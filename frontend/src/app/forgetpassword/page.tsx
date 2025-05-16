
'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: ''
  });
  const [tokenValid, setTokenValid] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:8000/verify-reset?token=${token}`)
        .then((res) => {
          if (!res.ok) throw new Error();
            return res.json();
        })
        .then((data) => {
            setTokenValid(true);
            setEmail(data.email);
        })
        .catch(() => {
          alert('連結無效或已過期');
          router.push('/forgetpassword');
        });
    }
  }, [token]);

  const handleResetPassword = async () => {
    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      alert('請填寫所有欄位');
      return;
    }

    if (password !== confirmPassword) {
      alert('兩次輸入的密碼不一致');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password, confirmPassword })
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message || '密碼更新成功！');
        router.push('/login');
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
      handleResetPassword();
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
              重設密碼
            </Typography>

            {!tokenValid ? (
              <Typography sx={{ textAlign: 'center' }}>驗證中...</Typography>
            ) : (
              <form>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ mb: 1 }}>帳號</Typography>
                  <LoginTextField
                    fullWidth
                    disabled
                    value={email || ''}
                    placeholder="載入中..."
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ mb: 1 }}>輸入新密碼</Typography>
                  <LoginTextField
                    fullWidth
                    type="password"
                    placeholder="請輸入新密碼"
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
                  <LoginButton fullWidth type="button" onClick={handleResetPassword}>
                    確認密碼
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
            )}
          </FormContainer>
        </LoginBox>
      </LoginContainer>
    </BackgroundAnimation>
  );
};

export default ResetPassword;
