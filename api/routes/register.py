# routes/register.py - 使用者註冊功能的路由處理模組

# 引入必要的套件
from fastapi import APIRouter, HTTPException  # FastAPI框架的核心組件
from pydantic import BaseModel            # 用於資料驗證和序列化
from db import db                         # Firebase資料庫客戶端
from utils.email_sender import send_verification_email  # 郵件發送功能
import bcrypt  # 用於密碼加密
import re     # 用於正則表達式匹配
import secrets  # 用於生成安全的隨機token

# 建立路由處理器
router = APIRouter()

# 定義註冊請求的資料模型
# 使用Pydantic的BaseModel來確保資料的型別正確性
class RegisterRequest(BaseModel):
    email: str             # 使用者的學校信箱
    password: str          # 使用者設定的密碼
    confirmPassword: str    # 確認密碼

# 處理註冊請求的路由
# 使用POST方法，路徑為"/register"
@router.post("/register")
async def register(data: RegisterRequest):
    # 驗證學號信箱格式是否符合規範
    # 使用正則表達式檢查是否為輔大信箱格式（9位數字@m365.fju.edu.tw）
    if not re.match(r"^\d{9}@m365\.fju\.edu\.tw$", data.email):
        raise HTTPException(status_code=400, detail="Email 格式錯誤")

    # 確認兩次輸入的密碼是否相同
    if data.password != data.confirmPassword:
        raise HTTPException(status_code=400, detail="兩次密碼不一致")

    # 從信箱中提取學號（@符號前的9位數字）
    student_id = data.email.split("@")[0]
    # 在Firebase中建立對應的文件參考
    doc_ref = db.collection("pending_users").document(student_id)
    alreadyregister = db.collection("users").document(student_id)
    # 檢查該學號是否已經註冊
    # 如果在pending_users中找到對應文件，表示已經註冊或正在驗證中
    if doc_ref.get().exists:
        raise HTTPException(status_code=400, detail="此學號已經註冊或驗證中")
    
    if alreadyregister.get().exists:
        raise HTTPException(status_code=400, detail="此學號已經註冊")

    # 對密碼進行加密處理
    # 1. encode()：將密碼字串轉換為位元組
    # 2. bcrypt.gensalt()：生成隨機鹽值
    # 3. bcrypt.hashpw()：使用鹽值對密碼進行雜湊
    # 4. decode()：將雜湊結果轉回字串
    hashed_pw = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()

    # 生成安全的隨機token，用於郵件驗證
    # secrets.token_urlsafe(32)生成一個URL安全的隨機字串
    token = secrets.token_urlsafe(32)

    # 將使用者資料存入Firebase的pending_users集合
    # 包含信箱、加密後的密碼、驗證token和驗證狀態
    doc_ref.set({
        "email": data.email,
        "password": hashed_pw,
        "token": token,
        "verified": False  # 初始狀態為未驗證
    })

    # 發送驗證郵件給使用者
    # 郵件中包含驗證連結，連結中帶有驗證token
    try:
        send_verification_email(data.email, token)
    except Exception as e:
        print("❌ 寄信失敗：", e)
        raise HTTPException(status_code=500, detail="寄送驗證信時發生錯誤")

    # 返回成功訊息
    return {"message": "驗證信已發送至您的信箱，請查收完成驗證"}
