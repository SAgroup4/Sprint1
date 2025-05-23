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

    # 回傳 isProfileComplete 狀態和 name 欄位
    is_profile_complete = user.get("isProfileComplete", False)
    user_name = user.get("name", "未知名稱")  # 確保有預設值

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "isProfileComplete": is_profile_complete,
        "userName": user_name,  # 回傳 name 欄位
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

    user_data = doc.to_dict()
    return {
        "id": student_id,
        "name": user_data.get("name", user_data.get("name", "未知用戶")), #將nickname修改成name
        "avatar": user_data.get("avatar", "/placeholder.svg"),
        "email": user_data.get("email", ""),
        "department": user_data.get("department", ""),
        "isProfileComplete": user_data.get("isProfileComplete", False)
    }
