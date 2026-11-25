import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

router.put('/preferences', authenticate, async (req, res) => {
  try {
    const { theme, defaultTone, notifications, signature } = req.body;
    if (theme) req.user.preferences.theme = theme;
    if (defaultTone) req.user.preferences.defaultTone = defaultTone;
    if (notifications !== undefined) req.user.preferences.notifications = notifications;
    if (signature !== undefined) req.user.preferences.signature = signature;

    await req.user.save();
    res.json({ success: true, preferences: req.user.preferences });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    if (name) req.user.name = name;
    await req.user.save();
    res.json({ success: true, user: { name: req.user.name, email: req.user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/account', authenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account permanently removed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
