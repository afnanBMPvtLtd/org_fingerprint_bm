import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const organization = localStorage.getItem('organization');

    if (token && role) {
      setUser({
        token,
        role,
        organization: organization || null
      });
    }

    setLoading(false);
  }, []);

  function login({ token, role, organization }) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (organization) {
      localStorage.setItem('organization', organization);
    }

    setUser({ token, role, organization: organization || null });
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
