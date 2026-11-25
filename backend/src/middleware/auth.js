import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { memoryStore } from '../models/memoryStore.js';
import mongoose from 'mongoose';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required or invalid format' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mailpilot_secret');

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Resilient fallback to memory store
    const memUser = memoryStore.users.find(u => u._id === decoded.userId || u.email === decoded.email) || memoryStore.users[0];
    if (memUser) {
      req.user = memUser;
      return next();
    }

    return res.status(401).json({ error: 'User no longer exists' });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token', details: error.message });
  }
};
