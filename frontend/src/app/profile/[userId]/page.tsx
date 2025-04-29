'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Post {
  post_id: string;
  title: string;
  content: string;
  comments_count: number;
}

interface UserInfo {
  department: string;
  //grade: string;
  tags: string[];        // 注意 tags 現在是陣列
  is_transfer: boolean;  // 轉學生：boolean
  gender: string;
}



export default function ProfilePage() {
  const router = useRouter();
  const { userId } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`http://localhost:8000/posts`);
      const data = await res.json();
      console.log('[使用者資訊]', data);
      const filtered = data.filter((post: any) => post.user_id === userId);
      setPosts(filtered);
    };
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch(`http://localhost:8000/api/users/${userId}`);
      const data = await res.json();
      setUserInfo(data);
    };
    fetchUserInfo();
  }, [userId]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #e6f0ff, #cce0ff)',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '32px',
        }}
      >
        {/* 🔹 上排按鈕列 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* 返回主討論區 */}
          <button
            onClick={() => router.push('/general')}
            style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ◀ 返回主討論區
          </button>

          {/* 修改按鈕區 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => router.push(`/profile_change/${userId}`)}
              style={{
                backgroundColor: '#75809c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 16px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              修改個人資料
            </button>
            <button
              onClick={() => router.push(`/password/${userId}`)}
              style={{
                backgroundColor: '#d9534f',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 16px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              修改密碼
            </button>
          </div>
        </div>

        {/* 使用者資訊 */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            background: '#f0f6ff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <img
          // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7Gi3Gu0z0-qZiLSPXSl9Wi6nAMRVQMZHrbg&s
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7Gi3Gu0z0-qZiLSPXSl9Wi6nAMRVQMZHrbg&s"
            alt="頭像"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '3px solid #4a90e2',
            }}
          />
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a3e6e' }}>{userId}</h2>
            <p style={{ color: '#3c6090', marginTop: '4px' }}>
              {userInfo?.department || '尚未填寫'}
               {/* {userInfo?.grade || ''} */}
            </p>
            <p style={{ color: '#3c6090', marginTop: '4px' }}>
              性別：{userInfo?.gender || '尚未填寫'}
            </p>
            <p style={{ color: '#3c6090', marginTop: '4px' }}>
             {userInfo?.is_transfer ? '轉學生' :'非轉學生'}
            </p>

            {/* 技能標籤 */}
            <div style={{ marginTop: '16px' }}>
              <p style={{ color: '#3c6090', fontWeight: 'bold', marginBottom: '12px', fontSize: '18px' }}>
                技能與語言：
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {userInfo?.tags?.length ? (() => {
                  // 先分類
                  const skills: string[] = [];
                  const languages: string[] = [];
                  const others: string[] = [];

                  userInfo.tags.forEach((item) => {
                    if (item.includes('英文') || item.includes('日文') || item.includes('韓文') || item.includes('中文')) {
                      languages.push(item);
                    } else if (item.includes('跑步') || item.includes('籃球') || item.includes('桌球') || item.includes('閒聊') || item.includes('吃飯') || item.includes('其他')) {
                      others.push(item);
                    } else {
                      skills.push(item);
                    }
                  });

                  // 把分類好的合併成一個陣列，順序是 技能 > 語言 > 其他
                  const orderedTags = [...skills, ...languages, ...others];

                  // 再 map 出來渲染
                  return orderedTags.map((item, index) => {
                    let backgroundColor = '#5941a9'; // 預設技能藍
                    if (languages.includes(item)) {
                      backgroundColor = '#e08d79'; // 語言粉紅
                    } else if (others.includes(item)) {
                      backgroundColor = '#877666'; // 其他
                    }

                    return (
                      <span key={index} style={{
                        backgroundColor: backgroundColor,
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                      }}>
                        {item}
                      </span>
                    );
                  });
                })() : (
                  <p style={{ color: '#888' }}>尚未選擇任何技能與語言</p>
                )}
              </div>
            </div>




                   
          </div>
        </div>

        {/* 發表貼文 */}
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: '16px',
            borderBottom: '2px solid #4a90e2',
            paddingBottom: '8px',
          }}
        >
          我發表過的貼文
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.length === 0 ? (
            <p style={{ color: '#888' }}>尚未發表任何貼文。</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.post_id}
                onClick={() => router.push(`/posts/${post.post_id}`)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                <h4 style={{ fontSize: '17px', fontWeight: 'bold', color: '#154c9c' }}>
                  # {post.title}
                </h4>
                <p style={{ color: '#333', margin: '10px 0' }}>{post.content}</p>
                <p style={{ fontSize: '14px', color: '#777' }}>{post.comments_count} 則留言</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
