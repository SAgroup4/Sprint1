'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function TransferGuidePage() {
  const router = useRouter();

  return (
    <div style={{ background: '#f0f6ff', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a3e6e', marginBottom: '24px' }}>
          輔大校園地圖
        </h1>

        <Image
          src="/guide/map.png"
          alt="校園地圖"
          width={800}
          height={500}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '12px',
            marginBottom: '40px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        />

        <h2 style={{ fontSize: '24px', color: '#1a3e6e', marginBottom: '20px' }}>
          轉學生必讀指南
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 卡片一：選課懶人包 */}
          <div
            style={{
              backgroundColor: '#d4edda',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
            }}
            onClick={() => router.push('/guides/course')}
          >
            <h3 style={{ fontWeight: 'bold', color: '#155724' }}>選課懶人包</h3>
            <p style={{ color: '#155724', marginTop: '8px' }}>
              以下將會提供選課時程、選課規則以及選課方法，提早做好準備選擇需選的課程吧！
            </p>
          </div>

          {/* 卡片二：學分抵免問題 */}
          <div
            style={{
              backgroundColor: '#fff3cd',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
            }}
            onClick={() => router.push('/guides/credit')}
          >
            <h3 style={{ fontWeight: 'bold', color: '#856404' }}>學分抵免問題</h3>
            <p style={{ color: '#856404', marginTop: '8px' }}>
            將介紹學分抵免的申請時間、相關規定以及申請流程，提前準備好資料，順利完成學分抵免吧！
            </p>
          </div>

          {/* 卡片三：各類校園活動 */}
          <div
            style={{
              backgroundColor: '#f8d7da',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
            }}
            onClick={() => router.push('/guides/events')}
          >
            <h3 style={{ fontWeight: 'bold', color: '#721c24' }}>各類校園活動</h3>
            <p style={{ color: '#721c24', marginTop: '8px' }}>
              以下將會介紹各類校園活動的時間、參與方式以及注意事項，提前規劃行程，盡情享受精彩的校園生活吧！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}