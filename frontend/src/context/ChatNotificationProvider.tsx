'use client';

import { createContext, useState, useEffect, useContext, useCallback, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Typography, Avatar } from '@mui/material';
import { useAuth } from '@/context/AuthProvider';
import { useChatWebSocket, ChatSocketEvent } from '@/lib/useChatWebSocket';
import * as api from '@/lib/api';

// 管理通知的 Context 類型
interface ChatNotificationContextType {
  notifyNewMessage: (senderId: string, senderName: string, senderAvatar: string, content: string, conversationId: string) => void;
  hasUnreadMessages: boolean;
  refreshUnreadStatus: () => Promise<void>;
}

// 建立 Context
const ChatNotificationContext = createContext<ChatNotificationContextType | undefined>(undefined);

// 通知提供器組件
export const ChatNotificationProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [hasUnreadMessages, setHasUnreadMessages] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 檢查當前路徑是否為聊天頁面
  const isChatPage = pathname?.startsWith('/chat');

  // 初始化：獲取未讀消息狀態
  useEffect(() => {
    if (user) {
      refreshUnreadStatus();
    }
  }, [user]);

  // 處理 WebSocket 事件
  const handleSocketEvent = useCallback((event: ChatSocketEvent) => {
    if (!event) return;
    
    if (event.type === "new_message") {
      // 如果是收到新訊息且不是自己發的，並且不在聊天頁面
      if (event.message.senderId !== user?.id) {
        // 更新未讀消息狀態
        setHasUnreadMessages(true);
        
        // 如果不在聊天頁面，顯示通知
        if (!isChatPage) {
          // 顯示通知
          fetchUserDetails(event.message.senderId)
            .then(sender => {
              notifyNewMessage(
                event.message.senderId,
                sender?.name || `用戶 ${event.message.senderId}`,
                sender?.avatar || '/placeholder.svg',
                event.message.content,
                event.conversationId
              );
            });
        }
      }
    } else if (event.type === "new_conversation") {
      // 新對話也應該觸發未讀狀態更新
      refreshUnreadStatus();
    }
  }, [user, isChatPage]);

  // WebSocket 連線
  useChatWebSocket({
    enabled: !!user,
    onEvent: handleSocketEvent,
  });

  // 獲取未讀消息狀態
  const refreshUnreadStatus = async () => {
    try {
      const conversations = await api.getConversations();
      const hasUnread = conversations.some(conv => conv.unreadCount > 0);
      setHasUnreadMessages(hasUnread);
      setIsInitialized(true);
    } catch (error) {
      console.error('獲取未讀消息狀態失敗:', error);
      setHasUnreadMessages(false);
    }
  };

  // 獲取用戶詳細資訊
  const fetchUserDetails = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('獲取用戶資訊失敗:', error);
      return null;
    }
  };

  // 創建新訊息通知
  const notifyNewMessage = (
    senderId: string, 
    senderName: string, 
    senderAvatar: string, 
    content: string, 
    conversationId: string
  ) => {
    // 使用自定義組件作為 toast 內容
    toast.custom((t) => (
      <Box
        onClick={() => {
          router.push(`/chat?conv=${conversationId}`);
          toast.dismiss(t.id);
        }}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          backgroundColor: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e2e8f0',
          width: '300px',
          maxWidth: '100%',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
          animation: t.visible ? 'custom-enter 0.5s ease' : 'custom-exit 0.5s ease forwards',
          '@keyframes custom-enter': {
            '0%': {
              opacity: 0,
              transform: 'translateY(-10px)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          },
          '@keyframes custom-exit': {
            '0%': {
              opacity: 1,
              transform: 'translateY(0)'
            },
            '100%': {
              opacity: 0,
              transform: 'translateY(-10px)'
            }
          }
        }}
      >
        <Avatar
          src={senderAvatar}
          alt={senderName}
          sx={{ 
            width: 40, 
            height: 40, 
            marginRight: 1.5,
            border: '2px solid #e2e8f0'
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 'bold',
              marginBottom: 0.5,
              color: '#1e40af'
            }}
          >
            {senderName}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#4b5563',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {content}
          </Typography>
        </Box>
      </Box>
    ), {
      duration: 5000,
      position: 'bottom-right',
    });
  };

  return (
    <ChatNotificationContext.Provider value={{ 
      notifyNewMessage, 
      hasUnreadMessages,
      refreshUnreadStatus
    }}>
      <Toaster 
        toastOptions={{
          className: '',
          style: {
            padding: 0,
            margin: 0,
            background: 'transparent',
            boxShadow: 'none',
            border: 'none',
          },
        }}
      />
      {children}
    </ChatNotificationContext.Provider>
  );
};

// 使用通知的 Hook
export const useChatNotifications = () => {
  const context = useContext(ChatNotificationContext);
  if (!context) {
    throw new Error('useChatNotifications 必須在 ChatNotificationProvider 中使用');
  }
  return context;
}; 