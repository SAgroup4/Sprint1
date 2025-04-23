// 'use client';
// import Image from 'next/image';
// import React from 'react';
// import './styles.css';
// import logo from './logo.png'; // 假設 logo.png 位於 public 資料夾
// import brandname from './brandname.png'; 
// import userphoto from './user.jpg'; 
// import { useAuth } from '@/context/AuthProvider'; // 引入 AuthProvider 的 useAuth
// import { IoIosText } from "react-icons/io";
// import { FaBell } from "react-icons/fa";



// const Header: React.FC = () => {
//   const { user, logout } = useAuth(); // 從 AuthProvider 獲取 user 和 logout 函式

//   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // TODO: 實現搜索邏輯
//   };

//   return (
//     <header className="header">
//       <div className="header-logo">
//         <Image
//           src={logo}
//           alt="輔仁大學 Logo"
//           className="logo-image clickable" // 新增 clickable 類別
//           width={40}
//           height={40}
//           onClick={() => (window.location.href = '/general')} // 新增導向 /general
//         />
//         <Image
//           src={brandname}
//           alt="輔學同行"
//           className="brandname clickable" // 新增 clickable 類別
//           width={170}
//           height={40}
//           onClick={() => (window.location.href = '/general')} // 新增導向 /general
//         />
//       </div>
      
//       <div className="header-search">
//         <form onSubmit={handleSearch}>
//           <input
//             type="text"
//             placeholder="搜尋討論話題..."
//             className="search-input"
//           />
//           <button type="submit" className="search-button">
//             搜尋
//           </button>
//         </form>
//       </div>


//       {user ? ( // 如果 user 存在，顯示頭像
//         <div className="header-user">
//           <div className="userbutton" onClick={() => (window.location.href = '/general')}>
//             <FaBell />
//           </div>
//           <div className="userbutton" onClick={() => (window.location.href = '/general')}>
//             <IoIosText />
//           </div>
//           <div className="login-button">
//             <Image src={userphoto} alt="用戶頭像"  width={23} height={23}  
//             onClick={() => (window.location.href = '/Profile')}/>
//           </div>
//         </div>
//       ) : ( // 如果 user 不存在，顯示登入按鈕
//         <button className="login-button" onClick={() => window.location.href = '/login'}>
//           登入
//         </button>
//       )}
//     </header>
//   );
// };

// export default Header;



'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import logo from './logo.png';
import brandname from './brandname.png';
import userphoto from './user.jpg';
import { useAuth } from '@/context/AuthProvider';
import { IoIosText } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // 取得 userId（這裡用 email 前綴，你也可以改成 user.id）
  const userId = user ? user.email.split('@')[0] : '';

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 搜尋功能待實作
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      {/* 左側 LOGO */}
      <div className="header-logo">
        <Image
          src={logo}
          alt="輔仁大學 Logo"
          className="logo-image clickable"
          className="logo-image clickable"
          width={40}
          height={40}
          onClick={() => (window.location.href = '/general')}
          onClick={() => (window.location.href = '/general')}
        />
        <Image
          src={brandname}
          alt="輔學同行"
          className="brandname clickable"
          className="brandname clickable"
          width={170}
          height={40}
          onClick={() => (window.location.href = '/general')}
          onClick={() => (window.location.href = '/general')}
        />
      </div>

      {/* 中間搜尋欄 */}
      <div className="header-search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="搜尋討論話題..."
            className="search-input"
          />
          <button type="submit" className="search-button">搜尋</button>
        </form>
      </div>

      {/* 右側使用者操作區塊 */}
      {user ? (
        <div className="header-user">
          <div className="userbutton" onClick={() => (window.location.href = '/general')}>
            <FaBell />
          </div>
          <div className="userbutton" onClick={() => (window.location.href = '/general')}>
            <IoIosText />
          </div>

          {/* Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center cursor-pointer space-x-1 login-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Image
                src={userphoto}
                alt="用戶頭像"
                width={23}
                height={23}
                className="rounded-full"
              />
              <IoMdArrowDropdown size={20} />
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <button
                  onClick={() => window.location.href = '/Profile'}
                >
                  個人主頁
                </button>
                <button
                  onClick={logout}
                >
                  登出
                </button>
              </div>
            )}
          </div>
          {/* 用 Link 導向 /profile/[userId] */}
          <Link
            href={`/profile/${userId}`}
            className="login-button"
            title="前往我的個人主頁"
          >
            <Image
              src={userphoto}
              alt="用戶頭像"
              width={23}
              height={23}
              style={{ borderRadius: '9999px', cursor: 'pointer' }}
            />
          </Link>
        </div>
      ) : (
        <button className="login-button" onClick={() => window.location.href = '/login'}>
          登入
        </button>
      )}
    </header>
  );
};

export default Header;
