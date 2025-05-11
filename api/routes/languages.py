from fastapi import APIRouter, Query, HTTPException
from typing import List
from db import db  # 延用原本的 Firebase 連線方式

languages_router = APIRouter()

@languages_router.get("/language-users")
async def get_users_by_languages(languages: List[str] = Query(...)):
    try:
        users_ref = db.collection("users")
        users = users_ref.stream()

        results = []
        for user in users:
            user_data = user.to_dict()
            languagetags = user_data.get("languagetags", {})

            # OR 邏輯：只要 languagetags 中有任一為 True
            if any(languagetags.get(language, False) for language in languages):
                results.append({
                    "name": user_data.get("name", ""),
                    "studentId": user.id,
                    "department": user_data.get("department", ""),
                    "year": user_data.get("grade", ""),
                    "avatar": user_data.get("avatar", ""),
                    "languages": languagetags
                })

        return results

    except Exception as e:
        print(f"語言搜尋錯誤：{str(e)}")
        raise HTTPException(status_code=500, detail="搜尋語言使用者失敗")
