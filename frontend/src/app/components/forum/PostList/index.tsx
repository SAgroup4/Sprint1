"use client";

import React, { useState, useMemo } from "react";
import "./styles.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { FaRegLightbulb } from "react-icons/fa6";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  replies: number;
  tags?: string[];
}

const Post: React.FC<{ post: Post; onClick: (post: Post) => void }> = ({
  post,
  onClick,
}) => {
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
        <div className="post-tags">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className={`tag ${tag === "轉學生" ? "tag-gold" : ""}`}
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="post-replies">{post.replies} 則回應</span>
      </div>
    </div>
  );
};

const PostList: React.FC = () => {
  const router = useRouter();
  const {user} = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateOrder, setDateOrder] = useState<'newest' | 'oldest'>('newest');

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:8000/posts");
      if (!response.ok) throw new Error("獲取文章失敗");
      const data = await response.json();
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
          tags: post.tag || [], // ✅ 對應 Firebase 裡的 tag 陣列
        };
        
      });
      setPosts(formattedPosts);
    } catch (error) {
      console.error("獲取文章列表失敗:", error);
    }
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenModal = () => {
    if (!user) {
      alert("請先登入");
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setContent("");
  };

  const handlePostClick = (post: Post) => {
    router.push(`/posts/${post.id}`);
  };

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        post.tags?.some(tag => selectedTags.includes(tag))
      );
    }
    if (dateOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    return filtered;
  }, [posts, selectedTags, dateOrder]);

  return (
    <div>
      <div className="post-list-container">
        <div className="post-header">
          <div className="title-with-icon">
            <FaRegLightbulb className="title-icon" />
            <h1 className="sidebar-title">學習路上，不如找個人同行</h1>
          </div>
          <div className="filter-controls">
            <div
              className="filter-group"
              onClick={() => {
                setShowDateFilter(prev => !prev);
                setShowTagFilter(false);
              }}
            >
              依日期排序 {showDateFilter ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
              {showDateFilter && (
                <div className="dropdown">
                  <label>
                    <input
                      type="radio"
                      name="date"
                      checked={dateOrder === 'newest'}
                      onChange={() => setDateOrder('newest')}
                    />
                    由近到遠
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="date"
                      checked={dateOrder === 'oldest'}
                      onChange={() => setDateOrder('oldest')}
                    />
                    由遠到近
                  </label>
                </div>
              )}
            </div>

            <div
              className="filter-group"
              onClick={() => {
                setShowTagFilter(prev => !prev);
                setShowDateFilter(false);
              }}
            >
              依標籤搜尋 {showTagFilter ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
              {showTagFilter && (
                <div className="dropdown">
                  {['Python', 'Java', '英文'].map(tag => (
                    <label key={tag}>
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button className="add-button" onClick={handleOpenModal}>+</button>
        </div>
      </div>

      <div className="post-list">
        {filteredPosts.map((post) => (
          <Post key={post.id} post={post} onClick={handlePostClick} />
        ))}
      </div>
    </div>
  );
};

export default PostList;