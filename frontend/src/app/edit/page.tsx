"use client";

import styles from "./edit.module.css";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface TagRecord {
  [key: string]: boolean;
}

export default function EditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams?.get("postId") || "";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isTransfer, setIsTransfer] = useState(false);

  const [skilltags, setSkilltags] = useState<TagRecord>({
    Java: false,
    Python: false,
    網頁開發: false,
    其他程式語言: false,
  });

  const [languagetags, setLanguagetags] = useState<TagRecord>({
    英文: false,
    日文: false,
    韓文: false,
    其他語言: false,
  });

  const [leisuretags, setLeisuretags] = useState<TagRecord>({
    閒聊: false,
    吃飯: false,
    桌球: false,
    跑步: false,
    其他: false,
  });

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("匿名");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");

    if (email) {
      const id = email.split("@")[0];
      setUserId(id);
    }
    if (name) {
      setUserName(name);
    }
  }, []);

  useEffect(() => {
    if (!postId) return;

    fetch(`http://localhost:8000/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
        setSkilltags(data.skilltags || {});
        setLanguagetags(data.languagetags || {});
        setLeisuretags(data.leisuretags || {});
        setIsTransfer(data.trans || false);
      })
      .catch((err) => {
        console.error("❌ 抓取原始資料失敗：", err);
      });
  }, [postId]);

  const handleCheckboxChange = (
    tagType: "skilltags" | "languagetags" | "leisuretags",
    tag: string
  ) => {
    const updater = {
      skilltags: setSkilltags,
      languagetags: setLanguagetags,
      leisuretags: setLeisuretags,
    }[tagType];

    updater?.((prev) => ({ ...prev, [tag]: !prev[tag] }));
  };

  const handleSubmit = async () => {
    const confirm = window.confirm("是否確認更新貼文？");
    if (!confirm) return;

    const data = {
      title,
      content,
      user_id: userId,
      name: userName,
      skilltags,
      languagetags,
      leisuretags,
      trans: isTransfer,
    };

    try {
      await fetch(`http://localhost:8000/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

     

      router.push(`/posts/${postId}?refresh=true`);
    } catch (err) {
      console.error("更新貼文錯誤：", err);
      router.push("/general");
    }
  };

  return (
    <div className={styles.postContainer}>
      <h2>🔸編輯貼文</h2>
      <input
        className={styles.postInput}
        placeholder="輸入文章標題……"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <textarea
        className={styles.postTextarea}
        placeholder="輸入文章內容……"
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
      />

      <div className={styles.formGroup}>
        <label className={styles.skillLabel}>技能標籤</label>
        <div className={styles.checkboxGroup}>
          {Object.entries(skilltags).map(([skill, checked], index) => (
            <label
              key={`skill-${index}`}
              className={`${styles.checkboxLabel} ${
                checked ? styles.checked : ""
              }`}
              htmlFor={`skill-${index}`}
            >
              <input
                type="checkbox"
                id={`skill-${index}`}
                value={skill}
                checked={checked}
                onChange={() => handleCheckboxChange("skilltags", skill)}
              />
              {skill}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.skillLabel}>語言標籤</label>
        <div className={styles.checkboxGroup}>
          {Object.entries(languagetags).map(([lang, checked], index) => (
            <label
              key={`lang-${index}`}
              className={`${styles.checkboxLabel} ${
                checked ? styles.checked : ""
              }`}
              htmlFor={`lang-${index}`}
            >
              <input
                type="checkbox"
                id={`lang-${index}`}
                value={lang}
                checked={checked}
                onChange={() => handleCheckboxChange("languagetags", lang)}
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.skillLabel}>休閒標籤</label>
        <div className={styles.checkboxGroup}>
          {Object.entries(leisuretags).map(([tag, checked], index) => (
            <label
              key={`leisure-${index}`}
              className={`${styles.checkboxLabel} ${
                checked ? styles.checked : ""
              }`}
              htmlFor={`leisure-${index}`}
            >
              <input
                type="checkbox"
                id={`leisure-${index}`}
                value={tag}
                checked={checked}
                onChange={() => handleCheckboxChange("leisuretags", tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.skillLabel}>是否與學生相關</label>
        <div className={styles.checkboxGroup}>
          {["是", "否"].map((label, idx) => (
            <label
              key={`trans-${idx}`}
              className={`${styles.checkboxLabel} ${
                isTransfer === (label === "是") ? styles.checked : ""
              }`}
            >
              <input
                type="radio"
                name="isTransfer"
                value={label}
                checked={isTransfer === (label === "是")}
                onChange={() => setIsTransfer(label === "是")}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.buttonBar}>
        <button className={styles.editButton} onClick={handleSubmit}>編輯完成</button>
        <button className={styles.cancelButton} onClick={() => router.back()}>取消</button>
      </div>
    </div>
  );
}
