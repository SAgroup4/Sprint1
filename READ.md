# 輔大學生交流平台（Student Discussion Platform）

內容包含
前端：登入、註冊、主討論區、文章留言列表
後端：登入、註冊(信箱驗證)、發表文章、發表留言

---

## 功能介紹

### 使用者系統
- [x] 註冊帳號（信箱驗證）
- [x] 登入 / 登出（JWT Token）

### 文章系統
- [x] 發佈新文章（標題 / 內容）
- [x] 查看文章列表（時間排序）
- [x] 點進文章詳情

### 留言系統
- [x] 每篇文章下可留言
- [x] 依照時間顯示留言
- [x] 留言者名稱與時間呈現

---

## 技術架構

| 分類   | 技術                      |
|--------|---------------------------|
| 前端   | Next.js 14 App Router     |
| UI框架 | MUI + CSS Modules         |
| 後端   | FastAPI                   |
| 資料庫 | Firebase Firestore        |
| 驗證   | JWT / bcrypt / Email 驗證 |

---

## 專案結構

```
frontend_api_clone/
├── frontend/       # Next.js 前端
│   └── src/
│       └── app/
│           ├── login/
│           ├── register/
│           ├── posts/         # 所有文章與留言頁面
│           └── layout.tsx     # Root Layout
├── api/            # FastAPI 後端
│   ├── main.py     # FastAPI 主入口
│   └── routes/     # 登入、註冊、文章、留言 API
└── README.md       # 專案說明
```

---

## 啟動方式 (可參考舊README)

### 1. 前端
```bash
cd frontend
npm install
npm run dev
```

### 2. 後端
```bash
cd api
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Firebase 設定
請在 `api/` 下放入 `firebase_key.json`，並於 `db.py` 中引用該檔案初始化。



