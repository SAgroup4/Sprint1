// 'use client';
// import { AuthProvider } from '@/context/AuthProvider';
// export default function Layout({ children }: { children: React.ReactNode }) {
//   return <><AuthProvider>{children}  </AuthProvider></>; // 只回傳內容，不寫 html / body
// }

// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "學生討論區",
  description: "一個專門為學生提供交流和討論的平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}