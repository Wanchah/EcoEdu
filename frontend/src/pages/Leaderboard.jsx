import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Star } from 'lucide-react';
import api from '../services/api.js';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await api.get('/stats/leaderboard?limit=20');
      setLeaderboard(data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-500" />;
    return <span className="text-gray-500 font-bold">#{rank}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6 flex items-center justify-center">
        <div className="text-green-700">Loading leaderboard...</div>
      </div>
    );
  }

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
            Community Leaderboard
          </h1>
          <p className="text-green-600">Top eco-warriors making a difference!</p>
        </div>

        {/* Podium for top 3 */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-4 shadow-lg text-center order-2"
            >
              <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-600 mb-1">
                {leaderboard[1]?.userId?.name || 'Anonymous'}
              </div>
              <div className="text-3xl font-bold text-gray-500 mb-1">
                {leaderboard[1]?.points || 0}
              </div>
              <div className="text-sm text-gray-500">Level {leaderboard[1]?.level || 1}</div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg p-6 shadow-xl text-center order-1 transform scale-110"
            >
              <Trophy className="w-10 h-10 text-yellow-800 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-900 mb-1">
                {leaderboard[0]?.userId?.name || 'Anonymous'}
              </div>
              <div className="text-4xl font-bold text-yellow-900 mb-1">
                {leaderboard[0]?.points || 0}
              </div>
              <div className="text-sm text-yellow-800">Level {leaderboard[0]?.level || 1}</div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-lg text-center order-3"
            >
              <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {leaderboard[2]?.userId?.name || 'Anonymous'}
              </div>
              <div className="text-3xl font-bold text-orange-500 mb-1">
                {leaderboard[2]?.points || 0}
              </div>
              <div className="text-sm text-orange-500">Level {leaderboard[2]?.level || 1}</div>
            </motion.div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 text-white p-4 font-bold">
            <TrendingUp className="w-5 h-5 inline mr-2" />
            All Rankings
          </div>
          <div className="divide-y">
            {leaderboard.map((user, index) => (
              <motion.div
                key={user._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 flex items-center justify-between hover:bg-green-50 transition-colors ${
                  index < 3 ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 flex items-center justify-center">
                    {getRankIcon(index + 1)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {user.userId?.name || 'Anonymous'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.reportsSubmitted || 0} reports • {user.lessonsCompleted || 0} lessons
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {user.points || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    Level {user.level || 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No rankings yet. Be the first to earn points!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

