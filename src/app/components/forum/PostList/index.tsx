'use client'; // 設為 Client Component，確保可以使用交互

import React, { useState } from 'react';
import './styles.css';
import { useRouter } from 'next/navigation';
import { AiOutlineTeam } from 'react-icons/ai'; // 引入 React Icon
import { useAuth } from '@/context/AuthProvider';
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  replies: number;
}

const Post: React.FC<{ post: Post; onClick: (post: Post) => void }> = ({ post, onClick }) => {
  return (
    <div className="post-card" onClick={() => onClick(post)}>
      <div className="post-header">
        <div className="post-author">
          <img src={post.avatar} alt="頭貼" className="post-avatar" />
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
        <span className="post-replies">{post.replies} 則回應</span>
      </div>
    </div>
  );
};

const PostList: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8000/posts');
      if (!response.ok) throw new Error('獲取文章失敗');
      const data = await response.json();
      const formattedPosts = data.map((post: any) => {
        // 處理時間戳
        let formattedTime = '剛剛';
        if (post.timestamp) {
          const date = post.timestamp._seconds 
            ? new Date(post.timestamp._seconds * 1000)  // Firestore 時間戳格式
            : new Date(post.timestamp);                 // 一般 ISO 字串格式
  
          if (!isNaN(date.getTime())) {
            formattedTime = date.toLocaleString('zh-TW', {
              timeZone: 'Asia/Taipei',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        }
  
        return {
          id: post.post_id,
          title: post.title,
          content: post.content,
          author: post.user_id,
          avatar: '/default-avatar.png',
          timestamp: formattedTime,
          replies: post.comments_count || 0,
        };
      });
      setPosts(formattedPosts);
    } catch (error) {
      console.error('獲取文章列表失敗:', error);
    }
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenModal = () => {
    if (!user) {
      alert('請先登入');
      router.push('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('請填寫標題和內文');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        alert('請先登入');
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.email.split('@')[0],
          title,
          content
        })
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || '發文失敗');
      }
      
      const result = await response.json();
      console.log('發文成功，文章ID:', result.post_id);
      alert('發文成功！');
      handleCloseModal();
      await fetchPosts(); // 重新獲取文章列表
    } catch (error) {
      window.location.reload();
    }
  };

  const handlePostClick = (post: Post) => {
    router.push(`/posts/${post.id}`);
  };

  return (
    <div className="post-list-container">
      <div className="post-header">
        <div className="title-with-icon">
          <AiOutlineTeam className="title-icon" />
          <h1 className="sidebar-title">來找找你的學習夥伴...？</h1>
        </div>
        <button className="add-button" onClick={handleOpenModal}>
          +
        </button>
      </div>

      <div className="post-list">
        {posts.map((post) => (
          <Post key={post.id} post={post} onClick={handlePostClick} />
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>新增學習目標</h3>
            <div className="modal-field">
              <label>標題：</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入標題"
              />
            </div>
            <div className="modal-field">
              <label>內文：</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="輸入內文"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleSubmit} className="submit-button">
                提交
              </button>
              <button onClick={handleCloseModal} className="cancel-button">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
