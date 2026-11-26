// In-memory data store for standalone/resilient mode without local MongoDB

// Helper: a save() that actually persists changes back into the users array
function makeSaveFn(usersArray, userRef) {
  return async function() {
    const idx = usersArray.findIndex(u => u._id === userRef._id);
    if (idx !== -1) {
      usersArray[idx] = userRef;
    }
    return userRef;
  };
}

export const memoryStore = {
  users: [],
  activityLogs: [],
  emailRecords: []
};

// Seed the demo user separately so save() has access to memoryStore.users
const demoUser = {
  _id: 'user_demo_123',
  name: 'Alex Johnson',
  email: 'alex.johnson@mailpilot.ai',
  password: 'password123',
  // No real Google tokens by default — user must connect via OAuth
  googleTokens: null,
  preferences: {
    theme: 'dark',
    defaultTone: 'professional',
    notifications: true,
    signature: 'Best regards,\nAlex Johnson\nSent via MailPilot AI'
  },
  createdAt: new Date(),
  comparePassword: async function(pass) {
    return pass === 'password123' || pass === 'admin123';
  },
  save: async function() {
    const idx = memoryStore.users.findIndex(u => u._id === this._id);
    if (idx !== -1) {
      memoryStore.users[idx] = this;
      console.log('[memoryStore] Saved user:', this.email, '| googleTokens:', this.googleTokens ? 'SET ✅' : 'null');
    }
    return this;
  }
};

memoryStore.users.push(demoUser);

memoryStore.activityLogs = [
  {
    _id: 'act_1',
    userId: 'user_demo_123',
    command: 'Send an email to my professor requesting two days of leave.',
    status: 'executed',
    plan: [
      { step: 1, name: 'Intent Understanding', status: 'completed' },
      { step: 2, name: 'Contact & Inbox Research', status: 'completed' },
      { step: 3, name: 'Email Drafting & Tone Alignment', status: 'completed' },
      { step: 4, name: 'Security & Recipient Verification', status: 'completed' },
      { step: 5, name: 'User Explicit Approval Gate', status: 'completed' },
      { step: 6, name: 'Execution via Gmail API', status: 'completed' }
    ],
    agentsActivated: [
      { name: 'Intent Understanding Agent', status: 'completed', summary: 'Identified academic leave request with formal tone' },
      { name: 'Email Research Agent', status: 'completed', summary: 'Resolved Prof. David Miller (d.miller@university.edu)' },
      { name: 'Email Writing Agent', status: 'completed', summary: 'Drafted formal leave request highlighting assignment continuity' },
      { name: 'Email Verification Agent', status: 'completed', summary: 'All security checks passed. Verified 1 valid recipient.' },
      { name: 'Execution Agent', status: 'completed', summary: 'Accepted by Gmail API for dispatch' }
    ],
    toolsCalled: [
      { tool: 'Contact Lookup Tool', input: { query: 'professor' }, output: [{ name: 'Prof. David Miller', email: 'd.miller@university.edu' }], status: 'success' },
      { tool: 'Gmail Send Tool', input: { to: ['d.miller@university.edu'], subject: 'Leave of Absence Request' }, output: { messageId: 'msg-live-101' }, status: 'success' }
    ],
    emailDraft: {
      to: ['d.miller@university.edu'],
      subject: 'Leave of Absence Request - Alex Johnson',
      body: 'Dear Professor Miller,\n\nI hope this email finds you well.\n\nI am writing to formally request a leave of absence for two days due to unavoidable family commitments.\n\nThank you for your understanding.\n\nSincerely,\nAlex Johnson'
    },
    verificationReport: { isSafe: true, missingInfo: [], warnings: [], notes: 'Verification passed. Safe to send.' },
    executionResult: { gmailMessageId: 'msg-live-101', sentAt: new Date(Date.now() - 3600000 * 2), statusMessage: 'Email sent via Gmail API.' },
    timestamp: new Date(Date.now() - 3600000 * 2)
  }
];

memoryStore.emailRecords = [
  {
    _id: 'rec_1',
    userId: 'user_demo_123',
    gmailId: 'msg-live-101',
    type: 'sent',
    to: ['d.miller@university.edu'],
    from: 'alex.johnson@mailpilot.ai',
    subject: 'Leave of Absence Request - Alex Johnson',
    snippet: 'Dear Professor Miller, I am writing to formally request a leave of absence...',
    bodyText: 'Dear Professor Miller,\n\nI am writing to formally request a leave of absence...',
    date: new Date(Date.now() - 3600000 * 2),
    status: 'sent',
    aiGenerated: true
  },
  {
    _id: 'rec_2',
    userId: 'user_demo_123',
    gmailId: 'draft-live-102',
    type: 'draft',
    to: ['careers@innovatech.com'],
    from: 'alex.johnson@mailpilot.ai',
    subject: 'Inquiry Regarding Summer Software Internship 2026',
    snippet: 'Dear Hiring Team, I hope this message finds you well...',
    bodyText: 'Dear Hiring Team,\n\nI hope this message finds you well...',
    date: new Date(Date.now() - 3600000 * 5),
    status: 'draft',
    aiGenerated: true
  }
];
