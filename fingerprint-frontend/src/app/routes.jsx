import { Routes, Route } from 'react-router-dom';
import Login from '../auth/Login';

import AdminLayout from '../layouts/AdminLayout';
import OrgLayout from '../layouts/OrgLayout';

import AdminDashboard from '../admin/pages/Dashboard';
import Organizations from '../admin/pages/Organizations';
import CreateOrganization from '../admin/pages/CreateOrganization';

import OrgDashboard from '../organization/pages/Dashboard';
import Locations from '../organization/pages/Locations';
import Devices from '../organization/pages/Devices';
import Employees from '../organization/pages/Employees';
import EnrollEmployee from '../organization/pages/EnrollEmployee';

export default function RoutesConfig() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="organizations/create" element={<CreateOrganization />} />
      </Route>

      {/* ORG */}
      <Route path="/org" element={<OrgLayout />}>
        <Route path="dashboard" element={<OrgDashboard />} />
        <Route path="locations" element={<Locations />} />
        <Route path="devices" element={<Devices />} />
        <Route path="employees" element={<Employees />} />
        <Route path="enroll" element={<EnrollEmployee />} />
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
}
