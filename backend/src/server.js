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

// Allow multiple origins: local dev + Vercel production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('CORS: Origin not allowed: ' + origin));
  },
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

// Debug: show what redirect URI the backend is using (safe to expose - no secrets)
app.get('/api/debug-oauth', (req, res) => {
  res.json({
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    FRONTEND_URL: process.env.FRONTEND_URL,
    GOOGLE_CLIENT_ID_prefix: (process.env.GOOGLE_CLIENT_ID || '').slice(0, 20) + '...'
  });
});

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mailpilot';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB connected successfully to:', uri);
  } catch (err) {
    console.warn('MongoDB connection warning:', err.message);
    console.log('Starting in standalone resilient mode with in-memory store.');
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`MailPilot AI backend running on port ${PORT}`);
  });
});
