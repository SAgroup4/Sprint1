import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import RootLayout from "../components/layout/Layout";
import { AuthProvider } from '@/context/AuthProvider';
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
        <RootLayout><AuthProvider>{children}</AuthProvider></RootLayout>
      </body>
    </html>
  );
}