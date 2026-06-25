import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/browse?search=${encodeURIComponent(search)}`);
  };

  return (
    <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20, height: 60 }}>
        <Link to="/" style={{ fontFamily: "'Press Start 2P'", fontSize: 12, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
          IndieGamer
        </Link>
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          <Link to="/browse" style={{ fontSize: 13, color: 'var(--muted)', padding: '6px 12px', borderRadius: 6 }}>Browse</Link>
          <Link to="/trending" style={{ fontSize: 13, color: 'var(--muted)', padding: '6px 12px', borderRadius: 6 }}>Trending</Link>
          <Link to="/upcoming" style={{ fontSize: 13, color: 'var(--muted)', padding: '6px 12px', borderRadius: 6 }}>Upcoming</Link>
        </div>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search games..."
            style={{ width: 200, padding: '7px 12px', fontSize: 13 }}
          />
        </form>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <>
              {user.role === 'developer' && <Link to="/submit-game" className="btn btn-primary" style={{ fontSize: 12, padding: '8px 14px' }}>+ Submit game</Link>}
              {user.role === 'admin' && <Link to="/admin" style={{ fontSize: 13, color: 'var(--amber)' }}>Admin</Link>}
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{user.username}</span>
              <button onClick={logout} className="btn btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 13, color: 'var(--muted)', padding: '7px 14px', border: '1px solid var(--border)', borderRadius: 8 }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: 13, padding: '7px 14px' }}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
