// ✅ ChatPage.tsx
'use client';
import React, { useState, useEffect } from 'react';
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
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const { user, loading } = useAuth();
  const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sortRooms = (rooms: ChatRoom[]) =>
    [...rooms].sort(
      (a, b) => new Date(b.lastUpdatedAt || 0).getTime() - new Date(a.lastUpdatedAt || 0).getTime()
    );

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    axios.get<ChatRoom[]>('http://localhost:8000/api/chatrooms', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setChatrooms(sortRooms(res.data));
      })
      .catch(err => console.error('取得聊天室失敗:', err));
  }, [user]);

  useEffect(() => {
    const handler = (e: any) => {
      setChatrooms(sortRooms(e.detail));
    };
    window.addEventListener('refresh-chatrooms', handler);
    return () => window.removeEventListener('refresh-chatrooms', handler);
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8000/api/chatrooms/${selectedChat.id}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setMessages(res.data as ChatMessage[]))
      .catch(err => setMessages([]));
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    const payload = {
      senderId: user.email || '',
      senderName: user.name || '',
      content: newMessage.trim(),
    };

    console.log('發送訊息內容', payload);

    axios.post<ChatMessage>(
      `http://localhost:8000/api/chatrooms/${selectedChat.id}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }
    ).then(res => {
      const msg = res.data;

      // 更新聊天室資訊並確保排序
      const updatedRoom = {
        ...selectedChat,
        lastMessage: msg.content,
        lastUpdatedAt: msg.timestamp
      };
      
      // 從現有聊天室列表中移除當前聊天室
      const filteredRooms = chatrooms.filter(room => room.id !== selectedChat.id);
      
      // 將更新後的聊天室放在最前面，確保它顯示在列表頂部
      const newRooms = [updatedRoom, ...filteredRooms];
      
      setChatrooms(newRooms);
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    }).catch(err => {
      console.error('發送失敗:', err);
    });
  };

  if (loading) return <div>載入中...</div>;
  if (!user) return <div>尚未登入</div>;

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: 2,
      gap: 0
    }}>
      <ChatList
        chats={chatrooms} // ✅ 不再使用 sortedRooms，直接用已排序 chatrooms
        selectedChat={selectedChat}
        onChatSelect={setSelectedChat}
        onChatroomsUpdate={(updated) => setChatrooms(sortRooms(updated))} // ✅ 確保列表更新時排序
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
  );
}
