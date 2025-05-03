"use client";

import React, { useState } from "react";
import styles from "./styles.module.css"; // 引入 module.css
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { FaRegLightbulb } from "react-icons/fa6";

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
  name: string;
  trans: boolean;
}

const Post: React.FC<{ post: Post; onClick: (post: Post) => void }> = ({
  post,
  onClick,
}) => {
  return (
    <div className={styles["post-card"]} onClick={() => onClick(post)}>
      <div className={styles["post-header"]}>
        <div className={styles["post-author"]}>
          <img
            src={post.avatar || "/avatar.png"}
            alt="頭貼"
            className={styles["post-avatar"]}
          />
          <span>{post.author || "匿名使用者"}</span>
        </div>
        <span className={styles["post-timestamp"]}>{post.timestamp}</span>
      </div>
      <div className={styles["post-body"]}>
        <h3 className={styles["post-title"]}>{post.title}</h3>
        <p className={styles["post-content"]}>{post.content}</p>
      </div>
      <div className={styles["post-footer"]}>
        <hr />
        <div className={styles["post-footer-content"]}>
          <div className={styles["post-tags"]}>
            {post.trans && <span className={styles["post-tagtrans"]}>轉學生</span>}
            {Array.from(post.skilltags.entries())
              .filter(([_, value]) => value)
              .map(([key]) => (
                <span key={key} className={styles["post-tagskill"]}>
                  {key}
                </span>
              ))}
            {Array.from(post.languagetags.entries())
              .filter(([_, value]) => value)
              .map(([key]) => (
                <span key={key} className={styles["post-taglang"]}>
                  {key}
                </span>
              ))}
            {Array.from(post.leisuretags.entries())
              .filter(([_, value]) => value)
              .map(([key]) => (
                <span key={key} className={styles["post-tagleisure"]}>
                  {key}
                </span>
              ))}
          </div>
          <span className={styles["post-replies"]}>{post.replies} 則回應</span>
        </div>
      </div>
    </div>
  );
};

const PostList: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // 新增篩選後的貼文狀態
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [order, setOrder] = useState<string>("newest"); // 預設排序為 "newest"

  const [skilltags, setSkilltags] = useState<Map<string, boolean>>(
    new Map([
      ["Java", false],
      ["Python", false],
      ["網頁開發", false],
      ["其他程式語言", false],
    ])
  );
  const [languagetags, setLanguagetags] = useState<Map<string, boolean>>(
    new Map([
      ["英文", false],
      ["韓文", false],
      ["日文", false],
      ["其他語言", false],
    ])
  );
  const [leisuretags, setLeisuretags] = useState<Map<string, boolean>>(
    new Map([
      ["跑步", false],
      ["桌球", false],
      ["吃飯", false],
      ["閒聊", false],
      ["其他", false],
    ])
  );

  // 計算是否有啟用篩選條件
  const isFiltered =
    Array.from(skilltags.values()).some((value) => value) ||
    Array.from(languagetags.values()).some((value) => value) ||
    Array.from(leisuretags.values()).some((value) => value);

  const toggleOverlay = () => {
    setIsOverlayOpen((prev) => !prev);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/posts?order=${order}`);
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
          author: post.name,
          trans: post.trans,
          timestamp: formattedTime,
          replies: post.comments_count || 0,
          skilltags: new Map(Object.entries(post.skilltags || {})),
          languagetags: new Map(Object.entries(post.languagetags || {})),
          leisuretags: new Map(Object.entries(post.leisuretags || {})),
        };
      });

      setPosts(formattedPosts);
      setFilteredPosts(formattedPosts); // 初始化篩選後的貼文
      applyFilters(); // 確保篩選邏輯被執行
    } catch (error) {
      console.error("獲取文章失敗:", error);
    }
  };

  const applyFilters = () => {
    const filtered = posts.filter((post) => {
      if (!post.trans) return false;
      // 篩選技能標籤
      const skillMatch = Array.from(skilltags.entries()).every(
        ([key, value]) => !value || post.skilltags.get(key)
      );

      // 篩選語言標籤
      const languageMatch = Array.from(languagetags.entries()).every(
        ([key, value]) => !value || post.languagetags.get(key)
      );

      // 篩選休閒標籤
      const leisureMatch = Array.from(leisuretags.entries()).every(
        ([key, value]) => !value || post.leisuretags.get(key)
      );

      return skillMatch && languageMatch && leisureMatch;
    });

    // 根據 order 狀態排序
    const sortedFiltered = filtered.sort((a, b) => {
      if (order === "newest") {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } else {
        return (
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      }
    });

    setFilteredPosts(sortedFiltered); // 更新篩選後的貼文
  };

  React.useEffect(() => {
    fetchPosts(); // 當 order 改變時重新獲取貼文
  }, [order]);

  React.useEffect(() => {
    applyFilters(); // 當 order 改變時重新應用篩選與排序
  }, [order, posts]); // 確保 posts 更新後也會重新執行

  React.useEffect(() => {
    applyFilters();
  }, [skilltags, languagetags, leisuretags]); // 當篩選條件改變時應用篩選

  const handlePostClick = (post: Post) => {
    router.push(`/posts/${post.id}`);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrder(e.target.value); // 更新排序條件
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    // 更新 skilltags
    const updatedSkilltags = new Map(skilltags);
    updatedSkilltags.forEach((_, key) => {
      updatedSkilltags.set(key, formData.getAll("skill").includes(key));
    });
    setSkilltags(updatedSkilltags);

    // 更新 languagetags
    const updatedLanguagetags = new Map(languagetags);
    updatedLanguagetags.forEach((_, key) => {
      updatedLanguagetags.set(
        key,
        formData.getAll("language").includes(key)
      );
    });
    setLanguagetags(updatedLanguagetags);

    // 更新 leisuretags
    const updatedLeisuretags = new Map(leisuretags);
    updatedLeisuretags.forEach((_, key) => {
      updatedLeisuretags.set(
        key,
        formData.getAll("leisure").includes(key)
      );
    });
    setLeisuretags(updatedLeisuretags);

    setIsOverlayOpen(false);
  };

  const handleClear = () => {
    // 重置所有選項
    setSkilltags(
      new Map([
        ["Java", false],
        ["Python", false],
        ["網頁開發", false],
        ["其他程式語言", false],
      ])
    );
    setLanguagetags(
      new Map([
        ["英文", false],
        ["韓文", false],
        ["日文", false],
        ["其他語言", false],
      ])
    );
    setLeisuretags(
      new Map([
        ["跑步", false],
        ["桌球", false],
        ["吃飯", false],
        ["閒聊", false],
        ["其他", false],
      ])
    );
    setFilteredPosts(posts); // 重置篩選後的貼文
  };

  return (
    <div>
      <div className={styles["post-list-container"]}>
        <div className={styles["post-header"]}>
          <div className={styles["title-with-icon"]}>
            <FaRegLightbulb className={styles["title-icon"]} />
            <h1 className={styles["sidebar-title"]}>轉個彎，也能找到同路人。</h1>
          </div>
          <button className={styles["add-button"]} onClick={() => router.push("/topost")}>
            +
          </button>
        </div>
      </div>

      <div className={styles["filter-area"]}>
        <div className={styles["two-Columns"]}>
          <div>
            <h2>篩選條件</h2>
          </div>
          <div className={styles["filter-controls"]}>
            <div className={styles["filter-row"]}>
              <div className={styles["filter-controls"]}>
                <div className={styles["filter-controls"]}>
                  {isFiltered ? (
                    <div className={styles["active-filters"]}>
                      {/* 篩選標籤 */}
                      <div className={styles["post-tags"]}>
                        {/* 清除按鈕 */}
                        <button className={styles["filter-button"]} onClick={handleClear}>
                          清除
                        </button>
                        {Array.from(skilltags.entries())
                          .filter(([_, value]) => value) // 篩選出值為 true 的標籤
                          .map(([key]) => (
                            <span key={key} className={styles["post-tagskill"]}>
                              {key}
                            </span>
                          ))}
                        {Array.from(languagetags.entries())
                          .filter(([_, value]) => value)
                          .map(([key]) => (
                            <span key={key} className={styles["post-taglang"]}>
                              {key}
                            </span>
                          ))}
                        {Array.from(leisuretags.entries())
                          .filter(([_, value]) => value)
                          .map(([key]) => (
                            <span key={key} className={styles["post-tagleisure"]}>
                              {key}
                            </span>
                          ))}
                      </div>
                    </div>
                  ) : (
                    // 選擇按鈕
                    <button className={styles["filter-button"]} onClick={toggleOverlay}>
                      選擇
                    </button>
                  )}
                </div>
              </div>
                            <div className={styles["filter-options"]}>
                <label>
                  <input
                    type="radio"
                    name="date"
                    value="newest"
                    checked={order === "newest"}
                    onChange={handleOrderChange}
                  />
                  由近到遠
                </label>
                <label>
                  <input
                    type="radio"
                    name="date"
                    value="oldest"
                    checked={order === "oldest"}
                    onChange={handleOrderChange}
                  />
                  由遠到近
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["post-list"]}>
        {filteredPosts.map((post) => (
          <Post key={post.id} post={post} onClick={handlePostClick} />
        ))}
      </div>

      {isOverlayOpen && (
        <div className={styles["overlay"]} onClick={toggleOverlay}>
          <div
            className={styles["overlay-content"]}
            onClick={(e) => e.stopPropagation()} // 防止點擊內容區關閉
          >
            <form className={styles["filter-form"]} onSubmit={handleSubmit}>
              <h2>篩選條件</h2>

              {/* 第一組問題：依技能搜尋 */}
              <div className={styles["filter-group"]}>
                <h3>依技能搜尋</h3>
                <div className={styles["filter-options-row"]}>
                  {Array.from(skilltags.keys()).map((key) => (
                    <label key={key}>
                      <input type="checkbox" name="skill" value={key} />
                      {key}
                    </label>
                  ))}
                </div>
              </div>

              {/* 第二組問題：依語言搜尋 */}
              <div className={styles["filter-group"]}>
                <h3>依語言搜尋</h3>
                <div className={styles["filter-options-row"]}>
                  {Array.from(languagetags.keys()).map((key) => (
                    <label key={key}>
                      <input type="checkbox" name="language" value={key} />
                      {key}
                    </label>
                  ))}
                </div>
              </div>

              {/* 第三組問題：依休閒搜尋 */}
              <div className={styles["filter-group"]}>
                <h3>依休閒搜尋</h3>
                <div className={styles["filter-options-row"]}>
                  {Array.from(leisuretags.keys()).map((key) => (
                    <label key={key}>
                      <input type="checkbox" name="leisure" value={key} />
                      {key}
                    </label>
                  ))}
                </div>
              </div>

              {/* 提交按鈕 */}
              <div className={styles["button-row"]}>
                <button type="submit" className={styles["submit-button"]}>
                  提交
                </button>
                <button
                  type="button"
                  className={styles["clear-button"]}
                  onClick={handleClear}
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