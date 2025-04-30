"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react"; // 引入 React.use()
import "./styles.css";

export default function UserProfileForm({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const router = useRouter();
  const { userId } = use(params); // 使用 React.use() 解包 params
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    gender: "",
    grade: "",
    skills: [] as string[],
    languages: [] as string[],
    isTransferStudent: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "skills" | "languages"
  ) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], value]
        : prev[type].filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    try {
      const response = await fetch(
        `http://localhost:8000/users/${userId}/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("資料更新成功！");
        router.push("/general");
      } else {
        const errorData = await response.json();
        alert(`更新失敗：${errorData.detail}`);
      }
    } catch (error) {
      console.error("提交資料時發生錯誤:", error);
      alert("伺服器錯誤，請稍後再試");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h1 className="form-title">填寫個人資料</h1>
        <div className="double-columns">
          <div>
            <div className="profile-header">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7Gi3Gu0z0-qZiLSPXSl9Wi6nAMRVQMZHrbg&s"
                alt="頭像"
                className="profile-image"
              />
              <h2 className="profile-id">{userId || "載入中..."}</h2>
            </div>
            <br />
            <div className="form-group">
              <label htmlFor="name">暱稱</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="請輸入您的暱稱"
                required
              />
            </div>

            <div className="form-group form-group-select">
              <label htmlFor="department">系所</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  請選擇您的系所
                </option>
                {[
                  "中國文學系",
                  "歷史學系",
                  "哲學系",
                  "音樂學系",
                  "應用美術學系",
                  "景觀設計學系",
                  "藝術與文化創意學士學位學程",
                  "影像傳播學系",
                  "新聞傳播學系",
                  "廣告傳播學系",
                  "大眾傳播學士學位學程",
                  "體育學系",
                  "圖書資訊學系",
                  "教育領導與科技發展學士學位學程",
                  "運動休閒管理學士學位學程",
                  "醫學系",
                  "護理學系",
                  "公共衛生學系",
                  "臨床心理學系",
                  "職能治療學系",
                  "呼吸治療學系",
                  "數學系",
                  "物理學系",
                  "化學系",
                  "生命科學系",
                  "資訊工程學系",
                  "電機工程學系",
                  "醫學資訊與創新應用學士學位學程",
                  "軟體工程與數位創意學士學位學程",
                  "英國語文學系",
                  "德語語文學系",
                  "法國語文學系",
                  "西班牙語文學系",
                  "日本語文學系",
                  "義大利語文學系",
                  "兒童與家庭學系",
                  "餐旅管理學系",
                  "食品科學系",
                  "營養科學系",
                  "法律學系",
                  "財經法律學系",
                  "社會學系",
                  "社會工作學系",
                  "經濟學系",
                  "宗教學系",
                  "心理學系",
                  "企業管理學系",
                  "會計學系",
                  "統計資訊學系",
                  "金融與國際企業學系",
                  "資訊管理學系",
                  "商業管理學士學位學程",
                  "織品服裝學系",
                ].map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>年級</label>
              <div className="grade-group">
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    請選擇您的年級
                  </option>
                  {[
                    "大一",
                    "大二",
                    "大三",
                    "大四",
                    "大五及以上",
                    "碩一",
                    "碩二",
                    "碩三及以上",
                    "博士班",
                  ].map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>性別</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="男"
                    checked={formData.gender === "男"}
                    onChange={handleInputChange}
                  />
                  <span className="custom-radio"></span>男
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="女"
                    checked={formData.gender === "女"}
                    onChange={handleInputChange}
                  />
                  <span className="custom-radio"></span>女
                </label>
              </div>
            </div>
          </div>
          <div>
            <div className="form-group">
              <label>你掌握那些技能呢？</label>
              <div className="checkbox-group">
                {["Java", "Python", "網頁開發", "其他程式語言"].map(
                  (skill, index) => (
                    <label
                      key={`skill-${index}`}
                      className="checkbox-label"
                      htmlFor={`skill-${index}`}
                    >
                      <input
                        type="checkbox"
                        id={`skill-${index}`}
                        value={skill}
                        checked={formData.skills.includes(skill)}
                        onChange={(e) => handleCheckboxChange(e, "skills")}
                      />
                      <span className="custom-checkbox"></span>
                      {skill}
                    </label>
                  )
                )}
              </div>
            </div>
            <div className="form-group">
              <label>你掌握那些語言呢？</label>
              <div className="checkbox-group">
                {["英文", "日文", "韓文", "其他語言"].map((language, index) => (
                  <label
                    key={`language-${index}`}
                    className="checkbox-label"
                    htmlFor={`language-${index}`}
                  >
                    <input
                      type="checkbox"
                      id={`language-${index}`}
                      value={language}
                      checked={formData.languages?.includes(language)}
                      onChange={(e) => handleCheckboxChange(e, "languages")}
                    />
                    <span className="custom-checkbox"></span>
                    {language}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>是否為轉學生</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="isTransferStudent"
                    value="true"
                    checked={formData.isTransferStudent === true}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isTransferStudent: true,
                      }))
                    }
                  />
                  <span className="custom-radio"></span>是
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="isTransferStudent"
                    value="false"
                    checked={formData.isTransferStudent === false}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isTransferStudent: false,
                      }))
                    }
                  />
                  <span className="custom-radio"></span>否
                </label>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="submit-button">
          提交
        </button>
      </form>
    </div>
  );
}
