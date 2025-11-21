import express from 'express';
import upload from '../middleware/upload.js';
import auth from '../middleware/auth.js';
import {
  createReport,
  listReports,
  updateStatus,
  updateReport,
  deleteReport,
  likeReport,
  dislikeReport
} from '../controllers/reportController.js';

const router = express.Router();

// Get all reports
router.get('/', listReports);

// Create a new report (with optional image upload)
router.post('/', auth, upload.single('image'), createReport);

// Update report status (only officials allowed)
router.patch('/:id/status', auth, (req, res, next) => {
  if (req.user.role !== 'official') {
    return res.status(403).json({ message: 'Admins only: insufficient privileges' });
  }
  next();
}, updateStatus);

// Edit report description
router.patch('/:id', auth, updateReport);

// Delete a report
router.delete('/:id', auth, deleteReport);

// Like a report
router.post('/:id/like', auth, likeReport);

// Dislike a report
router.post('/:id/dislike', auth, dislikeReport);

export default router;