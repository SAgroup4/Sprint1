# routes/users.py
from fastapi import APIRouter, HTTPException
from db import db  # 你自己在 db.py 設定的 Firestore 連線

user_router = APIRouter()

@user_router.get("/api/users/{user_id}")
async def get_user_info(user_id: str):
    try:
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = user_doc.to_dict()

        # 僅回傳需要的欄位
        filtered_data = {
            "department": user_data.get("department", ""),
            "grade": user_data.get("grade", ""),
            "skill": user_data.get("skill", ""),
            "language": user_data.get("language", ""),
            "gender": user_data.get("gender", "")
        }

        return filtered_data

    except Exception as e:
        print("Error getting user info:", e)
        raise HTTPException(status_code=500, detail="Internal server error")
