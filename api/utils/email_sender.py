# utils/email_sender.py - 郵件發送功能模組

# 引入Python內建的SMTP郵件發送模組
import smtplib
# 引入EmailMessage類別，用於建立郵件內容
from email.message import EmailMessage
from dotenv import load_dotenv
import json
import os

load_dotenv()
# Brevo（郵件發送服務商）提供的SMTP伺服器設定
# 這些是連接到Brevo郵件伺服器所需的基本資訊
SMTP_SERVER = "smtp-relay.brevo.com"  # SMTP伺服器地址
SMTP_PORT = 587                       # SMTP伺服器端口，587是TLS加密連接的標準端口
SMTP_LOGIN =  os.getenv("SMTP_LOGIN")  # Brevo帳號
SMTP_PASSWORD =  os.getenv("SMTP_PASSWORD")    # Brevo密碼


# 發送驗證郵件的函數
# 參數說明：
# - to_email: 收件人的郵件地址（字串類型）
# - token: 用於驗證的唯一標識符（字串類型）
def send_verification_email(to_email: str, token: str):
    # 建立一個新的郵件訊息物件
    msg = EmailMessage()
    # 設定郵件主旨
    msg["Subject"] = "輔大學生交流平台 - 信箱驗證"
    # 設定寄件人信箱
    msg["From"] = "410012409@m365.fju.edu.tw"
    # 設定收件人信箱
    msg["To"] = to_email

    # 建立驗證連結
    # 將token加入URL中，這樣用戶點擊連結時就能驗證身份
    verify_url = f"http://localhost:8000/verify-email?token={token}"
    
    # 設定郵件內容
    # 使用多行字串（f-string）來格式化郵件內容
    msg.set_content(f"""
您好，

請點擊下方連結完成註冊驗證：

{verify_url}

若您未進行註冊，請忽略此信件。
""")

    # 使用with語句建立SMTP連接
    # 這樣可以確保連接在使用完後會自動關閉
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
        # 啟動TLS加密
        # 這可以確保郵件傳輸的安全性
        smtp.starttls()
        # 登入SMTP伺服器
        smtp.login(SMTP_LOGIN, SMTP_PASSWORD)
        # 發送郵件
        smtp.send_message(msg)

# 忘記密碼驗證
def send_reset_email(to_email: str, token: str):
    print(f" 正在寄送 reset email 給 {to_email}...")
    print(f" 使用的 reset URL: http://localhost:3000/forgetpassword?token={token}")

    msg = EmailMessage()
    msg["Subject"] = "輔大學生交流平臺 - 重設密碼驗證"
    msg["From"] = "410012409@m365.fju.edu.tw"
    msg["To"] = to_email

    # 忘記密碼驗證連結（注意路徑不同）
    reset_url = f"http://localhost:3000/forgetpassword?token={token}"
    msg.set_content(f"""
您好，

請點擊下方連結完成身份驗證並重設密碼：

{reset_url}

若您未申請重設密碼，請忽略此封信件。
""")
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(SMTP_LOGIN, SMTP_PASSWORD)
            smtp.send_message(msg)
            print(f"✅ 成功寄出密碼重設信件給 {to_email}")
    except Exception as e:
        print(f"❌ 寄信失敗：{e}")

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt