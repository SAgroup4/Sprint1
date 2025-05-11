"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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

const allSkills = ["Python", "Java", "網頁開發","其他程式語言"];

export default function SkillsExchangePage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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
    const queryParams = selectedSkills.map(skill => `skills=${skill}`).join("&");
    const res = await fetch(`http://localhost:8000/skill-users?${queryParams}`);
    const data = await res.json();
    setUsers(data);
  };

  return (
    <div className={styles.skillPage}>
      <div className={styles.skillTitle}>你想學習什麼技能？</div>
      <div className={styles.skillSelectRow}>
        <div className={styles.skillButtons}>
          {allSkills.map(skill => (
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
        {users.map(user => (
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
              onClick={() => router.push(`/chat?to=${user.studentId}`)}
              title="私訊"
            >
              ...
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
