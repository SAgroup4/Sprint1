# utils/jwt_handler.py
# 🔐 JWT 權杖處理模組
# 用來產生與驗證登入用的 JSON Web Token

import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# 讀取 .env 中的環境變數
load_dotenv()

# 🔑 秘密金鑰（應該放在 .env 裡）
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")  # 預設 fallback
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token 有效時間為 60 分鐘

# ✅ 建立 JWT Token
# data: 欲儲存在 token 中的資料（例如 student_id）
def create_access_token(data: dict):
    # 複製資料並加上過期時間
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    # 使用 JWT 加密並回傳字串型的 token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ✅ 驗證 JWT Token 並回傳其中的內容（失敗則回傳 None）
def verify_token(token: str):
    try:
        # 解碼 token（若無效會拋出例外）
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
