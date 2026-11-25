import mongoose from 'mongoose';

const emailRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gmailId: { type: String, index: true },
  threadId: { type: String, index: true },
  type: { type: String, enum: ['sent', 'draft', 'inbox_cached'], required: true },
  to: [{ type: String }],
  cc: [{ type: String }],
  bcc: [{ type: String }],
  from: { type: String },
  subject: { type: String },
  snippet: { type: String },
  bodyHtml: { type: String },
  bodyText: { type: String },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'approved', 'sent', 'failed'], default: 'sent' },
  aiGenerated: { type: Boolean, default: false },
  promptUsed: { type: String }
});

export const EmailRecord = mongoose.model('EmailRecord', emailRecordSchema);
