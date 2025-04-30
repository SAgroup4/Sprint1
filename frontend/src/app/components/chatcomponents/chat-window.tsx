"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Box, Typography, IconButton, TextField, Button, Avatar } from "@mui/material"
import { styled } from "@mui/material/styles"
import { ArrowLeft, Send, AlertCircle } from "lucide-react"
import type { Conversation, Message, User } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface ChatWindowProps {
  conversation: Conversation
  messages: Message[]
  currentUser: User
  onSendMessage: (content: string) => void
  onViewProfile: (userId: string) => void
  onBack?: () => void
}

// 樣式組件
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    "& fieldset": {
      borderColor: theme.palette.primary.light,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}))

const SendButton = styled(IconButton)(({ theme }) => ({
  width: 48,
  height: 48,
  minWidth: 48,
  minHeight: 48,
  borderRadius: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "flex-end",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  "&.Mui-disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}))

const MessagePaper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isCurrentUser",
})<{ isCurrentUser: boolean }>(({ theme, isCurrentUser }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: "100%",
  borderRadius: 16,
  borderTopRightRadius: isCurrentUser ? 4 : 16,
  borderTopLeftRadius: isCurrentUser ? 16 : 4,
  backgroundColor: isCurrentUser ? theme.palette.primary.main : theme.palette.grey[100],
  color: isCurrentUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  transition: "box-shadow 0.2s",
  "&:hover": {
    boxShadow: theme.shadows[3],
  },
}))

// 聊天窗口組件 - 需要後端集成
// 這個組件顯示聊天消息並允許發送新消息
export default function ChatWindow({
  conversation,
  messages,
  currentUser,
  onSendMessage,
  onViewProfile,
  onBack,
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const [userScrolled, setUserScrolled] = useState(false)

  // 滾動到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
    setUserScrolled(false)
  }, [messages, conversation.id])

  // 處理滾動事件
  const handleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10
      setUserScrolled(!isAtBottom)
    }
  }

  // 處理按鍵事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault()
      if (messageInput.trim()) {
        onSendMessage(messageInput)
        setMessageInput("")
      }
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  // 獲取消息狀態文本
  const getStatusText = (status?: string) => {
    switch (status) {
      case "sending":
        return "傳送中..."
      case "delivered":
        return "已送達"
      case "read":
        return "已讀"
      case "failed":
        return "傳送失敗"
      default:
        return ""
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 頭部 */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "primary.light",
          bgcolor: "secondary.light",
          display: "flex",
          alignItems: "center",
        }}
      >
        {onBack && (
          <IconButton onClick={onBack} sx={{ mr: 1, color: "primary.main" }}>
            <ArrowLeft size={20} />
          </IconButton>
        )}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => onViewProfile(conversation.user.id)}
        >
          <Avatar
            src={conversation.user.avatar || "/placeholder.svg"}
            alt={conversation.user.nickname}
            sx={{ width: 40, height: 40, border: 2, borderColor: "background.paper" }}
          />
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="subtitle1">{conversation.user.nickname}</Typography>
          </Box>
        </Box>
      </Box>

      {/* 消息區域 */}
      <Box
        ref={messageContainerRef}
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        onScroll={handleScroll}
      >
        {messages.length > 0 ? (
          messages.map((message, index) => {
            const isCurrentUserMessage = message.senderId === currentUser.id
            // 修改頭像顯示邏輯，對於非當前用戶的消息，始終顯示頭像
            const showAvatar = !isCurrentUserMessage
            const user = isCurrentUserMessage ? currentUser : conversation.user

            return (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: isCurrentUserMessage ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isCurrentUserMessage ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    maxWidth: "80%",
                    gap: 1,
                  }}
                >
                  {showAvatar && !isCurrentUserMessage && (
                    <Box sx={{ mt: 1 }}>
                      <Avatar
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.nickname}
                        sx={{
                          width: 32,
                          height: 32,
                          cursor: "pointer",
                          border: 1,
                          borderColor: "background.paper",
                        }}
                        onClick={() => onViewProfile(user.id)}
                      />
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isCurrentUserMessage ? "flex-end" : "flex-start",
                    }}
                  >
                    {showAvatar && !isCurrentUserMessage && (
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, ml: 0.5 }}>
                        {user.nickname}
                      </Typography>
                    )}

                    <MessagePaper isCurrentUser={isCurrentUserMessage}>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {message.content}
                      </Typography>
                    </MessagePaper>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      <Typography variant="caption">{formatTime(new Date(message.timestamp))}</Typography>

                      {isCurrentUserMessage && (
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {message.status === "failed" ? (
                            <Box sx={{ display: "flex", alignItems: "center", color: "error.main" }}>
                              <AlertCircle size={12} style={{ marginRight: 4 }} />
                              <span>失敗</span>
                              <Button
                                size="small"
                                sx={{
                                  minWidth: "auto",
                                  p: 0,
                                  ml: 0.5,
                                  color: "primary.main",
                                  textTransform: "none",
                                  fontSize: "0.75rem",
                                }}
                                onClick={() => {
                                  // 在實際應用中，這裡會重試發送消息
                                  console.log("重試發送消息:", message.id)
                                }}
                              >
                                重試
                              </Button>
                            </Box>
                          ) : (
                            getStatusText(message.status)
                          )}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            )
          })
        ) : (
          <Box sx={{ textAlign: "center", color: "text.secondary", py: 4 }}>
            <Typography>還沒有訊息。開始對話吧！</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* 新消息指示器 */}
      {userScrolled && (
        <Box
          sx={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 20, boxShadow: 2 }}
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
              setUserScrolled(false)
            }}
          >
            新訊息 ↓
          </Button>
        </Box>
      )}

      {/* 輸入區域 */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "primary.light",
          bgcolor: "secondary.light",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <StyledTextField
            fullWidth
            multiline
            maxRows={4}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="輸入訊息..."
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <SendButton
            disabled={!messageInput.trim()}
            onClick={() => {
              if (messageInput.trim()) {
                onSendMessage(messageInput)
                setMessageInput("")
              }
            }}
          >
            <Send size={20} />
          </SendButton>
        </Box>
      </Box>
    </Box>
  )
}
