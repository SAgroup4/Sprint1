'use client'; // 設為 Client Component，確保可以使用交互

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './styles.css';
import { BiAlignLeft } from "react-icons/bi";

/**
 * Sidebar 組件 - 網站左側導航欄
 * 
 * 功能：
 * 1. 顯示討論區分類列表
 * 2. 提供分類導航功能
 * 3. 顯示學校相關網站連結
 */
const Sidebar: React.FC = () => {
  /**
   * 討論區分類數據
   */
  const categories = [
    { id: 'general', title: '一般討論區' },
    {
      id: 'transfer',
      title: '轉學生討論區',
      children: [
        { id: 'guides', title: '轉學生指南' },
        { id: 'transfer', title: '轉學生討論區' },
      ],
    },
    { id: 'professional', title: '技能交換區' },
    { id: 'language', title: '外籍語言交換區' },
  ];

  /**
   * 學校相關網站數據
   */
  const schoolLinks = [
    { title: '學生資訊入口網', url: 'https://portal.fju.edu.tw' },
    { title: '學生資訊平台', url: 'https://student.fju.edu.tw' },
    { title: '輔仁大學行事曆', url: 'https://calendar.fju.edu.tw' },
    { title: '輔仁大學圖書館', url: 'https://www.lib.fju.edu.tw' },
    { title: '輔大全球資訊網', url: 'https://www.fju.edu.tw' },
  ];

  const router = useRouter();
  const pathname = usePathname();

  // 狀態：控制「轉學生討論區」的展開/收起
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/${categoryId}`);
  };

  const isActive = (categoryId: string) => {
    return pathname === `/${categoryId}` || 
           (pathname === '/' && categoryId === 'general');
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <h4 className="sidebar-title">討論區分類</h4>
        <ul className="category-list">
          {categories.map((category) => (
            <li
              key={category.id}
              className="category-item"
              onMouseEnter={() => category.id === 'transfer' && setIsTransferOpen(true)}
              onMouseLeave={() => category.id === 'transfer' && setIsTransferOpen(false)}
            >
              {category.children ? (
                <>
                  <button className="category-button">
                    {category.title} {isTransferOpen ? '▲' : '▼'}
                  </button>
                  <ul
                    className={`subcategory-list ${
                      isTransferOpen ? 'open' : 'closed'
                    }`}
                  >
                    {category.children.map((child) => (
                      <li key={child.id} className="subcategory-item">
                        <button
                          onClick={() => handleCategoryClick(child.id)}
                          className={`subcategory-button ${isActive(child.id) ? 'active' : ''}`}
                        >
                          {child.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`category-button ${isActive(category.id) ? 'active' : ''}`}
                >
                  {category.title}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
