import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { orchestrateTask } from '../agents/orchestrator.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { memoryStore } from '../models/memoryStore.js';
import mongoose from 'mongoose';

const router = express.Router();
const isDb = () => mongoose.connection.readyState === 1;

router.post('/command', authenticate, async (req, res) => {
  try {
    const { command } = req.body;
    if (!command || !command.trim()) {
      return res.status(400).json({ error: 'Command text is required.' });
    }

    const result = await orchestrateTask({
      user: req.user,
      command: command.trim()
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/approve', authenticate, async (req, res) => {
  try {
    const { activityId, action, editedEmail } = req.body;
    if (!activityId || !action) {
      return res.status(400).json({ error: 'activityId and action (approve_send, save_draft, cancel) required.' });
    }

    const result = await orchestrateTask({
      user: req.user,
      command: '',
      approvalPayload: {
        activityId,
        action,
        editedEmail
      }
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/activity', authenticate, async (req, res) => {
  try {
    if (isDb()) {
      const logs = await ActivityLog.find({ userId: req.user._id })
        .sort({ timestamp: -1 })
        .limit(50);
      return res.json({ logs });
    }
    const logs = memoryStore.activityLogs.filter(l => l.userId.toString() === req.user._id.toString());
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/activity/:id', authenticate, async (req, res) => {
  try {
    if (isDb()) {
      const log = await ActivityLog.findOne({ _id: req.params.id, userId: req.user._id });
      if (!log) return res.status(404).json({ error: 'Activity log not found.' });
      return res.json({ log });
    }
    const log = memoryStore.activityLogs.find(l => l._id.toString() === req.params.id.toString() && l.userId.toString() === req.user._id.toString());
    if (!log) return res.status(404).json({ error: 'Activity log not found.' });
    res.json({ log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
