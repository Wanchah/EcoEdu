import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecoedu";

  try {
    await mongoose.connect(uri, {
      // Removed deprecated options - mongoose 7+ handles these automatically
    });
    console.log("✅ MongoDB connected:", uri.includes("mongodb+srv") ? "Atlas Cluster" : "Local Instance");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // exit process if DB fails
  }
}