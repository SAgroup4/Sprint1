'use client';
import Image from 'next/image';
import Link from 'next/link'; // 加這行
import React from 'react';
import './styles.css';
import logo from './輔大logo.png';

const Header: React.FC = () => {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 實現搜索邏輯
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Image src={logo} alt="輔仁大學 Logo" className="logo-image" width={50} height={50} />
        <h1>輔仁大學學生交流平台</h1>
      </div>

      <div className="header-search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="搜尋討論話題..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            搜尋
          </button>
        </form>
      </div>

      <div className="header-user">
        {/* 私訊按鈕 */}
        <Link href="/message">
          <button className="message-button">私訊</button>
        </Link>

        {/* 用戶頭像 */}
        <div className="user-avatar">
          <img src="/default-avatar.png" alt="用戶頭像" />
        </div>
      </div>
    </header>
  );
};

export default Header;
