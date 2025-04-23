'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './style.css';

const ChangePasswordPage = () => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        <h2 className="title">更改密碼</h2>

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
