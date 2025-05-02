from fastapi import APIRouter, HTTPException, Request
from firebase_admin import firestore
from pydantic import BaseModel
from typing import Dict
from db import db

# 定義 Post 模型（與資料庫結構相對應）
class Post(BaseModel):
    user_id: str
    title: str
    content: str
    skilltags: Dict[str, bool] = {}
    languagetags: Dict[str, bool] = {}
    leisuretags: Dict[str, bool] = {}

# 定義路由器
post_router = APIRouter()

# 🔹 發文 API
@post_router.post("/posts")
async def create_post(post: Post):
    try:
        result = db.collection("post").add({
            "user_id": post.user_id,
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
@post_router.get("/posts")
async def get_posts(request: Request):
    try:
        order = request.query_params.get("order", "newest")
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
                "name": data.get("name"),  # 新增 name 欄位
                "title": data.get("title"),
                "content": data.get("content"),
                "timestamp": timestamp,  # 確保 timestamp 存在
                "comments_count": data.get("comments_count", 0),  # 預設為 0
                "skilltags": data.get("skilltags", {}),
                "languagetags": data.get("languagetags", {}),
                "leisuretags": data.get("leisuretags", {}),
                "trans": data.get("trans", False),  # 新增 trans 欄位，預設為 False

            })

        print(f"成功取得 {len(posts)} 篇文章，排序：{order}")
        return {"posts": posts}
    except Exception as e:
        print(f"獲取文章時出錯：{e}")
        raise HTTPException(status_code=500, detail=f"Error fetching posts: {e}")

@post_router.get("/posts/{post_id}")
async def get_post(post_id: str):
    try:
        doc_ref = db.collection("post").document(post_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="貼文不存在")
        
        data = doc.to_dict()
        return {
            "post_id": post_id,
            "user_id": data.get("user_id"),
            "title": data.get("title"),
            "content": data.get("content"),
            "timestamp": data.get("timestamp"),
            "comments_count": data.get("comments_count"),
            "skilltags": data.get("skilltags", {}),
            "languagetags": data.get("languagetags", {}),
            "leisuretags": data.get("leisuretags", {}),
        }
    except Exception as e:
        print(f"獲取單一貼文時出錯: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching post: {e}")

# 🔹 支援條件篩選的貼文 API（依技能／語言／休閒／日期）
@post_router.get("/posts/filter")
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
