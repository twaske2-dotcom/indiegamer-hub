import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GameCard from '../components/game/GameCard';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || '';

export default function HomePage() {
  const [featured,  setFeatured]  = useState([]);
  const [trending,  setTrending]  = useState([]);
  const [newGames,  setNewGames]  = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/games?featured=true`).then(r => setFeatured(Array.isArray(r.data) ? r.data : [])).catch(() => setFeatured([]));
    axios.get(`${API}/api/games/trending`).then(r => setTrending(Array.isArray(r.data) ? r.data : [])).catch(() => setTrending([]));
    axios.get(`${API}/api/games`).then(r => setNewGames(Array.isArray(r.data) ? r.data.slice(0, 8) : [])).catch(() => setNewGames([]));
  }, []);

  return (
    <div>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: 10, color: 'var(--accent)', marginBottom: 16 }}>Discover indie games</p>
          <h1 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>Hidden gems deserve<br />the spotlight.</h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 520, lineHeight: 1.7, marginBottom: 28 }}>
            IndieGamer Hub connects indie developers with players who want unique experiences.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/browse" className="btn btn-primary">Browse all games</Link>
            <Link to="/register?role=developer" className="btn btn-secondary">Submit your game</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>

        {featured.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 500 }}>⭐ Featured games</h2>
              <Link to="/browse?featured=true" style={{ fontSize: 13, color: 'var(--accent)' }}>See all</Link>
            </div>
            <div className="grid-games">
              {featured.map(g => <GameCard key={g._id} game={g} />)}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 500 }}>🔥 Trending this week</h2>
            <Link to="/trending" style={{ fontSize: 13, color: 'var(--accent)' }}>See all</Link>
          </div>
          {trending.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No trending games yet — be the first to review!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {trending.slice(0, 5).map((item, i) => (
                <Link key={item._id} to={`/game/${item.game?._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px' }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--muted)', minWidth: 28 }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>{item.game?.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>{item.reviewCount} reviews this week</p>
                    </div>
                    <span style={{ color: 'var(--amber)', fontSize: 14 }}>★ {item.game?.averageRating?.toFixed(1)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 500 }}>🆕 New releases</h2>
            <Link to="/browse" style={{ fontSize: 13, color: 'var(--accent)' }}>See all</Link>
          </div>
          {newGames.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No games yet — submit yours!</p>
          ) : (
            <div className="grid-games">
              {newGames.map(g => <GameCard key={g._id} game={g} />)}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}