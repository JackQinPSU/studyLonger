import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const nav = useNavigate();
  const loc = useLocation();
  const redirectTo = loc.state?.from || "/dashboard";

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      await login(email, password); // ✅ 只调用 AuthContext
      nav(redirectTo, { replace: true });
    } catch (e) {
      setErr(e.message || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Login</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Login</button>

        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </form>
    </div>
  );
}
