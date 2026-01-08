import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../services/auth";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await authApi.login(email, password); // first login 
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
    await authApi.login(email, password);
    const data = await authApi.me();
    setUser(data.user);
    return data.user;
  }

  async function register(email, password) {
    const res = await fetch(`${API_URL}/api/users/createUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Registration failed");
    }

    return res.json();
  }

  async function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, booting, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
