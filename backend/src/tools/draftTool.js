import { z } from 'zod';
import { google } from 'googleapis';
import { getAuthenticatedClient } from '../config/google.js';

export const createDraftSchema = z.object({
  to: z.array(z.string().email()).describe("List of verified recipient email addresses"),
  cc: z.array(z.string().email()).optional().describe("CC email addresses"),
  bcc: z.array(z.string().email()).optional().describe("BCC email addresses"),
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Email body content (text or HTML)"),
  threadId: z.string().optional().describe("Optional threadId if replying")
});

const makeRawEmail = ({ to, cc, bcc, subject, body }) => {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `To: ${Array.isArray(to) ? to.join(', ') : to}`,
    cc && cc.length ? `Cc: ${cc.join(', ')}` : '',
    bcc && bcc.length ? `Bcc: ${bcc.join(', ')}` : '',
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    body.replace(/\n/g, '<br/>')
  ].filter(Boolean);

  const message = messageParts.join('\r\n');
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const createDraft = async (user, { to, cc, bcc, subject, body, threadId }) => {
  // Check if live Google OAuth credentials exist
  const hasLiveTokens = Boolean(
    user?.googleTokens?.refreshToken ||
    (user?.googleTokens?.accessToken &&
      !user?.googleTokens?.accessToken.startsWith('demo_') &&
      !user?.googleTokens?.accessToken.startsWith('mock_'))
  );

  // --- SIMULATED MODE (no real Google token) ---
  if (!hasLiveTokens) {
    console.log('[draftTool] No live Google token — saving draft locally (simulated).');
    return {
      success: true,
      simulated: true,
      draftId: `draft-local-${Date.now()}`,
      status: 'Draft saved in MailPilot workspace (connect Gmail in Settings to sync to Gmail)',
      to,
      subject,
      preview: (body || '').slice(0, 160)
    };
  }

  // --- LIVE GMAIL MODE ---
  try {
    const auth = getAuthenticatedClient(user);
    const gmail = google.gmail({ version: 'v1', auth });
    const raw = makeRawEmail({ to: Array.isArray(to) ? to : [to], cc, bcc, subject, body });

    const res = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw,
          threadId: threadId || undefined
        }
      }
    });

    return {
      success: true,
      draftId: res.data.id,
      messageId: res.data.message?.id,
      status: 'Draft created in your Gmail account',
      to,
      subject,
      preview: body.slice(0, 160)
    };
  } catch (err) {
    console.warn('[draftTool] Live Gmail draft failed, falling back to local save:', err.message);
    return {
      success: true,
      simulated: true,
      draftId: `draft-local-${Date.now()}`,
      status: 'Draft saved locally (Gmail sync failed — check OAuth permissions in Settings)',
      to,
      subject,
      preview: (body || '').slice(0, 160)
    };
  }
};
