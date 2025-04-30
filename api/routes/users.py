# routes/users.py
from fastapi import APIRouter, HTTPException
from db import db

user_router = APIRouter()

@user_router.get("/api/users/{user_id}")
async def get_user_info(user_id: str):
    try:
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = user_doc.to_dict()

        # 新版結構：直接傳回 skilltags、languagetags、leasuretags 三個物件
        filtered_data = {
            "department": user_data.get("department", ""),
            "grade": user_data.get("grade", ""),
            "gender": user_data.get("gender", ""),
            "is_transfer": bool(user_data.get("trans", 0)),  # 用 trans 判斷是否為轉學生
            "skilltags": user_data.get("skilltags", {}),
            "languagetags": user_data.get("languagetags", {}),
            "leasuretags": user_data.get("leasuretags", {}),
        }
        

        return filtered_data

    except Exception as e:
        print("Error getting user info:", e)
        raise HTTPException(status_code=500, detail="Internal server error")
