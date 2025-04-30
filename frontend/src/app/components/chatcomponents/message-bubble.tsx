"use client"

import { Box, Typography, Avatar, Button, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"
import { AlertCircle } from "lucide-react"
import type { Message, User } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
  isCurrentUser: boolean
  showAvatar: boolean
  user: User
  onRetry: () => void
  onViewProfile: (userId: string) => void
}

const MessagePaper = styled(Paper, {
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

export default function MessageBubble({
  message,
  isCurrentUser,
  showAvatar,
  user,
  onRetry,
  onViewProfile,
}: MessageBubbleProps) {
  const getStatusText = () => {
    switch (message.status) {
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
    <Box
      sx={{
        display: "flex",
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isCurrentUser ? "row-reverse" : "row",
          alignItems: "flex-start", // Changed from flex-end to flex-start
          maxWidth: "80%",
          gap: 1,
        }}
      >
        {showAvatar && !isCurrentUser && (
          <Box sx={{ mt: 1 }}>
            {" "}
            {/* Added a top margin to align with the message bubble */}
            <Avatar
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
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

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: isCurrentUser ? "flex-end" : "flex-start" }}>
          {showAvatar && !isCurrentUser && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, ml: 0.5 }}>
              {user.name}
            </Typography>
          )}

          <MessagePaper isCurrentUser={isCurrentUser}>
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

            {isCurrentUser && (
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
                      onClick={onRetry}
                    >
                      重試
                    </Button>
                  </Box>
                ) : (
                  getStatusText()
                )}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
