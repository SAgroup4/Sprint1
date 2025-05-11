from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
from db import db

# 定義路由器
notification_router = APIRouter()

# 🔹 取得指定使用者的最近五則通知
@notification_router.get("/users/{user_id}/notifications")
async def get_notifications(user_id: str):
    """
    取得指定使用者的最近五則通知
    """
    try:
        notifications_ref = (
            db.collection("users")
            .document(user_id)
            .collection("notifications")
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
            .limit(5)  # 限制只返回最近五則通知
        )
        notifications = notifications_ref.stream()

        result = []
        for notification in notifications:
            data = notification.to_dict()
            comment_user_id = data.get("comment_user_id")

            # 查找 comment_user_id 對應的使用者名稱
            comment_user_name = None
            if comment_user_id:
                users_ref = db.collection("users")
                user_query = users_ref.where("email", "==", comment_user_id).stream()
                for user_doc in user_query:
                    user_data = user_doc.to_dict()
                    comment_user_name = user_data.get("name")
                    break  # 假設 email 是唯一的，找到後即可停止查詢

            result.append({
                "notification_id": notification.id,
                "post_id": data.get("post_id"),
                "post_title": data.get("post_title"),
                "comment_content": data.get("comment_content"),
                "comment_user_id": comment_user_id,
                "comment_user_name": comment_user_name,  # 新增的欄位
                "timestamp": data.get("timestamp"),
                "is_read": data.get("is_read", False),
            })

        print(f"成功取得 {len(result)} 則通知")
        return {"notifications": result}
    except Exception as e:
        print(f"取得通知失敗: {str(e)}")
        raise HTTPException(status_code=500, detail="無法取得通知")

# 🔹 標記通知為已讀
@notification_router.put("/users/{user_id}/notifications/{notification_id}/read")
async def mark_notification_as_read(user_id: str, notification_id: str):
    """
    標記指定通知為已讀
    """
    try:
        notification_ref = db.collection("users").document(user_id).collection("notifications").document(notification_id)
        notification_ref.update({"is_read": True})
        print(f"通知 {notification_id} 已標記為已讀")

        return {"message": "通知已標記為已讀"}
    except Exception as e:
        print(f"標記通知為已讀失敗: {str(e)}")
        raise HTTPException(status_code=500, detail="無法標記通知為已讀")

# 🔹 將指定使用者的所有通知標記為已讀
@notification_router.put("/users/{user_id}/notifications/read-all")
async def mark_all_notifications_as_read(user_id: str):
    """
    將指定使用者的所有通知標記為已讀
    """
    try:
        notifications_ref = db.collection("users").document(user_id).collection("notifications")
        notifications = notifications_ref.stream()

        for notification in notifications:
            notification.reference.update({"is_read": True})

        print(f"使用者 {user_id} 的所有通知已標記為已讀")
        return {"message": "所有通知已標記為已讀"}
    except Exception as e:
        print(f"標記所有通知為已讀失敗: {str(e)}")
        raise HTTPException(status_code=500, detail="無法標記所有通知為已讀")

# 🔹 刪除通知
@notification_router.delete("/users/{user_id}/notifications/{notification_id}")
async def delete_notification(user_id: str, notification_id: str):
    """
    刪除指定通知
    """
    try:
        notification_ref = db.collection("users").document(user_id).collection("notifications").document(notification_id)
        notification_ref.delete()
        print(f"通知 {notification_id} 已刪除")

        return {"message": "通知已刪除"}
    except Exception as e:
        print(f"刪除通知失敗: {str(e)}")
        raise HTTPException(status_code=500, detail="無法刪除通知")