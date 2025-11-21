import React,{useState} from 'react';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';
export default function Signup(){ const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const nav = useNavigate();
const submit = async (e) => { e.preventDefault(); try{ const res = await api.post('/auth/signup', { name, email, password: pass }); localStorage.setItem('token', res.token); localStorage.setItem('user', JSON.stringify(res.user)); nav('/'); } catch(err){ alert(err.response?.data?.message || err.message); } };
return (<div className='card'><h3>Sign up</h3><form onSubmit={submit} style={{display:'grid',gap:8}}><input placeholder='name' value={name} onChange={e=>setName(e.target.value)} /><input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} /><input placeholder='password' value={pass} onChange={e=>setPass(e.target.value)} /><button>Sign up</button></form></div>); }
