import express from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { memoryStore } from '../models/memoryStore.js';
import { createOAuth2Client, GMAIL_SCOPES } from '../config/google.js';
import { authenticate } from '../middleware/auth.js';
import mongoose from 'mongoose';
import { google } from 'googleapis';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (isDbConnected()) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already registered' });
      const user = new User({ name, email, password });
      await user.save();
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'mailpilot_secret', { expiresIn: '7d' });
      return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, googleConnected: false, preferences: user.preferences } });
    }

    const existing = memoryStore.users.find(u => u.email === email);
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const newUser = {
      _id: 'user_' + Date.now(),
      name,
      email,
      password,
      googleTokens: null,
      preferences: { theme: 'dark', defaultTone: 'professional', notifications: true, signature: `Best regards,\n${name}` },
      comparePassword: async (p) => p === password,
      save: async function() { return this; }
    };
    memoryStore.users.push(newUser);

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET || 'mailpilot_secret', { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, googleConnected: false, preferences: newUser.preferences }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    let user = null;
    if (isDbConnected()) {
      user = await User.findOne({ email });
      if (user && !(await user.comparePassword(password))) user = null;
    } else {
      user = memoryStore.users.find(u => u.email === email) || memoryStore.users[0];
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'mailpilot_secret', { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        googleConnected: !!(user.googleTokens?.accessToken && !user.googleTokens.accessToken.startsWith('mock_') && !user.googleTokens.accessToken.startsWith('demo_')),
        googleEmail: user.googleTokens?.email,
        preferences: user.preferences
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      googleConnected: !!(req.user.googleTokens?.accessToken && !req.user.googleTokens.accessToken.startsWith('mock_') && !req.user.googleTokens.accessToken.startsWith('demo_')),
      googleEmail: req.user.googleTokens?.email,
      preferences: req.user.preferences
    }
  });
});

router.get('/google/url', authenticate, (req, res) => {
  try {
    const oauth2Client = createOAuth2Client();
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: GMAIL_SCOPES,
      state: req.user._id.toString()
    });
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate Google OAuth URL: ' + err.message });
  }
});

// ==========================================
// GOOGLE OAUTH CALLBACK — This is the KEY route
// Google redirects here after user approves
// ==========================================
router.get('/google/callback', async (req, res) => {
  try {
    const { code, state: userId, error } = req.query;

    if (error) {
      console.error('[OAuth Callback] Google returned error:', error);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings?error=no_code`);
    }

    // Exchange code for tokens
    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    console.log('[OAuth Callback] Got tokens. Has refresh_token:', !!tokens.refresh_token);

    oauth2Client.setCredentials(tokens);

    // Get the user's Gmail address
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const googleEmail = userInfo.data.email;

    console.log('[OAuth Callback] Authenticated Google email:', googleEmail);

    // Find user and update tokens
    let user = null;
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    }

    if (!user) {
      // Memory store fallback — find by userId from state
      user = memoryStore.users.find(u => u._id === userId) || memoryStore.users[0];
    }

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings?error=user_not_found`);
    }

    // Store the real tokens
    user.googleTokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || user.googleTokens?.refreshToken,
      tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      email: googleEmail,
      connectedAt: new Date()
    };

    await user.save();
    console.log('[OAuth Callback] Tokens saved for user:', user.email, '→ Google:', googleEmail);

    // Redirect back to frontend settings with success
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings?connected=true&googleEmail=${encodeURIComponent(googleEmail)}`);
  } catch (err) {
    console.error('[OAuth Callback] Error:', err.message);
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings?error=${encodeURIComponent(err.message)}`);
  }
});

router.post('/google/demo-connect', authenticate, async (req, res) => {
  try {
    req.user.googleTokens = {
      accessToken: 'demo_oauth_token_' + Date.now(),
      refreshToken: 'demo_refresh_token',
      email: req.user.email,
      connectedAt: new Date()
    };
    await req.user.save();
    res.json({ success: true, message: 'Google account connected in demo mode.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/google/disconnect', authenticate, async (req, res) => {
  try {
    req.user.googleTokens = null;
    await req.user.save();
    res.json({ success: true, message: 'Google account disconnected.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
