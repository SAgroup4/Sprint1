// src/context/AuthProvider.tsx
// 'use client';

// import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';

// interface User {
//   email: string;
//   name: string;
//   department: string;
//   grade: string;
//   token?: string; // token 可能是 User 物件的一部分
//   id: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (token: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch('http://localhost:8000/me', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error('Token 無效');

//       const data = await res.json();
//       setUser(data);
//     } catch (error) {
//       console.error('驗證失敗', error);
//       localStorage.removeItem('token');
//       router.push('/login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const login = async (token: string) => {
//     localStorage.setItem('token', token);
//     await fetchUser(); // 登入後立即獲取使用者資料
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth 必須在 <AuthProvider> 中使用');
//   return context;
// };




//第二版
// 'use client';

// import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';

// // 使用者資料型別
// interface User {
//   id: string;              // Firebase 或資料庫中的 UID
//   email: string;
//   name: string;
//   department: string;
//   grade: string;
//   token?: string;          // 可選：保留 token（如果你要傳給後端用）
// }

// // 提供給 context 的型別
// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (token: string) => Promise<void>;
//   logout: () => void;
// }

// // 創建 Context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // AuthProvider 包住整個 app
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // 從 localStorage 拿 token，打 API 取得使用者資料
//   const fetchUser = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch('http://localhost:8000/me', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error('Token 無效');

//       const data = await res.json(); // 從後端取回使用者資料
//       setUser(data);                 // 設定 user 狀態
//     } catch (error) {
//       console.error('驗證失敗', error);
//       localStorage.removeItem('token');
//       router.push('/login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 初次進入網站就驗證一次
//   useEffect(() => {
//     fetchUser();
//   }, []);

//   // 登入後：儲存 token 並打 API 取得 user 資料
//   const login = async (token: string) => {
//     localStorage.setItem('token', token);
//     await fetchUser();
//   };

//   // 登出：清空 token、user、導回登入頁
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // 提供給元件使用 Auth 狀態的 Hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth 必須在 <AuthProvider> 中使用');
//   return context;
// };


//第三版
'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  name: string;
  department: string;
  grade: string;
  token?: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Token 無效');

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error('驗證失敗', error);
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    await fetchUser();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth 必須在 <AuthProvider> 中使用');
  return context;
};
