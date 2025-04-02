'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, Button } from '@mui/material';
import {
  LoginContainer,
  LoginBox,
  LoginTextField,
  LoginButton,
  BackgroundCircles,
  BackgroundAnimation,
  FormContainer
} from './loginStyles';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^\d{9}@m365\.fju\.edu\.tw$/;
  return emailRegex.test(email);
};

const Login = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async () => {
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      alert('請填寫所有欄位');
      return;
    }

    if (!validateEmail(email)) {
      alert('請輸入有效的學校信箱格式（9碼學號@m365.fju.edu.tw）');
      return;
    }

    if (password !== confirmPassword) {
      alert('兩次輸入的密碼不一致');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, confirmPassword })
      });

      const result = await res.json();

      if (res.ok) {
        alert('驗證信已發送，請前往信箱完成驗證');
        router.push('/verify-success');
      } else {
        alert(`註冊失敗：${result.detail || '未知錯誤'}`);
      }
    } catch (error) {
      console.error(error);
      alert('伺服器錯誤，請稍後再試');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleRegister();
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
            <Button sx={{ color: 'var(--primary)', fontSize: '0.9em' }}>
              中文 | ENGLISH
            </Button>
          </Box>

          <FormContainer>
            <Typography
              variant="h4"
              sx={{ fontSize: '24px', fontWeight: 'bold', mb: 3, textAlign: 'center' }}
            >
              註冊新帳號
            </Typography>

            <Typography
              sx={{ mb: 3, textAlign: 'center', color: 'rgba(0, 0, 0, 0.7)' }}
            >
              請填寫以下資訊以建立新帳號
            </Typography>

            <form>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ mb: 1 }}>電子郵件</Typography>
                <LoginTextField
                  fullWidth
                  placeholder="請輸入學校信箱（9碼學號@m365.fju.edu.tw）"
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

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ mb: 1 }}>確認密碼</Typography>
                <LoginTextField
                  fullWidth
                  type="password"
                  placeholder="請再次輸入密碼"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onKeyDown={handleKeyDown}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <LoginButton fullWidth type="button" onClick={handleRegister}>
                  註冊帳號
                  <span className="dot"></span>
                </LoginButton>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  color="primary"
                  sx={{ textDecoration: 'underline', color: 'var(--primary)' }}
                  onClick={() => router.push('/login')}
                >
                  返回登入
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