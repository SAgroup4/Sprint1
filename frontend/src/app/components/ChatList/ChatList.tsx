// ChatList.tsx
'use client';
import { useState } from 'react';
import axios from 'axios';
import {
  Box, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Typography, Badge, TextField, IconButton, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import type { ChatRoom } from '@/app/chat/chat';
import type { TypographyProps } from '@mui/material';

const ChatListContainer = styled(Box)(({ theme }) => ({
  width: '300px',
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledListItem = styled(ListItem)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  backgroundColor: selected ? `${theme.palette.primary.light}20` : 'transparent',
  '&:hover': {
    backgroundColor: selected ? `${theme.palette.primary.light}30` : theme.palette.action.hover,
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  transition: 'background-color 0.2s ease',
}));

const ChatName = styled((props: TypographyProps) => (
  <Typography component="span" {...props} />
))({ 
  fontWeight: 600, 
  fontSize: '0.95rem',
  color: '#2c3e50',
});

const LastMessage = styled((props: TypographyProps) => (
  <Typography component="span" {...props} />
))({
  color: 'rgba(0, 0, 0, 0.5)',
  fontSize: '0.85rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '200px',
});

interface ChatListProps {
  chats: ChatRoom[];
  selectedChat: ChatRoom | null;
  onChatSelect: (chat: ChatRoom) => void;
  onChatroomsUpdate: (updated: ChatRoom[]) => void;
}

export default function ChatList({ chats, selectedChat, onChatSelect, onChatroomsUpdate }: ChatListProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState('');

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    const found = chats.find(chat =>
      chat.name.includes(searchInput) || chat.id.includes(searchInput)
    );
    if (found) onChatSelect(found);
    else alert("找不到相關聊天室");
    setSearchInput('');
  };

  const handleUserSearchCreate = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (!studentIdInput.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8000/api/chatrooms/chatsearch?student_id=${studentIdInput}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 为res.data添加类型断言，确保可以安全访问chatroom_id
      const newId = (res.data as { chatroom_id: string }).chatroom_id;
      const updated = await axios.get("http://localhost:8000/api/chatrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allRooms = updated.data as ChatRoom[];
      const newRoom = allRooms.find(r => r.id === newId);
      if (newRoom) onChatSelect(newRoom);
      const sorted = allRooms.sort((a, b) =>
        new Date(b.lastUpdatedAt || 0).getTime() - new Date(a.lastUpdatedAt || 0).getTime()
      );
      onChatroomsUpdate(sorted);
      setStudentIdInput('');
      setIsModalOpen(false);
    } catch {
      alert("建立聊天室失敗或找不到使用者");
    }
  };

  const handleHelperChat = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/chatrooms/create-helper", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = await axios.get("http://localhost:8000/api/chatrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allRooms = updated.data as ChatRoom[];
      const helperRoom = allRooms.find(r => r.id.endsWith("_helper"));
      if (helperRoom) onChatSelect(helperRoom);
      const sorted = allRooms.sort((a, b) =>
        new Date(b.lastUpdatedAt || 0).getTime() - new Date(a.lastUpdatedAt || 0).getTime()
      );
      onChatroomsUpdate(sorted);
    } catch {
      alert("載入小幫手聊天室失敗");
    }
  };

  return (
    <ChatListContainer>
      <Box px={2} py={1.5} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
    <Typography fontWeight="bold" fontSize="1.1rem" sx={{ color: '#1a365d' }}>聊天</Typography>
    <Stack direction="row" spacing={1}>
      <IconButton onClick={handleUserSearchCreate} size="small" sx={{ backgroundColor: 'rgba(25, 118, 210, 0.04)', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' } }}>
        <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: 'primary.main' }}>+</Avatar>
      </IconButton>
      <IconButton onClick={handleHelperChat} size="small" sx={{ backgroundColor: 'rgba(25, 118, 210, 0.04)', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' } }}>
        <SmartToyIcon fontSize="small" />
      </IconButton>
    </Stack>
  </Stack>
        
        <TextField
          placeholder="搜尋聊天室"
          size="small"
          fullWidth
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />,
            sx: { borderRadius: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }
          }}
          sx={{ mb: 0.5 }}
        />
        
      </Box>

      <List sx={{ p: 0 }}>
        {chats.map((chat) => (
          <StyledListItem
            key={chat.id}
            selected={selectedChat?.id === chat.id}
            onClick={() => onChatSelect(chat)}
          >
            <ListItemAvatar>
              <Badge 
                color="primary" 
                badgeContent={chat.unread} 
                invisible={chat.unread === 0}
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontWeight: 'bold', 
                    minWidth: '18px', 
                    height: '18px',
                    fontSize: '0.7rem'
                  } 
                }}
              >
                <Avatar 
                  src={chat.avatar} 
                  sx={{ 
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    bgcolor: chat.id.endsWith('_helper') ? 'secondary.main' : 'primary.main'
                  }}
                >
                  {chat.name.charAt(0)}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={<ChatName variant="body1">{chat.name}</ChatName>}
              secondary={<LastMessage variant="body2">{chat.lastMessage}</LastMessage>}
            />
          </StyledListItem>
        ))}
      </List>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600, color: '#1a365d' }}>建立新聊天室</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="學號"
            fullWidth
            variant="outlined"
            value={studentIdInput}
            onChange={(e) => setStudentIdInput(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsModalOpen(false)} sx={{ color: 'text.secondary' }}>取消</Button>
          <Button onClick={handleModalSubmit} variant="contained" sx={{ px: 3, borderRadius: 1.5 }}>建立</Button>
        </DialogActions>
      </Dialog>
    </ChatListContainer>
  );
}