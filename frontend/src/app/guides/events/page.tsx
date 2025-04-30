'use client';

import './events.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CampusEventsPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    '/events/event1.jpg',
    '/events/event2.jpg',
    '/events/event3.jpg',
    '/events/event4.jpg',
    '/events/event5.jpg',
  ];

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="transfer-page">
      <div className="transfer-container">

        {/* 返回上一頁 */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px' }}>
          <button
            onClick={() => router.back()}
            style={{
              backgroundColor: '#1a3e6e',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              position: 'absolute',
              left: 0,
            }}
          >
            ◀ 返回上一頁
          </button>
          <h1 style={{
            margin: '0 auto',
            padding: '8px 16px',
            backgroundColor: '#e2e8f0',
            borderRadius: '8px',
            color: '#1a3e6e',
            fontSize: '28px',
            fontWeight: 'bold',
          }}>
            🎉 各類校園活動懶人包
          </h1>
        </div>

        {/* 校際活動區塊 */}
        <div className="course-section">
          <h2>🏫 校級大型活動</h2>
          <div className="rule-list">
            <h3 className="rule-title">🎪 輔大校慶園遊會</h3>
            <ul>
              <li><strong>時間：</strong>12月</li>
              <li><strong>地點：</strong>中美堂周圍、風華廣場、閃光大道等</li>
              <li><strong>內容：</strong>社團攤位、二手市集、校慶周邊販售、校慶演唱會（校外藝人表演）</li>
            </ul>

            <h3 className="rule-title">🎤 社團迎新博覽會</h3>
            <ul>
              <li><strong>時間：</strong>學期初（9~10月）</li>
              <li><strong>地點：</strong>風華廣場</li>
              <li><strong>內容：</strong>社團介紹、特色表演，為期一週</li>
            </ul>

            <h3 className="rule-title">🎄 耶誕晚會演唱會</h3>
            <ul>
              <li><strong>時間：</strong>12月</li>
              <li><strong>地點：</strong>中美堂</li>
              <li><strong>內容：</strong>校外藝人演唱會</li>
            </ul>

            <h3 className="rule-title">🏃 校慶運動會</h3>
            <ul>
              <li><strong>時間：</strong>校慶期間</li>
              <li><strong>地點：</strong>各大體育場地</li>
              <li><strong>內容：</strong>田徑、大隊接力、拔河競賽，促進師生情感與社區互動</li>
            </ul>

            <h3 className="rule-title">✨ 耶誕祈福晚會</h3>
            <ul>
              <li><strong>活動：</strong>聖誕裝飾、聖誕市集、大聖誕樹點燈（第二圓環）</li>
            </ul>

            <h3 className="rule-title">🗳️ 五月選舉月</h3>
            <ul>
              <li><strong>時間：</strong>5月</li>
              <li><strong>內容：</strong>學生會長、學生議員、班代、院代、社團負責人大選，學習民主精神</li>
            </ul>
          </div>
        </div>

        {/* 校園活動圖片輪播 */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a3e6e', marginBottom: '20px' }}>
            📸 校園活動照片
          </h2>
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <img
              src={images[currentIndex]}
              alt="校園活動"
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
            />
            {/* 左箭頭 */}
            <button
              onClick={goToPrev}
              style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                backgroundColor: '#1a3e6e',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
              }}
            >
              ◀
            </button>
            {/* 右箭頭 */}
            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                backgroundColor: '#1a3e6e',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
              }}
            >
              ▶
            </button>
          </div>
        </div>

        {/* 系級活動區塊 */}
        <div className="course-section" style={{ marginTop: '60px' }}>
          <h2>🏢 系級特色活動</h2>
          <div className="rule-list">
            <h3 className="rule-title">🏀 系隊活動</h3>
            <ul>
              <li>各系有自己的籃球、排球、羽球隊，提供興趣交流與代表系上參賽機會。</li>
            </ul>

            <h3 className="rule-title">👨‍🎓 系學會經營</h3>
            <ul>
              <li>大二或大三由同班同學接管，負責舉辦系上各種活動。</li>
            </ul>

            <h3 className="rule-title">🎉 系上特色活動</h3>
            <ul>
              <li>系烤、宿營、制服日等活動，增進同學感情。</li>
            </ul>

            <h3 className="rule-title">🤝 地方友會</h3>
            <ul>
              <li>如北友會、雄友會、竹友會等，同地區學生聚會交流。</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
