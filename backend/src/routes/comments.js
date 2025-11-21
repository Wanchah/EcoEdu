import express from 'express';
import Comment from '../models/Comments.js';
import Report from '../models/Report.js';
import auth from '../middleware/auth.js';
import { awardPoints } from '../controllers/statsController.js';
import { updateTaskProgress } from '../controllers/dailyTaskController.js';

const router = express.Router();

// GET all comments for a specific report
router.get('/:reportId', async (req, res) => {
  try {
    const comments = await Comment.find({ reportId: req.params.reportId })
      .populate('userId', 'name');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST a new comment for a specific report
router.post('/:reportId', auth, async (req, res) => {
  const { reportId } = req.params;
  const { text } = req.body;
  const userId = req.user?._id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized: userId missing' });

  try {
    let newComment = await Comment.create({ reportId, text, userId });
    newComment = await newComment.populate('userId', 'name');
    await Report.findByIdAndUpdate(reportId, { $push: { comments: newComment._id } });

    // Award points for posting a comment
    await awardPoints(userId, 'comment_posted');
    // Update daily task progress
    await updateTaskProgress(userId, 'comment', 1);

    if (req.io) req.io.emit('comment_created', newComment);
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// DELETE a comment
router.delete('/:reportId/:commentId', auth, async (req, res) => {
  const { reportId, commentId } = req.params;
  try {
    await Comment.findByIdAndDelete(commentId);
    await Report.findByIdAndUpdate(reportId, { $pull: { comments: commentId } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;