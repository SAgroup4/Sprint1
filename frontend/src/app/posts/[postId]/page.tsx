"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

interface Comment {
  comment_id: string;
  user_id: string;
  name: string; // 新增的 name 欄位
  content: string;
  timestamp: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  name: string; // 新增的 name 欄位
  trans: boolean; // 新增的 trans 欄位
  timestamp: string;
  skilltags: Map<string, boolean>; // 新增的 skilltags 欄位
  languagetags: Map<string, boolean>; // 新增的 languagetags 欄位
  leisuretags: Map<string, boolean>; // 新增的 leisuretags 欄位
  comments_count: number; // 新增的 comments_count 欄位
}

const PostDetail = ({ params }: { params: Promise<{ postId: string }> }) => {
  const router = useRouter();
  const { postId } = use(params); // 解包 Promise，取得真實 postId

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [post, setPost] = useState<Post | null>(null);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}`);
      if (!res.ok) throw new Error("取得貼文失敗");
      const data = await res.json();

      setPost({
        id: data.post_id,
        title: data.title,
        content: data.content,
        user_id: data.user_id,
        name: data.name || "未知名稱", // 新增的 name 欄位
        trans: data.trans || false, // 新增的 trans 欄位
        timestamp: data.timestamp,
        skilltags: new Map(Object.entries(data.skilltags || {})), // 確保 skilltags 是 Map
        languagetags: new Map(Object.entries(data.languagetags || {})), // 確保 languagetags 是 Map
        leisuretags: new Map(Object.entries(data.leisuretags || {})), // 確保 leisuretags 是 Map
        comments_count: data.comments_count || 0, // 新增的 comments_count 欄位
      });
    } catch (err) {
      console.error("無法取得文章內容", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}/comments`);
      if (!res.ok) throw new Error("無法取得留言");
      const data = await res.json();

      if (Array.isArray(data)) {
        setComments(
          data.map((comment: any) => ({
            ...comment,
            name: comment.name || "匿名", // 確保 name 欄位存在
          }))
        );
      } else {
        console.error("留言資料格式錯誤", data);
        setComments([]);
      }
    } catch (err) {
      console.error("❌ 取得留言失敗", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("請輸入評論內容");
      return;
    }

    try {

      const userName = localStorage.getItem("userName") || "匿名???"; // 從 localStorage 取得使用者名稱
      const userEmail = localStorage.getItem("userEmail") || "匿名"; // 從 localStorage 取得使用者 ID
      
      console.log(localStorage.getItem("userName"));
      console.log(localStorage.getItem("userEmail"));

      console.log("傳遞的留言資料：", {
        user_id: userEmail,
        name: userName,
        content: newComment,
      }); // 檢查傳遞的資料

      const res = await fetch(
        `http://localhost:8000/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userEmail, // 傳遞使用者 ID
            name: userName, // 傳遞使用者名稱
            content: newComment, // 傳遞評論內容
          }),
        }
      );

      if (res.ok) {
        setNewComment(""); // 清空輸入框
        fetchComments(); // 重新取得留言
      } else {
        const err = await res.json(); // 解析錯誤回應
        alert(`留言失敗：${err.detail || "未知錯誤"}`); // 顯示具體錯誤訊息
      }
    } catch (err) {
      alert("伺服器錯誤，留言失敗");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
    console.log("🔍 正在取得文章 ID:", postId);
    fetchComments();
  }, [postId]);

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

  if (!post) return <p>🔄 載入文章中...</p>;

  return (
    <div className={styles.postDetailContainer}>
      <div className={styles.postHeader}>
        <IoIosArrowBack
          className={styles.backButton}
          onClick={() => router.back()}
        />
        <h5 className={styles.postWord}>內文</h5>
        <span className={styles.postDate}>
          {formatTimestamp(post.timestamp)}
        </span>
      </div>

      <hr className={styles.divider} />
      <div className={styles.postMeta}>
        <div className={styles.authorInfo}>
          <div className={styles.authorInfo}>
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
          </div>
          <button className={styles.messageButton}>私訊</button>
        </div>
      </div>

      <h1 className={styles.postWord}>{post.title}</h1>
      <div className={styles.postContent}>{post.content}</div>
      <div className={styles.postTags}>
        {post.trans && <span className={styles.postTagTrans}>轉學生</span>}
        {Array.from(post.skilltags.entries())
          .filter(([_, value]) => value)
          .map(([key]) => (
            <span key={key} className={styles.postTagSkill}>
              {key}
            </span>
          ))}
        {Array.from(post.languagetags.entries())
          .filter(([_, value]) => value)
          .map(([key]) => (
            <span key={key} className={styles.postTagLang}>
              {key}
            </span>
          ))}
        {Array.from(post.leisuretags.entries())
          .filter(([_, value]) => value)
          .map(([key]) => (
            <span key={key} className={styles.postTagLeisure}>
              {key}
            </span>
          ))}
      </div>
      <hr className={styles.divider} />
      <h2 className={styles.commentsTitle}>全部留言</h2>

      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.comment_id} className={styles.commentItem}>
            <div className={styles.commentMeta}>
              <div className={styles.authorInfo}>
                <img
                  src="/avatar.png"
                  alt="頭貼"
                  className={styles.authorAvatar}
                />
                <span className={styles.commentAuthor}>{comment.name}</span>{" "}
                {/* 顯示 name */}
              </div>
              <span className={styles.commentTimestamp}>
                {formatTimestamp(comment.timestamp)}
              </span>
            </div>
            <div className={styles.commentContent}>{comment.content}</div>
          </div>
        ))}
      </div>

      {/* 新增評論 */}
      <div className={styles.addComment}>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // 防止表單預設提交行為
            handleAddComment();
          }}
        >
          {/* 隱藏欄位，傳送使用者名稱 */}
          <input
            type="hidden"
            name="userName"
            value={localStorage.getItem("userName") || "匿名"}
          />
          <textarea
            className={styles.commentInput}
            placeholder="輸入你的評論..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className={styles.submitCommentButton}>
            提交評論
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostDetail;
