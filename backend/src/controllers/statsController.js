import UserStats from '../models/UserStats.js';
import User from '../models/User.js';
import Report from '../models/Report.js';
import Progress from '../models/Progress.js';
import Challenge from '../models/Challenge.js';

// Get or create user stats
export const getUserStats = async (req, res) => {
  try {
    let stats = await UserStats.findOne({ userId: req.user._id });
    if (!stats) {
      stats = await UserStats.create({ userId: req.user._id });
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const stats = await UserStats.find()
      .populate('userId', 'name email')
      .sort({ points: -1 })
      .limit(limit);
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Award points for actions
export const awardPoints = async (userId, action, amount = 0) => {
  try {
    let stats = await UserStats.findOne({ userId });
    if (!stats) {
      stats = await UserStats.create({ userId });
    }

    // Point values for different actions
    const pointValues = {
      report_submitted: 10,
      lesson_completed: 15,
      comment_posted: 5,
      report_resolved: 20,
      challenge_completed: 50,
      daily_login: 5
    };

    const pointsToAdd = amount || pointValues[action] || 0;
    stats.points += pointsToAdd;
    stats.updateLevel();
    
    // Update specific counters
    if (action === 'report_submitted') stats.reportsSubmitted += 1;
    if (action === 'lesson_completed') stats.lessonsCompleted += 1;
    if (action === 'comment_posted') stats.commentsPosted += 1;
    if (action === 'report_resolved') stats.reportsResolved += 1;

    await stats.save();
    return stats;
  } catch (err) {
    console.error('Error awarding points:', err);
    return null;
  }
};

// Get community impact stats
export const getCommunityImpact = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });
    const totalProgress = await Progress.countDocuments();
    
    const allStats = await UserStats.find();
    const totalPoints = allStats.reduce((sum, s) => sum + s.points, 0);
    const totalImpact = allStats.reduce((acc, s) => ({
      wasteReduced: acc.wasteReduced + (s.totalImpact.wasteReduced || 0),
      treesPlanted: acc.treesPlanted + (s.totalImpact.treesPlanted || 0),
      waterSaved: acc.waterSaved + (s.totalImpact.waterSaved || 0),
      co2Reduced: acc.co2Reduced + (s.totalImpact.co2Reduced || 0)
    }), { wasteReduced: 0, treesPlanted: 0, waterSaved: 0, co2Reduced: 0 });

    res.json({
      totalUsers,
      totalReports,
      resolvedReports,
      totalProgress,
      totalPoints,
      totalImpact,
      activeChallenges: await Challenge.countDocuments({ isActive: true })
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get active challenges
export const getActiveChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ 
      isActive: true,
      endDate: { $gte: new Date() }
    }).sort({ endDate: 1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Join a challenge
export const joinChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const existingParticipant = challenge.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (!existingParticipant) {
      challenge.participants.push({ userId: req.user._id, contribution: 0 });
      await challenge.save();
    }

    res.json(challenge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

