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
import { useRouter } from "next/navigation";
import { db } from "../../../../firebase"; // 匯入 Firebase Firestore 實例
import { collection, onSnapshot } from "firebase/firestore";

interface Notification {
  notification_id: string;
  post_id: string;
  post_title: string;
  comment_content: string;
  comment_user_name: string;
  is_read: boolean;
  timestamp: string;
}

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false); // 控制通知 Overlay 的顯示
  const [hasUnread, setHasUnread] = useState(false); // 控制紅點顯示
  const [isNotificationsLoaded, setIsNotificationsLoaded] = useState(false); // 控制是否完成通知加載
  const [loading, setLoading] = useState(false); // 加載狀態
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userId = user ? user.id : "";
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchInput = (e.target as HTMLFormElement).elements.namedItem("search") as HTMLInputElement;
    const keyword = searchInput.value.trim();

    if (!keyword) {
      alert("請輸入搜尋關鍵字");
      return;
    }

    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  // 從後端 API 獲取通知
  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true); // 開始加載
    try {
      const res = await fetch(
        `http://localhost:8000/users/${user.id}/notifications` // 後端已限制返回前五則通知
      );
      if (!res.ok) throw new Error("無法取得通知");
      const data = await res.json();
      setNotifications(data.notifications);

      // 判斷是否有未讀通知
      const unreadExists = data.notifications.some(
        (n: Notification) => !n.is_read
      );
      setHasUnread(unreadExists);
    } catch (error) {
      console.error("取得通知失敗:", error);
    } finally {
      setLoading(false); // 結束加載
      setIsNotificationsLoaded(true); // 通知加載完成
    }
  };

  // Firebase 實時監聽通知集合
  useEffect(() => {
    if (!user) return;

    const notificationsRef = collection(db, "users", userId, "notifications");

    const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
      console.log("監聽到變化，當前用戶:", user.email);
      if (!snapshot.empty) {
        fetchNotifications();
        setHasUnread(true);
      }
    });

    return () => unsubscribe();
  }, [user, userId]);

  // 點擊通知按鈕時顯示通知 Overlay
  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications(); // 點擊時讀取通知
      setHasUnread(false); // 點擊後將 hasUnread 設為 false
    }
  };

  // 點擊外部時關閉通知 Overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
        setDropdownOpen(false);
        setHasUnread(false); // 點擊外部時移除紅點

        // 調用後端 API 將所有通知標記為已讀
        if (showNotifications) {
          fetch(
            `http://localhost:8000/users/${userId}/notifications/read-all`,
            { method: "PUT" }
          )
            .then(() => {
              // 更新前端狀態
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, is_read: true }))
              );
              setHasUnread(false); // 移除紅點
            })
            .catch((error) => {
              console.error("標記通知為已讀失敗:", error);
            });
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
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
          <form onSubmit={handleSearch}>
            <input
              type="text"
              name="search"
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
            {/* 通知按鈕 */}
            <div
              className="notification-button"
              onClick={handleToggleNotifications}
              style={{ position: "relative" }}
            >
              <FaBell />
              {isNotificationsLoaded && hasUnread && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    width: "10px",
                    height: "10px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    border: "2px solid white",
                  }}
                ></span>
              )}
            </div>

            {/* 通知 Overlay */}
            {showNotifications && (
              <div className="notifications-overlay" ref={dropdownRef}>
                <h4>通知</h4>
                {loading ? (
                  <p>加載中...</p> // 顯示加載中的狀態
                ) : (
                  <ul>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <li
                          key={notification.notification_id}
                          style={{
                            fontWeight: notification.is_read
                              ? "normal"
                              : "bold", // 未讀通知顯示粗體
                          }}
                          onClick={async () => {
                            // 點擊後跳轉到貼文頁面
                            router.push(`/posts/${notification.post_id}`);

                            // 標記通知為已讀
                            if (!notification.is_read) {
                              try {
                                const res = await fetch(
                                  `http://localhost:8000/users/${userId}/notifications/${notification.notification_id}/read`,
                                  {
                                    method: "PUT",
                                  }
                                );
                                if (!res.ok)
                                  throw new Error("無法標記通知為已讀");

                                // 更新前端通知狀態
                                setNotifications((prevNotifications) =>
                                  prevNotifications.map((n) =>
                                    n.notification_id ===
                                    notification.notification_id
                                      ? { ...n, is_read: true }
                                      : n
                                  )
                                );

                                // 更新紅點狀態
                                const unreadExists = notifications.some(
                                  (n) => !n.is_read
                                );
                                setHasUnread(unreadExists);
                              } catch (error) {
                                console.error("標記通知為已讀失敗:", error);
                              }
                            }
                          }}
                        >
                          <p>
                            <span className="notification-user-name">
                              {notification.comment_user_name}
                            </span>{" "}
                            在你的貼文{" "}
                            <span className="notification-post-title">
                              {notification.post_title}
                            </span>{" "}
                            中留言
                          </p>
                          <p className="notification-timestamp">
                            {new Date(notification.timestamp).toLocaleString()}{" "}
                            {/* 顯示留言日期 */}
                          </p>
                        </li>
                      ))
                    ) : (
                      <p>目前沒有通知</p>
                    )}
                  </ul>
                )}
              </div>
            )}

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
    </div>
  );
};

export default Header;
