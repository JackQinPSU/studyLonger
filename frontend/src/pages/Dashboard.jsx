import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Dashboard ✅</h2>
      <p>Logged in as: {user.username}</p>
    </div>
  );
}