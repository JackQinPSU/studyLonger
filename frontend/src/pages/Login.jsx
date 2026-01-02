import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const redirectTo = loc.state?.from || "/dashboard";

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!username.trim()) {
      setErr("Username required");
      return;
    }
    await login(username.trim());
    nav(redirectTo, { replace: true });
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button>Login</button>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </form>
    </div>
  );
}
