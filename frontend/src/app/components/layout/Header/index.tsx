'use client';
import Image from 'next/image';
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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 實現搜索邏輯
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
      <div className="header-logo">
        <Image
          src={logo}
          alt="輔仁大學 Logo"
          className="logo-image clickable"
          width={40}
          height={40}
          onClick={() => (window.location.href = '/general')}
        />
        <Image
          src={brandname}
          alt="輔學同行"
          className="brandname clickable"
          width={170}
          height={40}
          onClick={() => (window.location.href = '/general')}
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
