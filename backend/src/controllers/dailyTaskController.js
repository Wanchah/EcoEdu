import DailyTask from '../models/DailyTask.js';
import { awardPoints } from './statsController.js';

// Generate daily tasks for a user
const generateDailyTasks = () => {
  const tasks = [
    {
      id: 'daily_report',
      title: 'Submit a Report',
      description: 'Report an environmental issue in your community',
      type: 'report',
      target: 1,
      reward: { points: 10 }
    },
    {
      id: 'daily_lesson',
      title: 'Complete a Lesson',
      description: 'Learn something new about the environment',
      type: 'lesson',
      target: 1,
      reward: { points: 15 }
    },
    {
      id: 'daily_comment',
      title: 'Engage with Community',
      description: 'Post a comment on a report',
      type: 'comment',
      target: 1,
      reward: { points: 5 }
    }
  ];

  // Randomly select 3 tasks
  const shuffled = tasks.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

// Get or create daily tasks for user
export const getDailyTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dailyTask = await DailyTask.findOne({ 
      userId, 
      date: today 
    });

    if (!dailyTask) {
      // Generate new tasks for today
      const tasks = generateDailyTasks();
      dailyTask = await DailyTask.create({
        userId,
        date: today,
        tasks,
        totalTasks: tasks.length
      });
    }

    res.json(dailyTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update task progress
export const updateTaskProgress = async (userId, taskType, amount = 1) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyTask = await DailyTask.findOne({ 
      userId, 
      date: today 
    });

    if (!dailyTask) return null;

    let taskUpdated = false;
    let completedTask = null;

    // Update matching tasks
    for (let task of dailyTask.tasks) {
      if (task.type === taskType && !task.completed) {
        task.current += amount;
        
        if (task.current >= task.target) {
          task.completed = true;
          taskUpdated = true;
          completedTask = task;
          
          // Award points
          if (task.reward?.points) {
            await awardPoints(userId, 'daily_task', task.reward.points);
          }
        }
      }
    }

    // Update completed count
    dailyTask.completedCount = dailyTask.tasks.filter(t => t.completed).length;
    await dailyTask.save();

    return { taskUpdated, completedTask, dailyTask };
  } catch (err) {
    console.error('Error updating task progress:', err);
    return null;
  }
};

// Mark task as complete manually
export const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyTask = await DailyTask.findOne({ 
      userId, 
      date: today 
    });

    if (!dailyTask) {
      return res.status(404).json({ error: 'Daily tasks not found' });
    }

    const task = dailyTask.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.completed) {
      return res.json({ message: 'Task already completed', dailyTask });
    }

    task.completed = true;
    task.current = task.target;
    dailyTask.completedCount = dailyTask.tasks.filter(t => t.completed).length;
    
    // Award points
    if (task.reward?.points) {
      await awardPoints(userId, 'daily_task', task.reward.points);
    }

    await dailyTask.save();
    res.json(dailyTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

