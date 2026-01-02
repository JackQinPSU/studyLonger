import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { user, booting } = useAuth();
    const loc = useLocation();

    if (booting) return <div>Loading...</div>;

    if (!user) {
        return  <Navigate to="/login" replace state={{ from: loc.pathname }} />
    }
    return <Outlet />;
}