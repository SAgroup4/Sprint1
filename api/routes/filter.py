from fastapi import APIRouter, Query, HTTPException
from firebase_admin import firestore
from db import db

filter_router = APIRouter()

@filter_router.get("/posts")
async def get_posts(
    order: str = Query("newest", regex="^(newest|oldest)$")  # 排序方式
):
    """
    根據排序條件獲取貼文，並依據時間排序。
    """
    try:
        # 設定排序方向
        direction = firestore.firestore.Query.DESCENDING if order == "newest" else firestore.firestore.Query.ASCENDING
        query = db.collection("post").order_by("timestamp", direction=direction)

        # 執行查詢
        posts_ref = query.stream()
        posts = [
            {
                "post_id": post.id,
                "title": post.get("title"),
                "content": post.get("content"),
                "timestamp": post.get("timestamp"),
                "trans": post.get("trans"),
                "comments_count": post.get("comments_count"),
            }
            for post in posts_ref
        ]

        return {"posts": posts}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching posts: {str(e)}")