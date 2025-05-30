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

        print(f"文章作者ID: {author_id}")
        print(f"評論者ID: {comment.user_id}")

        if not author_id:
            raise HTTPException(status_code=400, detail="無法找到貼文作者")

        # 為author_id添加郵箱後綴進行比較
        author_email = f"{author_id}@m365.fju.edu.tw"
        print(f"比較用的作者郵箱: {author_email}")
        
        # 檢查是否為作者自己留言
        # 從 comment.user_id 中提取用戶 ID（假設格式為 xxx@m365.fju.edu.tw）
        comment_id_parts = comment.user_id.split('@')
        comment_author_id = comment_id_parts[0] if len(comment_id_parts) > 1 else comment.user_id

        print(f"提取的評論者ID: {comment_author_id}")
        print(f"比較: author_id={author_id}, comment_author_id={comment_author_id}")

        if author_id != comment_author_id:  # 使用提取的 ID 部分進行比較
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
        
        return {"message": "留言新增成功"}
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


# 編輯留言 API
@comment_router.put("/posts/{post_id}/comments/{comment_id}")
async def edit_comment(post_id: str, comment_id: str, comment: Comment):
    """
    編輯指定留言內容
    """
    try:
        # 嘗試取得文章文件
        post_ref = db.collection("post").document(post_id)
        post_snapshot = post_ref.get()
        if not post_snapshot.exists:
            raise HTTPException(status_code=404, detail="找不到這篇文章")

        # 嘗試取得特定留言文件
        comment_ref = post_ref.collection("comments").document(comment_id)
        comment_snapshot = comment_ref.get()
        if not comment_snapshot.exists:
            raise HTTPException(status_code=404, detail="找不到這則留言")

        # 更新留言內容
        comment_ref.update({
            "content": comment.content,
            "timestamp": firestore.SERVER_TIMESTAMP  # 更新時間戳
        })

        return {"message": "留言已更新"}
    except HTTPException as http_err:
        print(f"HTTP 錯誤: {http_err.detail}")
        raise http_err
    except Exception as e:
        print(f"編輯留言時發生錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"編輯留言失敗: {str(e)}")


# 刪除留言 API
@comment_router.delete("/posts/{post_id}/comments/{comment_id}")
async def delete_comment(post_id: str, comment_id: str):
    """
    刪除指定留言
    """
    try:
        # 嘗試取得文章文件
        post_ref = db.collection("post").document(post_id)
        post_snapshot = post_ref.get()
        if not post_snapshot.exists:
            raise HTTPException(status_code=404, detail="找不到這篇文章")

        # 嘗試取得特定留言文件
        comment_ref = post_ref.collection("comments").document(comment_id)
        comment_snapshot = comment_ref.get()
        if not comment_snapshot.exists:
            raise HTTPException(status_code=404, detail="找不到這則留言")

        # 刪除留言
        comment_ref.delete()

        # 更新留言數
        post_ref.update({
            "comments_count": firestore.Increment(-1)
        })

        return {"message": "留言已刪除"}
    except HTTPException as http_err:
        print(f"HTTP 錯誤: {http_err.detail}")
        raise http_err
    except Exception as e:
        print(f"刪除留言時發生錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"刪除留言失敗: {str(e)}")
