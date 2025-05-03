// loginStyles.tsx
// 此檔案用來集中管理 Login 頁面的 styled-components，保持主檔案乾淨
"use client"
import { styled } from '@mui/material/styles';
import { Box, Container, Dialog } from '@mui/material';
import { BaseContainer, BaseTextField, BaseButton, BaseBox } from './style';

// Logo 區塊不需要 styled，可保留在主組件中

// Dialog 樣式
export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1f25',
    color: '#fff',
    borderRadius: '1.5em',
    border: '.15em solid var(--primary)',
    backdropFilter: 'blur(4px)',
    boxShadow: 'inset 1px 1px 6px rgba(255,255,255,0.3), 2px 2px 15px rgba(0,0,0,0.5)',
    padding: theme.spacing(2)
  }
}));

// 外層容器
export const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  color: '#000000',  // 改這行
  padding: theme.spacing(4)
}));

// 用於包裝表單區塊
export const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '512px',
  margin: '0 auto',
  padding: theme.spacing(3),
}));

// 最外層的 box，包含背景動畫
export const LoginBox = styled(BaseBox)(({ theme }) => ({
  maxWidth: '512px',
  margin: '0 auto',
  position: 'relative'
}));

export const LoginContainer = styled(BaseContainer)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  minHeight: '100vh',
  backgroundColor: '#ffffff' 
}));

// 客製化輸入欄位
export const LoginTextField = styled(BaseTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '56px',
    backgroundColor: '#293038',
    borderRadius: '12px',
    color: '#fff',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    }
  }
}));

// 客製化按鈕
export const LoginButton = styled(BaseButton)(({ theme }) => ({
  height: '48px',
  padding: '12px',
  '&.outlined': {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(120, 255, 205, 0.1)'
    }
  }
}));

// 背景動畫圓圈
export const BackgroundCircles = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: 0,
  '& span': {
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0,
    '&:nth-of-type(1)': {
      width: '180px',
      height: '180px',
      background: '#81D8D0',
      left: '-80px',
      top: '50px',
      animation: 'am2 ease-out 1s forwards, float 3s ease-in-out infinite alternate'
    },
    '&:nth-of-type(2)': {
      width: '100px',
      height: '100px',
      background: '#E6C786',
      right: '-10px',
      top: '80px',
      animation: 'am2 ease-out 1s 0.2s forwards, float 4s ease-in-out infinite alternate-reverse'
    },
    '&:nth-of-type(3)': {
      width: '220px',
      height: '220px',
      background: '#97A5C0',
      right: '-100px',
      bottom: '50px',
      animation: 'am2 ease-out 1s 0.4s forwards, float 3.5s ease-in-out infinite alternate'
    }
  },
  '@keyframes float': {
    '0%': { transform: 'translateY(0)' },
    '100%': { transform: 'translateY(-20px)' }
  },
  '@keyframes am2': {
    '0%': {
      transform: 'scale(0) rotateZ(60deg)',
      opacity: 0
    },
    '100%': {
      transform: 'scale(1) rotateZ(0)',
      opacity: 0.7
    }
  }
}));

// 背景動畫用 wrapper
export const BackgroundAnimation = styled(Box)({
  '.bg': {
    animation: 'am2 ease-out 1s'
  },
  '.glass': {
    animation: 'am3 ease-out 1s 0.2s backwards'
  },
  '@keyframes am1': {
    '0%': { transform: 'translateY(0)' },
    '100%': { transform: 'translateY(-30px)' }
  },
  '@keyframes am2': {
    '0%': { transform: 'scale(0, 0) rotateZ(60deg)' },
    '100%': { transform: 'scale(1, 1) rotateZ(0)' }
  },
  '@keyframes am3': {
    '0%': {
      transform: 'translateY(8px)',
      opacity: 0
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1
    }
  }
});

// 表單區塊樣式
export const FormContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(5),
  border: '.15em solid var(--primary)',
  borderRadius: '1.5em',
  color: '#000000',  // 添加這行
  backdropFilter: 'blur(4px)',
  boxShadow: 'inset 1px 1px 6px rgba(255, 255, 255, 0.3), 2px 2px 15px rgba(0, 0, 0, 0.5)',
  marginBottom: theme.spacing(3),
  zIndex: 1,
  animation: 'am3 ease-out 1s 0.2s backwards',
  '& form': {
    marginTop: theme.spacing(4)
  }
}));
