import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get('/api/admin/games').then(r => setGames(r.data));
    axios.get('/api/admin/stats').then(r => setStats(r.data));
  }, []);

  const toggleFeature = async (id) => {
    const { data } = await axios.patch(`/api/admin/games/${id}/feature`);
    setGames(gs => gs.map(g => g._id === id ? { ...g, isFeatured: data.isFeatured } : g));
  };

  const togglePublish = async (id) => {
    const { data } = await axios.patch(`/api/admin/games/${id}/publish`);
    setGames(gs => gs.map(g => g._id === id ? { ...g, isPublished: data.isPublished } : g));
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>Admin panel</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 28 }}>Manage games, featured spots, and visibility.</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Total games',    val: stats.totalGames    },
          { label: 'Total users',    val: stats.totalUsers    },
          { label: 'Featured games', val: stats.featuredGames }
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{s.val ?? '—'}</p>
          </div>
        ))}
      </div>

      {/* Games table */}
      <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>All games</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {games.map(g => (
          <div key={g._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={g.coverImage} alt="" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500 }}>{g.title}</p>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>by {g.developerID?.username} · ${g.price?.toFixed(2)} · ★ {g.averageRating}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={() => toggleFeature(g._id)}
                className="btn"
                style={{ fontSize: 12, padding: '6px 14px', background: g.isFeatured ? 'rgba(245,166,35,0.15)' : 'var(--surface2)', color: g.isFeatured ? 'var(--amber)' : 'var(--muted)', border: '1px solid var(--border)' }}>
                {g.isFeatured ? '⭐ Featured' : '☆ Feature'}
              </button>
              <button
                onClick={() => togglePublish(g._id)}
                className="btn"
                style={{ fontSize: 12, padding: '6px 14px', background: g.isPublished ? 'rgba(62,207,142,0.1)' : 'var(--surface2)', color: g.isPublished ? 'var(--green)' : 'var(--muted)', border: '1px solid var(--border)' }}>
                {g.isPublished ? '✓ Published' : '○ Unpublished'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
