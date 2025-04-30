from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel
from db import db

# 定義 UserProfile 模型
class UserProfileUpdate(BaseModel):
    department: str
    gender: str
    grade: str
    name: str
    skills: list[str]
    languages: list[str]
    isTransferStudent: bool

# 定義路由器
user_creation_router = APIRouter()

# 更新使用者資料 API
@user_creation_router.put("/users/{user_id}/profile")
async def update_user_profile(user_id: str, profile: UserProfileUpdate):
    try:
        # 取得使用者的 document reference
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        # 檢查使用者是否存在
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="找不到該使用者資料")

        # 獲取現有的 skilltags 和 languagetags 資料
        existing_skills_tags = user_doc.to_dict().get("skilltags", {})
        existing_languages_tags = user_doc.to_dict().get("languagetags", {})

        # 更新技能標籤：只將提交的技能標籤設為 true，保留其他標籤的原始值
        updated_skills_tags = {
            key: (True if key in profile.skills else value)
            for key, value in existing_skills_tags.items()
        }

        # 更新語言標籤：只將提交的語言標籤設為 true，保留其他標籤的原始值
        updated_languages_tags = {
            key: (True if key in profile.languages else value)
            for key, value in existing_languages_tags.items()
        }

        # 更新資料
        update_data = {
            "department": profile.department,
            "gender": profile.gender,
            "grade": profile.grade,
            "name": profile.name,
            "skilltags": updated_skills_tags,  # 更新後的技能標籤
            "languagetags": updated_languages_tags,  # 更新後的語言標籤
            "trans": profile.isTransferStudent,  # 更新是否為轉學生
            "isProfileComplete": True,  # 設定為已完成註冊
        }
        user_ref.update(update_data)

        return {"message": "使用者資料更新成功", "updated_data": update_data}
    except Exception as e:
        print(f"更新使用者資料時發生錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"更新使用者資料失敗: {str(e)}")