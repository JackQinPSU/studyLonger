import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  async function handleLogout() {
    await logout();
    nav("/");
  }

  return (
    <div style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
      <Link to="/">Home</Link>

      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}
