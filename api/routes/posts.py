# from fastapi import APIRouter
# from fastapi import HTTPException
# from firebase_admin import firestore
# from pydantic import BaseModel
# from db import db

# # 定義 Post 模型（與資料庫結構相對應）
# class Post(BaseModel):
#     user_id: str
#     title: str
#     content: str

# # 定義路由器
# post_router = APIRouter()

# # 創建新文章的 API 路由
# @post_router.post("/posts")
# async def create_post(post: Post):
#     try:
#         result = db.collection("post").add({
#             "user_id": post.user_id,
#             "title": post.title,
#             "content": post.content,
#             "timestamp": firestore.firestore.SERVER_TIMESTAMP,
#             "comments_count": 0 
            
#         })
#         print("Add結果：", result)
#         post_ref = result[0]  # 取 tuple 的第一個元素（DocumentReference）
#         print(f"文章創建成功, post_id: {post_ref.id}") 
#         return {"post_id": post_ref.id}
#     except Exception as e:
#         print(f"錯誤: {str(e)}")  # 打印錯誤訊息
#         raise HTTPException(status_code=500, detail=f"Error creating post: {str(e)}")


# @post_router.get("/posts")
# async def get_posts():
#     try:
#         # 按時間戳記降序排序，確保最新的文章顯示在最前面
#         posts_ref = db.collection("post").order_by("timestamp", direction=firestore.firestore.Query.DESCENDING).stream()
#         posts = [{
#             "post_id": post.id,
#             "user_id": post.get("user_id"),
#             "title": post.get("title"),
#             "content": post.get("content"),
#             "timestamp": post.get("timestamp"),
#             "comments_count": post.get("comments_count")

#         } for post in posts_ref]
#         print(f"成功獲取 {len(posts)} 篇文章")
#         return posts
#     except Exception as e:
#         print(f"獲取文章列表時發生錯誤: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error fetching posts: {str(e)}")



from fastapi import APIRouter, HTTPException, Request
from firebase_admin import firestore
from pydantic import BaseModel
from typing import List
from db import db

# 定義 Post 模型（與資料庫結構相對應）
class Post(BaseModel):
    user_id: str
    title: str
    content: str
    skilltags: List[str] = []
    languagetags: List[str] = []
    leisuretags: List[str] = []

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
            "timestamp": firestore.firestore.SERVER_TIMESTAMP,
            "comments_count": 0 
        })
        post_ref = result[0]  # 取 tuple 的第一個元素（DocumentReference）
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
            if not data.get("timestamp"):
                continue

            posts.append({
                "post_id": post.id,
                "user_id": data.get("user_id"),
                "title": data.get("title"),
                "content": data.get("content"),
                "timestamp": data.get("timestamp"),
                "comments_count": data.get("comments_count"),
                "skilltags": data.get("skilltags", []),
                "languagetags": data.get("languagetags", []),
                "leisuretags": data.get("leisuretags", []),
            })

        print(f"成功取得 {len(posts)} 篇文章，排序：{order}")
        return posts
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
            "skilltags": data.get("skilltags", []),
            "languagetags": data.get("languagetags", []),
            "leisuretags": data.get("leisuretags", []),
        }
    except Exception as e:
        print(f"獲取單一貼文時出錯: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching post: {e}")


# 🔹 支援條件篩選的貼文 API（依技能／語言／休閒／日期）
@post_router.get("/posts/filter")
async def filter_posts(request: Request):
    try:
        params = request.query_params
        order = params.get("order", "newest")  # newest 或 oldest
        skilltags = params.get("skilltags", "").split(",") if params.get("skilltags") else []
        languagetags = params.get("languagetags", "").split(",") if params.get("languagetags") else []
        leisuretags = params.get("leisuretags", "").split(",") if params.get("leisuretags") else []

        query = db.collection("post")

        # 注意：Firestore 限制 array-contains-any 一次只能用在一個欄位
        if skilltags:
            query = query.where("skilltags", "array_contains_any", skilltags)
        elif languagetags:
            query = query.where("languagetags", "array_contains_any", languagetags)
        elif leisuretags:
            query = query.where("leisuretags", "array_contains_any", leisuretags)

        direction = firestore.firestore.Query.DESCENDING if order == "newest" else firestore.firestore.Query.ASCENDING
        query = query.order_by("timestamp", direction=direction)

        results = query.stream()

        posts = []
        for post in results:
            data = post.to_dict()
            posts.append({
                "post_id": post.id,
                "user_id": data.get("user_id"),
                "title": data.get("title"),
                "content": data.get("content"),
                "timestamp": data.get("timestamp"),
                "comments_count": data.get("comments_count"),
                "skilltags": data.get("skilltags", []),
                "languagetags": data.get("languagetags", []),
                "leisuretags": data.get("leisuretags", []),
            })

        return {"posts": posts}
    except Exception as e:
        print(f"過濾文章時出錯: {e}")
        raise HTTPException(status_code=500, detail=f"Error filtering posts: {e}")
