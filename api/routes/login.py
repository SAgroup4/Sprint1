# routes/login.py
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from db import db
import bcrypt
from utils.jwt_handler import create_access_token, verify_token
from fastapi.responses import JSONResponse

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(data: LoginRequest):
    student_id = data.email.split("@")[0]
    doc_ref = db.collection("users").document(student_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="帳號不存在或尚未驗證")

    user = doc.to_dict()

    if not bcrypt.checkpw(data.password.encode(), user["password"].encode()):
        raise HTTPException(status_code=401, detail="密碼錯誤")

    # 產生 JWT token
    access_token = create_access_token({"student_id": student_id})

    # 回傳 isProfileComplete 狀態
    is_profile_complete = user.get("isProfileComplete", False)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "isProfileComplete": is_profile_complete  # 加入 isProfileComplete 欄位
    }

# 驗證 Token 用的 API
@router.get("/me")
async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供 Token")

    token = auth_header.split(" ")[1]
    payload = verify_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Token 驗證失敗")

    student_id = payload.get("student_id")
    doc = db.collection("users").document(student_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="使用者不存在")

    return doc.to_dict()
