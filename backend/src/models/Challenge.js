import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['weekly', 'monthly', 'special'], 
    default: 'weekly' 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  target: { type: Number, required: true }, // Target number (e.g., 100 reports)
  currentProgress: { type: Number, default: 0 },
  metric: { 
    type: String, 
    enum: ['reports', 'lessons', 'comments', 'points'],
    required: true 
  },
  reward: { 
    points: { type: Number, default: 0 },
    badge: { type: String }
  },
  participants: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contribution: { type: Number, default: 0 }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Challenge', ChallengeSchema);

