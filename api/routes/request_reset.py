# 發送驗證信
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from db import db
from utils.jwt_handler import create_access_token
from utils.email_sender import send_reset_email

router = APIRouter()

class ResetRequest(BaseModel):
    email: EmailStr

@router.post("/request-reset-password")
async def request_reset_password(data: ResetRequest):
    email = data.email
    student_id = email.split("@")[0]

    #  Debug 用：先印出呼叫紀錄
    print(f" 收到重設密碼請求 for {email}")

    # 確認使用者是否存在
    user_ref = db.collection("users").document(student_id)
    user_doc = user_ref.get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="查無此帳號")

    token_data = {
        "student_id": student_id,
        "type": "reset-password"
    }
    token = create_access_token(token_data, expires_minutes=15)


    send_reset_email(email, token)

    # Debug 用：token 印出來確認
    print(f" 已產生 token: {token}")
    return {"message": "驗證信已發送，請前往信箱完成驗證"}
