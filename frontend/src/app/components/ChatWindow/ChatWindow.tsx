// ChatWindow.tsx
'use client';
import { Box, Typography, TextField, IconButton, Paper } from '@mui/material';
import { useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { SendOutlined, CheckCircleOutline } from '@mui/icons-material';

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

const ChatWindowContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
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
  color: isOwn ? '#fff' : '#1a2b6b',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  borderRadius: isOwn ? '1.5rem 1.5rem 0.25rem 1.5rem' : '1.5rem 1.5rem 1.5rem 0.25rem',
  background: isOwn
    ? 'linear-gradient(145deg, #3a7bd5, #2b5cbe)'
    : '#fff',
  boxShadow: isOwn
    ? '0 5px 15px rgba(43, 92, 190, 0.2)'
    : '0 5px 15px rgba(0, 118, 255, 0.05)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: isOwn
      ? '0 7px 20px rgba(43, 92, 190, 0.3)'
      : '0 7px 20px rgba(0, 118, 255, 0.1)',
  },
}));

const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: theme.spacing(1),
  backgroundColor: '#fff',
  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)',
  transition: 'all 0.3s ease',
}));

const MessageInfo = styled(Typography)({
  fontSize: '0.7rem',
  opacity: 0.7,
  marginTop: '4px',
  fontStyle: 'italic',
});

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const localDate = new Date(date.getTime() + 8 * 60 * 60 * 1000); // UTC+8
  return `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(localDate.getDate())} ${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
};

const pad = (num: number) => num.toString().padStart(2, '0');

interface ChatWindowProps {
  selectedChat: ChatRoom | null;
  currentUserId: string;
  newMessage: string;
  onMessageChange: (msg: string) => void;
  onSendMessage: () => void;
  messages: ChatMessage[];
}

export default function ChatWindow({
  selectedChat,
  currentUserId,
  newMessage,
  onMessageChange,
  onSendMessage,
  messages,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement?.parentElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages]);

  if (!selectedChat) {
    return (
      <ChatWindowContainer>
        <Typography variant="h6" sx={{ p: 3, textAlign: 'center' }}>
          請選擇一個聊天室
        </Typography>
      </ChatWindowContainer>
    );
  }

  return (
    <ChatWindowContainer>
      <ChatHeader>
        <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
          {selectedChat.name}
        </Typography>
      </ChatHeader>
      <ChatMessages>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {messages.map((message) => (
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
                <Typography sx={{ lineHeight: 1.5, wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                  {message.content}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MessageInfo>{formatTimestamp(message.timestamp)}</MessageInfo>
                </Box>
              </MessageBubble>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 0.5,
                  pr: 1,
                  visibility: message.senderId === currentUserId ? 'visible' : 'hidden',
                }}
              >
                {message.status === 'sent' && (
                  <CheckCircleOutline fontSize="small" sx={{ fontSize: '14px', color: 'text.secondary' }} />
                )}
                {message.status === 'read' && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px' }}>
                    已讀
                  </Typography>
                )}
              </Box>
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
          multiline
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
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
              },
            },
          }}
        />
        <IconButton
          color="primary"
          sx={{
            p: '10px',
            backgroundColor: (theme) => theme.palette.primary.main,
            color: '#fff',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.primary.dark,
            },
            transition: 'all 0.2s ease',
          }}
          onClick={onSendMessage}
        >
          <SendOutlined />
        </IconButton>
      </ChatInputContainer>
    </ChatWindowContainer>
  );
}