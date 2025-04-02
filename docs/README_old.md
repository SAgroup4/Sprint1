前端部分由CRA改成使用Next.js開發
已經完成註冊登入，基本的一般討論區頁面和 Heder和Sidebar  
需要安裝的主要依賴包括：Next.js 15.2.4、React 19.0.0、React DOM 19.0.0、Material-UI等UI組件庫
開發依賴包括：TypeScript、ESLint等工具
可以通過在Frontend目錄下執行npm install 來安裝所有依賴

後端部分使用FastAPI開發
完成了註冊登入功能
建立了requirements.txt文件，列出所有必要的Python套件
主要依賴包括：FastAPI、Uvicorn、Python-Jose等
可以通過在api目錄下執行pip install -r requirements.txt 來安裝所有依賴

資料庫連接部分
目前是直接把金鑰.json放在api 根目錄裡之後
在db.py檔案中的
cred = credentials.Certificate("超長金鑰名稱.json")
換上去

之後要設定好金鑰.json收進 secrets/ 資料夾 
專案結構可以長這樣：

sa/
├── api/
│   ├── main.py
│   ├── db.py
│   ├── ...
│   └── secrets/
│       └── firebase-key.json  ← 放這裡
建立 .env 檔案
在 api/ 目錄底下新增 .env 檔案，內容如下：

FIREBASE_KEY_PATH=secrets/firebase-key.json
在 db.py 用 dotenv 自動載入
你原本的 db.py 要加這段（如果還沒加）：

import os
from dotenv import load_dotenv
from firebase_admin import credentials, firestore, initialize_app

 載入 .env 檔案
load_dotenv()
 
從環境變數取得金鑰位置

cred_path = os.getenv("FIREBASE_KEY_PATH")

cred = credentials.Certificate(cred_path)
initialize_app(cred)

db = firestore.client()

