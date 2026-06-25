import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>Welcome back</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Log in to your IndieGamer Hub account.</p>
        {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 16 }}>{error}</p>}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '12px 0' }}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
          No account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
