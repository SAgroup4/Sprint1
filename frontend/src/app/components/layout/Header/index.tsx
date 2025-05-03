"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import logo from "./logo.png";
import brandname from "./brandname.png";
import { useAuth } from "@/context/AuthProvider";
import { IoIosText } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userId = user ? user.email.split("@")[0] : "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      {/* 左側 LOGO */}
      <div className="header-logo">
        <Image
          src={logo}
          alt="輔仁大學 Logo"
          className="logo-image clickable"
          width={40}
          height={40}
          onClick={() => (window.location.href = "/general")}
        />
        <Image
          src={brandname}
          alt="輔學同行"
          className="brandname clickable"
          width={170}
          height={40}
          onClick={() => (window.location.href = "/general")}
        />
      </div>

      {/* 中間搜尋欄 */}
      <div className="header-search">
        <form>
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

      {/* 右側使用者操作區塊 */}
      {user ? (
        <div className="header-user">
          <div
            className="userbutton"
            onClick={() => (window.location.href = "/chat")}
          >
            <FaBell />
          </div>
          <div
            className="userbutton"
            onClick={() => (window.location.href = "/chat")}
          >
            <IoIosText />
          </div>

          {/* Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center cursor-pointer space-x-1 login-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7Gi3Gu0z0-qZiLSPXSl9Wi6nAMRVQMZHrbg&s"
                alt="頭像"
                style={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  border: "1px solid #4a90e2",
                }}
              />
              <IoMdArrowDropdown size={20} />
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link href={`/profile/${userId}`}>
                  <button>個人主頁</button>
                </Link>

                <button onClick={logout}>登出</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          className="login-button"
          onClick={() => (window.location.href = "/login")}
        >
          登入
        </button>
      )}
    </header>
  );
};

export default Header;
