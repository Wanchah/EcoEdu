import Report from '../models/Report.js';
import cloudinary from '../services/cloudinary.js';
import { awardPoints } from './statsController.js';
import { updateTaskProgress } from './dailyTaskController.js';

// Create a new report
export const createReport = async (req, res) => {
  try {
    const { description, lat, lng } = req.body;
    let imageUrl = null;

    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const r = await cloudinary.uploader.upload(req.file.path, { folder: 'ecoedu_reports' });
        imageUrl = r.secure_url;
      } else {
        imageUrl = '/uploads/' + req.file.filename;
      }
    }

    const report = await Report.create({
      description,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      image: imageUrl,
      reporter: req.user ? req.user._id : null,
    });

    // Award points for submitting a report
    if (req.user) {
      await awardPoints(req.user._id, 'report_submitted');
      // Update daily task progress
      await updateTaskProgress(req.user._id, 'report', 1);
    }

    if (req.io) req.io.emit('report_created', report);
    res.status(201).json(report);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// List all reports with reporter + comments populated
export const listReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate('reporter', 'name email role')
      .populate({ path: 'comments', populate: { path: 'userId', select: 'name' } })
      .lean();

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

// Update report status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    const wasResolved = report.status !== 'resolved' && status === 'resolved';
    const r = await Report.findByIdAndUpdate(id, { status }, { new: true });
    
    // Award points to reporter if report is resolved
    if (wasResolved && report.reporter) {
      await awardPoints(report.reporter, 'report_resolved');
    }
    
    if (req.io) req.io.emit('report_updated', r);
    res.json(r);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Edit report description
export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updated = await Report.findByIdAndUpdate(id, { description }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Report not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update report' });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Report.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete report' });
  }
};

// Like a report
export const likeReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (!report.likes.includes(userId)) report.likes.push(userId);
    report.dislikes = report.dislikes.filter(d => d.toString() !== userId.toString());

    const updated = await report.save();
    if (req.io) req.io.emit('report_liked', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dislike a report
export const dislikeReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (!report.dislikes.includes(userId)) report.dislikes.push(userId);
    report.likes = report.likes.filter(l => l.toString() !== userId.toString());

    const updated = await report.save();
    if (req.io) req.io.emit('report_disliked', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};