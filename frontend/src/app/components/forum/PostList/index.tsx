"use client";

import React, { useState, useEffect } from "react";
import "./styles.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { FaRegLightbulb } from "react-icons/fa6";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  replies: number;
  // 等做完標籤再打開
  // skilltags?: { [key: string]: boolean };
  // languagetags?: { [key: string]: boolean };
  // leisuretags?: { [key: string]: boolean };
}

const Post: React.FC<{ post: Post; onClick: (post: Post) => void }> = ({ post, onClick }) => {
  return (
    <div className="post-card" onClick={() => onClick(post)}>
      <div className="post-header">
        <div className="post-author">
          <img src={post.avatar || "/default-avatar.png"} alt="頭貼" className="post-avatar" />
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
        {/* 標籤先註解掉 */}
        {/* <div className="post-skills">
          {Object.entries(post.skilltags || {}).filter(([_, v]) => v).map(([k]) => (
            <span key={k} className="skill">#{k}</span>
          ))}
          {Object.entries(post.languagetags || {}).filter(([_, v]) => v).map(([k]) => (
            <span key={k} className="language">#{k}</span>
          ))}
          {Object.entries(post.leisuretags || {}).filter(([_, v]) => v).map(([k]) => (
            <span key={k} className="leisure">#{k}</span>
          ))}
        </div> */}
        <span className="post-replies">{post.replies} 則回應</span>
      </div>
    </div>
  );
};

const PostList: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [dateOrder, setDateOrder] = useState<'newest' | 'oldest'>('newest');

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/posts`);
      if (!response.ok) throw new Error("獲取文章失敗");

      const data = await response.json();

      const formattedPosts: Post[] = data.map((post: any) => {
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
          id: post.id || post.post_id, // 支援舊的 post_id
          title: post.title,
          content: post.content,
          author: post.user_id,
          avatar: "/avatar.png",
          timestamp: formattedTime,
          replies: post.comments_count || 0,
          // skilltags: post.skilltags || {},
          // languagetags: post.languagetags || {},
          // leisuretags: post.leisuretags || {},
        };
      });

      setPosts(formattedPosts);
    } catch (error) {
      console.error("獲取文章失敗:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [dateOrder]);

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
        </div>
      </div>

      {/* 貼文列表 */}
      <div className="post-list">
        {posts.map((post) => (
          <Post key={post.id} post={post} onClick={handlePostClick} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
