# 驗證token
# 引入必要的套件
from fastapi import APIRouter, HTTPException, Request  # FastAPI框架的核心組件
from db import db  # Firebase資料庫客戶端
from utils.jwt_handler import verify_token  
from typing import Dict

# 建立路由處理器
router = APIRouter()

@router.get("/verify-reset")
async def verify_reset(token: str):
    payload = verify_token(token)

    if not payload or payload.get("type") != "reset-password":
        raise HTTPException(status_code=400, detail="連結無效或過期")

    # 你可以額外確認 student_id 是否存在
    student_id = payload["student_id"]
    user_doc = db.collection("users").document(student_id).get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="使用者不存在")

    return {"message": "驗證成功，請輸入新密碼", "student_id": student_id,"email": user_doc.get("email")}
