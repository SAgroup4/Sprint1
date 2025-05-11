"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegLightbulb } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { useAuth } from "@/context/AuthProvider";
import styles from "./language.module.css";

interface User {
  name: string;
  studentId: string;
  department: string;
  year: string;
  avatar?: string;
  languages: {
    [key: string]: boolean;
  };
}

const allLanguages = ["英文", "日文", "韓文", "其他語言"];

export default function LanguageExchangePage() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language) ? prev.filter((s) => s !== language) : [...prev, language]
    );
  };

  const handleSearch = async () => {
    if (selectedLanguages.length === 0) {
      setUsers([]);
      return;
    }
    const queryParams = selectedLanguages.map((lang) => `languages=${lang}`).join("&");
    const res = await fetch(`http://localhost:8000/language-users?${queryParams}`);
    const data = await res.json();

    const filtered = data.filter((u: User) => u.studentId !== user?.id);
    setUsers(filtered);
  };

  const handleChat = async (user: User) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("請先登入");
        router.push("/login");
        return;
      }

      const res = await fetch("http://localhost:8000/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          participantId: user.studentId,
        }),
      });

      const conversation = await res.json();
      router.push("/chat");
    } catch (error) {
      alert("建立對話失敗");
      console.error(error);
    }
  };

  return (
    <>
      {/* 上方提示區塊 */}
      <div className={styles.postListContainer}>
        <div className={styles.postHeader}>
          <div className={styles.titleWithIcon}>
            <FaRegLightbulb className={styles.titleIcon} />
            <h1 className={styles.sidebarTitle}>語言交換，不如找個人一起說</h1>
          </div>
        </div>
      </div>

      <div className={styles.languagePage}>
        <div className={styles.languageTitle}>你想學習什麼語言？</div>
        <div className={styles.languageSelectRow}>
          <div className={styles.languageButtons}>
            {allLanguages.map((lang) => (
              <button
                key={lang}
                className={`${styles.languageButton} ${selectedLanguages.includes(lang) ? styles.selected : ""}`}
                onClick={() => toggleLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
          <button className={styles.searchIcon} onClick={handleSearch}>
            搜尋
          </button>
        </div>

        <div className={styles.divider}>篩選結果</div>

        <div className={styles.userList}>
          {users.map((user) => (
            <div className={styles.userCard} key={user.studentId}>
              <img
                src={user.avatar || "/avatar.png"}
                alt="頭像"
                onClick={() => router.push(`/profile/${user.studentId}`)}
                className={styles.avatar}
              />
              <div className={styles.userInfo}>
                <strong>{user.name}</strong> {user.studentId}
                <br />
                {user.department} {user.year}
              </div>
              <div className={styles.languageTagsRight}>
                {Object.entries(user.languages)
                  .filter(([_, value]) => value)
                  .map(([lang]) => (
                    <span key={lang} className={styles.tag}>
                      {lang}
                    </span>
                  ))}
              </div>
              <button className={styles.chatButton} onClick={() => handleChat(user)}>
                <LuMessageCircleMore className={styles.chatIcon} /> 
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
