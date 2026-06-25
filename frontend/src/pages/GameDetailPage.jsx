import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import ScreenshotGallery from '../components/game/ScreenshotGallery';
import ReviewSection from '../components/review/ReviewSection';
import ForumSection from '../components/forum/ForumSection';

export default function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [tab, setTab] = useState('about');

  useEffect(() => {
    axios.get(`/api/games/${id}`).then(r => setGame(r.data));
  }, [id]);

  if (!game) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>;

  const storeUrl = game.storeLinks?.steam || game.storeLinks?.itch || game.storeLinks?.epic;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>

        {/* Left */}
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {game.genre?.map(g => <span key={g} className="badge badge-purple">{g}</span>)}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{game.title}</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
            by <Link to={`/developer/${game.developerID?._id}`}>{game.developerID?.username}</Link>
            {game.releaseDate && ` · Released ${new Date(game.releaseDate).toLocaleDateString()}`}
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
            {['about', 'media', 'reviews', 'forum'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                  color: tab === t ? 'var(--accent)' : 'var(--muted)',
                  borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`,
                  fontSize: 14, textTransform: 'capitalize' }}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'about' && (
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--muted)', marginBottom: 20 }}>{game.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {game.tags?.map(t => <span key={t} style={{ fontSize: 12, padding: '4px 10px', background: 'var(--surface2)', borderRadius: 6, color: 'var(--muted)' }}>{t}</span>)}
              </div>
            </div>
          )}

          {tab === 'media' && (
            <div>
              {game.trailerUrl && (
                <div style={{ marginBottom: 24, borderRadius: 10, overflow: 'hidden' }}>
                  <ReactPlayer url={game.trailerUrl} width="100%" controls />
                </div>
              )}
              <ScreenshotGallery screenshots={game.screenshots} />
            </div>
          )}

          {tab === 'reviews' && <ReviewSection gameId={id} />}
          {tab === 'forum'   && <ForumSection gameId={id} />}
        </div>

        {/* Right sidebar */}
        <div>
          <img src={game.coverImage} alt={game.title} style={{ width: '100%', borderRadius: 10, marginBottom: 16 }} />

          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--green)' }}>
                {game.price === 0 ? 'Free' : `$${game.price.toFixed(2)}`}
              </span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--amber)', fontSize: 18 }}>{'★'.repeat(Math.round(game.averageRating))}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{game.totalReviews} reviews</div>
              </div>
            </div>
            {storeUrl && (
              <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Buy now ↗
              </a>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {game.storeLinks?.steam && <a href={game.storeLinks.steam} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>Steam</a>}
              {game.storeLinks?.itch  && <a href={game.storeLinks.itch}  target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>Itch.io</a>}
              {game.storeLinks?.epic  && <a href={game.storeLinks.epic}  target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>Epic</a>}
            </div>
          </div>

          <div className="card">
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Developer</p>
            <p style={{ fontSize: 14, fontWeight: 500 }}>{game.developerID?.username}</p>
            {game.developerID?.bio && <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{game.developerID.bio}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
