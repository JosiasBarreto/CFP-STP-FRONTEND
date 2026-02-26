import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import NavbarTop from "./NavbarTop";
import "./dashboard.css";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <div className="dashboard">
      <NavbarTop
        user={user}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <Sidebar
        open={sidebarOpen}
        onNavigate={() => window.innerWidth < 768 && setSidebarOpen(false)}
      />

      <main className={`content ${sidebarOpen ? "expanded" : "collapsed"}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
