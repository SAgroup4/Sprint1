# routes/change_password.py
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from db import db
import bcrypt
from utils.jwt_handler import verify_token
from fastapi.responses import JSONResponse
from pydantic import EmailStr

router = APIRouter()

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

@router.post("/change-password")
async def change_password(request: Request, data: ChangePasswordRequest):
    # 驗證 JWT Token
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供 Token")

    token = auth_header.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token 驗證失敗")

    student_id = payload.get("student_id")
    user_ref = db.collection("users").document(student_id)
    user_doc = user_ref.get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="使用者不存在")

    user = user_doc.to_dict()

    # 驗證舊密碼
    if not bcrypt.checkpw(data.old_password.encode(), user["password"].encode()):
        raise HTTPException(status_code=403, detail="舊密碼錯誤")

    # 更新新密碼
    hashed_new_pw = bcrypt.hashpw(data.new_password.encode(), bcrypt.gensalt()).decode()
    user_ref.update({"password": hashed_new_pw})

    return {"message": "密碼已成功更新"}

#忘記密碼
#使用者輸入信箱,產生token&寄信
class ResetPasswordByTokenRequest(BaseModel):
    token: str
    password: str
    confirmPassword: str

@router.post("/reset-password")
async def reset_password(data: ResetPasswordByTokenRequest):
    if data.password != data.confirmPassword:
        return JSONResponse(status_code=400, content={"message": "兩次密碼不一致"})
    #驗證token
    payload = verify_token(data.token)
    if not payload or payload.get("type") != "reset-password":
        raise HTTPException(status_code=400, detail="連結無效或已過期")

    student_id = payload.get("student_id")
    user_ref = db.collection("users").document(student_id)
    user_doc = user_ref.get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="使用者不存在")

    hashed_pw = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    user_ref.update({"password": hashed_pw})

    return JSONResponse(status_code=200, content={"message": "密碼更新成功！"})
