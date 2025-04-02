// utils/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // 沒有 token 就直接導回登入頁
    if (!token) {
      router.push('/login');
      return;
    }

    // 有 token 就向後端請求驗證使用者資訊
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('驗證失敗');
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return { user, loading };
};

export default useAuth;
