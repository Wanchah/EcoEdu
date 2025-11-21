import express from "express";
import Progress from "../models/Progress.js";
import auth from "../middleware/auth.js";
import { awardPoints } from "../controllers/statsController.js";
import { updateTaskProgress } from "../controllers/dailyTaskController.js";

const router = express.Router();

// Save or update progress
router.post("/", auth, async (req, res) => {
  const userId = req.user._id; // 👈 use authenticated user
  const { progress } = req.body;

  try {
    if (!progress) {
      return res.status(400).json({ error: "Progress data is required" });
    }

    // Get previous progress to detect new completions
    const previous = await Progress.findOne({ userId });
    const previousCompleted = previous ? Object.keys(previous.progress || {}).length : 0;
    
    const updated = await Progress.findOneAndUpdate(
      { userId },
      { userId, progress },
      { upsert: true, new: true, runValidators: true }
    );
    
    // Award points for newly completed lessons
    const newCompleted = Object.keys(progress || {}).length;
    const newlyCompleted = newCompleted - previousCompleted;
    if (newlyCompleted > 0) {
      for (let i = 0; i < newlyCompleted; i++) {
        await awardPoints(userId, 'lesson_completed');
      }
      // Update daily task progress
      await updateTaskProgress(userId, 'lesson', newlyCompleted);
    }
    
    console.log("✅ Progress saved successfully for user:", userId);
    res.json(updated);
  } catch (err) {
    console.error("❌ Error saving progress:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch progress
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const data = await Progress.findOne({ userId });
    console.log("✅ Progress fetched for user:", userId, data ? "Found" : "Not found");
    res.json(data || { progress: {} });
  } catch (err) {
    console.error("❌ Error fetching progress:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;