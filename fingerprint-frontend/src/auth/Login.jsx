import { useNavigate } from 'react-router-dom';
import api from '../services/api/axios';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', {
        email,
        password
      });

      login(res.data);

      if (res.data.role === 'SUPER_ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/org', { replace: true });
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  }

  return (
    <div>
      <h2>Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
