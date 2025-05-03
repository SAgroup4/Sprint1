"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { X, UserPlus, Mail, Search } from "lucide-react"
import type { User } from "@/lib/types"
import { searchUser } from "@/lib/api"

/**
 * 自定義 DialogTitle 組件
 * 避免標題嵌套問題，使用 Box 代替 MUI 的 DialogTitle
 */
const DialogTitle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: "relative",
}))

/**
 * 用戶資料模態框屬性
 */
interface UserProfileModalProps {
  user: User // 要顯示的用戶資料
  onClose: () => void // 關閉模態框的回調函數
}

/**
 * 個人資料頂部橫幅樣式
 */
const ProfileBanner = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 96,
  background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}))

/**
 * 自定義搜尋按鈕樣式
 * 右側圓角，與輸入框形成一個整體
 */
const SearchButton = styled(Button)(({ theme }) => ({
  height: 56,
  minWidth: 56,
  borderRadius: "0 28px 28px 0", // 右側圓角
  boxShadow: "none",
  transition: "all 0.3s ease",
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  "&:hover": {
    boxShadow: theme.shadows[2],
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  },
  "&.Mui-disabled": {
    background: theme.palette.action.disabledBackground,
  },
}))

/**
 * 自定義圓角輸入框
 * 左側圓角，與搜尋按鈕形成一個整體
 */
const RoundedTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "28px 0 0 28px", // 左側圓角
    "& fieldset": {
      borderColor: theme.palette.primary.light,
      borderRight: "none",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}))

/**
 * 用戶資料模態框組件
 * 顯示用戶的詳細資料，包括頭像、暱稱、學號、電子郵件和系所
 */
export function UserProfileModal({ user, onClose }: UserProfileModalProps) {
  // 如果 user 為 undefined 或 null，顯示加載中或錯誤信息
  if (!user) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">用戶資料</Typography>
          <IconButton onClick={onClose} size="small" sx={{ position: "absolute", right: 8, top: 8 }}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography>無法載入用戶資料</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">用戶資料</Typography>
        <IconButton onClick={onClose} size="small" sx={{ position: "absolute", right: 8, top: 8 }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* 頂部橫幅 */}
          <ProfileBanner />

          {/* 頭像 */}
          <Box sx={{ mt: -6 }}>
            <Avatar
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              sx={{
                width: 96,
                height: 96,
                border: 4,
                borderColor: "background.paper",
                boxShadow: 2,
              }}
            />
          </Box>

          {/* 用戶基本信息 */}
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            學號: {user.id}
          </Typography>

          <Divider sx={{ my: 2, width: "100%" }} />

          {/* 聯絡信息 */}
          <List sx={{ width: "100%", px: 2 }}>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                <Mail size={18} />
              </ListItemIcon>
              <ListItemText primary={user.email || "沒有電子郵件"} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="系所"
                secondary={user.department}
                primaryTypographyProps={{ color: "primary.main", variant: "body2" }}
              />
            </ListItem>
          </List>

          {/* 操作按鈕 */}
          <Box sx={{ display: "flex", gap: 2, my: 3 }}>
            <Button variant="contained" color="primary">
              發送訊息
            </Button>
            <Button variant="outlined" color="primary">
              查看資料
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

/**
 * 添加聯絡人模態框屬性
 */
interface AddContactModalProps {
  onClose: () => void // 關閉模態框的回調函數
  onAddContact: (studentId: string) => void // 添加聯絡人的回調函數
}

/**
 * 添加聯絡人模態框組件
 * 允許用戶通過學號搜尋並添加新聯絡人
 */
export function AddContactModal({ onClose, onAddContact }: AddContactModalProps) {
  // 狀態管理
  const [studentId, setStudentId] = useState("") // 學號輸入
  const [error, setError] = useState("") // 錯誤信息
  const [isSearching, setIsSearching] = useState(false) // 搜尋中狀態
  const [searchResult, setSearchResult] = useState<User | null>(null) // 搜尋結果

  /**
   * 處理搜尋用戶
   * 後端實現：調用 searchUser API 函數搜尋用戶
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    // 輸入驗證
    if (!studentId.trim()) {
      setError("請輸入學號")
      return
    }

    // 驗證學號格式 - 必須是9位數字
    if (!/^\d{9}$/.test(studentId)) {
      setError("學號格式不正確，請輸入9位數字")
      return
    }

    // 開始搜尋
    setIsSearching(true)
    setError("")
    setSearchResult(null)

    try {
      // 調用後端API搜尋用戶
      const result = await searchUser(studentId)
      setIsSearching(false)
      
      if (result) {
        setSearchResult(result)
      } else {
        setError("找不到該用戶，請確認學號是否正確")
      }
    } catch (error) {
      setIsSearching(false)
      if (error instanceof Error) {
        setError(error.message || "搜尋用戶失敗，請稍後再試")
      } else {
        setError("搜尋用戶失敗，請稍後再試")
      }
    }
  }

  /**
   * 處理添加聯絡人
   * 當用戶點擊"新增聯絡人"按鈕時調用
   */
  const handleAddContact = () => {
    if (searchResult) {
      onAddContact(searchResult.id)
    }
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 10,
        },
      }}
    >
      {/* 模態框標題 */}
      <DialogTitle sx={{ pb: 2, pt: 2.5 }}>
        <UserPlus size={20} />
        <Typography variant="h6" component="div" sx={{ fontWeight: "medium" }}>
          新增聯絡人
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ position: "absolute", right: 8, top: 8 }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      {/* 模態框內容 */}
      <DialogContent sx={{ pt: 3 }}>
        {/* 搜尋表單 */}
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            輸入對方的學號來搜尋並新增聯絡人。
          </Typography>

          {/* 搜尋輸入框和按鈕 */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <RoundedTextField
              autoFocus
              id="studentId"
              label="學號"
              placeholder="請輸入9位數字學號"
              variant="outlined"
              value={studentId}
              onChange={(e) => {
                // 只允許輸入數字
                const value = e.target.value.replace(/\D/g, "")
                setStudentId(value)
                setError("")
                setSearchResult(null)
              }}
              error={!!error}
              helperText={error}
              disabled={isSearching}
              sx={{
                flex: 1,
                maxWidth: "calc(100% - 56px)", // 為搜尋按鈕留出空間
              }}
              inputProps={{
                maxLength: 9,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
            <SearchButton
              type="submit"
              disabled={isSearching || !studentId.trim()}
              sx={{
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSearching ? <CircularProgress size={20} color="inherit" /> : <Search size={20} />}
            </SearchButton>
          </Box>
        </Box>

        {/* 搜尋結果 */}
        {searchResult && (
          <Box sx={{ mt: 3, animation: "fadeIn 0.5s ease-in-out" }}>
            <Alert
              severity="success"
              sx={{
                mb: 2,
                boxShadow: 1,
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  color: "success.main",
                },
              }}
            >
              找到用戶！
            </Alert>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                boxShadow: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 3,
                  borderColor: "primary.light",
                },
              }}
            >
              <Avatar
                src={searchResult.avatar}
                alt={searchResult.name}
                sx={{
                  width: 56,
                  height: 56,
                  mr: 2,
                  boxShadow: 2,
                  border: 2,
                  borderColor: "background.paper",
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {searchResult.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchResult.department} · 學號: {searchResult.id}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* 模態框底部按鈕 */}
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined" color="primary" sx={{ borderRadius: 28, px: 3 }}>
          取消
        </Button>
        <Button
          onClick={handleAddContact}
          variant="contained"
          color="primary"
          disabled={!searchResult}
          sx={{
            borderRadius: 28,
            px: 3,
            boxShadow: 2,
            "&:not(.Mui-disabled)": {
              background: "linear-gradient(45deg, #2196F3, #64B5F6)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2, #2196F3)",
                boxShadow: 4,
              },
            },
          }}
        >
          新增聯絡人
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// 導出命名組件，不使用默認導出
