# main.py - FastAPI後端服務的主要入口點

# 引入FastAPI框架，這是一個現代、快速的Web框架，用於建立API
from fastapi import FastAPI
# 引入CORS中間件，用於處理跨域資源共享
from fastapi.middleware.cors import CORSMiddleware
# 引入註冊和驗證相關的路由模組
from routes import register  # 處理使用者註冊的路由
from routes import verify    # 處理郵件驗證的路由
from routes import login     # 處理登入相關的路由
from routes import posts     # 處理文章相關的路由
from routes import comments # 留言的路由
from routes import users     # 使用者相關的路由
from routes import password  # 密碼相關的路由
from routes import user_creation  # 新增的使用者註冊資料相關的路由
from routes import profile_change  # 新增的使用者註冊資料相關的路由
from routes import filter  # 新增的篩選文章的路由
from routes import chat     # 處理聊天相關的路由
from routes import search   # 新增的搜尋文章的路由
from routes import skills #新增技能交換的路由
from routes import languages #新增語言交換的路由


# 創建FastAPI應用實例
app = FastAPI()

# 設定CORS（跨域資源共享）
# 這是一個安全機制，用於控制不同網域的網頁能否存取API
app.add_middleware(
    CORSMiddleware,
    # 允許的來源網域，["*"]表示允許所有來源
    # 在實際產品環境中，應該限制為特定的前端網域
    allow_origins=["*"],
    # 允許攜帶認證資訊（如cookies）
    allow_credentials=True,
    # 允許的HTTP方法，["*"]表示允許所有方法（GET、POST等）
    allow_methods=["*"],
    # 允許的HTTP標頭，["*"]表示允許所有標頭
    allow_headers=["*"],
)

# 註冊路由模組
# 這些路由模組包含了處理不同API端點的邏輯
app.include_router(register.router)  # 加入註冊相關的路由
app.include_router(verify.router)    # 加入驗證相關的路由
app.include_router(login.router)     # 加入登入相關的路由
app.include_router(posts.post_router) # 加入文章相關的路由
app.include_router(comments.comment_router) # 加入留言相關的路由
app.include_router(users.user_router) # 加入使用者相關的路由
app.include_router(password.router) # 加入密碼相關的路由
app.include_router(user_creation.user_creation_router) # 加入使用者註冊資料相關的路由
app.include_router(profile_change.profile_change_router) # 加入使用者註冊資料相關的路由
app.include_router(filter.filter_router) # 加入篩選文章的路由
app.include_router(chat.router, prefix="/api", tags=["聊天"]) # 加入聊天相關的路由
app.include_router(search.search_router) # 加入搜尋文章的路由
app.include_router(skills.skills_router) # 加入技能交換的路由
app.include_router(languages.languages_router) # 加入語言交換的路由