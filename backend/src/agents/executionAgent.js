import { sendEmail } from '../tools/gmailSendTool.js';
import { createDraft } from '../tools/draftTool.js';
import { EmailRecord } from '../models/EmailRecord.js';

export const runExecutionAgent = async ({ user, action, emailDraft, userApprovalGiven }) => {
  if (action === 'send') {
    if (!userApprovalGiven) {
      throw new Error("Execution aborted: Explicit user approval required to send email.");
    }

    const sendResult = await sendEmail(user, {
      to: emailDraft.to,
      cc: emailDraft.cc,
      bcc: emailDraft.bcc,
      subject: emailDraft.subject,
      body: emailDraft.body,
      threadId: emailDraft.threadId,
      userApprovalGiven: true
    });

    try {
      await EmailRecord.create({
        userId: user._id,
        gmailId: sendResult.gmailMessageId,
        threadId: sendResult.threadId,
        type: 'sent',
        to: emailDraft.to,
        cc: emailDraft.cc,
        bcc: emailDraft.bcc,
        from: user.email,
        subject: emailDraft.subject,
        snippet: emailDraft.body.slice(0, 100),
        bodyHtml: emailDraft.body.replace(/\n/g, '<br/>'),
        bodyText: emailDraft.body,
        status: 'sent',
        aiGenerated: true
      });
    } catch (dbErr) {
      console.warn("Could not save EmailRecord:", dbErr.message);
    }

    return {
      status: 'executed',
      result: sendResult,
      summary: sendResult.statusMessage
    };
  }

  if (action === 'draft') {
    const draftResult = await createDraft(user, emailDraft);
    try {
      await EmailRecord.create({
        userId: user._id,
        gmailId: draftResult.draftId,
        type: 'draft',
        to: emailDraft.to,
        from: user.email,
        subject: emailDraft.subject,
        snippet: emailDraft.body.slice(0, 100),
        bodyHtml: emailDraft.body.replace(/\n/g, '<br/>'),
        bodyText: emailDraft.body,
        status: 'draft',
        aiGenerated: true
      });
    } catch (e) {}

    return {
      status: 'draft_created',
      result: draftResult,
      summary: draftResult.status
    };
  }

  throw new Error(`Unknown execution action: ${action}`);
};
