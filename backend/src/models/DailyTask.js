import mongoose from 'mongoose';

const DailyTaskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0) // Start of day
  },
  tasks: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { 
      type: String, 
      enum: ['report', 'lesson', 'comment', 'login', 'streak'],
      required: true 
    },
    target: { type: Number, required: true },
    current: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    reward: { 
      points: { type: Number, default: 0 }
    }
  }],
  completedCount: { type: Number, default: 0 },
  totalTasks: { type: Number, default: 3 }
}, { timestamps: true });

// Index for quick lookups
DailyTaskSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyTask', DailyTaskSchema);

