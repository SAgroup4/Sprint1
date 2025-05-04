"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import Link from "next/link";

interface Post {
  post_id: string;
  title: string;
  content: string;
  user_id: string;
  name: string; // 發布者名稱
  trans: boolean; // 是否為轉學生
  timestamp: string;
  skilltags: Record<string, boolean>; // 技能標籤
  languagetags: Record<string, boolean>; // 語言標籤
  leisuretags: Record<string, boolean>; // 休閒標籤
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || ""; // 從 URL 中取得搜尋關鍵字

  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/search?keyword=${encodeURIComponent(keyword)}`);
        if (!res.ok) throw new Error("搜尋失敗");
        const data = await res.json();

        // 確保 data.results 是陣列
        if (Array.isArray(data.results)) {
          setResults(data.results);
        } else {
          console.error("API 回應格式錯誤：", data);
          setResults([]); // 設定為空陣列以避免 map 出錯
        }
      } catch (err) {
        console.error("搜尋失敗：", err);
        setResults([]); // 設定為空陣列以避免 map 出錯
      } finally {
        setLoading(false);
      }
    };

    if (keyword) fetchResults();
  }, [keyword]);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "時間不明";

    const date = timestamp._seconds
      ? new Date(timestamp._seconds * 1000)
      : new Date(timestamp);

    if (isNaN(date.getTime())) return "時間格式錯誤";

    return date.toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <p>載入中...</p>;

  return (
    <div className={styles.searchPageContainer}>
      <h1 className={styles.searchTitle}>搜尋結果：「{keyword}」</h1>
      {results.length === 0 ? (
        <p className={styles.noResults}>找不到任何相關貼文</p>
      ) : (
        <ul className={styles.postList}>
          {results.map((post) => (
            <li key={post.post_id} className={styles.postDetailContainer}>
              <div className={styles.postHeader}>
                <Link href={`/profile/${post.user_id}`}>
                  <img
                    src="/avatar.png"
                    alt="頭貼"
                    className={styles.authorAvatar}
                  />
                </Link>
                <Link href={`/profile/${post.user_id}`}>
                  <span className={styles.postAuthor}>{post.name}</span>
                </Link>
                <span className={styles.postDate}>
                  {formatTimestamp(post.timestamp)}
                </span>
              </div>

              <h1 className={styles.postWord}>{post.title}</h1>
              <div className={styles.postContent}>{post.content}</div>

              <div className={styles.postTags}>
                {post.trans && <span className={styles.postTagTrans}>轉學生</span>}
                {Object.entries(post.skilltags || {})
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <span key={key} className={styles.postTagSkill}>
                      {key}
                    </span>
                  ))}
                {Object.entries(post.languagetags || {})
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <span key={key} className={styles.postTagLang}>
                      {key}
                    </span>
                  ))}
                {Object.entries(post.leisuretags || {})
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <span key={key} className={styles.postTagLeisure}>
                      {key}
                    </span>
                  ))}
              </div>

              <hr className={styles.divider} />
              <Link href={`/posts/${post.post_id}`} className={styles.postLink}>
                <button className={styles.messageButton}>查看完整貼文</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;