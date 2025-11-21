import express from 'express';
import auth from '../middleware/auth.js';
import {
  getUserStats,
  getLeaderboard,
  getCommunityImpact,
  getActiveChallenges,
  joinChallenge
} from '../controllers/statsController.js';

const router = express.Router();

// Get current user's stats
router.get('/me', auth, getUserStats);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

// Get community impact
router.get('/impact', getCommunityImpact);

// Get active challenges
router.get('/challenges', getActiveChallenges);

// Join a challenge
router.post('/challenges/:challengeId/join', auth, joinChallenge);

export default router;

