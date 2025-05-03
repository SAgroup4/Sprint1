import { clsx, type ClassValue } from "clsx"




// 純前端工具函數 - 不需要後端集成

export function formatDistanceToNow(date: Date): string {
  // 暫時禁用時間顯示功能
  return ""
  
  /* 原始實現（暫時註釋掉）
  // 將輸入的日期轉換為UTC+8時區
  const utcDate = new Date(date)
  const utc8Date = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000)
  
  // 獲取當前時間（也轉換為UTC+8）
  const now = new Date()
  const utc8Now = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  
  const diffInSeconds = Math.floor((utc8Now.getTime() - utc8Date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "剛剛"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分鐘前`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}小時前`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}天前`
  }

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
  return utc8Date.toLocaleDateString("zh-TW", options)
  */
}

export function formatTime(date: Date): string {
  // 將UTC時間轉換為UTC+8時區
  const utcDate = new Date(date)
  const utc8Date = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000)
  return utc8Date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

