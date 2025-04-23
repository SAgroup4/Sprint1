# 輔大學生交流平台（Student Discussion Platform）

內容包含
前端：登入、註冊、主討論區、文章留言列表、個人檔案
後端：登入、註冊(信箱驗證)、發表文章、發表留言、個人檔案資料連接

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

### 個人檔案系統
- [x] 顯示自己發過的貼文
- [x] 顯示個人資料、技能語言標籤
- [x] 可另外點選按鈕修改密碼與個人資料

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
│   └── routes/     # 登入、註冊、文章、留言、個人檔案資料 API
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
pip install firebase-admin
### 2. 後端
```bash
cd api
python -m venv venv
venv\Scripts\activate  # Windows (要確認自己的venv檔案放在哪層作修改)
pip install -r requirements.txt
uvicorn main:app --reload #可不加--reload會跑比較快
```

### 3. Firebase 設定
請在 `api/` 下放入 `.env`，將`firebase的金鑰內容放入.env(使用.env格式)`，並於 `db.py` 中引用該檔案初始化。

請大家在`.gitignore` 記得確認有忽略 `.env` 檔案 以及 `db.py`檔案，組員個別使用自己的 `.env`和 `db.py`。



