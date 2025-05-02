"use client";

import React, { useState } from "react";
import "./styles.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { FaRegLightbulb } from "react-icons/fa6";
import { IoIosArrowDropup } from "react-icons/io";
import { IoIosArrowDropdown } from "react-icons/io";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  replies: number;
  skilltags: Map<string, boolean>;
  languagetags: Map<string, boolean>;
  leisuretags: Map<string, boolean>;
}

const Post: React.FC<{ post: Post; onClick: (post: Post) => void }> = ({
  post,
  onClick,
}) => {
  return (
    <div className="post-card" onClick={() => onClick(post)}>
      <div className="post-header">
        <div className="post-author">
          <img
            src={post.avatar || "/default-avatar.png"}
            alt="頭貼"
            className="post-avatar"
          />
          <span>{post.author}</span>
        </div>
        <span className="post-timestamp">{post.timestamp}</span>
      </div>
      <div className="post-body">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-content">{post.content}</p>
      </div>
      <div className="post-footer">
        <hr />
        <div className="post-footer-content">
          <div className="post-tags">
            {Array.from(post.skilltags.entries())
              .filter(([_, value]) => value)
              .map(([key]) => (
                <span key={key} className="post-tag skill">
                  {key}
                </span>
              ))}
            {Array.from(post.languagetags.entries())
              .filter(([_, value]) => value)
              .map(([key]) => (
                <span key={key} className="post-tag lang">
                  {key}
                </span>
              ))}
            {Array.from(post.leisuretags.entries())
              .filter(([_, value]) => value)
              .map(([key]) => (
                <span key={key} className="post-tag leisure">
                  {key}
                </span>
              ))}
          </div>
          <span className="post-replies">{post.replies} 則回應</span>
        </div>
      </div>
    </div>
  );
};

const PostList: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const toggleOverlay = () => {
    setIsOverlayOpen((prev) => !prev);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/posts`);
      if (!response.ok) throw new Error("獲取文章失敗");

      const result = await response.json();
      const data = result.posts;

      const formattedPosts = data.map((post: any) => {
        let formattedTime = "剛剛";
        if (post.timestamp) {
          const date = post.timestamp._seconds
            ? new Date(post.timestamp._seconds * 1000)
            : new Date(post.timestamp);
          if (!isNaN(date.getTime())) {
            formattedTime = date.toLocaleString("zh-TW", {
              timeZone: "Asia/Taipei",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
          }
        }
        return {
          id: post.post_id,
          title: post.title,
          content: post.content,
          author: post.user_id,
          avatar: "/avatar.png",
          timestamp: formattedTime,
          replies: post.comments_count || 0,
          skilltags: new Map(Object.entries(post.skilltags || {})),
          languagetags: new Map(Object.entries(post.languagetags || {})),
          leisuretags: new Map(Object.entries(post.leisuretags || {})),
        };
      });

      setPosts(formattedPosts);
      console.log("獲取文章成功:", formattedPosts);
    } catch (error) {
      console.error("獲取文章失敗:", error);
    }
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (post: Post) => {
    router.push(`/posts/${post.id}`);
  };

  return (
    <div>
      <div className="post-list-container">
        <div className="post-header">
          <div className="title-with-icon">
            <FaRegLightbulb className="title-icon" />
            <h1 className="sidebar-title">學習路上，不如找個人同行</h1>
          </div>
          <button className="add-button" onClick={() => router.push("/topost")}>
            +
          </button>
        </div>
      </div>

      <div className="filter-area">
        <div className="two-Columns">
          <div>
            <h2>篩選條件</h2>
          </div>
          <div className="filter-controls">
            <div className="filter-row">
              <button className="filter-button" onClick={toggleOverlay}>
                選擇
              </button>
              <div className="filter-options">
                <label>
                  <input type="radio" name="date" />
                  由近到遠
                </label>
                <label>
                  <input type="radio" name="date" />
                  由遠到近
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="post-list">
        {posts.map((post) => (
          <Post key={post.id} post={post} onClick={handlePostClick} />
        ))}
      </div>

      {isOverlayOpen && (
        <div className="overlay" onClick={toggleOverlay}>
          <div
            className="overlay-content"
            onClick={(e) => e.stopPropagation()} // 防止點擊內容區關閉
          >
            <form className="filter-form">
              <h2>篩選條件</h2>
              {/* 第一組問題：依技能搜尋 */}
              <div className="filter-group">
                <h3>依技能搜尋</h3>
                <div className="filter-options-row">
                  <label>
                    <input type="checkbox" name="skill" value="Java" />
                    Java
                  </label>
                  <label>
                    <input type="checkbox" name="skill" value="Python" />
                    Python
                  </label>
                  <label>
                    <input type="checkbox" name="skill" value="網頁開發" />
                    網頁開發
                  </label>
                  <label>
                    <input type="checkbox" name="skill" value="其他程式語言" />
                    其他程式語言
                  </label>
                </div>
              </div>

              {/* 第二組問題：依語言搜尋 */}
              <div className="filter-group">
                <h3>依語言搜尋</h3>
                <div className="filter-options-row">
                  <label>
                    <input type="checkbox" name="language" value="英文" />
                    英文
                  </label>
                  <label>
                    <input type="checkbox" name="language" value="韓文" />
                    韓文
                  </label>
                  <label>
                    <input type="checkbox" name="language" value="日文" />
                    日文
                  </label>
                  <label>
                    <input type="checkbox" name="language" value="其他語言" />
                    其他語言
                  </label>
                </div>
              </div>

              {/* 第三組問題：依休閒搜尋 */}
              <div className="filter-group">
                <h3>依休閒搜尋</h3>
                <div className="filter-options-row">
                  <label>
                    <input type="checkbox" name="leisure" value="跑步" />
                    跑步
                  </label>
                  <label>
                    <input type="checkbox" name="leisure" value="桌球" />
                    桌球
                  </label>
                  <label>
                    <input type="checkbox" name="leisure" value="吃飯" />
                    吃飯
                  </label>
                  <label>
                    <input type="checkbox" name="leisure" value="閒聊" />
                    閒聊
                  </label>
                  <label>
                    <input type="checkbox" name="leisure" value="其他" />
                    其他
                  </label>
                </div>
              </div>

              {/* 提交按鈕 */}
              <div className="button-row">
                <button type="submit" className="submit-button">
                  確認提交
                </button>
                <button
                  type="button"
                  className="clear-button"
                  onClick={() => alert("清除選項")}
                >
                  清除
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
