from fastapi import APIRouter, HTTPException, Request
from firebase_admin import firestore
from pydantic import BaseModel
from typing import Dict
from db import db

# 定義 Post 模型（與資料庫結構相對應）
class Post(BaseModel):
    user_id: str
    name : str  # 新增 name 欄位
    title: str
    content: str
    skilltags: Dict[str, bool] = {}
    languagetags: Dict[str, bool] = {}
    leisuretags: Dict[str, bool] = {}

# 定義路由器
search_router = APIRouter()

# 🔹 發文 API
@search_router.post("/posts")
async def create_post(post: Post):
    try:
        result = db.collection("post").add({
            "user_id": post.user_id,
            "name": post.name,  # 新增 name 欄位
            "title": post.title,
            "content": post.content,
            "skilltags": post.skilltags,
            "languagetags": post.languagetags,
            "leisuretags": post.leisuretags,
            "timestamp": firestore.firestore.SERVER_TIMESTAMP,  # 自動生成時間戳
            "comments_count": 0  # 預設為 0
        })
        post_ref = result[0]
        print(f"文章創建成功, post_id: {post_ref.id}")
        return {"post_id": post_ref.id}
    except Exception as e:
        print(f"錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating post: {str(e)}")

# 🔹 一般獲取所有貼文（無篩選）
@search_router.get("/posts")
async def get_posts(request: Request):
    try:
        order = request.query_params.get("order", "newest")  # 預設為 "newest"
        direction = firestore.firestore.Query.DESCENDING if order == "newest" else firestore.firestore.Query.ASCENDING

        posts_ref = db.collection("post").order_by("timestamp", direction=direction).stream()
        posts = []
        for post in posts_ref:
            data = post.to_dict()

            # 避免 timestamp 為 None 導致錯誤
            timestamp = data.get("timestamp")
            if not timestamp:
                continue

            posts.append({
                "post_id": post.id,
                "user_id": data.get("user_id"),
                "name": data.get("name"),
                "title": data.get("title"),
                "content": data.get("content"),
                "timestamp": timestamp,
                "comments_count": data.get("comments_count", 0),
                "skilltags": data.get("skilltags", {}),
                "languagetags": data.get("languagetags", {}),
                "leisuretags": data.get("leisuretags", {}),
                "trans": data.get("trans", False),
            })

        print(f"成功取得 {len(posts)} 篇文章，排序：{order}")
        return {"posts": posts}
    except Exception as e:
        print(f"獲取文章時出錯：{e}")
        raise HTTPException(status_code=500, detail=f"Error fetching posts: {e}")

@search_router.get("/posts/{post_id}")
async def get_post(post_id: str):
    try:
        doc_ref = db.collection("post").document(post_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="貼文不存在")
        
        data = doc.to_dict()

        # 避免 timestamp 為 None
        timestamp = data.get("timestamp")
        if not timestamp:
            raise HTTPException(status_code=400, detail="貼文缺少 timestamp")

        return {
            "post_id": post_id,
            "user_id": data.get("user_id"),
            "name": data.get("name"),  # 新增 name 欄位
            "title": data.get("title"),
            "content": data.get("content"),
            "timestamp": timestamp,  # 確保 timestamp 存在
            "comments_count": data.get("comments_count", 0),  # 預設為 0
            "skilltags": data.get("skilltags", {}),
            "languagetags": data.get("languagetags", {}),
            "leisuretags": data.get("leisuretags", {}),
            "trans": data.get("trans", False),  # 新增 trans 欄位，預設為 False
        }
    except Exception as e:
        print(f"獲取單一貼文時出錯: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching post: {e}")

# 🔹 支援條件篩選的貼文 API（依技能／語言／休閒／日期）
@search_router.get("/posts/filter")
async def filter_posts(request: Request):
    try:
        params = request.query_params
        order = params.get("order", "newest")
        skilltags = params.get("skilltags", "").split(",") if params.get("skilltags") else []
        languagetags = params.get("languagetags", "").split(",") if params.get("languagetags") else []
        leisuretags = params.get("leisuretags", "").split(",") if params.get("leisuretags") else []

        query = db.collection("post")

        # 動態篩選條件
        for skill in skilltags:
            query = query.where(f"skilltags.{skill}", "==", True)
        for language in languagetags:
            query = query.where(f"languagetags.{language}", "==", True)
        for leisure in leisuretags:
            query = query.where(f"leisuretags.{leisure}", "==", True)

        direction = firestore.firestore.Query.DESCENDING if order == "newest" else firestore.firestore.Query.ASCENDING
        query = query.order_by("timestamp", direction=direction)

        results = query.stream()

        posts = []
        for post in results:
            data = post.to_dict()

            # 避免 timestamp 為 None
            timestamp = data.get("timestamp")
            if not timestamp:
                continue

            posts.append({
                "post_id": post.id,
                "user_id": data.get("user_id"),
                "name": data.get("name"),  # 新增 name 欄位
                "title": data.get("title"),
                "content": data.get("content"),
                "timestamp": timestamp,
                "comments_count": data.get("comments_count", 0),
                "skilltags": data.get("skilltags", {}),
                "languagetags": data.get("languagetags", {}),
                "leisuretags": data.get("leisuretags", {}),
            })

        return {"posts": posts}
    except Exception as e:
        print(f"過濾文章時出錯: {e}")
        raise HTTPException(status_code=500, detail=f"Error filtering posts: {e}")

# 🔹 搜尋貼文 API
@search_router.get("/search")
async def search_posts(request: Request):
    try:
        # 從查詢參數中取得 keyword
        keyword = request.query_params.get("keyword", "").strip()
        if not keyword:
            raise HTTPException(status_code=400, detail="搜尋關鍵字不能為空")

        # 從 Firestore 中獲取所有貼文
        posts_ref = db.collection("post").stream()
        results = []

        for post in posts_ref:
            data = post.to_dict()
            title = data.get("title", "")

            # 搜尋邏輯：檢查關鍵字是否出現在 title 中（不區分大小寫）
            if keyword.lower() in title.lower():
                # 避免 timestamp 為 None
                timestamp = data.get("timestamp")
                if not timestamp:
                    continue

                results.append({
                    "post_id": post.id,
                    "user_id": data.get("user_id", ""),
                    "name": data.get("name", ""),
                    "title": title,
                    "content": data.get("content", ""),
                    "timestamp": str(timestamp),
                    "comments_count": data.get("comments_count", 0),
                    "skilltags": data.get("skilltags", {}),
                    "languagetags": data.get("languagetags", {}),
                    "leisuretags": data.get("leisuretags", {}),
                    "trans": data.get("trans", False),
                })

        # 如果沒有找到任何結果，返回空陣列
        if not results:
            return {"results": []}

        # 返回搜尋結果
        return {"results": results}
    except Exception as e:
        print(f"搜尋貼文時發生錯誤: {e}")
        raise HTTPException(status_code=500, detail=f"Error searching posts: {e}")
