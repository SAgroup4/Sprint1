// lib/api.ts
import axios from "axios";
import type { Conversation, Message, User } from "./types";

// FastAPI 後端 base URL
const API_BASE_URL = "http://localhost:8000";

// 通用 fetch 回應處理
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 401) {
      localStorage.removeItem("token");
      throw new Error("Authentication token is invalid or expired");
    }
    throw new Error(`Request failed: ${response.status} ${errorText}`);
  }
  const data = await response.json();
  return data as T;
}

// 取得帶 Authorization 的標頭
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * 取得目前登入使用者資料
 * FastAPI: GET /api/me
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/me`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<User>(response);
    if (!data.id || !data.name) {
      throw new Error("Invalid user data received");
    }
    return data;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    throw error;
  }
}

/**
 * 取得所有對話列表
 * FastAPI: GET /api/conversations
 */
export async function getConversations(): Promise<Conversation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/conversations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse<Conversation[]>(response);
  } catch (error) {
    console.error("Error in getConversations:", error);
    throw error;
  }
}

/**
 * 取得單一對話的訊息
 * FastAPI: GET /api/conversations/{conversationId}/messages
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/messages`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse<Message[]>(response);
  } catch (error) {
    console.error("Error in getMessages:", error);
    throw error;
  }
}

/**
 * 傳送新訊息
 * FastAPI: POST /api/conversations/{conversationId}/messages
 */
export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    return await handleResponse<Message>(response);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
}

/**
 * 將對話標記為已讀
 * FastAPI: PUT /api/conversations/{conversationId}/read
 */
export async function markConversationAsRead(conversationId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/read`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    await handleResponse<{ success: boolean }>(response);
  } catch (error) {
    console.error("Error in markConversationAsRead:", error);
    throw error;
  }
}

/**
 * 搜尋使用者
 * FastAPI: GET /api/users/search/{studentId}
 */
export async function searchUser(studentId: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/search/${studentId}`, {
      headers: getAuthHeaders(),
    });
    if (response.status === 404) return null;
    return await handleResponse<User>(response);
  } catch (error) {
    console.error("Error in searchUser:", error);
    throw error;
  }
}

/**
 * 創建與某使用者的新對話
 * FastAPI: POST /api/conversations
 */
export async function createConversation(participantId: string): Promise<Conversation> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
    
    const res = await axios.post(
      `${API_BASE_URL}/api/conversations`,
      { participantId },
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    return res.data as Conversation;
  } catch (error) {
    console.error("Error in createConversation:", error);
    throw error;
  }
}

/**
 * 取得指定使用者資料
 * FastAPI: GET /api/users/{userId}
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (response.status === 404) return null;
    
    const userData = await handleResponse<User>(response);
    
    // 確保用戶ID和姓名存在
    if (!userData.id) {
      userData.id = userId; // 使用傳入的userId作為備用
    }
    
    // 如果姓名不存在，嘗試從其他屬性獲取或設置默認值
    if (!userData.name) {
      userData.name = userData.email ? userData.email.split('@')[0] : '未知用戶';
    }
    
    console.log("獲取到的用戶資料:", userData);
    return userData;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
}

/**
 * 加好友（建立聯絡人）
 * FastAPI: POST /api/contacts
 */
export async function addContact(contactId: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contacts`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ contactId }),
    });
    return await handleResponse<User>(response);
  } catch (error) {
    console.error("Error in addContact:", error);
    throw error;
  }
}
