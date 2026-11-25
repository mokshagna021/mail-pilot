import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MailPilot AI Backend', timestamp: new Date() });
});

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mailpilot';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log('MongoDB connected successfully to:', uri);
  } catch (err) {
    console.warn('MongoDB connection warning:', err.message);
    console.log('Starting in standalone resilient mode with memory/fallback handlers.');
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`MailPilot AI backend server running on port ${PORT}`);
  });
});
