import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; // 修正 CSS 路徑
import RootLayout from "@/components/layout/Layout"; // 使用絕對路徑，需確認 tsconfig.json 設定
import { ReactNode } from "react";

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
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}