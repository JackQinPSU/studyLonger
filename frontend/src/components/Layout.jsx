import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}
