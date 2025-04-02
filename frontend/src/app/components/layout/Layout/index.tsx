'use client'; // 設為 Client Component，確保可以使用 UI 交互

import React, { ReactNode } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import './styles.css';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout 組件 - 網站主要布局結構
 *
 * 功能：
 * 1. 整合 Header 和 Sidebar 組件
 * 2. 提供主要內容區域的布局結構
 * 3. 實現響應式布局
 *
 * @component
 * @param {LayoutProps} props - 組件屬性
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="layout-main">
        <Sidebar />
        <main className="content-area">
          {children} {/* 使用 children 取代 Outlet */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
