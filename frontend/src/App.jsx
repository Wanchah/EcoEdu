import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Feed from './components/Feed.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import MapPage from './pages/MapPage.jsx';
import ReportForm from './pages/ReportForm.jsx';
import LearningHub from './pages/LearningHub.jsx';
import Admin from './pages/Admin.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import ImpactDashboard from './pages/ImpactDashboard.jsx';
import MyStats from './pages/MyStats.jsx';
import Challenges from './pages/Challenges.jsx';
import DailyTasks from './components/DailyTasks.jsx';
import NotificationToast from './components/NotificationToast.jsx';

function RequireAuth({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'official') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTaskComplete = (data) => {
    if (data.completedCount === data.totalTasks) {
      setNotification({
        type: 'achievement',
        title: 'All Daily Tasks Complete! 🎉',
        message: 'You\'ve earned bonus points!'
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Simple Header - Just Logo */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        background: '#f5f5f5',
        borderBottom: '1px solid #ddd',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#2c3e50' }}>EcoEdu</h3>
        <nav style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/">Feed</Link>
          <Link to="/map">Map</Link>
          <Link to="/report">Report</Link>
          <Link to="/learning">Learning</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/impact">Impact</Link>
          <Link to="/stats">My Stats</Link>
          <Link to="/challenges">Challenges</Link>
          {user?.role === 'official' && <Link to="/admin">Admin</Link>}
          {user && (
            <button
              onClick={logout}
              style={{
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Daily Tasks Widget - Show only on home page with spacing */}
        {user && location.pathname === '/' && (
          <div style={{ marginBottom: '2rem' }}>
            <DailyTasks onTaskComplete={handleTaskComplete} />
          </div>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<RequireAuth><Feed /></RequireAuth>} />
          <Route path="/map" element={<RequireAuth><MapPage /></RequireAuth>} />
          <Route path="/report" element={<RequireAuth><ReportForm /></RequireAuth>} />
          <Route path="/learning" element={<RequireAuth><LearningHub /></RequireAuth>} />
          <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />
          <Route path="/impact" element={<RequireAuth><ImpactDashboard /></RequireAuth>} />
          <Route path="/stats" element={<RequireAuth><MyStats /></RequireAuth>} />
          <Route path="/challenges" element={<RequireAuth><Challenges /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
        </Routes>
      </main>

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}