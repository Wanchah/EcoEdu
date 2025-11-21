// backend/src/seed.js
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Report from './models/Report.js';

(async () => {
  await connectDB();
  const report = await Report.create({
    description: 'Test pothole on Main Street',
    status: 'pending',
    image: '',
    likes: [],
    dislikes: [],
  });
  console.log('Seeded report:', report._id);
  process.exit();
})();