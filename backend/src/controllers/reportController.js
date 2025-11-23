import Report from '../models/Report.js';
import cloudinary from '../services/cloudinary.js';
import { awardPoints } from './statsController.js';
import { updateTaskProgress } from './dailyTaskController.js';

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'ecoedu_reports' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Create a new report
export const createReport = async (req, res) => {
  try {
    const { description, lat, lng } = req.body;
    let imageUrl = null;

    // Image upload
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
      } else {
        // Local development fallback ONLY
        imageUrl = 'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64');
      }
    }

    // Create report
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
      await updateTaskProgress(req.user._id, 'report', 1);
    }

    if (req.io) req.io.emit('report_created', report);
    res.status(201).json(report);

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// List reports
export const listReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate('reporter', 'name email role')
      .populate({ 
        path: 'comments',
        populate: { path: 'userId', select: 'name' }
      })
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

    const updated = await Report.findByIdAndUpdate(id, { status }, { new: true });

    if (wasResolved && report.reporter) {
      await awardPoints(report.reporter, 'report_resolved');
    }

    if (req.io) req.io.emit('report_updated', updated);
    res.json(updated);

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Update report description
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

// Delete a report + delete Cloudinary image
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Delete Cloudinary image if present
    if (report.image && report.image.includes('cloudinary')) {
      try {
        const publicId = report.image.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy('ecoedu_reports/' + publicId);
      } catch (err) {
        console.warn('Cloudinary delete failed:', err);
      }
    }

    await Report.findByIdAndDelete(id);
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
