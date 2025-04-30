// "use client";

// import React, { useState, useEffect } from "react";
// import "./styles.css";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthProvider";
// import { FaRegLightbulb } from "react-icons/fa6";
// import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   author: string;
//   avatar: string;
//   timestamp: string;
//   replies: number;
//   // 等做完標籤再打開
//   // skilltags?: { [key: string]: boolean };
//   // languagetags?: { [key: string]: boolean };
//   // leisuretags?: { [key: string]: boolean };
// }

// const Post: React.FC<{ post: Post; onClick: (post: Post) => void }> = ({ post, onClick }) => {
//   return (
//     <div className="post-card" onClick={() => onClick(post)}>
//       <div className="post-header">
//         <div className="post-author">
//           <img src={post.avatar || "/default-avatar.png"} alt="頭貼" className="post-avatar" />
//           <span>{post.author}</span>
//         </div>
//         <span className="post-timestamp">{post.timestamp}</span>
//       </div>
//       <div className="post-body">
//         <h3 className="post-title">{post.title}</h3>
//         <p className="post-content">{post.content}</p>
//       </div>
//       <div className="post-footer">
//         <hr />
//         {/* 標籤先註解掉 */}
//         {/* <div className="post-skills">
//           {Object.entries(post.skilltags || {}).filter(([_, v]) => v).map(([k]) => (
//             <span key={k} className="skill">#{k}</span>
//           ))}
//           {Object.entries(post.languagetags || {}).filter(([_, v]) => v).map(([k]) => (
//             <span key={k} className="language">#{k}</span>
//           ))}
//           {Object.entries(post.leisuretags || {}).filter(([_, v]) => v).map(([k]) => (
//             <span key={k} className="leisure">#{k}</span>
//           ))}
//         </div> */}
//         <span className="post-replies">{post.replies} 則回應</span>
//       </div>
//     </div>
//   );
// };

// const PostList: React.FC = () => {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [dateOrder, setDateOrder] = useState<'newest' | 'oldest'>('newest');

//   const fetchPosts = async () => {
//     try {
//       const response = await fetch(`http://localhost:8000/posts`);
//       if (!response.ok) throw new Error("獲取文章失敗");

//       const data = await response.json();

//       const formattedPosts: Post[] = data.map((post: any) => {
//         let formattedTime = "剛剛";
//         if (post.timestamp) {
//           const date = post.timestamp._seconds
//             ? new Date(post.timestamp._seconds * 1000)
//             : new Date(post.timestamp);
//           if (!isNaN(date.getTime())) {
//             formattedTime = date.toLocaleString("zh-TW", {
//               timeZone: "Asia/Taipei",
//               year: "numeric",
//               month: "2-digit",
//               day: "2-digit",
//               hour: "2-digit",
//               minute: "2-digit",
//             });
//           }
//         }

//         return {
//           id: post.id || post.post_id, // 支援舊的 post_id
//           title: post.title,
//           content: post.content,
//           author: post.user_id,
//           avatar: "/avatar.png",
//           timestamp: formattedTime,
//           replies: post.comments_count || 0,
//           // skilltags: post.skilltags || {},
//           // languagetags: post.languagetags || {},
//           // leisuretags: post.leisuretags || {},
//         };
//       });

//       setPosts(formattedPosts);
//     } catch (error) {
//       console.error("獲取文章失敗:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, [dateOrder]);

//   const handlePostClick = (post: Post) => {
//     router.push(`/posts/${post.id}`);
//   };

//   return (
//     <div>
//       <div className="post-list-container">
//         <div className="post-header">
//           <div className="title-with-icon">
//             <FaRegLightbulb className="title-icon" />
//             <h1 className="sidebar-title">學習路上，不如找個人同行</h1>
//           </div>
//         </div>
//       </div>

//       {/* 貼文列表 */}
//       <div className="post-list">
//         {posts.map((post) => (
//           <Post key={post.id} post={post} onClick={handlePostClick} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PostList;




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
  skilltags?: string[];
  languagetags?: string[];
  leisuretags?: string[];
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
        <div className="post-skills">
          {post.skilltags?.map((skill) => (
            <span key={skill} className="skill">
              #{skill}
            </span>
          ))}
          {post.languagetags?.map((language) => (
            <span key={language} className="language">
              #{language}
            </span>
          ))}
          {post.leisuretags?.map((leisure) => (
            <span key={leisure} className="leisure">
              #{leisure}
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
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showSkillFilter, setShowSkillFilter] = useState(false);
  const [showLanguageFilter, setShowLanguageFilter] = useState(false);
  const [showLeisureFilter, setShowLeisureFilter] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedLeisure, setSelectedLeisure] = useState<string[]>([]);
  const [dateOrder, setDateOrder] = useState<'newest' | 'oldest'>('newest');

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]
    );
  };

  const toggleLeisure = (leisure: string) => {
    setSelectedLeisure((prev) =>
      prev.includes(leisure) ? prev.filter((l) => l !== leisure) : [...prev, leisure]
    );
  };

  const fetchFilteredPosts = async () => {
    try {
      const hasFilter =
        selectedSkills.length > 0 ||
        selectedLanguages.length > 0 ||
        selectedLeisure.length > 0;
  
      const skillParams = selectedSkills.length > 0 ? `&skilltags=${selectedSkills.join(",")}` : "";
      const languageParams = selectedLanguages.length > 0 ? `&languagetags=${selectedLanguages.join(",")}` : "";
      const leisureParams = selectedLeisure.length > 0 ? `&leisuretags=${selectedLeisure.join(",")}` : "";
  
      const url = hasFilter
        ? `http://localhost:8000/posts/filter?order=${dateOrder}${skillParams}${languageParams}${leisureParams}`
        : `http://localhost:8000/posts?order=${dateOrder}`; // 無篩選時改用 /posts
  
      const response = await fetch(url);
      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ 後端回傳錯誤：", errText);
        throw new Error("獲取文章失敗");
      }
  
      const result = await response.json();
      const data = hasFilter ? result.posts : result; // filter 回傳有包 posts，get_all 沒包
  
      const formattedPosts = data
        .filter((post: any) => post.title && post.timestamp) // 過濾 timestamp 或 title 為 null 的貼文
        .map((post: any) => {
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
            skilltags: post.skilltags || [],
            languagetags: post.languagetags || [],
            leisuretags: post.leisuretags || [],
          };
        });
  
      setPosts(formattedPosts);
      console.log("成功取得貼文：", formattedPosts);
    } catch (error) {
      console.error("取得貼文失敗：", error);
    }
  };
  

  React.useEffect(() => {
    fetchFilteredPosts();
  }, [dateOrder, selectedSkills, selectedLanguages, selectedLeisure]);

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

      {/* 篩選功能移到貼文列表上方 */}
      <div className="filter-controls">
        <h2>篩選條件</h2>

        {/* 日期篩選 */}
        <div
          className="filter-group"
          onClick={() => {
            setShowDateFilter((prev) => !prev);
            setShowSkillFilter(false);
            setShowLanguageFilter(false);
            setShowLeisureFilter(false);
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

        {/* 技能篩選 */}
        <div
          className="filter-group"
          onClick={() => {
            setShowSkillFilter((prev) => !prev);
            setShowDateFilter(false);
            setShowLanguageFilter(false);
            setShowLeisureFilter(false);
          }}
        >
          依技能搜尋 {showSkillFilter ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
          {showSkillFilter && (
            <div className="dropdown">
              {["Python", "Java", "網頁開發", "跑步", "籃球", "桌球"].map((skill) => (
                <label key={skill}>
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 語言篩選 */}
        <div
          className="filter-group"
          onClick={() => {
            setShowLanguageFilter((prev) => !prev);
            setShowDateFilter(false);
            setShowSkillFilter(false);
            setShowLeisureFilter(false);
          }}
        >
          依語言搜尋 {showLanguageFilter ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
          {showLanguageFilter && (
            <div className="dropdown">
              {["英文", "日文", "韓文", "中文"].map((language) => (
                <label key={language}>
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(language)}
                    onChange={() => toggleLanguage(language)}
                  />
                  {language}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 休閒篩選 */}
        <div
          className="filter-group"
          onClick={() => {
            setShowLeisureFilter((prev) => !prev);
            setShowDateFilter(false);
            setShowSkillFilter(false);
            setShowLanguageFilter(false);
          }}
        >
          依休閒搜尋 {showLeisureFilter ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
          {showLeisureFilter && (
            <div className="dropdown">
              {["旅遊", "音樂", "電影", "運動"].map((leisure) => (
                <label key={leisure}>
                  <input
                    type="checkbox"
                    checked={selectedLeisure.includes(leisure)}
                    onChange={() => toggleLeisure(leisure)}
                  />
                  {leisure}
                </label>
              ))}
            </div>
          )}
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