from fastapi import APIRouter, Query, HTTPException
from firebase_admin import firestore
from db import db

filter_router = APIRouter()

@filter_router.get("/posts/filter")
async def filter_posts(
    order: str = Query("newest", regex="^(newest|oldest)$"), # 篩選排序方式(日期)
    #skilltags: str = Query(None),  # 篩選技能標籤
    #languagetags: str = Query(None),  # 篩選語言標籤
    #leisuretags: str = Query(None)  # 篩選休閒標籤
):
    """
    篩選文章列表，依據日期排序及技能標籤。
    :param order: 排序方式，"newest" 表示由近到遠，"oldest" 表示由遠到近。
    :param skilltags: 技能標籤，以逗號分隔，如 "Python,Java"。
    :param languagetags: 語言標籤，以逗號分隔，如 "英文,日文"。
    :return: 篩選後的文章列表。
    """
    try:
        direction = firestore.firestore.Query.DESCENDING if order == "newest" else firestore.firestore.Query.ASCENDING

        posts_ref = db.collection("post").order_by("timestamp", direction=direction)

        # 如果有傳入技能標籤，則進行技能標籤篩選
        #if skilltags:
        #    skill_list = skilltags.split(",")
        #    posts_ref = posts_ref.where("skilltags", "array_contains_any", skill_list)

        # 如果有傳入語言標籤，則進行語言標籤篩選
        #if languagetags:
        #    language_list = languagetags.split(",")
        #    posts_ref = posts_ref.where("languagetags", "array_contains_any", language_list)

        # 如果有傳入休閒標籤，則進行休閒標籤篩選
        #if leisuretags:
        #    leisure_list = leisuretags.split(",")
        #    posts_ref = posts_ref.where("leisuretags", "array_contains_any", leisure_list)

        posts_ref = posts_ref.stream()

        posts = [{
            "post_id": post.id,
            "user_id": post.get("user_id"),
            "title": post.get("title"),
            "content": post.get("content"),
            "timestamp": post.get("timestamp"),
            "comments_count": post.get("comments_count"),
            # "skilltags": post.get("skilltags") or [],
            # "languagetags": post.get("languagetags") or [],
            # "leisuretags": post.get("leisuretags") or []
        } for post in posts_ref]

        print(f"排序方式: {order}")
        #print(f"技能標籤: {skilltags}")
        #print(f"語言標籤: {languagetags}")
        #print(f"休閒標籤: {leisuretags}")
        print(f"文章數量: {len(posts)}")

        if not posts:
            print("沒有找到符合條件的文章。")
            return {"posts": []}

        return {"posts": posts}

    except Exception as e:
        print(f"篩選文章時發生錯誤: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error filtering posts: {str(e)}")
