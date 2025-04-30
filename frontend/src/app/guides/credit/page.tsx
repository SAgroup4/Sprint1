'use client';

import './credit.css';
import { useRouter } from 'next/navigation';

export default function CreditTransferPage() {
  const router = useRouter();

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
            ✨ 學分抵免懶人包 ✨
          </h1>
        </div>

        {/* 內容卡片 */}
        <div className="course-section">
          {/* 抵免懶人包 - 通則 */}
          {/* <h2>📚 學分抵免通則一覽</h2> */}
          <div className="course-section">
          <h2>🧑‍🎓 轉學生抵免怎麼算？</h2>
          <div className="rule-list">
            <ul>
              <li>轉二年級 ➔ 抵免上限＝該系一年級應修總學分。</li>
              <li>轉三年級 ➔ 抵免上限＝該系一、二年級應修總學分。</li>
              <li>曾在本校修習且及格者 ➔ 可另外申請抵免，不受上限限制。</li>
            </ul>
          </div>
          </div>
          <div className="rule-list">

            <h3 className="rule-title">✅ 什麼可以抵免？</h3>
            <ul>
              <li>入學前已修習且及格的科目與學分，可申請抵免！</li>
              <li>需經「系(所)初審」＋「院主管核定」＋「教務處複審」通過。</li>
            </ul>

            <h3 className="rule-title">⏳ 抵免時間注意！</h3>
            <ul>
              <li>只能在「入學當學期」申請！</li>
              <li><strong>開學後一週內截止</strong>，逾期不受理。</li>
              <li>每個人只能申請<strong>一次</strong>。</li>
            </ul>

            <h3 className="rule-title">🚫 不能抵免的情況</h3>
            <ul>
              <li>雙重學籍 ➔ 學分分開計算，不能互抵！</li>
              <li>大學入門、人生哲學、專業倫理等 ➔ 原則上不能抵免，但曾修過且及格者可以。</li>
            </ul>

            <h3 className="rule-title">🔍 審查標準怎麼看？</h3>
            <ul>
              <li>科目名稱、內容相同 ➔ 可抵免</li>
              <li>名稱不同但內容相同 ➔ 可抵免</li>
              <li>性質相近 ➔ 可抵免</li>
              <li>多抵少 ➔ 以「少的學分數」計</li>
              <li>少抵多 ➔ 要補修，不足不能抵</li>
            </ul>

            <h3 className="rule-title">🛡️ 特殊情況 - 軍訓抵免</h3>
            <ul>
              <li>年滿36歲、現役軍人、僑生、外籍生或身心障礙學生，可申請「免修」軍訓課。</li>
            </ul>

        </div>

        {/* 抵免懶人包 - 轉學生規定
        <div className="course-section">
          <h2>🧑‍🎓 轉學生抵免怎麼算？</h2>
          <div className="rule-list">
            <ul>
              <li>轉二年級 ➔ 抵免上限＝該系一年級應修總學分。</li>
              <li>轉三年級 ➔ 抵免上限＝該系一、二年級應修總學分。</li>
              <li>曾在本校修習且及格者 ➔ 可另外申請抵免，不受上限限制。</li>
            </ul>
          </div>
        </div> */}

        
        
        <h2>📝 申請抵免作業</h2>

        {/* 注意事項 */}
        <div className="rule-list">

          <h3 className="rule-title">📢 注意事項</h3>
          <ul>
            <li>每位同學<strong>只能申請一次</strong>！</li>
            <li><strong>申請截止時間：</strong>開學後一週內！逾期不受理！</li>
            <li><strong>體育</strong>：只能抵免至入學前學年（不含入學當學年）。</li>
            <li><strong>軍訓</strong>：可以抵免到入學當年。</li>
            <li>若抵免後學分還不足 ➔ <strong>要補修該科下學期的學分</strong>！</li>
          </ul>

        </div>
        {/* 流程圖說明 */}
        <div style={{ backgroundColor: '#e2e8f0', padding: '24px', borderRadius: '12px', marginTop: '32px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '22px', color: '#1a3e6e' }}>
            🛠️ 抵免作業流程
          </h3>

          <div
            className="flow-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* 第一層 */}
            <div className="flow-item">
              <p>當學年度入學(轉系)，符合抵免規則</p>
            </div>

            {/* 第二層 */}
            <div className="flow-arrow">↓</div>
            <div className="flow-item">
              <p>填寫抵免申請表＋附上歷年成績單正本 ➔ 交至各系(所)/師資培育中心</p>
            </div>

            {/* 分流 */}
            <div className="flow-arrow">↓</div>
            <div className="flow-split" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <div className="flow-split-item">
                <p>各系(所)或師資培育中心初審</p>
              </div>
              <div className="flow-split-item">
                <p>註冊組複審</p>
              </div>
            </div>

            {/* 合流 */}
            <div className="flow-arrow">↓</div>
            <div className="flow-item">
              <p>註冊組維護通過抵免的科目與學分</p>
            </div>

            <div className="flow-arrow">↓</div>
            <div className="flow-item">
              <p>學生於加退選前領回個人抵免結果表</p>
            </div>
          </div>
        </div>

        {/* 下載申請表單 */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <a
            href="/guide/credit-transfer-application.ods"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#3182ce',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
            }}
          >
            下載抵免申請表單
          </a>
          </div>
        </div>

      </div>
    </div>
  );
}
