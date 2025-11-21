import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, Award, TrendingUp, Users, Zap } from 'lucide-react';
import api from '../services/api.js';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const data = await api.get('/stats/challenges');
      setChallenges(data);
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId) => {
    try {
      await api.post(`/stats/challenges/${challengeId}/join`);
      fetchChallenges(); // Refresh
      alert('Successfully joined the challenge!');
    } catch (err) {
      console.error('Failed to join challenge:', err);
      alert('Failed to join challenge');
    }
  };

  const getProgressPercentage = (challenge) => {
    return Math.min((challenge.currentProgress / challenge.target) * 100, 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6 flex items-center justify-center">
        <div className="text-green-700">Loading challenges...</div>
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
            <Target className="w-10 h-10" />
            Community Challenges
          </h1>
          <p className="text-green-600">Join forces with your community to make a bigger impact!</p>
        </div>

        {challenges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No active challenges at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for new challenges!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {challenges.map((challenge, index) => {
              const progress = getProgressPercentage(challenge);
              const isParticipating = challenge.participants?.some(
                p => p.userId?._id || p.userId === localStorage.getItem('userId')
              );

              return (
                <motion.div
                  key={challenge._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">{challenge.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          challenge.type === 'weekly' ? 'bg-blue-100 text-blue-700' :
                          challenge.type === 'monthly' ? 'bg-purple-100 text-purple-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {challenge.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{challenge.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Ends: {formatDate(challenge.endDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {challenge.participants?.length || 0} participants
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        Progress: {challenge.currentProgress} / {challenge.target} {challenge.metric}
                      </span>
                      <span className="font-semibold text-green-600">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {challenge.reward?.points > 0 && (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <Zap className="w-5 h-5" />
                          <span className="font-semibold">+{challenge.reward.points} points</span>
                        </div>
                      )}
                      {challenge.reward?.badge && (
                        <div className="flex items-center gap-2 text-purple-600">
                          <Award className="w-5 h-5" />
                          <span className="font-semibold">{challenge.reward.badge} badge</span>
                        </div>
                      )}
                    </div>

                    {!isParticipating && (
                      <button
                        onClick={() => joinChallenge(challenge._id)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Join Challenge
                      </button>
                    )}
                    {isParticipating && (
                      <div className="px-6 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                        ✓ Joined
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

