import React, { useState } from 'react';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password: pass });

      console.log('✅ Login response:', res); // Confirm structure

      if (!res.token || !res.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      nav('/');
    } catch (err) {
      console.error('❌ Login error:', err);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="card">
      <h3>Login</h3>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <input
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        <button>Login</button>
      </form>
      <p>Need account? <a href="/signup">Sign up</a></p>
    </div>
  );
}