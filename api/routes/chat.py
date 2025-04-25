from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel
from datetime import datetime
import uuid

from utils.jwt_handler import verify_token
from fastapi.security import OAuth2PasswordBearer
from typing import Union

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
db = firestore.client()

router = APIRouter(prefix="/api/chatrooms", tags=["chat"])

class MessageIn(BaseModel):
    senderId: str
    senderName: str
    content: str

class MessageOut(BaseModel):
    id: str
    senderId: str
    senderName: str
    content: str
    timestamp: str

def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_token(token)

def _iso_or_empty(t: Union[datetime, str, None]) -> str:
    if isinstance(t, datetime):
        return t.isoformat()
    if isinstance(t, str):
        return t
    return ""

def create_helper_chatroom(user_id: str):
    helper_id = "helper"
    chat_id = f"{user_id}_helper"

    chatroom_ref = db.collection("chatrooms").document(chat_id)
    if not chatroom_ref.get().exists:
        now = datetime.utcnow()
        chatroom_ref.set({
            "users": [user_id, helper_id],
            "lastMessage": "你好，我是平台小幫手，有任何問題可以找我！",
            "createdAt": now,
            "lastUpdatedAt": now
        })
        chatroom_ref.collection("messages").add({
            "senderId": helper_id,
            "senderName": "平台小幫手",
            "content": "你好，我是平台小幫手，有任何問題可以找我！",
            "timestamp": now.isoformat()
        })

@router.post("/create-helper")
async def manually_create_helper_chatroom(user=Depends(get_current_user)):
    user_id = user["student_id"]
    create_helper_chatroom(user_id)
    return {"status": "success"}

@router.get("/")
async def get_chatrooms(user=Depends(get_current_user)):
    user_id = user["student_id"]
    create_helper_chatroom(user_id)

    chatrooms_ref = db.collection("chatrooms").where("users", "array_contains", user_id)
    docs = chatrooms_ref.stream()

    chatrooms = []
    for doc in docs:
        data = doc.to_dict()
        users = data.get("users", [])
        target_id = [u for u in users if u != user_id][0]
        name = "平台小幫手" if target_id == "helper" else target_id

        last_time = data.get("lastUpdatedAt") or data.get("createdAt")
        chatrooms.append({
            "id": doc.id,
            "name": name,
            "avatar": "/default-avatar.png",
            "unread": 0,
            "lastMessage": data.get("lastMessage", ""),
            "messages": [],
            "lastUpdatedAt": _iso_or_empty(last_time)
        })

    chatrooms.sort(key=lambda x: x["lastUpdatedAt"], reverse=True)
    return chatrooms

@router.get("/{room_id}/messages")
async def get_messages(room_id: str, user=Depends(get_current_user)):
    messages_ref = db.collection("chatrooms").document(room_id).collection("messages")
    docs = messages_ref.order_by("timestamp").stream()

    messages = []
    for doc in docs:
        data = doc.to_dict()
        messages.append({
            "id": doc.id,
            "senderId": data["senderId"],
            "senderName": data["senderName"],
            "content": data["content"],
            "timestamp": data["timestamp"]
        })
    return messages

@router.post("/{room_id}/messages")
async def send_message(room_id: str, msg: MessageIn, user=Depends(get_current_user)):
    message_id = str(uuid.uuid4())
    now = datetime.utcnow()

    message_data = {
        "senderId": msg.senderId,
        "senderName": msg.senderName,
        "content": msg.content,
        "timestamp": now.isoformat(),
        "type": "text"
    }

    db.collection("chatrooms").document(room_id).collection("messages").document(message_id).set(message_data)

    db.collection("chatrooms").document(room_id).update({
        "lastMessage": msg.content,
        "lastUpdatedAt": now
    })

    return {"id": message_id, **message_data}

@router.get("/chatsearch")
async def search_or_create_chat(student_id: str, user=Depends(get_current_user)):
    current_id = user["student_id"]
    if current_id == student_id:
        raise HTTPException(status_code=400, detail="不能與自己建立聊天室")

    user_doc = db.collection("users").document(student_id).get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="找不到該使用者")

    chatroom_id = "_".join(sorted([current_id, student_id]))
    chatroom_ref = db.collection("chatrooms").document(chatroom_id)
    if not chatroom_ref.get().exists:
        now = datetime.utcnow()
        chatroom_ref.set({
            "users": [current_id, student_id],
            "lastMessage": "聊天室已建立",
            "lastUpdatedAt": now,
            "createdAt": now
        })
    return {"chatroom_id": chatroom_id}