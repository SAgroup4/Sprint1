from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel
from db import db

# 定義 UserProfile 模型
class UserProfile(BaseModel):
    department: str
    gender: str
    skills: list[str]
    isTransferStudent: bool

# 定義路由器
profile_change_router = APIRouter()

# 獲取使用者資料的 API 路由
@profile_change_router.get("/users/{user_id}/profile", response_model=UserProfile)
async def get_user_profile(user_id: str):
    try:
        # 從 Firestore 獲取使用者資料
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        # 檢查使用者是否存在
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="找不到該使用者資料")

        # 提取資料並格式化
        user_data = user_doc.to_dict()
        profile_data = {
            "department": user_data.get("department", ""),
            "gender": user_data.get("gender", ""),
            "skills": [skill for skill, value in user_data.get("tags", {}).items() if value],
            "isTransferStudent": user_data.get("trans", False),
        }

        return profile_data
    except Exception as e:
        print(f"獲取使用者資料時發生錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"獲取使用者資料失敗: {str(e)}")

# 更新使用者資料的 API 路由
@profile_change_router.put("/users/{user_id}/profile")
async def update_user_profile(user_id: str, profile: UserProfile):
    try:
        # 獲取使用者的 document reference
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        # 檢查使用者是否存在
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="找不到該使用者資料")

        # 獲取現有的 tags 資料
        existing_tags = user_doc.to_dict().get("tags", {})

        # 更新資料
        update_data = {
            "department": profile.department,
            "gender": profile.gender,
            "tags": {**existing_tags, **{skill: True for skill in profile.skills}},  # 更新技能標籤
            "trans": profile.isTransferStudent,  # 更新是否為轉學生
            "isProfileComplete": True,  # 設定為已完成註冊
        }
        user_ref.update(update_data)

        return {"message": "使用者資料更新成功", "updated_data": update_data}
    except Exception as e:
        print(f"更新使用者資料時發生錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"更新使用者資料失敗: {str(e)}")