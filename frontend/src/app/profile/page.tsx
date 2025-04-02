// pages/profile.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useAuth } from '@/context/AuthProvider';


const Profile = () => {
    
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography>尚未登入，請重新登入。</Typography>
        <Button variant="contained" onClick={() => router.push('/login')}>返回登入</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8, mx: 'auto', width: '90%', maxWidth: '600px', p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>個人資料</Typography>
      <Typography><strong>學號：</strong> {user?.email?.split('@')[0]}</Typography>
      <Typography><strong>姓名：</strong> {user?.name || '未設定'}</Typography>
      <Typography><strong>科系：</strong> {user?.department || '未設定'}</Typography>
      <Typography><strong>年級：</strong> {user?.grade || '未設定'}</Typography>

      <Box sx={{ mt: 4 }}>
        <Button variant="outlined" color="primary" onClick={() => router.push('/general')}>
          返回首頁
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
