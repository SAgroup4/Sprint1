"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Divider,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { Search, Plus } from 'lucide-react'
import type { Conversation } from "@/lib/types"
import { formatDistanceToNow } from "@/lib/utils"

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId?: string
  onSelectConversation: (conversation: Conversation) => void
  onAddContact: () => void
}

// 樣式組件
const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.secondary.light,
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}))

const MessagePreview = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "block",
  maxWidth: "100%",
}) as typeof Typography

const ConversationItem = styled(Box)({
  transition: "all 0.3s ease",
})

// 對話列表組件 - 需要後端集成
// 這個組件顯示用戶的對話列表
export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onAddContact,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortedConversations, setSortedConversations] = useState<Conversation[]>([])
  const [, forceUpdate] = useState({})

  // 更新排序的對話列表
  useEffect(() => {
    // 首次渲染 - 立即設置
    if (sortedConversations.length === 0) {
      setSortedConversations(conversations)
      return
    }

    // 後續更新添加小延遲以實現平滑過渡
    const timer = setTimeout(() => {
      setSortedConversations(conversations)
    }, 50)

    return () => clearTimeout(timer)
  }, [conversations])
  
  // 暫時禁用時間更新定時器
  /*
  useEffect(() => {
    // 每分鐘強制更新組件以刷新時間顯示
    const timer = setInterval(() => {
      forceUpdate({})
    }, 60000) // 60秒 = 1分鐘
    
    return () => clearInterval(timer) // 清理定時器
  }, [])
  */

  // 過濾對話列表
  const filteredConversations = sortedConversations.filter((conversation) => {
    // 如果搜索查詢為空，顯示所有對話
    if (!searchQuery.trim()) return true;
    
    // 如果用戶名存在，則按名稱過濾，否則顯示為「未知用戶」
    const userName = conversation.user.name || "未知用戶";
    return userName.toLowerCase().includes(searchQuery.toLowerCase());
  })

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "primary.light", bgcolor: "secondary.light" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.dark" }}>
            訊息
          </Typography>
          <Button variant="contained" size="small" startIcon={<Plus size={16} />} onClick={onAddContact}>
            新增聯絡人
          </Button>
        </Box>
        <TextField
          fullWidth
          placeholder="搜尋對話..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#2563eb" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "background.paper",
              borderRadius: 2,
              "& fieldset": {
                borderColor: "primary.light",
              },
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
      </Box>

      <List
        sx={{
          overflow: "auto",
          flex: 1,
          p: 0,
          position: "relative",
        }}
      >
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem key={conversation.id}>
              <StyledListItem
                selected={selectedConversationId === conversation.id}
                onClick={() => onSelectConversation(conversation)}
                sx={{ px: 2, py: 1.5 }}
              >
                <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                  <ListItemAvatar sx={{ minWidth: 60 }}>
                    <Avatar
                      src={conversation.user.avatar || "/placeholder.svg"}
                      alt={conversation.user.name}
                      sx={{ width: 48, height: 48, border: 2, borderColor: "background.paper" }}
                    />
                  </ListItemAvatar>

                  <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="subtitle1" component="span" fontWeight="medium">
                        {conversation.user.name || "未知用戶"}
                      </Typography>
                      {/* 暫時禁用時間顯示功能
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(conversation.lastMessageTime))}
                      </Typography>
                      */}
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                      <MessagePreview variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {conversation.lastMessage}
                      </MessagePreview>

                      {conversation.unreadCount > 0 && (
                        <Box
                          sx={{
                            ml: 1,
                            minWidth: 20,
                            height: 20,
                            borderRadius: 10,
                            bgcolor: "primary.main",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          {conversation.unreadCount}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </StyledListItem>
              <Divider />
            </ConversationItem>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
            <Typography>沒有找到對話</Typography>
          </Box>
        )}
      </List>
    </Box>
  )
}
