import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  description: { type: String, required: true },
  image: { type: String },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved'],
    default: 'pending'
  },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // ✅ Location fields added
  lat: { type: Number },
  lng: { type: Number },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

export default mongoose.model('Report', ReportSchema);