import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import '../../globals.css';

import Header from "../../components/layout/Header"; // 上方導覽列
 

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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* 根據需求只顯示上方導覽列 */}
        <Header />
        {/* 主內容區域 */}
        
        <main>{children}</main>
      </body>
    </html>
  );
}
