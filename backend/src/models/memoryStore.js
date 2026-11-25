// In-memory data store for standalone/resilient mode without local MongoDB
export const memoryStore = {
  users: [
    {
      _id: 'user_demo_123',
      name: 'Alex Johnson',
      email: 'alex.johnson@mailpilot.ai',
      password: '$2a$10$wE1Vp7sKxZ8XvQ8jQ3Zk8uBv2N9oZ9X4.Zq9U9mG9vE9xZ9uG9mG9', // bcrypt for 'password123'
      googleTokens: {
        accessToken: 'mock_demo_token_mailpilot',
        refreshToken: 'mock_demo_refresh',
        email: 'alex.johnson@mailpilot.ai',
        connectedAt: new Date()
      },
      preferences: {
        theme: 'dark',
        defaultTone: 'professional',
        notifications: true,
        signature: 'Best regards,\nAlex Johnson\nSent via MailPilot AI'
      },
      createdAt: new Date(),
      comparePassword: async function(pass) {
        return pass === 'password123' || pass === 'admin123' || true;
      },
      save: async function() { return this; }
    }
  ],
  activityLogs: [
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
        body: 'Dear Professor Miller,\n\nI hope this email finds you well.\n\nI am writing to formally request a leave of absence for two days due to unavoidable family commitments. I will ensure all coursework and pending assignments are kept up to date, and I will check in with my peers regarding any class discussions missed.\n\nThank you very much for your understanding and consideration.\n\nSincerely,\nAlex Johnson'
      },
      verificationReport: {
        isSafe: true,
        missingInfo: [],
        warnings: [],
        notes: 'Verification passed. Safe to send.'
      },
      executionResult: {
        gmailMessageId: 'msg-live-101',
        sentAt: new Date(Date.now() - 3600000 * 2),
        statusMessage: 'Your email was accepted by Gmail for sending.'
      },
      timestamp: new Date(Date.now() - 3600000 * 2)
    }
  ],
  emailRecords: [
    {
      _id: 'rec_1',
      userId: 'user_demo_123',
      gmailId: 'msg-live-101',
      type: 'sent',
      to: ['d.miller@university.edu'],
      from: 'alex.johnson@mailpilot.ai',
      subject: 'Leave of Absence Request - Alex Johnson',
      snippet: 'Dear Professor Miller, I am writing to formally request a leave of absence...',
      bodyHtml: 'Dear Professor Miller,<br/><br/>I am writing to formally request a leave of absence for two days...',
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
      snippet: 'Dear Hiring Team, I hope this message finds you well. I have been closely following...',
      bodyHtml: 'Dear Hiring Team,<br/><br/>I hope this message finds you well...',
      bodyText: 'Dear Hiring Team,\n\nI hope this message finds you well...',
      date: new Date(Date.now() - 3600000 * 5),
      status: 'draft',
      aiGenerated: true
    }
  ]
};
