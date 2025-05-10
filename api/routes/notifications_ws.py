from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

class NotificationConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"推送訊息失敗: {e}")

notification_manager = NotificationConnectionManager()

@router.websocket("/ws/notifications")
async def notifications_websocket(websocket: WebSocket):
    await notification_manager.connect(websocket)
    print("通知 WebSocket 已連線")

    try:
        while True:
            data = await websocket.receive_text()
            print(f"收到訊息: {data}")
    except WebSocketDisconnect:
        notification_manager.disconnect(websocket)
        print("通知 WebSocket 已斷線")