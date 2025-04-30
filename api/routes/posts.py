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
 
#  # 定義路由器
# post_router = APIRouter()
 
#  # 創建新文章的 API 路由
# @post_router.post("/posts")
# async def create_post(post: Post):
#     try:
#         # db.collection("post").add(...) 返回的是一個 tuple，應該取第一個元素，即 DocumentReference
#         result = db.collection("post").add({
#             "user_id": post.user_id,
#             "title": post.title,
#             "content": post.content,
#             "timestamp": firestore.firestore.SERVER_TIMESTAMP,
#             "comments_count": 0  # 初始設為 0

#         })

#         print("Add結果：", result)  # 打印返回結果檢查

#         # 如果返回的是正確的 DocumentReference，應該可以獲得 post_ref.id
#         post_ref = result[0]  # 取 tuple 的第一個元素（DocumentReference）
#         print(f"文章創建成功, post_id: {post_ref.id}")  # 打印 post_id
#         return {"post_id": post_ref.id}
#     except Exception as e:
#         print(f"錯誤: {str(e)}")  # 打印錯誤訊息
#         raise HTTPException(status_code=500, detail=f"Error creating post: {str(e)}")
 
# # 獲取所有文章的 API 路由
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


# @post_router.get("/posts")
# async def get_posts():
#     try:
#         posts_ref = db.collection("post").order_by("timestamp", direction=firestore.firestore.Query.DESCENDING).stream()
#         posts = []

#         for post in posts_ref:
#             data = post.to_dict()

#             posts.append({
#                 "post_id": post.id,
#                 "user_id": data.get("user_id"),
#                 "title": data.get("title"),
#                 "content": data.get("content"),
#                 "timestamp": data.get("timestamp"),
#                 "comments_count": data.get("comments_count"),
#                 # 新增這幾行：如果欄位不存在就補空值
#                 # "skilltags": data.get("skilltags", {}),
#                 # "languagetags": data.get("languagetags", {}),
#                 # "leisuretags": data.get("leisuretags", {}),
#             })

#         print(f"成功獲取 {len(posts)} 篇文章")
#         return posts
#     except Exception as e:
#         print(f"獲取文章列表時發生錯誤: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error fetching posts: {str(e)}")




from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel
from db import db

# 🔹 定義貼文資料結構
class Post(BaseModel):
    user_id: str
    title: str
    content: str
    # 🔸 雖然你目前沒存 skilltags 等欄位，這裡不加也 OK

post_router = APIRouter()

# 🔹 建立新貼文
@post_router.post("/posts")
async def create_post(post: Post):
    try:
        result = db.collection("post").add({
            "user_id": post.user_id,
            "title": post.title,
            "content": post.content,
            "timestamp": firestore.firestore.SERVER_TIMESTAMP,
            "comments_count": 0
            # ❌ 不存 skilltags / languagetags / leisuretags（你們目前沒這些欄位）
        })
        post_ref = result[0]
        print(f"文章創建成功, post_id: {post_ref.id}")
        return {"post_id": post_ref.id}
    except Exception as e:
        print(f"錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating post: {str(e)}")

# 🔹 主討論區：取得所有貼文
@post_router.get("/posts")
async def get_posts():
    try:
        posts_ref = db.collection("post").order_by("timestamp", direction=firestore.firestore.Query.DESCENDING).stream()
        posts = []

        for post in posts_ref:
            data = post.to_dict()

            posts.append({
                "post_id": post.id,
                "user_id": data.get("user_id"),
                "title": data.get("title"),
                "content": data.get("content"),
                "timestamp": data.get("timestamp"),
                "comments_count": data.get("comments_count"),
                # 🔸 即使沒有這些欄位，也預設給空物件（讓前端不會爆）
                "skilltags": data.get("skilltags", {}),
                "languagetags": data.get("languagetags", {}),
                "leisuretags": data.get("leisuretags", {})
            })

        print(f"成功獲取 {len(posts)} 篇文章")
        return posts
    except Exception as e:
        print(f"獲取文章列表時發生錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching posts: {str(e)}")

# 🔹 單篇貼文內容頁
@post_router.get("/posts/{post_id}")
async def get_post(post_id: str):
    post_ref = db.collection("post").document(post_id)
    doc = post_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="找不到文章")

    data = doc.to_dict()
    return {
        "id": post_id,
        "title": data.get("title"),
        "content": data.get("content"),
        "user_id": data.get("user_id"),
        "timestamp": data.get("timestamp"),
    }
