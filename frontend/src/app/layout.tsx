'use client';
import { AuthProvider } from '@/context/AuthProvider';
import { ChatNotificationProvider } from '@/context/ChatNotificationProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ChatNotificationProvider>
        {children}
      </ChatNotificationProvider>
    </AuthProvider>
  );
}