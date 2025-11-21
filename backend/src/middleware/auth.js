import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || req.cookies?.token;
    const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : header;
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET is not set!');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    let payload;
    try {
      payload = jwt.verify(token, jwtSecret);
    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach user info to request - ensure id is valid ObjectId format
    if (!payload.id) {
      console.log('❌ No user ID in token payload');
      return res.status(401).json({ message: 'Invalid token - missing user ID' });
    }
    
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) {
      console.log('❌ User not found for token payload ID:', payload.id, 'Type:', typeof payload.id);
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    req.user = user; // includes role
    next();
  } catch (e) {
    console.error('❌ Auth middleware error:', e.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
}