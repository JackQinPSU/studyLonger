import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [booting, setBooting] = useState(true);


    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) setUser(JSON.parse(saved));
        setBooting(false);
    }, []);


    async function login(username) {
        const u = { username };
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
        return u;
    }


    async function logout() {
        setUser(null);
        localStorage.removeItem("user");
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