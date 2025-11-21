import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import socket from '../socket.js';

export default function Comments({ reportId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    // Load existing comments
    api.get(`/comments/${reportId}`)
      .then(setComments)
      .catch(err => console.error('Failed to load comments:', err));

    // Listen for new comments via socket
    socket.on('comment_created', (c) => {
      if (c.reportId === reportId) {
        setComments(prev => [...prev, c]);
      }
    });

    return () => socket.off('comment_created');
  }, [reportId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const newComment = await api.post(`/comments/${reportId}`, { text });
      setComments(prev => [...prev, newComment]);
      setText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h4>Comments</h4>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a comment..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Post</button>
      </form>
      <ul style={styles.list}>
        {comments.map(c => (
          <li key={c._id} style={styles.item}>
            <strong>{c.userId?.name || 'Anonymous'}:</strong> {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { marginTop: '15px', textAlign: 'left' },
  form: { display: 'flex', gap: '10px', marginBottom: '10px' },
  input: { flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' },
  button: { padding: '8px 12px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0 },
  item: { marginBottom: '6px' }
};