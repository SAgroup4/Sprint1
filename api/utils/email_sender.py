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