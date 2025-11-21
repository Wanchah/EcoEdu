import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  progress: { type: Object, default: {} }
});

export default mongoose.model("Progress", ProgressSchema);