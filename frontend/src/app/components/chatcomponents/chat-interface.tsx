"use client";

import { useState, useEffect, useRef } from "react";
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
  
  // 将 useRef 移到组件顶部与其他 Hooks 一起声明
  const previousConversationsRef = useRef<string>("");

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
        // 對獲取的對話列表進行排序
        const sortedConvs = (convs || []).sort(
          (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );
        setConversations(sortedConvs);
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

  // 添加輪詢機制獲取新消息
  useEffect(() => {
    if (!selectedConversation) return;
    
    // 首次加载消息
    const loadMessages = async () => {
      try {
        if (!selectedConversation.id) return;
        const msgs = await api.getMessages(selectedConversation.id);
        setMessages(msgs);
        
        // 标记为已读
        if (selectedConversation.unreadCount > 0) {
          await api.markConversationAsRead(selectedConversation.id);
          setConversations(prevConversations => 
            prevConversations.map((conv) =>
              conv.id === selectedConversation.id ? { ...conv, unreadCount: 0 } : conv
            )
          );
        }
      } catch (error) {
        console.error("加载消息失败:", error);
      }
    };
    
    loadMessages();
    
    // 设置轮询间隔，每3秒检查一次新消息
    const intervalId = setInterval(async () => {
      try {
        if (!selectedConversation.id) return;
        const msgs = await api.getMessages(selectedConversation.id);
        
        // 只有当消息数量或最后一条消息ID变化时才更新
        if (msgs.length !== messages.length || 
            (msgs.length > 0 && messages.length > 0 && 
             msgs[msgs.length-1].id !== messages[messages.length-1].id)) {
          setMessages(msgs);
        }
      } catch (error) {
        console.error("轮询消息失败:", error);
      }
    }, 3000); // 3秒轮询一次
    
    return () => clearInterval(intervalId);
  }, [selectedConversation]);

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
      // 先檢查是否是當前選中的對話中的用戶
      if (selectedConversation && selectedConversation.user.id === userId) {
        // 如果是當前對話的用戶，直接使用對話中的用戶信息
        setSelectedUser({
          ...selectedConversation.user,
          // 確保電子郵件存在，如果對話中沒有，則嘗試從API獲取
          email: selectedConversation.user.email || `${userId}@mail.fju.edu.tw`
        });
        setShowProfile(true);
        return;
      }
      
      // 如果不是當前對話的用戶，則從API獲取
      const user = await api.getUserProfile(userId);
      if (user) {
        // 確保電子郵件存在，如果API返回的沒有，則使用學號構建一個
        const userWithEmail = {
          ...user,
          email: user.email || `${userId}@mail.fju.edu.tw`
        };
        setSelectedUser(userWithEmail);
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

  // 添加輪詢機制獲取新對話或對話更新
  useEffect(() => {
    if (!user || loading) return;
    
    const fetchConversations = async () => {
      try {
        const convs = await api.getConversations();
        // 对获取的对话列表进行排序
        const sortedConvs = (convs || []).sort(
          (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );
        
        // 使用 useRef 存储的上一次对话列表进行比较，而不是直接依赖 conversations
        const currentConversationsJson = JSON.stringify(sortedConvs);
        const hasChanges = currentConversationsJson !== previousConversationsRef.current;
        
        if (hasChanges) {
          setConversations(sortedConvs);
          previousConversationsRef.current = currentConversationsJson;
        }
      } catch (error) {
        console.error("获取对话列表失败:", error);
      }
    };
    
    // 首次加载
    fetchConversations();
    
    // 设置轮询间隔，每5秒检查一次新对话
    const intervalId = setInterval(fetchConversations, 5000);
    
    return () => clearInterval(intervalId);
  }, [user, loading]); // 移除 conversations 依赖项，使用 useRef 代替

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
