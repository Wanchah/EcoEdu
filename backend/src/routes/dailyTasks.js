import express from 'express';
import auth from '../middleware/auth.js';
import {
  getDailyTasks,
  completeTask
} from '../controllers/dailyTaskController.js';

const router = express.Router();

// Get daily tasks
router.get('/', auth, getDailyTasks);

// Complete a task
router.post('/:taskId/complete', auth, completeTask);

export default router;

