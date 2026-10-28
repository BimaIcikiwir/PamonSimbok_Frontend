import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LiveProvider } from "../context/LiveContext";
import { Spinner } from "../components/ui/Button";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";
import Footer from "./Footer";

export default function AdminLayout() {
  const { user, siap } = useAuth();
  const [sidebar, setSidebar] = useState(false);
  const loc = useLocation();

  if (!siap)
    return (
      <div className="grid min-h-dvh place-items-center text-soga-500">
        <Spinner />
      </div>
    );
  if (!user) return <Navigate to="/kasir" state={{ dari: loc.pathname }} replace />;

  return (
    <LiveProvider>
      <div className="flex min-h-dvh bg-gading-100">
        <Sidebar buka={sidebar} onTutup={() => setSidebar(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader onBukaSidebar={() => setSidebar(true)} />
          <main className="flex-1 px-4 py-6 lg:px-8">
            <Outlet />
          </main>
          <Footer admin />
        </div>
      </div>
    </LiveProvider>
  );
}
