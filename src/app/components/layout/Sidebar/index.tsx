'use client'; // 設為 Client Component，確保可以使用交互

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './styles.css';

/**
 * 討論區分類類型
 */
interface Category {
  id: string;
  title: string;
}

/**
 * Sidebar 組件 - 網站左側導航欄
 * 
 * 功能：
 * 1. 顯示討論區分類列表
 * 2. 提供分類導航功能
 */
const Sidebar: React.FC = () => {
  // 討論區分類數據
  const categories: Category[] = [
    { id: 'general', title: '一般討論區' },
    { id: 'transfer', title: '轉學生討論區' },
    { id: 'professional', title: '專業討論群組' },
    { id: 'language', title: '語言交換區' }
  ];

  // 使用 Next.js 的路由
  const router = useRouter();
  const pathname = usePathname();

  // 處理分類點擊事件
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/${categoryId}`); // 改為 `/forum/${categoryId}`
  };

  // 判斷當前分類是否為活動狀態
  const isActive = (categoryId: string) => {
    return pathname === `/${categoryId}` || 
           (pathname === '/' && categoryId === 'general');
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <h2 className="sidebar-title">討論區分類</h2>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.id} className="category-item">
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`category-button ${isActive(category.id) ? 'active' : ''}`}
              >
                {category.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
