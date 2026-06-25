import React from 'react';
import { Link } from 'react-router-dom';

export default function GameCard({ game }) {
  const stars = '★'.repeat(Math.round(game.averageRating)) + '☆'.repeat(5 - Math.round(game.averageRating));

  return (
    <Link to={`/game/${game._id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden', transition: 'border-color 0.2s', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <img
          src={game.coverImage || 'https://via.placeholder.com/300x160/18181f/4f8ef7?text=No+Image'}
          alt={game.title}
          style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {game.genre?.slice(0, 2).map(g => (
              <span key={g} className="badge badge-purple">{g}</span>
            ))}
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, lineHeight: 1.3 }}>{game.title}</h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.5 }}>
            {game.description?.slice(0, 80)}...
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stars" style={{ fontSize: 13 }} title={`${game.averageRating} stars`}>{stars}</span>
            <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 500 }}>
              {game.price === 0 ? 'Free' : `$${game.price.toFixed(2)}`}
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>by {game.developerID?.username}</p>
        </div>
      </div>
    </Link>
  );
}
