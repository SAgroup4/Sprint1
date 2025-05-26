from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel
from db import db
import json

# 定義 UserProfile 模型
class UserProfile(BaseModel):
    department: str
    gender: str
    grade: str
    name: str
    skills: list[str]
    languages: list[str]
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
            "grade": user_data.get("grade", ""),
            "name": user_data.get("name", ""),
            "skills": [skill for skill, value in user_data.get("skilltags", {}).items() if value],
            "languages": [language for language, value in user_data.get("languagetags", {}).items() if value],
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
        print(f"收到更新請求: user_id={user_id}, profile={profile}")
        
        # 獲取使用者的 document reference
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        # 檢查使用者是否存在
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="找不到該使用者資料")

        # 獲取現有的完整資料
        user_data = user_doc.to_dict()
        print(f"更新前的用戶資料: {user_data}")
        
        # 技能標籤和語言標籤
        existing_skills_tags = user_data.get("skilltags", {})
        existing_languages_tags = user_data.get("languagetags", {})
        
        print(f"原始技能標籤: {existing_skills_tags}")
        print(f"原始語言標籤: {existing_languages_tags}")
        print(f"提交的技能: {profile.skills}")
        print(f"提交的語言: {profile.languages}")
        
        # 完全重建技能標籤字典
        updated_skills_tags = {}
        for skill in existing_skills_tags.keys():
            updated_skills_tags[skill] = skill in profile.skills
            
        # 完全重建語言標籤字典
        updated_languages_tags = {}
        for language in existing_languages_tags.keys():
            updated_languages_tags[language] = language in profile.languages
            
        print(f"更新後的技能標籤: {updated_skills_tags}")
        print(f"更新後的語言標籤: {updated_languages_tags}")
        
        # 建立完整的更新文檔
        update_data = {
            "department": profile.department,
            "gender": profile.gender,
            "grade": profile.grade,
            "name": profile.name,
            "skilltags": updated_skills_tags,
            "languagetags": updated_languages_tags,
            "trans": profile.isTransferStudent,
            "isProfileComplete": True,
        }
        
        # 使用完全替換而非更新
        # 注意：這裡不使用 update，而是使用 set 並設置 merge=True
        user_ref.set(update_data, merge=True)
        
        # 驗證更新是否成功
        updated_doc = user_ref.get().to_dict()
        print(f"更新後的技能標籤: {updated_doc.get('skilltags', {})}")
        print(f"更新後的語言標籤: {updated_doc.get('languagetags', {})}")
        
        # 返回成功消息
        return {"message": "使用者資料更新成功", "updated_data": update_data}
    except Exception as e:
        print(f"更新使用者資料時發生錯誤: {str(e)}")
        import traceback
        traceback.print_exc()  # 列印完整錯誤堆疊
        raise HTTPException(status_code=500, detail=f"更新使用者資料失敗: {str(e)}")

# 只更新標籤欄位的路由
@profile_change_router.put("/users/{user_id}/tags-only")
async def update_user_tags_only(user_id: str, skills: list[str], languages: list[str]):
    try:
        user_ref = db.collection("users").document(user_id)
        
        # 直接硬覆蓋標籤欄位
        skill_tags = {
            "Java": "Java" in skills,
            "Python": "Python" in skills,
            "網頁開發": "網頁開發" in skills,
            "其他程式語言": "其他程式語言" in skills
        }
        
        language_tags = {
            "英文": "英文" in languages,
            "日文": "日文" in languages,
            "韓文": "韓文" in languages,
            "其他語言": "其他語言" in languages
        }
        
        # 只更新標籤欄位
        user_ref.update({
            "skilltags": skill_tags,
            "languagetags": language_tags
        })
        
        return {"message": "標籤更新成功", "skilltags": skill_tags, "languagetags": language_tags}
    except Exception as e:
        print(f"更新標籤時發生錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"更新標籤失敗: {str(e)}")