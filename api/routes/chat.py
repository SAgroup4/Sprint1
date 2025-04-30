# routes/chat.py
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from datetime import datetime
from db import db
from utils.jwt_handler import verify_token
from typing import List, Optional
from google.cloud import firestore

router = APIRouter () # 設置 prefix 為 /api

# 請求和響應模型
class User(BaseModel):
    id: str
    nickname: str
    avatar: str
    email: str
    department: str

class Conversation(BaseModel):
    id: str
    user: User
    lastMessage: str
    lastMessageTime: str
    unreadCount: int

class Message(BaseModel):
    id: str
    senderId: str
    content: str
    timestamp: str
    status: str

class MessageRequest(BaseModel):
    content: str

# 驗證當前用戶
async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供 Token")
    token = auth_header.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token 驗證失敗")
    student_id = payload.get("student_id")
    if not student_id:
        raise HTTPException(status_code=401, detail="Token 中缺少 student_id")
    return student_id

# 獲取當前用戶的所有對話
@router.get("/conversations", response_model=List[Conversation])
async def get_conversations(current_user_id: str = Depends(get_current_user)):
    try:
        # 從 Firestore 獲取對話列表
        conversations_ref = db.collection("conversations")
        query = conversations_ref.where("participants", "array_contains", current_user_id)
        conversations = query.stream()

        result = []
        for conv in conversations:
            conv_data = conv.to_dict()
            # 確保 participants 是一個陣列且包含其他用戶
            participants = conv_data.get("participants", [])
            if not isinstance(participants, list) or len(participants) < 2:
                print(f"Invalid participants in conversation {conv.id}: {participants}")
                continue

            # 獲取對話對象的用戶信息
            other_user_id = next((uid for uid in participants if uid != current_user_id), None)
            if not other_user_id:
                print(f"No other user found in conversation {conv.id}")
                continue

            user_doc = db.collection("users").document(other_user_id).get()
            if not user_doc.exists:
                print(f"User {other_user_id} not found for conversation {conv.id}")
                continue
            user_data = user_doc.to_dict()

            # 構建對話信息
            result.append(Conversation(
                id=conv.id,
                user=User(
                    id=other_user_id,
                    nickname=user_data.get("nickname", "未知用戶"),
                    avatar=user_data.get("avatar", "/placeholder.svg"),
                    email=user_data.get("email", ""),
                    department=user_data.get("department", "")
                ),
                lastMessage=conv_data.get("lastMessage", ""),
                lastMessageTime=conv_data.get("lastMessageTime", ""),
                unreadCount=conv_data.get("unreadCount", {}).get(current_user_id, 0)
            ))

        return result
    except Exception as e:
        print(f"Error fetching conversations: {str(e)}")
        return []  # 返回空陣列而不是拋出異常

# 獲取特定對話的消息
@router.get("/conversations/{conversation_id}/messages", response_model=List[Message])
async def get_messages(conversation_id: str, current_user_id: str = Depends(get_current_user)):
    try:
        # 檢查對話是否存在且用戶是否為參與者
        conv_ref = db.collection("conversations").document(conversation_id)
        conv_doc = conv_ref.get()
        if not conv_doc.exists:
            raise HTTPException(status_code=404, detail="對話不存在")

        conv_data = conv_doc.to_dict()
        participants = conv_data.get("participants", [])
        if current_user_id not in participants:
            raise HTTPException(status_code=403, detail="無權訪問此對話")

        # 獲取消息列表
        messages_ref = conv_ref.collection("messages").order_by("timestamp")  # 與資料庫名稱一致
        messages = messages_ref.stream()

        return [
            Message(
                id=msg.id,
                senderId=msg.to_dict().get("senderId", ""),
                content=msg.to_dict().get("content", ""),
                timestamp=msg.to_dict().get("timestamp", ""),
                status=msg.to_dict().get("status", "delivered")
            )
            for msg in messages
        ]
    except Exception as e:
        print(f"Error fetching messages: {str(e)}")
        return []  # 返回空陣列而不是拋出異常

# 發送消息
@router.post("/conversations/{conversation_id}/messages", response_model=Message)
async def send_message(conversation_id: str, message: MessageRequest, current_user_id: str = Depends(get_current_user)):
    try:
        # 檢查對話是否存在且用戶是否為參與者
        conv_ref = db.collection("conversations").document(conversation_id)
        conv_doc = conv_ref.get()
        if not conv_doc.exists:
            raise HTTPException(status_code=404, detail="對話不存在")

        conv_data = conv_doc.to_dict()
        participants = conv_data.get("participants", [])
        if current_user_id not in participants:
            raise HTTPException(status_code=403, detail="無權訪問此對話")

        # 創建新消息
        now = datetime.utcnow().isoformat()
        new_message = {
            "senderId": current_user_id,
            "content": message.content,
            "timestamp": now,
            "status": "delivered"
        }

        # 添加消息到對話
        messages_ref = conv_ref.collection("messages")  # 與資料庫名稱一致
        msg_doc = messages_ref.add(new_message)

        # 更新對話的最後消息信息
        other_user_id = next((uid for uid in participants if uid != current_user_id), None)
        if not other_user_id:
            raise HTTPException(status_code=500, detail="無法找到對話對象")

        unread_counts = conv_data.get("unreadCount", {})
        # 確保 unreadCount 包含所有參與者的鍵
        for participant in participants:
            if participant not in unread_counts:
                unread_counts[participant] = 0
        # 增加對方的未讀計數
        unread_counts[other_user_id] = unread_counts.get(other_user_id, 0) + 1
        # 重置自己的未讀計數
        unread_counts[current_user_id] = 0

        conv_ref.update({
            "lastMessage": message.content,
            "lastMessageTime": now,
            "unreadCount": unread_counts
        })

        return Message(
            id=msg_doc[1].id,
            senderId=current_user_id,
            content=message.content,
            timestamp=now,
            status="delivered"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"發送消息失敗: {str(e)}")

# 標記對話為已讀
@router.put("/conversations/{conversation_id}/read")
async def mark_conversation_as_read(conversation_id: str, current_user_id: str = Depends(get_current_user)):
    try:
        # 檢查對話是否存在且用戶是否為參與者
        conv_ref = db.collection("conversations").document(conversation_id)
        conv_doc = conv_ref.get()
        if not conv_doc.exists:
            raise HTTPException(status_code=404, detail="對話不存在")

        conv_data = conv_doc.to_dict()
        participants = conv_data.get("participants", [])
        if current_user_id not in participants:
            raise HTTPException(status_code=403, detail="無權訪問此對話")

        # 更新未讀計數
        unread_counts = conv_data.get("unreadCount", {})
        unread_counts[current_user_id] = 0

        # 更新對話
        conv_ref.update({"unreadCount": unread_counts})

        # 將所有未讀消息標記為已讀
        messages_ref = conv_ref.collection("messages")
        unread_messages = messages_ref.where("status", "==", "delivered").where("senderId", "!=", current_user_id).stream()

        for msg in unread_messages:
            msg.reference.update({"status": "read"})

        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"標記已讀失敗: {str(e)}")

# 創建新對話或獲取已存在的對話
@router.post("/conversations", response_model=Conversation)
async def create_conversation(request: Request, current_user_id: str = Depends(get_current_user)):
    try:
        # 從請求體獲取目標用戶ID
        body = await request.json()
        target_user_id = body.get("participantId")  # 前端使用 participantId
        if not target_user_id:
            raise HTTPException(status_code=400, detail="缺少目標用戶ID")

        # 檢查目標用戶是否存在
        target_user_doc = db.collection("users").document(target_user_id).get()
        if not target_user_doc.exists:
            raise HTTPException(status_code=404, detail="目標用戶不存在")
        target_user_data = target_user_doc.to_dict()

        # 檢查是否已存在對話
        conversations_ref = db.collection("conversations")
        existing_conv_query = conversations_ref.where(
            "participants", "array_contains", current_user_id
        ).stream()

        for conv in existing_conv_query:
            conv_data = conv.to_dict()
            if target_user_id in conv_data.get("participants", []):
                # 返回現有對話
                return Conversation(
                    id=conv.id,
                    user=User(
                        id=target_user_id,
                        nickname=target_user_data.get("nickname", "未知用戶"),
                        avatar=target_user_data.get("avatar", "/placeholder.svg"),
                        email=target_user_data.get("email", ""),
                        department=target_user_data.get("department", "")
                    ),
                    lastMessage=conv_data.get("lastMessage", ""),
                    lastMessageTime=conv_data.get("lastMessageTime", ""),
                    unreadCount=conv_data.get("unreadCount", {}).get(current_user_id, 0)
                )

        # 創建新對話
        new_conv_data = {
            "participants": [current_user_id, target_user_id],
            "lastMessage": "",
            "lastMessageTime": "",
            "unreadCount": {
                current_user_id: 0,
                target_user_id: 0
            }
        }

        new_conv_ref = conversations_ref.document()
        new_conv_ref.set(new_conv_data)

        return Conversation(
            id=new_conv_ref.id,
            user=User(
                id=target_user_id,
                nickname=target_user_data.get("nickname", "未知用戶"),
                avatar=target_user_data.get("avatar", "/placeholder.svg"),
                email=target_user_data.get("email", ""),
                department=target_user_data.get("department", "")
            ),
            lastMessage="",
            lastMessageTime="",
            unreadCount=0
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"創建對話失敗: {str(e)}")


# 搜尋用戶
@router.get("/users/search/{student_id}", response_model=User)
async def search_user(student_id: str, current_user_id: str = Depends(get_current_user)):
    try:
        # 驗證學號格式
        if not student_id.isdigit() or len(student_id) != 9:
            raise HTTPException(status_code=400, detail="學號格式不正確，請輸入9位數字")
            
        # 檢查用戶是否存在
        user_doc = db.collection("users").document(student_id).get()
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="找不到該用戶")
            
        # 獲取用戶資料
        user_data = user_doc.to_dict()
        
        # 返回用戶資料
        return User(
            id=student_id,
            nickname=user_data.get("nickname", f"學生 {student_id}"),  # 如果沒有暱稱，則使用學號
            avatar=user_data.get("avatar", f"/placeholder.svg?height=200&width=200&text={student_id[:2]}"),  # 如果沒有頭像，則使用預設頭像
            email=user_data.get("email", ""),
            department=user_data.get("department", "")
        )
    except HTTPException as e:
        # 直接重新拋出 HTTP 異常
        raise e
    except Exception as e:
        print(f"搜尋用戶失敗: {str(e)}")
        raise HTTPException(status_code=500, detail=f"搜尋用戶失敗: {str(e)}")

# 新增聯絡人
@router.post("/contacts", response_model=User)
async def add_contact(request: Request, current_user_id: str = Depends(get_current_user)):
    try:
        # 從請求體獲取聯絡人信息
        body = await request.json()
        contact_id = body.get("contactId")
        if not contact_id:
            raise HTTPException(status_code=400, detail="缺少聯絡人ID")

        # 檢查聯絡人是否存在
        contact_doc = db.collection("users").document(contact_id).get()
        if not contact_doc.exists:
            raise HTTPException(status_code=404, detail="聯絡人不存在")
        contact_data = contact_doc.to_dict()

        # 檢查是否已經是聯絡人
        contacts_ref = db.collection("contacts").document(current_user_id)
        contacts_doc = contacts_ref.get()
        if contacts_doc.exists:
            contacts_data = contacts_doc.to_dict()
            if contact_id in contacts_data.get("contacts", []):
                raise HTTPException(status_code=400, detail="已經是聯絡人")

        # 添加聯絡人
        contacts_ref.set({"contacts": firestore.ArrayUnion([contact_id])}, merge=True)

        return User(
            id=contact_id,
            nickname=contact_data.get("nickname", "未知用戶"),
            avatar=contact_data.get("avatar", "/placeholder.svg"),
            email=contact_data.get("email", ""),
            department=contact_data.get("department", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"新增聯絡人失敗: {str(e)}")