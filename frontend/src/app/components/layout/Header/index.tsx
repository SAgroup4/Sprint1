'use client';
import Image from 'next/image';
import React from 'react';
import './styles.css';
import logo from './logo.png'; // 假設 logo.png 位於 public 資料夾
import brandname from './brandname.png'; 
import userphoto from './user.jpg'; 
import { useAuth } from '@/context/AuthProvider'; // 引入 AuthProvider 的 useAuth
import { IoIosText } from "react-icons/io";
import { FaBell } from "react-icons/fa";



const Header: React.FC = () => {
  const { user, logout } = useAuth(); // 從 AuthProvider 獲取 user 和 logout 函式

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 實現搜索邏輯
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Image
          src={logo}
          alt="輔仁大學 Logo"
          className="logo-image clickable" // 新增 clickable 類別
          width={40}
          height={40}
          onClick={() => (window.location.href = '/general')} // 新增導向 /general
        />
        <Image
          src={brandname}
          alt="輔學同行"
          className="brandname clickable" // 新增 clickable 類別
          width={170}
          height={40}
          onClick={() => (window.location.href = '/general')} // 新增導向 /general
        />
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


      {user ? ( // 如果 user 存在，顯示頭像
        <div className="header-user">
          <div className="userbutton" onClick={() => (window.location.href = '/general')}>
            <FaBell />
          </div>
          <div className="userbutton" onClick={() => (window.location.href = '/general')}>
            <IoIosText />
          </div>
          <div className="login-button">
            <Image src={userphoto} alt="用戶頭像"  width={23} height={23}  
            onClick={() => (window.location.href = '/Profile')}/>
          </div>
        </div>
      ) : ( // 如果 user 不存在，顯示登入按鈕
        <button className="login-button" onClick={() => window.location.href = '/login'}>
          登入
        </button>
      )}
    </header>
  );
};

export default Header;
