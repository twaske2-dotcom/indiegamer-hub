import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ForumSection({ gameId }) {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [active, setActive] = useState(null);
  const [thread, setThread] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [reply, setReply] = useState('');

  useEffect(() => {
    axios.get(`/api/forum/${gameId}/threads`).then(r => setThreads(r.data));
  }, [gameId]);

  const openThread = async (id) => {
    setActive(id);
    const { data } = await axios.get(`/api/forum/thread/${id}`);
    setThread(data);
  };

  const createThread = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`/api/forum/${gameId}/threads`, { title: newTitle, content: newContent });
    setThreads(t => [data, ...t]);
    setNewTitle(''); setNewContent('');
  };

  const postReply = async (e) => {
    e.preventDefault();
    await axios.post(`/api/forum/thread/${active}/reply`, { content: reply });
    const { data } = await axios.get(`/api/forum/thread/${active}`);
    setThread(data);
    setReply('');
  };

  if (active && thread) return (
    <div>
      <button onClick={() => { setActive(null); setThread(null); }} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13, marginBottom: 16 }}>
        ← Back to threads
      </button>
      <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>{thread.title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {thread.posts?.map((p, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>
                {p.userID?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{p.userID?.username}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{p.content}</p>
          </div>
        ))}
      </div>
      {user && (
        <form onSubmit={postReply} className="card">
          <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Write a reply..." rows={3} style={{ marginBottom: 10 }} />
          <button type="submit" className="btn btn-primary">Post reply</button>
        </form>
      )}
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Forum ({threads.length} threads)</h2>
      {user && (
        <form onSubmit={createThread} className="card" style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>New thread</p>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Thread title" style={{ marginBottom: 10 }} required />
          <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Start the discussion..." rows={3} style={{ marginBottom: 10 }} required />
          <button type="submit" className="btn btn-primary">Create thread</button>
        </form>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {threads.map(t => (
          <div key={t._id} className="card" style={{ cursor: 'pointer' }} onClick={() => openThread(t._id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{t.title}</p>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>by {t.userID?.username} · {new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
              <span style={{ fontSize: 12, color: 'var(--accent)' }}>View →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
