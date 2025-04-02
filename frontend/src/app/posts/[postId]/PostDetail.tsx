
'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import './styles.css';

interface Comment {
  comment_id: string;
  user_id: string;
  content: string;
  timestamp: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  timestamp: string;
}

const PostDetail = () => {
  const router = useRouter();
  const params = useParams();
  const postId = params?.postId as string;

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [post, setPost] = useState<Post | null>(null);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}`);
      const data = await res.json();
      console.log('📄 抓到文章資料：', data);
      setPost(data);
    } catch (err) {
      console.error('❌ 無法取得文章內容', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}/comments`);
      const data = await res.json();
      console.log("📨 取得留言資料：", data);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ 取得留言失敗', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('請輸入評論內容');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('userEmail') || '匿名',
          content: newComment,
        }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments(); // 重新取得留言
      } else {
        const err = await res.json();
        alert(`留言失敗：${err.detail}`);
      }
    } catch (err) {
      alert('伺服器錯誤，留言失敗');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  if (!post) return <p>載入文章中...</p>;

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <button className="back-button" onClick={() => router.back()}>
          返回
        </button>
        <h1 className="post-title">{post.title}</h1>
      </div>
      <div className="post-meta">
        <div className="author-info">
          <img src="/default-avatar.png" alt="頭貼" className="author-avatar" />
          <span className="post-author">{post.user_id}</span>
          <button className="message-button">私訊</button>
        </div>
        <span className="post-timestamp">{post.timestamp || '時間不明'}</span>
      </div>
      <div className="post-content">{post.content}</div>
      <hr className="divider" />
      <h2 className="comments-title">全部留言</h2>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.comment_id} className="comment-item">
            <div className="comment-meta">
              <div className="author-info">
                <img src="/default-avatar.png" alt="頭貼" className="author-avatar" />
                <span className="comment-author">{comment.user_id}</span>
              </div>
              <span className="comment-timestamp">{comment.timestamp || '時間不明'}</span>
            </div>
            <div className="comment-content">{comment.content}</div>
          </div>
        ))}
      </div>

      {/* 新增評論 */}
      <div className="add-comment">
        <textarea
          className="comment-input"
          placeholder="輸入你的評論..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="submit-comment-button" onClick={handleAddComment}>
          提交評論
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
