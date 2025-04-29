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

        # 把 tags 的物件轉成陣列，只拿有 true 的項目
        tags_object = user_data.get("tags", {})
        print("原本拿到的tags物件：", tags_object)  # ← 加這行
        tags_list = [tag for tag, selected in tags_object.items() if selected]
        print("轉成的tags陣列：", tags_list)  # ← 再加這行


        filtered_data = {
            "department": user_data.get("department", ""),
            "grade": user_data.get("grade", ""),
            "tags": tags_list,
            "is_transfer": bool(user_data.get("trans", 0)),  # 用 trans 欄位
            "gender": user_data.get("gender", "")
        }

        return filtered_data

    except Exception as e:
        print("Error getting user info:", e)
        raise HTTPException(status_code=500, detail="Internal server error")
