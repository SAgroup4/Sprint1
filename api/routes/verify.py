# routes/verify.py - 郵件驗證功能的路由處理模組

# 引入必要的套件
from fastapi import APIRouter, HTTPException, Request  # FastAPI框架的核心組件
from db import db  # Firebase資料庫客戶端

# 建立路由處理器
router = APIRouter()

# 處理郵件驗證的路由
# 使用GET方法，路徑為"/verify-email"
# 當使用者點擊驗證郵件中的連結時，會觸發這個路由
@router.get("/verify-email")
async def verify_email(token: str):
    # 在pending_users集合中查找對應的token
    # pending_users集合存放著尚未完成驗證的使用者資料
    pending_ref = db.collection("pending_users")
    # 使用where查詢找出符合token的文件
    # limit(1)表示只取第一個符合的結果
    # stream()用於獲取查詢結果的迭代器
    query = pending_ref.where("token", "==", token).limit(1).stream()

    # 初始化user_doc變數為None
    user_doc = None
    # 遍歷查詢結果（實際上只會有0或1個結果）
    for doc in query:
        user_doc = doc  # 將找到的文件賦值給user_doc
        break          # 因為只需要第一個結果，所以找到後就跳出迴圈

    # 如果沒有找到對應的token，表示驗證連結無效或已過期
    if not user_doc:
        raise HTTPException(status_code=400, detail="驗證連結無效或已過期")

    # 將文件轉換為字典格式，方便存取資料
    user_data = user_doc.to_dict()
    # 獲取文件ID（即學號）
    student_id = user_doc.id

    # 將使用者資料寫入正式的users集合
    # 這表示使用者已完成驗證，可以開始使用系統
    db.collection("users").document(student_id).set({
        "email": user_data["email"],      # 使用者的學校信箱
        "password": user_data["password"], # 加密後的密碼
        "name": "",                      # 預留的姓名欄位
        "department": "",                # 預留的系所欄位
        "grade": "",                     # 預留的年級欄位
        "trans": False, 
        "isProfileComplete": False,      # 新增的布林值欄位，預設為 False，看資料填寫了沒
        "tags": {                        # 新增的 tags 欄位，所有值預設為 False
            "Java": False,
            "Python": False,
            "網頁開發": False,
            "英文": False,
            "日文": False,
            "韓文": False,
            "跑步": False,
            "籃球": False,
            "桌球": False,
            "閒聊": False,
            "吃飯": False,
            "其他": False
        }
    })

    # 刪除pending_users中的暫存資料
    # 因為驗證已完成，不再需要保存這些臨時資料
    db.collection("pending_users").document(student_id).delete()

    # 返回成功訊息
    # 提示使用者可以返回登入頁面
    return {"message": "驗證成功，請返回登入頁面"}
