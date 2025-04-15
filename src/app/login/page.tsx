// ✅ 改寫：登入成功後儲存 JWT Token，並提供前端統一使用

'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, Button,  } from '@mui/material';
import {
  LoginContainer,
  LoginBox,
  LoginTextField,
  LoginButton,
  BackgroundCircles,
  BackgroundAnimation,
  FormContainer,
} from './loginStyles';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const { email, password } = formData;
  
    if (!email || !password) {
      alert('請輸入帳號和密碼');
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
        router.push('/general'); //  登入成功後直接跳轉
      } else {
        alert(result.detail || '登入失敗，請檢查帳號密碼');
      }
    } catch (error) {
      console.error(error);
      alert('伺服器錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
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
                <LoginButton fullWidth type="button" onClick={handleLogin}>
                  登入系統
                  <span className="dot"></span>
                 </LoginButton>
              </Box>



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