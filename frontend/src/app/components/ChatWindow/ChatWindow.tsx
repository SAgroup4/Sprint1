'use client';
import { Box, Typography, TextField, IconButton, Paper } from '@mui/material';
import { useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import type { ChatRoom, ChatMessage } from '@/app/chat/chat';
import type { TypographyProps } from '@mui/material';

const ChatWindowContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.divider}`,
  margin: theme.spacing(0, 0, 0, 2),
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.7) 2px, transparent 2px), linear-gradient(90deg, rgba(255, 255, 255, 0.7) 2px, transparent 2px)',
  backgroundSize: '40px 40px',
  backgroundPosition: '-2px -2px',
}));

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isOwn',
})<{ isOwn?: boolean }>(({ theme, isOwn }) => ({
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1),
  maxWidth: '70%',
  width: 'fit-content',
  backgroundColor: isOwn ? theme.palette.primary.main : '#fff',
  color: isOwn ? theme.palette.primary.contrastText : 'inherit',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  borderRadius: isOwn ? theme.spacing(2, 2, 0, 2) : theme.spacing(2, 2, 2, 0),
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)',
  position: 'relative',
  '&::after': isOwn ? {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: '-8px',
    width: '16px',
    height: '16px',
    backgroundColor: theme.palette.primary.main,
    clipPath: 'polygon(0 0, 0% 100%, 100% 100%)',
  } : {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '-8px',
    width: '16px',
    height: '16px',
    backgroundColor: '#fff',
    clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
  },
}));

const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: theme.spacing(1),
  backgroundColor: '#fff',
  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)',
}));

const MessageInfo = styled(Typography)({
  fontSize: '0.7rem',
  opacity: 0.7,
  marginTop: '4px',
  fontStyle: 'italic',
});

interface ChatWindowProps {
  selectedChat: ChatRoom | null;
  currentUserId: string;
  newMessage: string;
  onMessageChange: (msg: string) => void;
  onSendMessage: () => void;
  messages: ChatMessage[]; // ✅ 新增
}

export default function ChatWindow({
  selectedChat,
  currentUserId,
  newMessage,
  onMessageChange,
  onSendMessage,
  messages, // ✅ 解構
}: ChatWindowProps) {
  if (!selectedChat) {
    return (
      <ChatWindowContainer>
        <Typography variant="h6" sx={{ p: 3, textAlign: 'center' }}>
          請選擇一個聊天室
        </Typography>
      </ChatWindowContainer>
    );
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ChatWindowContainer>
      <ChatHeader>
        <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
          {selectedChat.name}
        </Typography>
      </ChatHeader>

      <ChatMessages>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {Array.isArray(messages) && messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mb: 2,
              }}
            >
              <MessageBubble isOwn={message.senderId === currentUserId}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {message.senderName}
                </Typography>
                <Typography sx={{ lineHeight: 1.5, wordBreak: 'break-word' }}>
                  {message.content}
                </Typography>
                <MessageInfo>{message.timestamp}</MessageInfo>
              </MessageBubble>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
      </ChatMessages>

      <ChatInputContainer>
        <TextField
          fullWidth
          placeholder="輸入訊息..."
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSendMessage();
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              '&.Mui-focused': {
                backgroundColor: '#fff',
              }
            }
          }}
        />
        <IconButton 
          color="primary" 
          sx={{ 
            p: '10px', 
            backgroundColor: theme => theme.palette.primary.main, 
            color: '#fff',
            '&:hover': {
              backgroundColor: theme => theme.palette.primary.dark,
            },
            transition: 'all 0.2s ease',
          }} 
          onClick={onSendMessage}
        >
          <span style={{ fontSize: '1.2rem' }} role="img" aria-label="send">✈️</span>
        </IconButton>
      </ChatInputContainer>
    </ChatWindowContainer>
  );
}