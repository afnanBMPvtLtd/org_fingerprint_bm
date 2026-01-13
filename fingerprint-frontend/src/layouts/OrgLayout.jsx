import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function OrgLayout() {
  const links = [
    { label: "Dashboard", to: "/org/dashboard" },
    { label: "Locations", to: "/org/locations" },
    { label: "Devices", to: "/org/devices" },
    { label: "Employees", to: "/org/employees" },
    { label: "Enroll Employee", to: "/org/enroll" }
  ];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar links={links} />
      <div style={{ padding: "20px", flex: 1 }}>
        <h1>Organization Admin Panel</h1>
        <Outlet />
      </div>
    </div>
  );
}
