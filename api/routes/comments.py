from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel
from db import db

# 定義 Comment 模型
class Comment(BaseModel):
    user_id: str
    name: str
    content: str

# 定義路由器
comment_router = APIRouter()

# 新增留言 API
@comment_router.post("/posts/{post_id}/comments")
async def add_comment(post_id: str, comment: Comment):
    """
    新增留言並為貼文作者新增通知
    """
    try:
        # 檢查文章是否存在
        post_ref = db.collection("post").document(post_id)
        if not post_ref.get().exists:
            raise HTTPException(status_code=404, detail="找不到這篇文章")

        # 建立留言資料
        comment_data = {
            "user_id": comment.user_id,
            "name": comment.name,
            "content": comment.content,
            "timestamp": firestore.SERVER_TIMESTAMP
        }
        post_ref.collection("comments").add(comment_data)

        # 更新留言數
        post_ref.update({
            "comments_count": firestore.Increment(1)
        })

        # 為貼文作者新增通知
        post_data = post_ref.get().to_dict()
        author_id = post_data.get("user_id")
        if not author_id:
            raise HTTPException(status_code=400, detail="無法找到貼文作者")

        notification_data = {
            "post_id": post_id,
            "post_title": post_data.get("title", "未知標題"),
            "comment_content": comment.content,
            "comment_user_id": comment.user_id,
            "comment_user_name": comment.name,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "is_read": False
        }
        db.collection("users").document(author_id).collection("notifications").add(notification_data)

        return {"message": "留言新增成功，通知已發送"}
    except Exception as e:
        print(f"留言錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"留言失敗: {str(e)}")


# 取得特定文章的所有留言（依時間排序）
@comment_router.get("/posts/{post_id}/comments")
async def get_comments(post_id: str):
    try:
        # 嘗試取得文章文件
        post_ref = db.collection("post").document(post_id)
        post_snapshot = post_ref.get()
        if not post_snapshot.exists:
            print(f"文章 {post_id} 不存在或已被刪除")
            raise HTTPException(status_code=404, detail="找不到這篇文章")

        # 嘗試取得 comments 子集合
        comments_ref = post_ref.collection("comments").order_by("timestamp", direction=firestore.firestore.Query.ASCENDING).stream()
        comments = []
        for c in comments_ref:
            comment_data = c.to_dict()
            print(f"讀取評論: {c.id}, 資料: {comment_data}")
            comments.append({
                "comment_id": c.id,
                "user_id": comment_data.get("user_id"),
                "name": comment_data.get("name", "匿名"),  # 預設為 "匿名"
                "content": comment_data.get("content"),
                "timestamp": comment_data.get("timestamp")
            })

        # 返回整理後的評論列表
        return comments
    except HTTPException as http_err:
        # 捕捉 HTTP 錯誤並重新拋出
        print(f"HTTP 錯誤: {http_err.detail}")
        raise http_err
    except Exception as e:
        # 捕捉其他錯誤
        print(f"取得留言時發生錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"無法取得留言: {str(e)}")
