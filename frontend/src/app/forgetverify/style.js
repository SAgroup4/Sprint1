import { styled } from '@mui/material/styles';
import { Container, Box, TextField, Select, Button } from '@mui/material';

// 添加全局 CSS 變量
export const GlobalStyles = {
  root: {
    '--bg': '#3C465C',
    '--primary': '#78FFCD',
    '--solid': '#fff',
    '--btn-w': '10em',
    '--dot-w': 'calc(var(--btn-w)*.2)',
    '--tr-X': 'calc(var(--btn-w) - var(--dot-w))',
    // 添加新的顏色變量
    '--page-bg': '#111418',
    '--home-bg': '#4a535c'
  }
};

// 基礎按鈕樣式
export const BaseButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  margin: '0 auto',
  width: '100%',
  minWidth: '160px',
  color: 'var(--primary)',
  border: '.15em solid var(--primary)',
  borderRadius: '5em',
  textTransform: 'uppercase',
  textAlign: 'center',
  fontSize: '1.3em',
  lineHeight: '2em',
  cursor: 'pointer',
  overflow: 'visible', // 改為 visible 讓光點可以顯示在外
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '&:hover .dot, &:focus .dot': {
    animation: 'atom 2s infinite linear',
    display: 'block'
  },
  '& .dot': {
    content: '""',
    position: 'absolute',
    top: -3,
    left: -3,
    width: '20%',
    height: 'calc(100% + 6px)', // 調整高度以覆蓋邊框
    borderRadius: '100%',
    transition: 'all 300ms ease',
    display: 'none',
    '&:after': {
      content: '""',
      position: 'absolute',
      left: 'calc(50% - .4em)',
      top: '-.4em',
      height: '.8em',
      width: '.8em',
      background: 'var(--primary)',
      borderRadius: '1em',
      border: '.25em solid var(--solid)',
      boxShadow: '0 0 .7em var(--solid), 0 0 2em var(--primary)',
    }
  },
  '@keyframes atom': {
    '0%': { transform: 'translateX(0) rotate(0)' },
    '30%': { transform: 'translateX(400%) rotate(0)' },
    '50%': { transform: 'translateX(400%) rotate(180deg)' },
    '80%': { transform: 'translateX(0) rotate(180deg)' },
    '100%': { transform: 'translateX(0) rotate(360deg)' }
  }
}));
// 修改全局共用的基礎容器
// 基礎容器（用於 Home 和 Login）
export const BaseContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#111418',
  color: '#fff',
}));

// 添加滾動容器（用於其他需要滾動條的頁面）
export const ScrollContainer = styled(Box)(({ theme }) => ({
  position: 'absolute', // 確保它覆蓋整個畫面
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh', // 改成 100vh 來覆蓋整個畫面
  backgroundColor: '#111418',
  color: '#fff',
  overflowY: 'auto', // 改成 auto，讓它只有在需要時才顯示滾動條
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#1a1f25',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#3C465C',
    borderRadius: '4px',
    '&:hover': {
      background: '#4a5568',
    },
  },
}));

// Add BaseBox export
export const BaseBox = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
}));
// 全局共用的輸入框基礎樣式
export const BaseTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#293038',
    color: '#fff',
    '& fieldset': {
      border: 'none',
    }
  }
}));