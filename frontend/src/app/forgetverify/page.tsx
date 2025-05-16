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
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^\d{9}@m365\.fju\.edu\.tw$/;
  return emailRegex.test(email);
};

const EmailSubmit = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: ''
  });

  const handleSubmit = async () => {
    const { email } = formData;

    if (!email) {
      alert('請填寫所有欄位');
      return;
    }

    if (!validateEmail(email)) {
      alert('請輸入有效的學校信箱格式（9碼學號@m365.fju.edu.tw）');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/request-reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const result = await res.json();

      if (res.ok) {
        alert('驗證信已發送，請前往信箱完成驗證');
        router.push('/verify-success?type=reset');
      } else {
        alert(`錯誤：${result.message || result.detail || '未知錯誤'}`);
      }
    } catch (error) {
      console.error(error);
      alert('伺服器錯誤，請稍後再試');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
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
              驗證身份
            </Typography>

            <Typography
              sx={{ mb: 3, textAlign: 'center', color: 'rgba(0, 0, 0, 0.7)' }}
            >
              請填寫以下資訊驗證身份以重設密碼
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

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <LoginButton
                  fullWidth
                  type="button"
                  onClick={handleSubmit}
                >
                  確認信箱
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

export default EmailSubmit;



