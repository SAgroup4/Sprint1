// 這個文件定義了應用程序中使用的類型
// 後端集成時，這些類型應該與 FastAPI 後端返回的數據結構保持一致

/**
 * 用戶類型定義
 * 對應 Firestore 中的 users 集合
 */
export interface User {
  id: string // 學號，作為用戶的唯一標識符
  name: string // 用戶名稱
  avatar: string // 頭像 URL
  email: string // 電子郵件
  department: string // 系所
  isProfileComplete: boolean // 用戶資料是否完整
}

/**
 * 消息類型定義
 * 對應 Firestore 中的 messages 子集合
 * 在 FastAPI 中需要實現消息的發送、接收和狀態更新
 */
export interface Message {
  id: string // 消息唯一標識符
  senderId: string // 發送者 ID (學號)
  content: string // 消息內容
  timestamp: string // 發送時間，ISO 格式字符串
  status?: "sending" | "delivered" | "read" | "failed" // 消息狀態
  // 後端實現：需要在 FastAPI 中實現消息狀態的更新機制
}

/**
 * 對話類型定義
 * 對應 Firestore 中的 conversations 集合
 * 每個對話包含一個用戶和相關的消息
 */
export interface Conversation {
  id: string // 對話唯一標識符，通常是 "conv-{userId}"
  user: User // 對話對象的用戶信息
  lastMessage: string // 最後一條消息的內容
  lastMessageTime: string // 最後一條消息的時間，ISO 格式字符串
  unreadCount: number // 未讀消息數量
  messages?: Message[] // 對話中的消息列表
  // 後端實現：在 FastAPI 中需要實現獲取對話列表、對話詳情和未讀消息計數的 API
}
