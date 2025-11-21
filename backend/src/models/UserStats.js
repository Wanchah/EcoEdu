import mongoose from 'mongoose';

const UserStatsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  points: { type: Number, default: 0 },
  reportsSubmitted: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  commentsPosted: { type: Number, default: 0 },
  reportsResolved: { type: Number, default: 0 }, // Reports they submitted that got resolved
  badges: [{ type: String }],
  level: { type: Number, default: 1 },
  totalImpact: {
    wasteReduced: { type: Number, default: 0 }, // in kg
    treesPlanted: { type: Number, default: 0 },
    waterSaved: { type: Number, default: 0 }, // in liters
    co2Reduced: { type: Number, default: 0 } // in kg
  },
  streak: { type: Number, default: 0 }, // Daily login streak
  lastActiveDate: { type: Date }
}, { timestamps: true });

// Calculate level based on points (every 100 points = 1 level)
UserStatsSchema.methods.updateLevel = function() {
  this.level = Math.floor(this.points / 100) + 1;
};

export default mongoose.model('UserStats', UserStatsSchema);

