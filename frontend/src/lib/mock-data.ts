// 這個文件包含模擬數據，用於前端開發
// 後端集成時，這些數據將被實際的API調用替換

import type { Conversation, Message, User } from "./types"

// 當前用戶


  

// 創建模擬消息
const createMessages = (userId: string): Message[] => {
  const now = new Date()

  return [
    {
      id: `msg-${userId}-1`,
      senderId: userId,
      content: "嗨，你好！最近怎麼樣？",
      timestamp: new Date(now.getTime() - 3600000 * 24).toISOString(),
      status: "read",
    },
    {
      id: `msg-${userId}-2`,
      senderId: "current-user",
      content: "我很好，謝謝！你呢？",
      timestamp: new Date(now.getTime() - 3500000 * 24).toISOString(),
      status: "read",
    },
    {
      id: `msg-${userId}-3`,
      senderId: userId,
      content: "我也很好！最近在準備期末考，有點忙。你的專案進展如何？",
      timestamp: new Date(now.getTime() - 3400000 * 24).toISOString(),
      status: "read",
    },
    {
      id: `msg-${userId}-4`,
      senderId: "current-user",
      content: "專案進展順利，謝謝關心！我們下週可以討論一下嗎？",
      timestamp: new Date(now.getTime() - 3300000 * 24).toISOString(),
      status: "read",
    },
    {
      id: `msg-${userId}-5`,
      senderId: userId,
      content: "當然可以！週二下午有空嗎？我們可以在圖書館見面。",
      timestamp: new Date(now.getTime() - 120000).toISOString(),
      status: "delivered",
    },
  ]
}

// 模擬對話
export const mockConversations: Conversation[] = mockUsers
  .map((user, index) => {
    const messages = createMessages(user.id)
    const lastMessage = messages[messages.length - 1]

    return {
      id: `conv-${user.id}`,
      user,
      lastMessage: lastMessage.content,
      lastMessageTime: lastMessage.timestamp,
      unreadCount: index % 3 === 0 ? 1 : 0, // 一些對話有未讀消息
      messages,
    }
  })
  .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
