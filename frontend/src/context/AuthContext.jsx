import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await authApi.me();     // { user: {id,email} }
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  async function login(email, password) {
    // 后端返回 { message, userId }，但 cookie 已经种下了
    await authApi.login(email, password);

    // 登录成功后再拉一次 /me 拿到 user
    const data = await authApi.me();
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    // 暂时没 logout，就先做前端登出（Step 6 我带你加后端 logout）
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, booting, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
