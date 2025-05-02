//第一版
// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import "./topost.css";

// export default function ToPostPage() {
//   const router = useRouter();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [isTransfer, setIsTransfer] = useState(false);

//   const [skilltags, setSkilltags] = useState<Record<string, boolean>>({
//     Java: false,
//     Python: false,
//     "網頁開發": false,
//     "其他程式語言": false,
//   });

//   const [languagetags, setLanguagetags] = useState<Record<string, boolean>>({
//     英文: false,
//     日文: false,
//     韓文: false,
//     其他語言: false,
//   });

//   const [leisuretags, setLeisuretags] = useState<Record<string, boolean>>({
//     閒聊: false,
//     吃飯: false,
//     桌球: false,
//     跑步: false,
//     其他: false,
//   });

//   const [userId, setUserId] = useState("");
//   const [userName, setUserName] = useState("");

//   useEffect(() => {
//     const id = localStorage.getItem("userId");
//     const name = localStorage.getItem("userName");
  
//     console.log("從 localStorage 取得：", id, name); // ✅ 除錯用
  
//     if (id) setUserId(id);
//     if (name) setUserName(name);
//   }, []);
  

//   const handleCheckboxChange = (
//     tagType: "skilltags" | "languagetags" | "leisuretags",
//     tag: string
//   ) => {
//     if (tagType === "skilltags") {
//       setSkilltags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     } else if (tagType === "languagetags") {
//       setLanguagetags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     } else if (tagType === "leisuretags") {
//       setLeisuretags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     }
//   };

//   const handleSubmit = async () => {
//     const confirm = window.confirm("是否確認發文？");
//     if (!confirm) return;

//     const data = {
//       title,
//       content,
//       user_id: userId,
//       name: userName,
//       skilltags,
//       languagetags,
//       leisuretags,
//       trans: isTransfer,
//     };

//     try {
//       const res = await fetch("http://localhost:8000/posts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await res.json();
//       if (res.ok) {
//         alert("發文成功！");
//         router.push("/general");
//       } else {
//         alert("發文失敗：" + result.detail);
//       }
//     } catch (err) {
//       console.error("發文錯誤：", err);
//       alert("發文過程發生錯誤");
//     }
//   };

//   return (
//     <div className="post-container">
//       <input
//         className="post-input"
//         placeholder="輸入文章標題……"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <textarea
//         className="post-textarea"
//         placeholder="輸入文章內容……"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       />

//       <div className="form-group">
//         <label>你掌握那些技能呢？</label>
//         <div className="checkbox-group">
//           {Object.entries(skilltags).map(([skill, checked], index) => (
//             <label
//               key={`skill-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`skill-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`skill-${index}`}
//                 value={skill}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("skilltags", skill)}
//               />
//               {skill}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//         <label>你掌握那些語言呢？</label>
//         <div className="checkbox-group">
//           {Object.entries(languagetags).map(([lang, checked], index) => (
//             <label
//               key={`lang-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`lang-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`lang-${index}`}
//                 value={lang}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("languagetags", lang)}
//               />
//               {lang}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//         <label>你喜歡那些休閒活動呢？</label>
//         <div className="checkbox-group">
//           {Object.entries(leisuretags).map(([tag, checked], index) => (
//             <label
//               key={`leisure-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`leisure-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`leisure-${index}`}
//                 value={tag}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("leisuretags", tag)}
//               />
//               {tag}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//         <label>是否為轉學生</label>
//         <div className="checkbox-group">
//           {['是', '否'].map((label, idx) => (
//             <label
//               key={`trans-${idx}`}
//               className={`checkbox-label ${isTransfer === (label === '是') ? 'checked' : ''}`}
//             >
//               <input
//                 type="radio"
//                 name="isTransfer"
//                 value={label}
//                 checked={isTransfer === (label === '是')}
//                 onChange={() => setIsTransfer(label === '是')}
//               />
//               {label}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="submit-button-wrapper">
//         <button className="submit-button" onClick={handleSubmit}>
//           發布貼文 ✓
//         </button>
//       </div>
//     </div>
//   );
// }


///第二版
// "use client";

// import "./topost.css"; 
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import { db } from "@/firebase";
// import { doc, getDoc } from "firebase/firestore";

// export default function ToPostPage() {
//   const router = useRouter();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [isTransfer, setIsTransfer] = useState(false);

//   const [skilltags, setSkilltags] = useState<Record<string, boolean>>({
//     Java: false,
//     Python: false,
//     "網頁開發": false,
//     "其他程式語言": false,
//   });

//   const [languagetags, setLanguagetags] = useState<Record<string, boolean>>({
//     英文: false,
//     日文: false,
//     韓文: false,
//     其他語言: false,
//   });

//   const [leisuretags, setLeisuretags] = useState<Record<string, boolean>>({
//     閒聊: false,
//     吃飯: false,
//     桌球: false,
//     跑步: false,
//     其他: false,
//   });

//   const [userId, setUserId] = useState("");
//   const [userName, setUserName] = useState("");

//   // ✅ 從 Firebase users/{userId} 撈取 name
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const email = localStorage.getItem("userEmail");
//       if (!email) return;

//       const id = email.split("@")[0];
//       setUserId(id);

//       try {
//         const userDoc = await getDoc(doc(db, "users", id));
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           setUserName(userData.name || "匿名");
//         } else {
//           setUserName("匿名");
//         }
//       } catch (err) {
//         console.error("讀取使用者名稱失敗", err);
//         setUserName("匿名");
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleCheckboxChange = (
//     tagType: "skilltags" | "languagetags" | "leisuretags",
//     tag: string
//   ) => {
//     if (tagType === "skilltags") {
//       setSkilltags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     } else if (tagType === "languagetags") {
//       setLanguagetags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     } else if (tagType === "leisuretags") {
//       setLeisuretags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     }
//   };

//   const handleSubmit = async () => {
//     const confirm = window.confirm("是否確認發文？");
//     if (!confirm) return;

//     const data = {
//       title,
//       content,
//       user_id: userId,
//       name: userName,
//       skilltags,
//       languagetags,
//       leisuretags,
//       trans: isTransfer,
//     };

//     try {
//       await fetch("http://localhost:8000/posts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       router.push("/general");
//     } catch (err) {
//       console.error("發文錯誤：", err);
//       router.push("/general");
//     }
//   };

//   return (
//     <div className="post-container">
//         <h2>🔸發布貼文</h2>
//       <input
//         className="post-input"
//         placeholder="輸入文章標題……"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <textarea
//         className="post-textarea"
//         placeholder="輸入文章內容……"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       />

//       <div className="form-group">
//       <label className="skill-label">技能標籤</label>
//         <div className="checkbox-group">
//           {Object.entries(skilltags).map(([skill, checked], index) => (
//             <label
//               key={`skill-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`skill-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`skill-${index}`}
//                 value={skill}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("skilltags", skill)}
//               />
//               {skill}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//       <label className="skill-label">語言標籤</label>
//         <div className="checkbox-group">
//           {Object.entries(languagetags).map(([lang, checked], index) => (
//             <label
//               key={`lang-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`lang-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`lang-${index}`}
//                 value={lang}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("languagetags", lang)}
//               />
//               {lang}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//       <label className="skill-label">休閒標籤</label>
//         <div className="checkbox-group">
//           {Object.entries(leisuretags).map(([tag, checked], index) => (
//             <label
//               key={`leisure-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`leisure-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`leisure-${index}`}
//                 value={tag}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("leisuretags", tag)}
//               />
//               {tag}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//       <label className="skill-label">是否為轉學生</label>
//         <div className="checkbox-group">
//           {['是', '否'].map((label, idx) => (
//             <label
//               key={`trans-${idx}`}
//               className={`checkbox-label ${isTransfer === (label === '是') ? 'checked' : ''}`}
//             >
//               <input
//                 type="radio"
//                 name="isTransfer"
//                 value={label}
//                 checked={isTransfer === (label === '是')}
//                 onChange={() => setIsTransfer(label === '是')}
//               />
//               {label}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="submit-button-wrapper">
//         <button className="submit-button" onClick={handleSubmit}>
//           確認發布
//         </button>
//       </div>
//     </div>
//   );
// }



// //第三版(未完成)
// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import "./topost.css";
// import { db } from "@/firebase";
// import { doc, getDoc } from "firebase/firestore";

// export default function ToPostPage() {
//   const [mounted, setMounted] = useState(false);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [isTransfer, setIsTransfer] = useState(false);
//   const [skilltags, setSkilltags] = useState<Record<string, boolean>>({
//     Java: false,
//     Python: false,
//     "網頁開發": false,
//     "其他程式語言": false,
//   });
//   const [languagetags, setLanguagetags] = useState<Record<string, boolean>>({
//     英文: false,
//     日文: false,
//     韓文: false,
//     其他語言: false,
//   });
//   const [leisuretags, setLeisuretags] = useState<Record<string, boolean>>({
//     閒聊: false,
//     吃飯: false,
//     桌球: false,
//     跑步: false,
//     其他: false,
//   });
//   const [userId, setUserId] = useState("");
//   const [userName, setUserName] = useState("");

//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const email = localStorage.getItem("userEmail");
//       if (!email) return;
//       const id = email.split("@")[0];
//       setUserId(id);
//       try {
//         const userDoc = await getDoc(doc(db, "users", id));
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           setUserName(userData.name || "匿名");
//         } else {
//           setUserName("匿名");
//         }
//       } catch (err) {
//         console.error("讀取使用者名稱失敗", err);
//         setUserName("匿名");
//       }
//     };
//     fetchUserData();
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   const handleCheckboxChange = (
//     tagType: "skilltags" | "languagetags" | "leisuretags",
//     tag: string
//   ) => {
//     if (tagType === "skilltags") {
//       setSkilltags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     } else if (tagType === "languagetags") {
//       setLanguagetags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     } else if (tagType === "leisuretags") {
//       setLeisuretags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     }
//   };

//   const handleSubmit = async () => {
//     const confirm = window.confirm("是否確認發文？");
//     if (!confirm) return;

//     const data = {
//       title,
//       content,
//       user_id: userId,
//       name: userName,
//       skilltags,
//       languagetags,
//       leisuretags,
//       trans: isTransfer,
//     };

//     try {
//       await fetch("http://localhost:8000/posts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       router.push("/general");
//     } catch (err) {
//       console.error("發文錯誤：", err);
//       router.push("/general");
//     }
//   };

//   return (
//     <div className="post-container">
//       <input
//         className="post-input"
//         placeholder="輸入文章標題……"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <textarea
//         className="post-textarea"
//         placeholder="輸入文章內容……"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       />

//       <div className="form-group">
//         <label>相關技能標籤</label>
//         <div className="checkbox-group">
//           {Object.entries(skilltags).map(([skill, checked], index) => (
//             <label
//               key={`skill-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`skill-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`skill-${index}`}
//                 value={skill}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("skilltags", skill)}
//               />
//               {skill}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//         <label>相關語言標籤</label>
//         <div className="checkbox-group">
//           {Object.entries(languagetags).map(([lang, checked], index) => (
//             <label
//               key={`lang-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`lang-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`lang-${index}`}
//                 value={lang}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("languagetags", lang)}
//               />
//               {lang}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//         <label>相關休閒標籤</label>
//         <div className="checkbox-group">
//           {Object.entries(leisuretags).map(([tag, checked], index) => (
//             <label
//               key={`leisure-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`leisure-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`leisure-${index}`}
//                 value={tag}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("leisuretags", tag)}
//               />
//               {tag}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//         <label>是否為轉學生</label>
//         <div className="checkbox-group">
//           {["是", "否"].map((label, idx) => (
//             <label
//               key={`trans-${idx}`}
//               className={`checkbox-label ${isTransfer === (label === "是") ? "checked" : ""}`}
//             >
//               <input
//                 type="radio"
//                 name="isTransfer"
//                 value={label}
//                 checked={isTransfer === (label === "是")}
//                 onChange={() => setIsTransfer(label === "是")}
//               />
//               {label}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="submit-button-wrapper">
//         <button className="submit-button" onClick={handleSubmit}>
//           發布貼文 ✓
//         </button>
//       </div>
//     </div>
//   );
// }


// //第四版(未完成)
// "use client";

// import "./topost.css"; 
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import { db } from "@/firebase";
// import { doc, getDoc } from "firebase/firestore";

// export default function ToPostPage() {
//   const router = useRouter();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [isTransfer, setIsTransfer] = useState(false);

//   const [skilltags, setSkilltags] = useState<Record<string, boolean>>({
//     Java: false,
//     Python: false,
//     "網頁開發": false,
//     "其他程式語言": false,
//   });

//   const [languagetags, setLanguagetags] = useState<Record<string, boolean>>({
//     英文: false,
//     日文: false,
//     韓文: false,
//     其他語言: false,
//   });

//   const [leisuretags, setLeisuretags] = useState<Record<string, boolean>>({
//     閒聊: false,
//     吃飯: false,
//     桌球: false,
//     跑步: false,
//     其他: false,
//   });

//   const [userId, setUserId] = useState("");
//   const [userName, setUserName] = useState("");

//   // ✅ 從 Firebase users/{userId} 撈取 name
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const email = localStorage.getItem("userEmail");
//       if (!email) return;

//       const id = email.split("@")[0];
//       setUserId(id);

//       try {
//         const userDoc = await getDoc(doc(db, "users", id));
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           setUserName(userData.name || "匿名");
//         } else {
//           setUserName("匿名");
//         }
//       } catch (err) {
//         console.error("讀取使用者名稱失敗", err);
//         setUserName("匿名");
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleCheckboxChange = (
//     tagType: "skilltags" | "languagetags" | "leisuretags",
//     tag: string
//   ) => {
//     if (tagType === "skilltags") {
//       setSkilltags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     } else if (tagType === "languagetags") {
//       setLanguagetags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     } else if (tagType === "leisuretags") {
//       setLeisuretags((prev) => ({ ...prev, [tag]: !prev[tag] }));
//     }
//   };

//   const handleSubmit = async () => {
//     const confirm = window.confirm("是否確認發文？");
//     if (!confirm) return;

//     const data = {
//       title,
//       content,
//       user_id: userId,
//       name: userName,
//       skilltags,
//       languagetags,
//       leisuretags,
//       trans: isTransfer,
//     };

//     try {
//       await fetch("http://localhost:8000/posts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       router.push("/general");
//     } catch (err) {
//       console.error("發文錯誤：", err);
//       router.push("/general");
//     }
//   };

//   return (
//     <div className="post-container">
//         <h2>🔸發布貼文</h2>
//       <input
//         className="post-input"
//         placeholder="輸入文章標題……"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <textarea
//         className="post-textarea"
//         placeholder="輸入文章內容……"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       />

//       <div className="form-group">
//       <label className="skill-label">技能標籤</label>
//         <div className="checkbox-group">
//           {Object.entries(skilltags).map(([skill, checked], index) => (
//             <label
//               key={`skill-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`skill-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`skill-${index}`}
//                 value={skill}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("skilltags", skill)}
//               />
//               {skill}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//       <label className="skill-label">語言標籤</label>
//         <div className="checkbox-group">
//           {Object.entries(languagetags).map(([lang, checked], index) => (
//             <label
//               key={`lang-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`lang-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`lang-${index}`}
//                 value={lang}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("languagetags", lang)}
//               />
//               {lang}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//       <label className="skill-label">休閒標籤</label>
//         <div className="checkbox-group">
//           {Object.entries(leisuretags).map(([tag, checked], index) => (
//             <label
//               key={`leisure-${index}`}
//               className={`checkbox-label ${checked ? "checked" : ""}`}
//               htmlFor={`leisure-${index}`}
//             >
//               <input
//                 type="checkbox"
//                 id={`leisure-${index}`}
//                 value={tag}
//                 checked={checked}
//                 onChange={() => handleCheckboxChange("leisuretags", tag)}
//               />
//               {tag}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="form-group">
//       <label className="skill-label">是否為轉學生</label>
//         <div className="checkbox-group">
//           {['是', '否'].map((label, idx) => (
//             <label
//               key={`trans-${idx}`}
//               className={`checkbox-label ${isTransfer === (label === '是') ? 'checked' : ''}`}
//             >
//               <input
//                 type="radio"
//                 name="isTransfer"
//                 value={label}
//                 checked={isTransfer === (label === '是')}
//                 onChange={() => setIsTransfer(label === '是')}
//               />
//               {label}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="submit-button-wrapper">
//         <button className="submit-button" onClick={handleSubmit}>
//           確認發布
//         </button>
//       </div>
//     </div>
//   );
// }


//第五版(未完成)
"use client";

import "./topost.css"; 
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ToPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isTransfer, setIsTransfer] = useState(false);

  const [skilltags, setSkilltags] = useState<Record<string, boolean>>({
    Java: false,
    Python: false,
    "網頁開發": false,
    "其他程式語言": false,
  });

  const [languagetags, setLanguagetags] = useState<Record<string, boolean>>({
    英文: false,
    日文: false,
    韓文: false,
    其他語言: false,
  });

  const [leisuretags, setLeisuretags] = useState<Record<string, boolean>>({
    閒聊: false,
    吃飯: false,
    桌球: false,
    跑步: false,
    其他: false,
  });

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  // ✅ 從 Firebase users/{userId} 撈取 name
  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) return;

      const id = email.split("@")[0];
      setUserId(id);

      try {
        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || "匿名");
        } else {
          setUserName("匿名");
        }
      } catch (err) {
        console.error("讀取使用者名稱失敗", err);
        setUserName("匿名");
      }
    };

    fetchUserData();
  }, []);

  const handleCheckboxChange = (
    tagType: "skilltags" | "languagetags" | "leisuretags",
    tag: string
  ) => {
    if (tagType === "skilltags") {
      setSkilltags((prev) => ({ ...prev, [tag]: !prev[tag] }));
    } else if (tagType === "languagetags") {
      setLanguagetags((prev) => ({ ...prev, [tag]: !prev[tag] }));
    } else if (tagType === "leisuretags") {
      setLeisuretags((prev) => ({ ...prev, [tag]: !prev[tag] }));
    }
  };

  const handleSubmit = async () => {
    const confirm = window.confirm("是否確認發文？");
    if (!confirm) return;

    const data = {
      title,
      content,
      user_id: userId,
      name: userName,
      skilltags,
      languagetags,
      leisuretags,
      trans: isTransfer,
    };

    try {
      await fetch("http://localhost:8000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      router.push("/general");
    } catch (err) {
      console.error("發文錯誤：", err);
      router.push("/general");
    }
  };

  return (
    <div className="post-container">
      <h2>🔸發布貼文</h2>
      <input
        className="post-input"
        placeholder="輸入文章標題……"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="post-textarea"
        placeholder="輸入文章內容……"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="form-group">
        <label className="skill-label">技能標籤</label>
        <div className="checkbox-group">
          {Object.entries(skilltags).map(([skill, checked], index) => (
            <label
              key={`skill-${index}`}
              className={`checkbox-label ${checked ? "checked" : ""}`}
              htmlFor={`skill-${index}`}
            >
              <input
                type="checkbox"
                id={`skill-${index}`}
                value={skill}
                checked={checked}
                onChange={() => handleCheckboxChange("skilltags", skill)}
              />
              {skill}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="skill-label">語言標籤</label>
        <div className="checkbox-group">
          {Object.entries(languagetags).map(([lang, checked], index) => (
            <label
              key={`lang-${index}`}
              className={`checkbox-label ${checked ? "checked" : ""}`}
              htmlFor={`lang-${index}`}
            >
              <input
                type="checkbox"
                id={`lang-${index}`}
                value={lang}
                checked={checked}
                onChange={() => handleCheckboxChange("languagetags", lang)}
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="skill-label">休閒標籤</label>
        <div className="checkbox-group">
          {Object.entries(leisuretags).map(([tag, checked], index) => (
            <label
              key={`leisure-${index}`}
              className={`checkbox-label ${checked ? "checked" : ""}`}
              htmlFor={`leisure-${index}`}
            >
              <input
                type="checkbox"
                id={`leisure-${index}`}
                value={tag}
                checked={checked}
                onChange={() => handleCheckboxChange("leisuretags", tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="skill-label">是否為轉學生</label>
        <div className="checkbox-group">
          {["是", "否"].map((label, idx) => (
            <label
              key={`trans-${idx}`}
              className={`checkbox-label ${isTransfer === (label === "是") ? "checked" : ""}`}
            >
              <input
                type="radio"
                name="isTransfer"
                value={label}
                checked={isTransfer === (label === "是")}
                onChange={() => setIsTransfer(label === "是")}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="submit-button-wrapper">
        <button className="submit-button" onClick={handleSubmit}>
          確認發布
        </button>
      </div>
    </div>
  );
}
