export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
  }
  
  export interface ChatRoom {
    id: string;
    name: string;
    avatar?: string; // 注意這裡是 optional，才不會報錯
    unread: number;
    lastMessage: string;
    messages: ChatMessage[];
    lastUpdatedAt?: string;
  }
  