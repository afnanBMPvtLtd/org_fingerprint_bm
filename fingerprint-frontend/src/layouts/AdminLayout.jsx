import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  const links = [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Organizations", to: "/admin/organizations" },
    { label: "Create Organization", to: "/admin/organizations/create" }
  ];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar links={links} />
      <div style={{ padding: "20px", flex: 1 }}>
        <h1>Super Admin Panel</h1>
        <Outlet />
      </div>
    </div>
  );
}
