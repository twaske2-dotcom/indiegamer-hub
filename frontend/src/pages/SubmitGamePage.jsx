import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SubmitGamePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', genre: '', price: '', steamAppId: '',
    storeLinks: { steam: '', epic: '', itch: '' }, trailerUrl: ''
  });
  const [files, setFiles] = useState({ coverImage: null, screenshots: [] });
  const [steamPreview, setSteamPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingSteam, setFetchingSteam] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fetchSteam = async () => {
    if (!form.steamAppId) return;
    setFetchingSteam(true);
    try {
      const { data } = await axios.post('/api/games/steam-fetch', { steamAppId: form.steamAppId });
      setSteamPreview(data);
      setForm(f => ({
        ...f,
        title:       f.title || data.title,
        description: f.description || data.description,
        price:       f.price || data.price,
        genre:       f.genre || data.tags?.slice(0,3).join(', ')
      }));
    } catch (err) {
      alert('Could not fetch Steam data: ' + err.response?.data?.message);
    }
    setFetchingSteam(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === 'object' && !(v instanceof File)) fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      if (files.coverImage) fd.append('coverImage', files.coverImage);
      files.screenshots.forEach(f => fd.append('screenshots', f));
      const { data } = await axios.post('/api/games', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/game/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting game');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 700 }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>Submit your game</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Paste a Steam App ID to auto-fill details, or fill in manually.</p>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div className="card">
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Auto-fill from Steam</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={form.steamAppId} onChange={e => set('steamAppId', e.target.value)} placeholder="Steam App ID (e.g. 570)" />
            <button type="button" className="btn btn-secondary" onClick={fetchSteam} disabled={fetchingSteam} style={{ whiteSpace: 'nowrap' }}>
              {fetchingSteam ? 'Fetching...' : 'Fetch data'}
            </button>
          </div>
          {steamPreview && (
            <div style={{ marginTop: 12, padding: 12, background: 'var(--surface2)', borderRadius: 8 }}>
              <p style={{ fontSize: 13, color: 'var(--green)' }}>✓ Fetched: {steamPreview.title} — ${steamPreview.price}</p>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{steamPreview.tags?.join(', ')}</p>
            </div>
          )}
        </div>

        <div>
          <label style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Game title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div>
          <label style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Description *</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={5} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Genre (comma separated)</label>
            <input value={form.genre} onChange={e => set('genre', e.target.value)} placeholder="Action, RPG, Indie" />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Price ($) — 0 for free</label>
            <input value={form.price} onChange={e => set('price', e.target.value)} type="number" min="0" step="0.01" />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Trailer URL (YouTube / Vimeo)</label>
          <input value={form.trailerUrl} onChange={e => set('trailerUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div>
          <label style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Cover image</label>
          <input type="file" accept="image/*" onChange={e => setFiles(f => ({ ...f, coverImage: e.target.files[0] }))} style={{ padding: '8px 0' }} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Screenshots (up to 6)</label>
          <input type="file" accept="image/*" multiple onChange={e => setFiles(f => ({ ...f, screenshots: Array.from(e.target.files).slice(0,6) }))} style={{ padding: '8px 0' }} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ fontSize: 15, padding: '12px 0', justifyContent: 'center' }}>
          {loading ? 'Submitting...' : 'Submit game'}
        </button>
      </form>
    </div>
  );
}