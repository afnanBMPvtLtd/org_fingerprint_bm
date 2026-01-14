import { Outlet } from 'react-router-dom';

export default function OrgLayout() {
  return (
    <div>
      <h1>Organization Admin</h1>
      <Outlet />
    </div>
  );
}
