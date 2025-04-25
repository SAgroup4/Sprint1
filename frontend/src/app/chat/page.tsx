// page.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import ChatList from '@/app/components/ChatList/ChatList';
import ChatWindow from '@/app/components/ChatWindow/ChatWindow';
import { useAuth } from '@/context/AuthProvider';

interface ChatRoom {
  id: string;
  name: string;
  avatar?: string;
  unread: number;
  lastMessage: string;
  lastUpdatedAt?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface User {
  email: string;
  name: string;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>發生錯誤，請重試。</h1>;
    }
    return this.props.children;
  }
}

export default function ChatPage() {
  const { user, loading } = useAuth();
  const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sortRooms = useCallback((rooms: ChatRoom[]) => {
    return [...rooms].sort((a, b) => {
      const timeA = a.lastUpdatedAt ? new Date(a.lastUpdatedAt).getTime() : 0;
      const timeB = b.lastUpdatedAt ? new Date(b.lastUpdatedAt).getTime() : 0;
      return timeB - timeA; // 降序排序，最近更新的在頂部
    });
  }, []);

  const fetchChatrooms = useCallback(async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get<ChatRoom[]>('http://localhost:8000/api/chatrooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 始終對後端數據進行排序，確保依據 lastUpdatedAt
      setChatrooms(sortRooms(res.data));
    } catch (error) {
      console.error('取得聊天室失敗:', error);
    }
  }, [user, sortRooms]);

  useEffect(() => {
    fetchChatrooms();
  }, [fetchChatrooms]);

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }
    const token = localStorage.getItem('token');
    axios
      .get<ChatMessage[]>(`http://localhost:8000/api/chatrooms/${selectedChat.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch((error) => {
        console.error('取得消息失敗:', error);
        setMessages([]);
      });
  }, [selectedChat]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    const payload = {
      senderId: user.email,
      senderName: user.name,
      content: newMessage.trim(),
      status: 'sent' as const,
    };

    try {
      const token = localStorage.getItem('token');
      // 發送消息
      const res = await axios.post<ChatMessage>(
        `http://localhost:8000/api/chatrooms/${selectedChat.id}/messages`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const msg = res.data;

      // 更新消息列表
      setMessages((prev) => [...prev, msg]);

      // 重新獲取聊天室列表，確保 lastUpdatedAt 最新
      const updatedRes = await axios.get<ChatRoom[]>('http://localhost:8000/api/chatrooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedRooms = sortRooms(updatedRes.data);
      setChatrooms(updatedRooms);

      // 更新 selectedChat 以反映最新的 lastUpdatedAt
      const updatedSelectedChat = updatedRooms.find((room) => room.id === selectedChat.id);
      if (updatedSelectedChat) {
        setSelectedChat(updatedSelectedChat);
      }

      setNewMessage('');
    } catch (error) {
      console.error('發送消息失敗:', error);
    }
  }, [newMessage, selectedChat, user, sortRooms]);

  const handleChatSelect = useCallback((chat: ChatRoom) => {
    setSelectedChat(chat);
  }, []);

  const updateMessageStatus = useCallback(
    async (messageId: string, status: 'read') => {
      if (!selectedChat) return;
      try {
        const token = localStorage.getItem('token');
        await axios.patch(
          `http://localhost:8000/api/chatrooms/${selectedChat.id}/messages/${messageId}`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
        );
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.warn('消息狀態更新端點不可用，可能尚未實現');
        } else {
          console.error('更新消息狀態失敗:', error);
        }
      }
    },
    [selectedChat]
  );

  // 禁用自動標記已讀，因為 API 端點返回 404
  /*
  useEffect(() => {
    if (!selectedChat || !messages.length) return;
    messages.forEach((msg) => {
      if (msg.senderId !== user?.email && msg.status !== 'read') {
        updateMessageStatus(msg.id, 'read');
      }
    });
  }, [messages, selectedChat, user, updateMessageStatus]);
  */

  if (loading) return <div>載入中...</div>;
  if (!user) return <div>尚未登入</div>;

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f8f9fa', padding: 2, gap: 0 }}>
        <ChatList
          chats={chatrooms}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          onChatroomsUpdate={(updated) => setChatrooms(sortRooms(updated))}
        />
        <ChatWindow
          selectedChat={selectedChat}
          currentUserId={user.email}
          newMessage={newMessage}
          onMessageChange={setNewMessage}
          onSendMessage={handleSendMessage}
          messages={messages}
        />
      </Box>
    </ErrorBoundary>
  );
}