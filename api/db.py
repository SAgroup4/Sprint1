#####################################################
# db.py - Firebase資料庫連接設定檔
# 這個文件的主要功能是：
# 1. 連接到 Firebase 雲端資料庫服務
# 2. 設置必要的認證和初始化
# 3. 提供一個可以在其他文件中使用的資料庫連接實例
#####################################################

# 【套件導入區域】
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# 【環境設定區域】
load_dotenv()  # 若你的 .env 在 env 資料夾

# 【Firebase 初始化區域】
if not firebase_admin._apps:
    try:
        cred_dict = {
            "type": os.getenv("FIREBASE_TYPE"),
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "client_id": os.getenv("FIREBASE_CLIENT_ID"),
            "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
            "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
            "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
            "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
            "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN")
        }

        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        raise Exception(f"Firebase 初始化失敗，錯誤訊息：{str(e)}")

# 【資料庫客戶端建立區域】
try:
    db = firestore.client()
except Exception as e:
    raise Exception(f"Firestore 客戶端創建失敗，錯誤訊息：{str(e)}")

# 【連線測試區域（僅在直接執行此檔案時執行）】
if __name__ == "__main__":
    try:
        doc_ref = db.collection("test").document("connection_check")
        doc_ref.set({"status": "connected"})
        doc = doc_ref.get()
        print("Firestore 連線成功，內容為：", doc.to_dict())
    except Exception as e:
        print("Firestore 連線失敗，錯誤訊息：", str(e))
