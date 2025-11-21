import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function Admin() {
  const [reports, setReports] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in as admin to view reports.');
      setLoading(false);
      return;
    }

    api.get('/reports')
      .then((data) => {
        setReports(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch reports:', err);
        setError(err.response?.data?.message || 'Failed to load reports');
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/reports/${id}/status`, { status });
    setReports(r => r.map(x => x._id === id ? { ...x, status } : x));
  };

  const saveEdit = async (id) => {
    await api.patch(`/reports/${id}`, { description: editedText });
    setReports(r => r.map(x => x._id === id ? { ...x, description: editedText } : x));
    setEditingId(null);
  };

  const deleteReport = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    await api.delete(`/reports/${id}`);
    setReports(r => r.filter(x => x._id !== id));
  };

  const deleteComment = async (reportId, commentId) => {
    await api.delete(`/comments/${reportId}/${commentId}`);
    setReports(r =>
      r.map(x =>
        x._id === reportId
          ? { ...x, comments: x.comments.filter(c => c._id !== commentId) }
          : x
      )
    );
  };

  const likeReport = async (id) => {
    const updated = await api.post(`/reports/${id}/like`);
    setReports(r => r.map(x => x._id === id ? updated : x));
  };

  const dislikeReport = async (id) => {
    const updated = await api.post(`/reports/${id}/dislike`);
    setReports(r => r.map(x => x._id === id ? updated : x));
  };

  const filtered = statusFilter
    ? reports.filter(r => r.status === statusFilter)
    : reports;

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3>Admin Feed Manager</h3>

      <label>Status Filter:</label>
      <select
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        style={{ marginBottom: 10 }}
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </select>

      {filtered.map(feed => (
        <div key={feed._id} style={{ marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
          {editingId === feed._id ? (
            <>
              <textarea
                value={editedText}
                onChange={e => setEditedText(e.target.value)}
                style={{ width: '100%', minHeight: 60 }}
              />
              <button onClick={() => saveEdit(feed._id)}>Save</button>
              <button onClick={() => setEditingId(null)} style={{ marginLeft: 8 }}>Cancel</button>
            </>
          ) : (
            <>
              <strong>{feed.description}</strong>
              <div>Status: {feed.status}</div>
              <div>Likes: {feed.likes?.length || 0}</div>
              <div>Dislikes: {feed.dislikes?.length || 0}</div>
              <div>Comments: {feed.comments?.length || 0}</div>

              <div style={{ marginTop: 8 }}>
                <button onClick={() => updateStatus(feed._id, 'in_progress')}>In Progress</button>
                <button onClick={() => updateStatus(feed._id, 'resolved')} style={{ marginLeft: 8 }}>Resolve</button>
                <button onClick={() => { setEditingId(feed._id); setEditedText(feed.description); }} style={{ marginLeft: 8 }}>Edit</button>
                <button onClick={() => deleteReport(feed._id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                <button onClick={() => likeReport(feed._id)} style={{ marginLeft: 8 }}>👍 Like</button>
                <button onClick={() => dislikeReport(feed._id)} style={{ marginLeft: 8 }}>👎 Dislike</button>
              </div>

              {feed.comments?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <strong>Comments:</strong>
                  <ul>
                    {feed.comments.map(c => (
                      <li key={c._id}>
                        {c.text} — <em>{c.userId?.name}</em>
                        <button
                          onClick={() => deleteComment(feed._id, c._id)}
                          style={{ marginLeft: 8, color: 'red' }}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}