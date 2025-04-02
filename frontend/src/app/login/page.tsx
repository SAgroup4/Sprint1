// ✅ 改寫：登入成功後儲存 JWT Token，並提供前端統一使用

'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import {
  StyledContainer,
  StyledBox,
  LoginContainer,
  LoginBox,
  LoginTextField,
  LoginButton,
  BackgroundCircles,
  BackgroundAnimation,
  FormContainer,
  StyledDialog
} from './loginStyles';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (isAccessible: boolean) => {
    console.log("🟡 handleLogin 執行中...", formData);
    const { email, password } = formData;

    if (!email || !password) {
      setError('請輸入帳號和密碼');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('userEmail', email);

        if (isAccessible) {
          router.push('/general');
        } else {
          setOpenDialog(true);
        }
      } else {
        setError(result.detail || '登入失敗，請檢查帳號密碼');
      }
    } catch (error) {
      console.error(error);
      setError('伺服器錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleLogin(false);
    }
  };

  const handleConfirm = () => {
    router.push('/general');
  };

  return (
    <BackgroundAnimation>
      <LoginContainer>
        <LoginBox>
          <BackgroundCircles className="bg">
            <span></span>
            <span></span>
            <span></span>
          </BackgroundCircles>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button sx={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.9em' }}>
              中文 | ENGLISH
            </Button>
          </Box>

          <FormContainer>
            <Typography variant="h4" sx={{ fontSize: '29px', fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
              輔大學習夥伴平台
            </Typography>

            <Typography sx={{ mb: 2, textAlign: 'center', color: 'rgba(0, 0, 0, 0.7)' }}>
              請輸入帳號、密碼登入
            </Typography>

            <form>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ mb: 1 }}>帳號</Typography>
                <LoginTextField
                  fullWidth
                  placeholder="請輸入電子信箱"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onKeyDown={handleKeyDown}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ mb: 1 }}>密碼</Typography>
                <LoginTextField
                  fullWidth
                  type="password"
                  placeholder="請輸入密碼"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onKeyDown={handleKeyDown}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <LoginButton fullWidth type="button" onClick={() => handleLogin(false)}>
                  登入系統
                  <span className="dot"></span>
                </LoginButton>
                <LoginButton fullWidth className="outlined" type="button" onClick={() => handleLogin(true)}>
                  登入無障礙版
                  <span className="dot"></span>
                </LoginButton>
              </Box>

              <StyledDialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle sx={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', pb: 1 }}>
                  確定登入一般版本
                </DialogTitle>
                <DialogContent>
                  <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                    確定登入一般版本，若您為視障生請選擇「登入無障礙版」？
                  </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3, pt: 2 }}>
                  <LoginButton onClick={handleConfirm}>確定</LoginButton>
                  <LoginButton className="outlined" onClick={() => setOpenDialog(false)}>取消</LoginButton>
                </DialogActions>
              </StyledDialog>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button color="primary" sx={{ textDecoration: 'underline', color: 'var(--primary)' }}>
                  忘記密碼？
                </Button>
                <Button color="primary" sx={{ textDecoration: 'underline', color: 'var(--primary)' }}
                 onClick={() => router.push('/register')}>
                  還沒註冊嗎 ? 點此註冊
                </Button>
              </Box>
            </form>
          </FormContainer>
        </LoginBox>
      </LoginContainer>
    </BackgroundAnimation>
  );
};

export default Login;
