// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ 你提供的前端安全設定
const firebaseConfig = {
  apiKey: "AIzaSyBQK7YA0Ocp5SFS6Y1ohH0M6m6O11w2Jmo",
  authDomain: "transfer-student-platform.firebaseapp.com",
  projectId: "transfer-student-platform",
  storageBucket: "transfer-student-platform.firebasestorage.app",
  messagingSenderId: "105309516750",
  appId: "1:105309516750:web:c9a17a8d6536e921beb19f",
  measurementId: "G-6P0GYXS18W",
};

// ✅ 初始化
const app = initializeApp(firebaseConfig);

// ✅ 導出 Firestore 實例（前端用這個即可）
const db = getFirestore(app);

export { db };
