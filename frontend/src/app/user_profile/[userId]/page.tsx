'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';

export default function UserProfileEdit({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { userId } = params;
  const [formData, setFormData] = useState({
    department: '',
    gender: '',
    skills: [] as string[],
    isTransferStudent: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 從後端拉取使用者資料
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/${userId}/profile`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          alert('無法載入使用者資料');
        }
      } catch (error) {
        console.error('載入資料時發生錯誤:', error);
        alert('伺服器錯誤，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      skills: checked
        ? [...prev.skills, value]
        : prev.skills.filter((skill) => skill !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    try {
      const response = await fetch(`http://localhost:8000/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('資料更新成功！');
        router.push('/general');
      } else {
        const errorData = await response.json();
        alert(`更新失敗：${errorData.detail}`);
      }
    } catch (error) {
      console.error('提交資料時發生錯誤:', error);
      alert('伺服器錯誤，請稍後再試');
    }
  };

  if (loading) {
    return <div>載入中...</div>;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h1 className="form-title">更改個人資料</h1>

        {/* 系級 */}
        <div className="form-group">
          <label htmlFor="department">系所</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="請輸入您的系所"
            required
          />
        </div>

        {/* 性別 */}
        <div className="form-group">
          <label>性別</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="男"
                checked={formData.gender === '男'}
                onChange={handleInputChange}
              />
              <span className="custom-radio"></span>
              男
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="女"
                checked={formData.gender === '女'}
                onChange={handleInputChange}
              />
              <span className="custom-radio"></span>
              女
            </label>
          </div>
        </div>

        {/* 技能標籤 */}
        <div className="form-group">
          <label>技能標籤</label>
          <div className="checkbox-group">
            {['Java', 'Python', '網頁開發', '英文', '日文', '韓文', '其他'].map((skill, index) => (
              <label key={skill} className="checkbox-label" htmlFor={`skill-${index}`}>
                <input
                  type="checkbox"
                  id={`skill-${index}`}
                  value={skill}
                  checked={formData.skills.includes(skill)}
                  onChange={handleCheckboxChange}
                />
                <span className="custom-checkbox"></span>
                {skill}
              </label>
            ))}
          </div>
        </div>

        {/* 是否為轉學生 */}
        <div className="form-group">
          <label>是否為轉學生</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="isTransferStudent"
                value="true"
                checked={formData.isTransferStudent === true}
                onChange={() => setFormData((prev) => ({ ...prev, isTransferStudent: true }))}
              />
              <span className="custom-radio"></span>
              是
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="isTransferStudent"
                value="false"
                checked={formData.isTransferStudent === false}
                onChange={() => setFormData((prev) => ({ ...prev, isTransferStudent: false }))}
              />
              <span className="custom-radio"></span>
              否
            </label>
          </div>
        </div>

        {/* 提交按鈕 */}
        <button type="submit" className="submit-button">
          提交
        </button>
      </form>
    </div>
  );
}