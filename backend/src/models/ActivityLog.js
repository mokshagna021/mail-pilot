import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  command: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['planning', 'in_progress', 'awaiting_approval', 'approved', 'rejected', 'executed', 'failed'],
    default: 'planning' 
  },
  plan: { type: Array, default: [] },
  agentsActivated: [{
    name: { type: String },
    status: { type: String },
    startedAt: { type: Date },
    completedAt: { type: Date },
    summary: { type: String }
  }],
  toolsCalled: [{
    tool: { type: String },
    input: { type: mongoose.Schema.Types.Mixed },
    output: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failed'], default: 'success' }
  }],
  emailDraft: {
    to: [{ type: String }],
    cc: [{ type: String }],
    bcc: [{ type: String }],
    subject: { type: String },
    body: { type: String },
    threadId: { type: String },
    gmailDraftId: { type: String },
    attachments: [{ filename: String, path: String, mimeType: String }]
  },
  verificationReport: {
    isSafe: { type: Boolean, default: true },
    missingInfo: [{ type: String }],
    sensitiveContentDetected: { type: Boolean, default: false },
    warnings: [{ type: String }],
    recipientMistakeDetected: { type: Boolean, default: false },
    notes: { type: String }
  },
  executionResult: {
    gmailMessageId: { type: String },
    sentAt: { type: Date },
    statusMessage: { type: String },
    error: { type: String }
  },
  timestamp: { type: Date, default: Date.now }
});

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
