import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: searchParams.get('role') || 'gamer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form.username, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>Create account</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Join the IndieGamer Hub community.</p>
        {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 16 }}>{error}</p>}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input value={form.username} onChange={e => set('username', e.target.value)} placeholder="Username" required />
          <input value={form.email} onChange={e => set('email', e.target.value)} type="email" placeholder="Email" required />
          <input value={form.password} onChange={e => set('password', e.target.value)} type="password" placeholder="Password" required />
          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>I am a...</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['gamer', 'developer'].map(r => (
                <button key={r} type="button" onClick={() => set('role', r)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${form.role === r ? 'var(--accent)' : 'var(--border)'}`,
                    background: form.role === r ? 'rgba(79,142,247,0.1)' : 'var(--surface2)',
                    color: form.role === r ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', fontSize: 14 }}>
                  {r === 'gamer' ? '🎮 Gamer' : '💻 Developer'}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '12px 0' }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
