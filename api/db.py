#####################################################
# db.py - Firebase資料庫連接設定檔
# 這個文件的主要功能是：
# 1. 連接到 Firebase 雲端資料庫服務
# 2. 設置必要的認證和初始化
# 3. 提供一個可以在其他文件中使用的資料庫連接實例
#####################################################

# 【套件導入區域】
#####################################################
# db.py - Firebase資料庫連接設定檔
# 功能：
# 1. 連接 Firebase 雲端資料庫
# 2. 從 .env 直接讀取 JSON 金鑰本體初始化
# 3. 提供 db 連線物件供其他檔案使用
#####################################################

# 【套件導入區域】
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv

# 【環境設定區域】
if not load_dotenv():
    raise Exception("無法載入 .env 文件，請確認文件存在且格式正確")

# 【Firebase 初始化區域】
if not firebase_admin._apps:
    firebase_key_json = os.getenv("FIREBASE_KEY")

    if not firebase_key_json:
        raise Exception("找不到 FIREBASE_KEY，請確認 .env 是否正確設置")

    try:
        firebase_key_dict = json.loads(firebase_key_json)
        cred = credentials.Certificate(firebase_key_dict)
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
