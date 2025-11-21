import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, TrendingUp, FileText, BookOpen, MessageSquare, 
  Target, Zap, Flame, Star, Trophy 
} from 'lucide-react';
import api from '../services/api.js';

export default function MyStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.get('/stats/me');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6 flex items-center justify-center">
        <div className="text-green-700">Loading your stats...</div>
      </div>
    );
  }

  const pointsToNextLevel = ((stats?.level || 1) * 100) - (stats?.points || 0);
  const progressToNextLevel = ((stats?.points || 0) % 100) / 100 * 100;

  const achievements = [
    { icon: <FileText />, label: 'Reports', value: stats?.reportsSubmitted || 0, color: 'text-blue-600' },
    { icon: <BookOpen />, label: 'Lessons', value: stats?.lessonsCompleted || 0, color: 'text-green-600' },
    { icon: <MessageSquare />, label: 'Comments', value: stats?.commentsPosted || 0, color: 'text-purple-600' },
    { icon: <Target />, label: 'Resolved', value: stats?.reportsResolved || 0, color: 'text-emerald-600' }
  ];

  const badges = [
    { name: 'First Steps', earned: (stats?.points || 0) >= 10, icon: '🌱' },
    { name: 'Eco Warrior', earned: (stats?.points || 0) >= 50, icon: '⚔️' },
    { name: 'Green Champion', earned: (stats?.points || 0) >= 100, icon: '🏆' },
    { name: 'Report Master', earned: (stats?.reportsSubmitted || 0) >= 10, icon: '📝' },
    { name: 'Knowledge Seeker', earned: (stats?.lessonsCompleted || 0) >= 5, icon: '📚' },
    { name: 'Community Voice', earned: (stats?.commentsPosted || 0) >= 20, icon: '💬' },
    { name: 'Problem Solver', earned: (stats?.reportsResolved || 0) >= 5, icon: '✅' },
    { name: 'Fire Starter', earned: (stats?.streak || 0) >= 7, icon: '🔥' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-10 h-10" />
            My Statistics
          </h1>
          <p className="text-green-600">Track your eco-journey!</p>
        </div>

        {/* Points & Level Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-8 text-white shadow-xl mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm opacity-90 mb-1">Total Points</div>
              <div className="text-5xl font-bold">{stats?.points || 0}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">Level</div>
              <div className="text-5xl font-bold">{stats?.level || 1}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Level {((stats?.level || 1) + 1)}</span>
              <span>{pointsToNextLevel} points needed</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextLevel}%` }}
                transition={{ duration: 1 }}
                className="bg-white h-4 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-md text-center"
            >
              <div className={`${achievement.color} flex justify-center mb-2`}>
                {achievement.icon}
              </div>
              <div className="text-2xl font-bold text-gray-800">{achievement.value}</div>
              <div className="text-sm text-gray-600">{achievement.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Badges & Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div
                key={badge.name}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  badge.earned
                    ? 'bg-green-50 border-green-500 shadow-md'
                    : 'bg-gray-50 border-gray-300 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className={`font-semibold text-sm ${
                  badge.earned ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {badge.name}
                </div>
                {badge.earned && (
                  <div className="text-xs text-green-600 mt-1">✓ Earned</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Streak */}
        {stats?.streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-white shadow-lg text-center"
          >
            <Flame className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.streak} Day Streak!</div>
            <div className="text-sm opacity-90">Keep it up! 🔥</div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

