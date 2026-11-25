import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  googleTokens: {
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiry: { type: Date },
    idToken: { type: String },
    email: { type: String },
    connectedAt: { type: Date }
  },
  preferences: {
    theme: { type: String, default: 'dark' },
    defaultTone: { type: String, default: 'professional' },
    notifications: { type: Boolean, default: true },
    signature: { type: String, default: 'Best regards,\nSent via MailPilot AI' }
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
