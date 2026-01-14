import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../auth/Login';
import ProtectedRoute from '../auth/ProtectedRoute';

import AdminLayout from '../layouts/AdminLayout';
import OrgLayout from '../layouts/OrgLayout';

import AdminDashboard from '../admin/pages/AdminDashboard';
import OrgDashboard from '../organization/pages/OrgDashboard';
import { useAuth } from '../context/AuthContext';

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'SUPER_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/org" replace />;
}

export default function RoutesConfig() {
  return (
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<RootRedirect />} />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* SUPER ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* ORG ADMIN */}
      <Route
        path="/org"
        element={
          <ProtectedRoute roles={['ORG_ADMIN']}>
            <OrgLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OrgDashboard />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
