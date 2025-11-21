// Seed Challenges Script
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Challenge from './models/Challenge.js';

const challenges = [
  // Weekly Challenges
  {
    title: 'Weekly Report Rush',
    description: 'Submit 25 environmental reports this week to help identify and fix community issues!',
    type: 'weekly',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    target: 25,
    metric: 'reports',
    reward: { points: 100, badge: 'Weekly Warrior' },
    isActive: true
  },
  {
    title: 'Learning Sprint',
    description: 'Complete 10 lessons this week and become an eco-expert!',
    type: 'weekly',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    target: 10,
    metric: 'lessons',
    reward: { points: 150, badge: 'Knowledge Master' },
    isActive: true
  },
  {
    title: 'Community Voice',
    description: 'Post 50 comments this week to engage with your community!',
    type: 'weekly',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    target: 50,
    metric: 'comments',
    reward: { points: 75, badge: 'Social Butterfly' },
    isActive: true
  },
  {
    title: 'Point Collector',
    description: 'Earn 500 points this week through all your eco-activities!',
    type: 'weekly',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    target: 500,
    metric: 'points',
    reward: { points: 200, badge: 'Point Champion' },
    isActive: true
  },

  // Monthly Challenges
  {
    title: 'Monthly Impact Maker',
    description: 'Submit 100 reports this month and make a real difference in your community!',
    type: 'monthly',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    target: 100,
    metric: 'reports',
    reward: { points: 500, badge: 'Impact Maker' },
    isActive: true
  },
  {
    title: 'Eco Education Master',
    description: 'Complete all 10 lessons this month and become a certified eco-warrior!',
    type: 'monthly',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    target: 10,
    metric: 'lessons',
    reward: { points: 300, badge: 'Eco Master' },
    isActive: true
  },
  {
    title: 'Community Champion',
    description: 'Post 200 comments this month and help build a stronger community!',
    type: 'monthly',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    target: 200,
    metric: 'comments',
    reward: { points: 250, badge: 'Community Champion' },
    isActive: true
  },
  {
    title: 'Elite Points Collector',
    description: 'Earn 2000 points this month and join the elite eco-warriors!',
    type: 'monthly',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    target: 2000,
    metric: 'points',
    reward: { points: 1000, badge: 'Elite Warrior' },
    isActive: true
  },

  // Special Challenges
  {
    title: 'Earth Day Special',
    description: 'Celebrate Earth Day by submitting 50 reports about environmental issues!',
    type: 'special',
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
    target: 50,
    metric: 'reports',
    reward: { points: 300, badge: 'Earth Day Hero' },
    isActive: true
  },
  {
    title: 'Clean Community Week',
    description: 'Join the clean community initiative - submit reports and complete lessons!',
    type: 'special',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    target: 30,
    metric: 'reports',
    reward: { points: 250, badge: 'Clean Community Leader' },
    isActive: true
  },
  {
    title: 'Green Learning Challenge',
    description: 'Complete 5 lessons in 3 days and unlock special rewards!',
    type: 'special',
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    target: 5,
    metric: 'lessons',
    reward: { points: 200, badge: 'Quick Learner' },
    isActive: true
  },
  {
    title: 'Social Engagement Blitz',
    description: 'Post 100 comments in 5 days and boost community engagement!',
    type: 'special',
    startDate: new Date(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    target: 100,
    metric: 'comments',
    reward: { points: 150, badge: 'Engagement Expert' },
    isActive: true
  }
];

(async () => {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Clear existing challenges (optional - comment out if you want to keep old ones)
    // await Challenge.deleteMany({});
    // console.log('🗑️  Cleared existing challenges');

    // Insert challenges
    const inserted = await Challenge.insertMany(challenges);
    console.log(`✅ Seeded ${inserted.length} challenges!`);
    
    inserted.forEach(challenge => {
      console.log(`   - ${challenge.title} (${challenge.type})`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding challenges:', err);
    process.exit(1);
  }
})();

