'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './style.css';

const ChangePasswordPage = () => {
  const router = useRouter();
  const { user_id: userId } = useParams(); // 從路由參數中取得 userId
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState('/path/to/default-avatar.jpg');  // 預設頭像

  const handleChangePassword = async () => {
    setMessage('');
    setError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('請填寫所有欄位');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('新密碼與確認密碼不一致');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('密碼修改成功！請重新登入');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(result.detail || '密碼修改失敗');
      }
    } catch (err) {
      setError('伺服器錯誤');
    }
  };

  return (
    <div className="change-wrapper">
      <div className="change-box">
        <h1 className="title">更改密碼</h1>

        {/* 顯示頭像 */}
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7Gi3Gu0z0-qZiLSPXSl9Wi6nAMRVQMZHrbg&s"
          alt="頭像"
          className="centered-image"
        />

        {/* 顯示學號 */}
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a3e6e' }}>
          {userId || '載入中...'}
        </h2>

        {/* 其他內容 */}
        <label>舊密碼</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label>新密碼</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label>再次確認新密碼</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleChangePassword}>確認更改</button>

        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePasswordPage;
