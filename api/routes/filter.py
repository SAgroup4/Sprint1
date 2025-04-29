from fastapi import APIRouter, Query, HTTPException
from firebase_admin import firestore
from db import db

filter_router = APIRouter()

@filter_router.get("/posts/filter")
async def filter_posts(
    order: str = Query("newest", regex="^(newest|oldest)$"), # 篩選排序方式
    # skills: str = Query(None)  # 篩選標籤
):
    """
    篩選文章列表，依據日期排序及技能標籤。
    :param order: 排序方式，"newest" 表示由近到遠，"oldest" 表示由遠到近。
    :param skills: 需要篩選的技能標籤，以逗號分隔，如 "Python,Java"。
    :return: 篩選後的文章列表。
    """
    try:
        # 設置排序方向：根據傳入的 order 參數來確定是 'newest' 還是 'oldest'
        direction = firestore.firestore.Query.DESCENDING if order == "newest" else firestore.firestore.Query.ASCENDING

        # 獲取文章資料，並根據 timestamp 排序
        posts_ref = db.collection("post").order_by("timestamp", direction=direction)

        # 如果有傳入技能標籤，則進行標籤篩選
        # if skills:
        #     skill_list = skills.split(",")  # 將技能標籤字串轉成列表
        #     posts_ref = posts_ref.where("skill", "array_contains_any", skill_list)  # 篩選符合技能標籤的文章

        posts_ref = posts_ref.stream()

        # 格式化文章資料
        posts = [{
            "post_id": post.id,
            "user_id": post.get("user_id"),
            "title": post.get("title"),
            "content": post.get("content"),
            "timestamp": post.get("timestamp"),
            "comments_count": post.get("comments_count"),
            # "skill": post.get("skill") or []  # 確保 skill 欄位存在
        } for post in posts_ref]

        print(f"排序方式: {order}")
        # print(f"篩選標籤: {skills}")
        print(f"文章數量: {len(posts)}")

        # 如果沒有找到符合條件的文章，返回提示
        if not posts:
            print("沒有找到符合條件的文章。")
            return {"posts": []}

        return {"posts": posts}
    
    except Exception as e:
        print(f"篩選文章時發生錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error filtering posts: {str(e)}")
