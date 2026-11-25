import { z } from 'zod';
import { google } from 'googleapis';
import { getAuthenticatedClient } from '../config/google.js';

export const gmailSearchSchema = z.object({
  query: z.string().describe("Gmail search query, e.g., 'from:professor@university.edu', 'subject:internship', 'is:unread', 'meeting'"),
  maxResults: z.number().optional().default(5).describe("Max messages to return, between 1 and 10")
});

export const searchEmails = async (user, { query, maxResults = 5 }) => {
  const auth = getAuthenticatedClient(user);
  const gmail = google.gmail({ version: 'v1', auth });

  try {
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: Math.min(maxResults, 10)
    });

    const messages = listRes.data.messages || [];
    if (messages.length === 0) {
      return { count: 0, messages: [], summary: `No emails found matching query: "${query}"` };
    }

    const details = await Promise.all(
      messages.map(async (m) => {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: m.id,
          format: 'full'
        });

        const headers = msg.data.payload?.headers || [];
        const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || '';
        const to = headers.find(h => h.name.toLowerCase() === 'to')?.value || '';
        const date = headers.find(h => h.name.toLowerCase() === 'date')?.value || '';

        let bodyText = msg.data.snippet || '';
        if (msg.data.payload?.parts) {
          const textPart = msg.data.payload.parts.find(p => p.mimeType === 'text/plain');
          if (textPart && textPart.body?.data) {
            bodyText = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
          }
        }

        return {
          id: msg.data.id,
          threadId: msg.data.threadId,
          subject,
          from,
          to,
          date,
          snippet: msg.data.snippet,
          bodySample: bodyText.slice(0, 500)
        };
      })
    );

    return {
      count: details.length,
      messages: details,
      summary: `Found ${details.length} emails matching "${query}".`
    };
  } catch (err) {
    if (!user?.googleTokens?.accessToken) {
      return {
        status: 'simulated',
        count: 2,
        messages: [
          {
            id: 'mock-msg-1',
            threadId: 'mock-th-1',
            subject: 'Regarding Project Milestone & Exam Schedule',
            from: 'Prof. Davis <davis@faculty.university.edu>',
            to: user?.email || 'user@mailpilot.ai',
            date: new Date(Date.now() - 86400000).toUTCString(),
            snippet: 'Please find the updated project deadlines and midterm exam schedule attached.',
            bodySample: 'Dear Students, Please find the updated project deadlines and midterm schedule attached. Make sure you submit by Friday.'
          },
          {
            id: 'mock-msg-2',
            threadId: 'mock-th-2',
            subject: 'Tomorrow Sprint Sync Update',
            from: 'Sarah Chen <sarah.chen@techcorp.io>',
            to: user?.email || 'user@mailpilot.ai',
            date: new Date(Date.now() - 3600000 * 4).toUTCString(),
            snippet: 'Hey team, let us align on tomorrow meeting agenda and deliverables.',
            bodySample: 'Hey team, please confirm your attendance for the sync tomorrow afternoon.'
          }
        ],
        summary: `[Demo Mode - Connect Gmail in Settings for real live inbox] Found 2 contextual messages matching "${query}".`
      };
    }
    throw new Error(`Gmail API search failed: ${err.message}`);
  }
};
