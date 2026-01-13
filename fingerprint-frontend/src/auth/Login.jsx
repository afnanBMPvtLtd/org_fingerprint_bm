import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  function loginSuperAdmin() {
    setUser({ role: 'SUPER_ADMIN' });
    navigate('/admin/dashboard');
  }

  function loginOrgAdmin() {
    setUser({ role: 'ORG_ADMIN', organizationId: 'ORG1' });
    navigate('/org/dashboard');
  }

  return (
    <div>
      <h2>Login</h2>

      <button onClick={loginSuperAdmin}>
        Super Admin Login
      </button>

      <button onClick={loginOrgAdmin}>
        Organization Admin Login
      </button>
    </div>
  );
}
