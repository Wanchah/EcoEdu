import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import socket from '../socket.js';
import Comments from './Comments.jsx';

export default function Feed() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/reports')
      .then(setReports)
      .catch(err => console.error('Failed to load reports:', err));

    socket.on('report_created', (r) => setReports(prev => [r, ...prev]));
    socket.on('report_liked', (updated) => {
      setReports(prev => prev.map(r => r._id === updated._id ? updated : r));
      if (selected && selected._id === updated._id) setSelected(updated);
    });
    socket.on('report_disliked', (updated) => {
      setReports(prev => prev.map(r => r._id === updated._id ? updated : r));
      if (selected && selected._id === updated._id) setSelected(updated);
    });

    return () => {
      socket.off('report_created');
      socket.off('report_liked');
      socket.off('report_disliked');
    };
  }, [selected]);

  const handleLike = async (id) => {
    try {
      const updated = await api.post(`/reports/${id}/like`);
      setReports(prev => prev.map(r => r._id === id ? updated : r));
      if (selected && selected._id === id) setSelected(updated);
    } catch (err) {
      console.error('Failed to like report:', err);
    }
  };

  const handleDislike = async (id) => {
    try {
      const updated = await api.post(`/reports/${id}/dislike`);
      setReports(prev => prev.map(r => r._id === id ? updated : r));
      if (selected && selected._id === id) setSelected(updated);
    } catch (err) {
      console.error('Failed to dislike report:', err);
    }
  };

  const renderLocation = (r) => {
    if (typeof r.lat === 'number' && typeof r.lng === 'number') {
      return (
        <p style={styles.meta}>
          <strong>Location:</strong>{' '}
          <a
            href={`https://www.google.com/maps?q=${r.lat},${r.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {r.lat.toFixed(4)}, {r.lng.toFixed(4)}
          </a>
        </p>
      );
    }
    return <p style={styles.meta}><strong>Location:</strong> Not provided</p>;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Community Feed</h2>
      {reports.length === 0 ? (
        <p style={styles.empty}>No reports yet. Be the first to contribute!</p>
      ) : (
        <div style={styles.grid}>
          {reports.map(r => (
            <div key={r._id} style={styles.card}>
              {r.image && <img src={r.image} alt="Report" style={styles.image} />}
              <div style={styles.content}>
                <h3 style={styles.title}>{r.description}</h3>
                <p style={styles.meta}><strong>Status:</strong> {r.status}</p>
                <p style={styles.meta}>
                  <strong>Submitted:</strong> {new Date(r.createdAt).toLocaleString()}
                </p>
                {renderLocation(r)}
                <div style={styles.actions}>
                  <button onClick={() => handleLike(r._id)}>👍 {r.likes?.length || 0}</button>
                  <button onClick={() => handleDislike(r._id)}>👎 {r.dislikes?.length || 0}</button>
                  <button onClick={() => setSelected(r)}>💬 Comments</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div style={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            {selected.image && (
              <img src={selected.image} alt="Full Report" style={styles.modalImage} />
            )}
            <h3>{selected.description}</h3>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Submitted:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
            {renderLocation(selected)}

            <Comments reportId={selected._id} />

            <button style={styles.closeBtn} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
  heading: { marginBottom: '20px', fontSize: '1.8rem', fontWeight: '600', color: '#2c3e50' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  card: { background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' },
  image: { width: '100%', height: '180px', objectFit: 'cover' },
  content: { padding: '15px' },
  title: { fontSize: '1.1rem', marginBottom: '10px', color: '#34495e' },
  meta: { fontSize: '0.9rem', color: '#777', marginBottom: '6px' },
  actions: { display: 'flex', gap: '10px', marginTop: '10px' },
  empty: { textAlign: 'center', color: '#888', fontStyle: 'italic' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '90%', maxHeight: '80%', overflowY: 'auto', textAlign: 'center', position: 'relative' },
  modalImage: { maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', marginBottom: '15px' },
  closeBtn: { marginTop: '10px', padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};