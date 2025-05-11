"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegLightbulb } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { useAuth } from "@/context/AuthProvider"; // 使用 useAuth
import styles from "./skill.module.css";

interface User {
  name: string;
  studentId: string;
  department: string;
  year: string;
  avatar?: string;
  skills: {
    [key: string]: boolean;
  };
}

const allSkills = ["Python", "Java", "網頁開發", "其他程式語言"];

export default function SkillsExchangePage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth(); // 拿到目前登入使用者
  const router = useRouter();

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSearch = async () => {
    if (selectedSkills.length === 0) {
      setUsers([]);
      return;
    }
    const queryParams = selectedSkills.map((skill) => `skills=${skill}`).join("&");
    const res = await fetch(`http://localhost:8000/skill-users?${queryParams}`);
    const data = await res.json();

    // ✅ 使用 user.id 排除自己
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

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "創建對話失敗");
      }

      const conversation = await res.json();

      const stored = JSON.parse(localStorage.getItem("recentChats") || "[]");
      const alreadyExist = stored.find((c: any) => c.id === conversation.id);
      if (!alreadyExist) {
        stored.push({
          id: conversation.id,
          name: user.name,
          studentId: user.studentId,
          avatar: user.avatar || "/avatar.png",
        });
        localStorage.setItem("recentChats", JSON.stringify(stored));
      }

      router.push("/chat");
    } catch (error) {
      alert(`無法創建對話: ${error instanceof Error ? error.message : "未知錯誤"}`);
      console.error(error);
    }
  };

  return (
    <>
      {/* 上方獨立區塊 */}
      <div className={styles.postListContainer}>
        <div className={styles.postHeader}>
          <div className={styles.titleWithIcon}>
            <FaRegLightbulb className={styles.titleIcon} />
            <h1 className={styles.sidebarTitle}>技能交換，不如找個人一起練</h1>
          </div>
        </div>
      </div>

      {/* 搜尋區與結果清單包在 skillPage 裡 */}
      <div className={styles.skillPage}>
        <div className={styles.skillTitle}>你想學習什麼技能？</div>
        <div className={styles.skillSelectRow}>
          <div className={styles.skillButtons}>
            {allSkills.map((skill) => (
              <button
                key={skill}
                className={`${styles.skillButton} ${selectedSkills.includes(skill) ? styles.selected : ""}`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
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
              <div className={styles.skillTagsRight}>
                {Object.entries(user.skills)
                  .filter(([_, value]) => value)
                  .map(([skill]) => (
                    <span key={skill} className={styles.tag}>
                      {skill}
                    </span>
                  ))}
              </div>
              <button
                className={styles.chatButton}
                onClick={() => handleChat(user)}
              >
                <LuMessageCircleMore className={styles.chatIcon} /> 
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
