"use client";

import { useState, useEffect } from "react";
import { Box, Container, Paper, Snackbar, Alert } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import ConversationList from "./conversation-list";
import ChatWindow from "./chat-window";
import { UserProfileModal, AddContactModal } from "./modals";
import type { Conversation, Message, User } from "@/lib/types";
import * as api from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

/**
 * 聊天界面主組件
 */
export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const { user, loading } = useAuth();
  console.log("目前的 user:", user);
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    async function initializeData() {
      try {
        if (!user) throw new Error("User not authenticated");

        setCurrentUser({
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.department,
          avatar: "", 
          isProfileComplete: false,
        });

        const convs = await api.getConversations();
        setConversations(convs || []);
        setIsLoading(false);
      } catch (error) {
        console.error("初始化數據失敗:", error);
        if (error instanceof Error) {
          setNotification({
            open: true,
            message: `無法加載數據：${error.message}`,
            severity: "error",
          });
        } else {
          setNotification({
            open: true,
            message: "無法加載數據：未知錯誤",
            severity: "error",
          });
        }
        setTimeout(() => {
          router.push("/chat");
        }, 3000);
      }
    }

    if (loading) return; // 還在判斷中，不要誤跳轉
    if (!user) {
      setNotification({
        open: true,
        message: "請先登錄",
        severity: "warning",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else {
      initializeData();
    }
  }, [user, loading, router]);

  const handleAddContact = () => {
    setShowAddContact(true);
  };

  const handleAddNewContact = async (studentId: string) => {
    try {
      const existingConversation = conversations.find((c) => c.user.id === studentId);
      if (existingConversation) {
        setShowAddContact(false);
        setSelectedConversation(existingConversation);
        setNotification({
          open: true,
          message: "已經與該用戶有對話，已為您切換到該對話",
          severity: "success",
        });
        return;
      }

      const newConversation = await api.createConversation(studentId);

      setConversations((prev) => [newConversation, ...prev]);
      setShowAddContact(false);
      setSelectedConversation(newConversation);
      setNotification({
        open: true,
        message: "成功添加聯絡人並創建對話",
        severity: "success",
      });
    } catch (error) {
      console.error("添加聯絡人失敗:", error);
      setNotification({
        open: true,
        message: "添加聯絡人失敗，請稍後再試",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (!selectedConversation) return;
    async function loadMessages() {
      try {
        // 確保selectedConversation不為null且有id屬性
        if (!selectedConversation || !selectedConversation.id) return;
        const msgs = await api.getMessages(selectedConversation.id);
        setMessages(msgs);

        // 使用函數式更新，不需要依賴 conversations
        if (selectedConversation && selectedConversation.unreadCount > 0) {
          await api.markConversationAsRead(selectedConversation.id);
          setConversations(prevConversations => 
            prevConversations.map((conv) =>
              conv.id === selectedConversation.id ? { ...conv, unreadCount: 0 } : conv
            )
          );
        }
      } catch (error) {
        console.error("加載消息失敗:", error);
      }
    }
    loadMessages();
  }, [selectedConversation]); // 移除 conversations 依賴

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !content.trim() || !currentUser) return;

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const sentMessage = await api.sendMessage(selectedConversation.id, content);
      setMessages((prev) => prev.map((msg) => (msg.id === tempMessage.id ? sentMessage : msg)));

      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: content, lastMessageTime: new Date().toISOString() }
          : conv
      ).sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
      setConversations(updatedConversations);

      // 移除自動將消息狀態設為「已讀」的功能
      // 只有在真正收到對方已讀確認時才應更新狀態
      // 後端應該提供一個機制來通知前端消息已被讀取
    } catch (error) {
      console.error("發送消息失敗:", error);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempMessage.id ? { ...msg, status: "failed" } : msg))
      );
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleViewProfile = async (userId: string) => {
    try {
      const user = await api.getUserProfile(userId);
      if (user) {
        setSelectedUser(user);
        setShowProfile(true);
      } else {
        setNotification({
          open: true,
          message: "無法載入用戶資料",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("獲取用戶資料失敗:", error);
      setNotification({
        open: true,
        message: "獲取用戶資料失敗",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (isLoading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 2, height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        正在加載...
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2, height: "100vh" }}>
      <Paper
        elevation={3}
        sx={{
          height: "calc(100vh - 32px)",
          display: "flex",
          overflow: "hidden",
          border: 1,
          borderColor: "primary.light",
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100%" : "33.333%",
            borderRight: 1,
            borderColor: "primary.light",
            display: selectedConversation && isMobile ? "none" : "block",
          }}
        >
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
            onAddContact={handleAddContact}
          />
        </Box>

        <Box
          sx={{
            width: isMobile ? "100%" : "66.667%",
            display: !selectedConversation && isMobile ? "none" : "block",
          }}
        >
          {selectedConversation && currentUser ? (
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onViewProfile={handleViewProfile}
              onBack={isMobile ? () => setSelectedConversation(null) : undefined}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <p>選擇一個對話開始聊天</p>
            </Box>
          )}
        </Box>
      </Paper>

      {showProfile && selectedUser && (
        <UserProfileModal user={selectedUser} onClose={() => setShowProfile(false)} />
      )}
      {showAddContact && (
        <AddContactModal onClose={() => setShowAddContact(false)} onAddContact={handleAddNewContact} />
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
