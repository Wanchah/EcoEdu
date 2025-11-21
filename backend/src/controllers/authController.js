import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User exists' });

    const hash = await bcrypt.hash(password, 10);

    // Default role is resident
    // Optionally: make the very first user an official
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'official' : 'resident';

    const user = await User.create({ name, email, passwordHash: hash, role });

    // Include role in JWT payload - convert _id to string explicitly
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    const token = jwt.sign({ id: user._id.toString(), role: user.role }, jwtSecret, { expiresIn: '7d' });

    res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    // Include role in JWT payload - convert _id to string explicitly
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    const token = jwt.sign({ id: user._id.toString(), role: user.role }, jwtSecret, { expiresIn: '7d' });

    res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};