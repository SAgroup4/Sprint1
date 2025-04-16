'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image'; // 引入 Image
import logo from '../components/layout/Header/輔大logo.png'; // 根據你的路徑調整
import './style.css';

interface Message {
  sender: string;
  text: string;
}

interface Contact {
  user_id: string; // 學號 or email
  avatarUrl: string; // 頭像 URL
}

const MessagePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [contactList, setContactList] = useState<Contact[]>([]);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setCurrentUser({ email: userEmail });
    } else {
      alert('尚未登入，請先登入');
      router.push('/login');
    }

    const dummyContacts: Contact[] = [
      { user_id: '410412345', avatarUrl: '/default-avatar.png' },
      { user_id: '410498765', avatarUrl: '/default-avatar.png' },
      { user_id: '410476543', avatarUrl: '/default-avatar.png' },
    ];
    setContactList(dummyContacts);
  }, [router]);

  useEffect(() => {
    const user = searchParams.get('user');
    if (user) {
      setSelectedUser(user);
    }
  }, [searchParams]);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentUser && selectedUser) {
      setMessages([...messages, { sender: currentUser.email, text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="message-container">
      {/* 浮水印 Logo */}
      <div className="watermark">
        <Image src={logo} alt="輔仁大學 Logo" width={300} height={300} />
      </div>

      {/* 左側聯絡人列表 */}
      <div className="contact-list">
        <h3>聯絡人</h3>
        <ul>
          {contactList.map((contact) => (
            <li
              key={contact.user_id}
              onClick={() => setSelectedUser(contact.user_id)}
              className={`contact-item ${selectedUser === contact.user_id ? 'selected' : ''}`}
            >
              <img src={contact.avatarUrl} alt="頭像" />
              <span>{contact.user_id}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 右側聊天區域 */}
      <div className="chat-container">
        {selectedUser ? (
          <>
            <h3 className="chat-header">與 {selectedUser} 的聊天</h3>
            <div className="message-box">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-item ${message.sender === currentUser?.email ? 'right' : 'left'}`}
                >
                  <div
                    className={`message-content ${message.sender === currentUser?.email ? 'sent' : 'received'}`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* 輸入區 */}
            <div className="input-area">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder="輸入訊息..."
              />
              <button onClick={handleSendMessage}>發送</button>
            </div>
          </>
        ) : (
          <h3 style={{ color: '#0000FF' }}>請選擇聊天對象</h3>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
