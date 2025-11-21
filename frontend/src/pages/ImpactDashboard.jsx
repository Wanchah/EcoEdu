import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FileText, CheckCircle, Leaf, Droplets, 
  Recycle, TrendingUp, Award, Target 
} from 'lucide-react';
import api from '../services/api.js';

export default function ImpactDashboard() {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpact();
  }, []);

  const fetchImpact = async () => {
    try {
      const data = await api.get('/stats/impact');
      setImpact(data);
    } catch (err) {
      console.error('Failed to fetch impact:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6 flex items-center justify-center">
        <div className="text-green-700">Loading impact data...</div>
      </div>
    );
  }

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      label: 'Active Users',
      value: impact?.totalUsers || 0,
      color: 'bg-blue-500'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      label: 'Reports Submitted',
      value: impact?.totalReports || 0,
      color: 'bg-green-500'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      label: 'Issues Resolved',
      value: impact?.resolvedReports || 0,
      color: 'bg-emerald-500'
    },
    {
      icon: <Award className="w-8 h-8" />,
      label: 'Total Points',
      value: impact?.totalPoints || 0,
      color: 'bg-yellow-500'
    }
  ];

  const impactMetrics = [
    {
      icon: <Recycle className="w-6 h-6" />,
      label: 'Waste Reduced',
      value: (impact?.totalImpact?.wasteReduced || 0).toFixed(1),
      unit: 'kg',
      color: 'text-green-600'
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      label: 'Trees Planted',
      value: impact?.totalImpact?.treesPlanted || 0,
      unit: 'trees',
      color: 'text-emerald-600'
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      label: 'Water Saved',
      value: (impact?.totalImpact?.waterSaved || 0).toFixed(0),
      unit: 'liters',
      color: 'text-blue-600'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'CO₂ Reduced',
      value: (impact?.totalImpact?.co2Reduced || 0).toFixed(1),
      unit: 'kg',
      color: 'text-purple-600'
    }
  ];

  const resolutionRate = impact?.totalReports 
    ? ((impact.resolvedReports / impact.totalReports) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 flex items-center justify-center gap-3 mb-2">
            <Target className="w-10 h-10" />
            Community Impact Dashboard
          </h1>
          <p className="text-green-600">Together we're making a real difference!</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.color} rounded-xl p-6 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                {stat.icon}
                <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
              </div>
              <div className="text-white/90 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            Environmental Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className="text-center p-4 bg-green-50 rounded-lg"
              >
                <div className={`${metric.color} flex justify-center mb-2`}>
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600">{metric.unit}</div>
                <div className="text-sm font-medium text-gray-700 mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resolution Rate</h3>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${resolutionRate}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="bg-green-600 h-8 rounded-full flex items-center justify-center"
                >
                  <span className="text-white font-bold text-sm">
                    {resolutionRate}%
                  </span>
                </motion.div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {impact?.resolvedReports || 0} of {impact?.totalReports || 0} reports resolved
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Active Challenges</h3>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {impact?.activeChallenges || 0}
            </div>
            <div className="text-sm text-gray-600">
              Community challenges in progress
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

