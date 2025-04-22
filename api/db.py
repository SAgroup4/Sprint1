#####################################################
# db.py - Firebase資料庫連接設定檔
# 這個文件的主要功能是：
# 1. 連接到 Firebase 雲端資料庫服務
# 2. 設置必要的認證和初始化
# 3. 提供一個可以在其他文件中使用的資料庫連接實例
#####################################################

# 【套件導入區域】
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

# 【環境設定區域】
if not load_dotenv():
    raise Exception("無法載入 .env 文件，請確認文件存在且格式正確")

# 【Firebase 初始化區域】
if not firebase_admin._apps:
    # 直接指定 Firebase 金鑰的路徑
    cred_path = os.path.abspath("firebase-key.json")  # 使用絕對路徑

    # 確認金鑰檔案是否存在
    if not os.path.exists(cred_path):
        raise FileNotFoundError(f"Firebase 金鑰文件不存在於路徑：{cred_path}，請確認檔案位置是否正確")

    try:
        # 初始化 Firebase
        cred = credentials.Certificate(cred_path)
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