import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import GameCard from '../components/game/GameCard';

const GENRES = ['Action','Adventure','RPG','Strategy','Puzzle','Simulation','Horror','Platformer','Roguelike','Cozy'];

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: '', minPrice: '', maxPrice: '',
    sort: 'createdAt',
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([,v]) => v !== ''));
    axios.get('/api/games', { params })
      .then(r => setGames(r.data))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Browse games</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, alignItems: 'center' }}>
        <input
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          placeholder="Search..."
          style={{ width: 200 }}
        />
        <select value={filters.genre} onChange={e => set('genre', e.target.value)} style={{ width: 150 }}>
          <option value="">All genres</option>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={filters.sort} onChange={e => set('sort', e.target.value)} style={{ width: 160 }}>
          <option value="createdAt">Newest first</option>
          <option value="rating">Top rated</option>
          <option value="trending">Trending</option>
        </select>
        <input value={filters.minPrice} onChange={e => set('minPrice', e.target.value)} placeholder="Min $" type="number" style={{ width: 90 }} />
        <input value={filters.maxPrice} onChange={e => set('maxPrice', e.target.value)} placeholder="Max $" type="number" style={{ width: 90 }} />
        <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => setFilters({ genre:'', minPrice:'', maxPrice:'', sort:'createdAt', search:'' })}>
          Clear filters
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading...</p>
      ) : games.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 60 }}>No games found. Try different filters.</p>
      ) : (
        <>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>{games.length} games found</p>
          <div className="grid-games">
            {games.map(g => <GameCard key={g._id} game={g} />)}
          </div>
        </>
      )}
    </div>
  );
}
