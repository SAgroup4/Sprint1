'use client';

import '../../globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider, useAuth } from '@/context/AuthProvider';
import Header from '@/components/layout/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // useEffect(() => {
  //   // 稍微延遲，避免一開始 user 還沒抓到就跳轉
  //   const timeout = setTimeout(() => {
  //     if (user === null) {
  //       router.push('/login');
  //     }
  //     setChecking(false);
  //   }, 500);
  useEffect(() => {
    const timeout = setTimeout(() => {
      // 當 user 明確為 null（表示已經確認沒登入）才跳轉
      if (user === null) {
        router.push('/login');
      }
      setChecking(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [user, router]);

  if (checking || user === undefined) {
    return <div style={{ padding: '32px' }}>載入中...</div>;
  }

  return (
    <>
      <Header />
      <main style={{ padding: '80px 32px' }}>{children}</main>
    </>
  );
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className={inter.className} style={{ backgroundColor: '#e6f0ff', minHeight: '100vh' }}>
        <AuthProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
