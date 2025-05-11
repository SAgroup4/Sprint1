from fastapi import APIRouter, Query, HTTPException
from typing import List
from db import db  # ✅ 延用你原本的 Firebase 連線方式

skills_router = APIRouter()

@skills_router.get("/skill-users")
async def get_users_by_skills(skills: List[str] = Query(...)):
    try:
        users_ref = db.collection("users")
        users = users_ref.stream()

        results = []
        for user in users:
            user_data = user.to_dict()
            skilltags = user_data.get("skilltags", {})

            # OR 邏輯：只要 skilltags 中有任一為 True
            if any(skilltags.get(skill, False) for skill in skills):
                results.append({
                    "name": user_data.get("name", ""),
                    "studentId": user.id,
                    "department": user_data.get("department", ""),
                    "year": user_data.get("grade", ""),
                    "avatar": user_data.get("avatar", ""),
                    "skills": skilltags
                })

        return results

    except Exception as e:
        print(f"技能搜尋錯誤：{str(e)}")
        raise HTTPException(status_code=500, detail="搜尋技能使用者失敗")
