'use client';

import './course.css';
import { useRouter } from 'next/navigation';

export default function TransferGuidePage() {
  const router = useRouter();

  return (
    <div className="transfer-page"> {/* 外層只保留背景色，不加padding */}
      <div className="transfer-container"> {/* 統一padding放在這層 */}
        
        {/* 返回上一頁按鈕 + 標題區塊 */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px' }}>
          
          {/* 返回按鈕靠左 */}
          <button
            onClick={() => router.back()}
            style={{
              backgroundColor: '#1a3e6e',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              position: 'absolute', // 定位在左邊
              left: 0,
            }}
          >
            ◀ 返回上一頁
          </button>

          {/* 標題置中，新增底色 */}
        <h1 
          className="transfer-title"
          style={{
            margin: '0 auto',
            padding: '8px 16px',
            backgroundColor: '#e2e8f0', // ← 這是淡藍灰色底
            borderRadius: '8px',
            color: '#1a3e6e',
            fontSize: '32px',
            fontWeight: 'bold',
          }}
        >
          🎓 轉學生選課懶人包 🎓
        </h1>

        </div>

        {/* 區塊三：課程類型區分 */}
        <div className="course-section">
          <h2>必修、選修、全人課程怎麼分？</h2>
          <p>了解不同課程類型的差異與選課注意事項</p>

          <div style={{ overflowX: 'auto' }}>
            <table className="course-table">
              <thead>
                <tr>
                  <th>類型</th>
                  <th>說明</th>
                  <th>注意事項</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>必修課程</td>
                  <td>系上規定必修，會自動帶入課程表中</td>
                  <td>可自行選擇是否加退選</td>
                </tr>
                <tr>
                  <td>選修課程</td>
                  <td>自由選修，除原系外也可修習外系選修</td>
                  <td>需注意各系外系選修上限規定</td>
                </tr>
                <tr>
                  <td>全人課程</td>
                  <td>包含通識、二外、體育、核心課程</td>
                  <td>需在全人選課系統由志願排序抽選</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 下面各細項 */}
          <div className="course-detail">
            <div className="course-column">
              <h3>全人選課類別：</h3>
              <ul>
                <li><strong>全人核心課程：</strong>大學入門、人生哲學、專業倫理、體育</li>
                <li><strong>基本能力課程：</strong>國文、外國語文、資訊素養</li>
                <li><strong>通識涵養課程：</strong>人文與藝術、自然與科技、社會科學等三領域</li>
              </ul>
            </div>
          </div>

          <div className="course-detail">
            <div className="course-column">
              <br />
              <h3>體育 (0學分，需修滿四學期)</h3>
              <ul>
                <li><strong>大一體育：</strong>須明確選擇大一體育課程</li>
                <li><strong>大二體育(含以上)：</strong>學期課，上下學期都要選</li>
              </ul>
            </div>
          </div>

          <div className="course-detail">
            <div className="course-column">
              <br />  
              <h3>外語 (8學分)</h3>
              <ul>
                <li><strong>大一英語(4)：</strong>可詢問系秘是否抵免原校英文課程</li>
                <li><strong>大二外語(含以上)(4)：</strong>可選英文(學期課)或非英文(學年課)，外語學院要避開自己的主修</li>
              </ul>
            </div>
          </div>

          <div className="course-detail">
            <div className="course-column">
              <br />
              <h3>通識 (12學分)</h3>
              <ul>
                <li><strong>人文藝術(4)：</strong>需修習4學分</li>
                <li><strong>社會科學(4)：</strong>需修習4學分</li>
                <li><strong>自然科學(4)：</strong>需修習4學分</li>
              </ul>
            </div>
          </div>

        </div> {/* 課程區塊結束 */}

        {/* 區塊四：選課時程 */}
        <div className="course-section">
        {/* <h2>🎯 選課時程提醒</h2> */}

        {/* 小標題＋說明 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a3e6e', marginBottom: '12px' }}>
          🎯 選課時程提醒
          </h3>
        </div>

        {/* 選課時間提醒卡片 */}
        <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px', color: '#1a3e6e' }}>113-2學期選課時程表</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0, color: '#4a5568', fontSize: '15px', lineHeight: '1.8' }}>
            <li style={{ marginBottom: '10px' }}>
              <span style={{
                backgroundColor: '#bbf7d0',
                color: '#166534',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '9999px',
                marginRight: '8px',
              }}>
                全人選填
              </span>
              01月16日 09:00 - 01月20日 12:00（通識/大二體育/大二英文課程志願選填）
            </li>
            <li style={{ marginBottom: '10px' }}>
              <span style={{
                backgroundColor: '#bfdbfe',
                color: '#1e3a8a',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '9999px',
                marginRight: '8px',
              }}>
                全人分發
              </span>
              01月21日 09:00 （選課分發結果，請查閱選課清單）
            </li>
            <li style={{ marginBottom: '10px' }}>
              <span style={{
                backgroundColor: '#FFCCCC',
                color: '#580095',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '9999px',
                marginRight: '8px',
              }}>
                網路初選
              </span>
              02月05日 09:00 - 02月13日 12:00 （選擇選修、必修）
            </li>
            <li style={{ marginBottom: '10px' }}>
              <span style={{
                backgroundColor: '#fde68a',
                color: '#78350f',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '9999px',
                marginRight: '8px',
              }}>
                加退選課
              </span>
              02月17日 09:00 - 02月24日 17:00（開學後加退選）
            </li>
            <p>※第一週(2/17-2/22)領取全人課程選課條者，應登入全人選課條系統輸入授權碼，逾期作廢。</p>
          </ul>
 
        </div>

        {/* 登入說明卡片 */}
        <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '12px' }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '12px', color: '#1a3e6e' }}>相關連結</h3>
        <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.8' }}>
          全人選課系統：
          <a 
            href="http://wishcourse.fju.edu.tw/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#3182ce', textDecoration: 'underline' }}
          >
            http://wishcourse.fju.edu.tw/
          </a>
          <br />
          網路初選系統：
          <a 
            href="https://signcourse.fju.edu.tw/User/Redirect" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#3182ce', textDecoration: 'underline' }}
          >
            https://signcourse.fju.edu.tw/User/Redirect
          </a>
        </p>
      </div>

        {/* <a
            href="https://ecourse.example.edu"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '16px',
              padding: '12px 24px',
              backgroundColor: '#3182ce',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
            }}
          >
            前往選課系統
          </a> */}
      </div>

      </div> {/* container 結束 */}
    </div> 
  );
}
