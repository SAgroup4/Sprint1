from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel
from db import db

# 定義 Comment 模型
class Comment(BaseModel):
    user_id: str
    content: str

# 定義路由器
comment_router = APIRouter()

# 新增留言 API（對指定 post_id 留言）
@comment_router.post("/posts/{post_id}/comments")
async def add_comment(post_id: str, comment: Comment):
    try:
        # 先檢查這篇文章是否存在
        post_ref = db.collection("post").document(post_id)
        if not post_ref.get().exists:
            raise HTTPException(status_code=404, detail="找不到這篇文章")

        # 建立留言資料
        comment_data = {
            "user_id": comment.user_id,
            "content": comment.content,
            "timestamp": firestore.firestore.SERVER_TIMESTAMP
        }

        # 將留言加入到文章的 comments 子集合
        post_ref.collection("comments").add(comment_data)

        # 更新該文章的留言數
        post_ref.update({
            "comments_count": firestore.Increment(1)
        })

        return {"message": "留言新增成功"}
    except Exception as e:
        print(f"留言錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"留言失敗: {str(e)}")


# 取得特定文章的所有留言（依時間排序）
@comment_router.get("/posts/{post_id}/comments")
async def get_comments(post_id: str):
    try:
        post_ref = db.collection("post").document(post_id)
        if not post_ref.get().exists:
            raise HTTPException(status_code=404, detail="找不到這篇文章")

        comments_ref = post_ref.collection("comments").order_by("timestamp", direction=firestore.firestore.Query.ASCENDING).stream()
        comments = [{
            "comment_id": c.id,
            "user_id": c.get("user_id"),
            "content": c.get("content"),
            "timestamp": c.get("timestamp")
        } for c in comments_ref]

        return comments
    except Exception as e:
        print(f"取得留言錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"無法取得留言: {str(e)}")
