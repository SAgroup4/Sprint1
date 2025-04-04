 'use client';
 import { AuthProvider } from '@/context/AuthProvider';
 export default function Layout({ children }: { children: React.ReactNode }) {
   return <><AuthProvider>{children}  </AuthProvider></>; // 只回傳內容，不寫 html / body
 }

