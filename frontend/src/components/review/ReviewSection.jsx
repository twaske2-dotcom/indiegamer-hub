import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, fontSize: 24, cursor: 'pointer' }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} onClick={() => onChange(n)} style={{ color: n <= value ? 'var(--amber)' : 'var(--border)' }}>★</span>
      ))}
    </div>
  );
}

export default function ReviewSection({ gameId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating,  setRating]  = useState(5);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/api/reviews/${gameId}`).then(r => setReviews(r.data));
  }, [gameId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/reviews/${gameId}`, { rating, content });
      setReviews(prev => [data, ...prev]);
      setContent('');
      setRating(5);
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting review');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Reviews ({reviews.length})</h2>

      {user && (
        <form onSubmit={submit} className="card" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 14, marginBottom: 12, fontWeight: 500 }}>Write a review</p>
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            style={{ marginTop: 12, marginBottom: 12 }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting...' : 'Post review'}
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reviews.map(r => (
          <div key={r._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500 }}>
                  {r.userID?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{r.userID?.username}</p>
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="stars" style={{ fontSize: 16 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted)' }}>{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
