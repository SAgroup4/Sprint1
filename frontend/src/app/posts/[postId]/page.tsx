"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";

interface Comment {
  comment_id: string;
  user_id: string;
  name: string;
  content: string;
  timestamp: any;
}

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  name: string;
  trans: boolean;
  timestamp: string;
  skilltags: Map<string, boolean>;
  languagetags: Map<string, boolean>;
  leisuretags: Map<string, boolean>;
  comments_count: number;
}

const PostDetail = ({ params }: { params: Promise<{ postId: string }> }) => {
  const router = useRouter();
  const [postId, setPostId] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [showCommentMenu, setShowCommentMenu] = useState<string | null>(null);
  
  // 確保 Hook 在頂層執行
  useEffect(() => {
    params.then((res) => setPostId(res.postId));
  }, [params]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail");
      const idPrefix = email?.split("@")[0] || null;
      setCurrentUserId(idPrefix);
    }
  }, []);

  useEffect(() => {
    params.then((res) => setPostId(res.postId));
  }, [params]);

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const needRefresh = urlParams.get("refresh");

    if (needRefresh === "true" && postId) {
      fetchPost(); 
      const newUrl = `${window.location.pathname}`;
      window.history.replaceState({}, "", newUrl); 
    }
  }, [postId]); 

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
        name: data.name || "未知名稱",
        trans: data.trans || false,
        timestamp: data.timestamp,
        skilltags: new Map(Object.entries(data.skilltags || {})),
        languagetags: new Map(Object.entries(data.languagetags || {})),
        leisuretags: new Map(Object.entries(data.leisuretags || {})),
        comments_count: data.comments_count || 0,
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
            name: comment.name || "匿名",
          }))
        );
      } else {
        console.error("留言資料格式錯誤", data);
        setComments([]);
      }
    } catch (err) {
      console.error("取得留言失敗", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("請輸入評論內容");
      return;
    }

    try {
      const userName = localStorage.getItem("userName") || "匿名???";
      const userEmail = localStorage.getItem("userEmail") || "匿名";

      const res = await fetch(`http://localhost:8000/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userEmail, name: userName, content: newComment }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments();
      } else {
        const err = await res.json();
        alert(`留言失敗：${err.detail || "未知錯誤"}`);
      }
    } catch (err) {
      alert("伺服器錯誤，留言失敗");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("你確定要刪除這篇貼文嗎？這個動作無法復原！");
    if (!confirm) return;
  
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        alert("刪除成功！");
        router.push("/?refresh=true"); // ⬅️ 回首頁並刷新
      } else {
        const err = await res.json();
        alert(`刪除失敗：${err.detail || "未知錯誤"}`);
      }
    } catch (err) {
      console.error("刪除錯誤：", err);
      alert("伺服器錯誤，無法刪除貼文");
    }
  };
  
  // 格式化時間戳
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "時間不明";
    const date = timestamp._seconds ? new Date(timestamp._seconds * 1000) : new Date(timestamp);
    return isNaN(date.getTime())
      ? "時間格式錯誤"
      : date.toLocaleString("zh-TW", {
          timeZone: "Asia/Taipei",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  // 檢查留言是否在發布後3分鐘內
  const isCommentEditable = (commentTimestamp: any) => {
    if (!commentTimestamp) return false;
    
    const commentDate = commentTimestamp._seconds 
      ? new Date(commentTimestamp._seconds * 1000) 
      : new Date(commentTimestamp);
    
    if (isNaN(commentDate.getTime())) return false;
    
    const now = new Date();
    const diffInMinutes = (now.getTime() - commentDate.getTime()) / (60 * 1000);
    
    return diffInMinutes <= 3; // 3分鐘內可編輯
  };

  // 開始編輯留言
  const startEditComment = (comment: Comment) => {
    setEditingCommentId(comment.comment_id);
    setEditCommentContent(comment.content);
    setShowCommentMenu(null); // 關閉選單
  };

  // 取消編輯留言
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  // 提交編輯後的留言
  const submitEditComment = async () => {
    if (!editingCommentId || !editCommentContent.trim()) return;

    try {
      const userName = localStorage.getItem("userName") || "匿名";
      const userEmail = localStorage.getItem("userEmail") || "匿名";

      const res = await fetch(`http://localhost:8000/posts/${postId}/comments/${editingCommentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: userEmail, 
          name: userName, 
          content: editCommentContent 
        }),
      });

      if (res.ok) {
        setEditingCommentId(null);
        setEditCommentContent("");
        fetchComments(); // 重新取得所有留言
      } else {
        const err = await res.json();
        alert(`編輯留言失敗：${err.detail || "未知錯誤"}`);
      }
    } catch (err) {
      console.error("編輯留言錯誤：", err);
      alert("伺服器錯誤，無法編輯留言");
    }
  };

  // 刪除留言
  const deleteComment = async (commentId: string) => {
    const confirm = window.confirm("你確定要刪除這則留言嗎？這個動作無法復原！");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}/comments/${commentId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("留言已刪除！");
        fetchComments(); // 重新取得所有留言
      } else {
        const err = await res.json();
        alert(`刪除留言失敗：${err.detail || "未知錯誤"}`);
      }
    } catch (err) {
      console.error("刪除留言錯誤：", err);
      alert("伺服器錯誤，無法刪除留言");
    }
  };

  // 切換留言的選單顯示
  const toggleCommentMenu = (commentId: string) => {
    setShowCommentMenu(showCommentMenu === commentId ? null : commentId);
  };

  if (!postId) return <p>載入中...</p>;
  if (!post) return <p>載入文章中...</p>;
  if (!currentUserId) return <p>正在驗證使用者...</p>;

  return (
    <div className={styles.postDetailContainer}>
      <div className={styles.postHeader}>
        <IoIosArrowBack className={styles.backButton} onClick={() => router.back()} />
        <h5 className={styles.postWord}>內文</h5>
        <span className={styles.postDate}>{formatTimestamp(post.timestamp)}</span>
      </div>

      <hr className={styles.divider} />
      <div className={styles.postMeta}>
        <div className={styles.authorleft}>
          <Link href={`/profile/${post.user_id}`}>
            <img src="/avatar.png" alt="頭貼" className={styles.authorAvatar} />
          </Link>
          <Link href={`/profile/${post.user_id}`}>
            <span className={styles.postAuthor}>{post.name}</span>
          </Link>
          <button className={styles.messageButton}>私訊</button>
        </div>

        {post.user_id === currentUserId && (
          <div className={styles.moreMenuContainer}>
            <button className={styles.moreOptionsButton} onClick={() => setShowMenu(!showMenu)}>
              <BsThreeDotsVertical />
            </button>
            {showMenu && (
              <div className={styles.menu}>
                <button className={styles.menuItem} onClick={() => router.push(`/edit?postId=${post.id}`)}>
                  編輯
                </button>
                <button className={styles.menuItem} onClick={handleDelete}>刪除</button>
              </div>
            )}
          </div>
        )}
      </div>

      <h1 className={styles.postWord}>{post.title}</h1>
      <div className={styles.postContent}>{post.content}</div>
      <div className={styles.postTags}>
        {post.trans && <span className={styles.postTagTrans}>轉學生</span>}
        {[...post.skilltags.entries()]
          .filter(([_, v]) => v)
          .map(([k]) => (
            <span key={k} className={styles.postTagSkill}>
              {k}
            </span>
          ))}
        {[...post.languagetags.entries()]
          .filter(([_, v]) => v)
          .map(([k]) => (
            <span key={k} className={styles.postTagLang}>
              {k}
            </span>
          ))}
        {[...post.leisuretags.entries()]
          .filter(([_, v]) => v)
          .map(([k]) => (
            <span key={k} className={styles.postTagLeisure}>
              {k}
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
                <img src="/avatar.png" alt="頭貼" className={styles.authorAvatar} />
                <span className={styles.commentAuthor}>{comment.name}</span>
              </div>
              <div className={styles.commentActions}>
                <span className={styles.commentTimestamp}>{formatTimestamp(comment.timestamp)}</span>
                
                {comment.user_id === localStorage.getItem("userEmail") && (
                  <div className={styles.commentMenuContainer}>
                    <button 
                      className={styles.commentMoreOptionsButton} 
                      onClick={() => toggleCommentMenu(comment.comment_id)}
                    >
                      <BsThreeDotsVertical />
                    </button>
                    
                    {showCommentMenu === comment.comment_id && (
                      <div className={styles.commentMenu}>
                        {isCommentEditable(comment.timestamp) && (
                          <button 
                            className={styles.commentMenuItem} 
                            onClick={() => startEditComment(comment)}
                          >
                            編輯
                          </button>
                        )}
                        <button 
                          className={styles.commentMenuItem} 
                          onClick={() => deleteComment(comment.comment_id)}
                        >
                          刪除
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.commentContent}>{comment.content}</div>
            
            {editingCommentId === comment.comment_id && (
              <div className={styles.editCommentContainer}>
                <textarea
                  className={styles.editCommentInput}
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                />
                <div className={styles.editCommentButtons}>
                  <button 
                    className={styles.editCommentCancel} 
                    onClick={cancelEditComment}
                  >
                    取消
                  </button>
                  <button 
                    className={styles.editCommentSubmit} 
                    onClick={submitEditComment}
                  >
                    更新留言
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.addComment}>
        <div>
          <textarea
            className={styles.commentInput}
            placeholder="輸入你的評論..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className={styles.submitCommentButton} onClick={handleAddComment}>
            提交評論
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;