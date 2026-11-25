import { runIntentAgent } from './intentAgent.js';
import { runResearchAgent } from './researchAgent.js';
import { runWritingAgent } from './writingAgent.js';
import { runVerificationAgent } from './verificationAgent.js';
import { runExecutionAgent } from './executionAgent.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { memoryStore } from '../models/memoryStore.js';
import mongoose from 'mongoose';

const isDb = () => mongoose.connection.readyState === 1;

export const orchestrateTask = async ({ user, command, approvalPayload }) => {
  if (approvalPayload && approvalPayload.activityId) {
    let log = null;
    if (isDb()) {
      log = await ActivityLog.findOne({ _id: approvalPayload.activityId, userId: user._id });
    } else {
      log = memoryStore.activityLogs.find(l => l._id.toString() === approvalPayload.activityId.toString());
    }

    if (!log) {
      throw new Error("Activity log not found for approval.");
    }

    if (approvalPayload.action === 'approve_send') {
      const emailToSend = {
        to: approvalPayload.editedEmail?.to || log.emailDraft.to,
        cc: approvalPayload.editedEmail?.cc || log.emailDraft.cc,
        bcc: approvalPayload.editedEmail?.bcc || log.emailDraft.bcc,
        subject: approvalPayload.editedEmail?.subject || log.emailDraft.subject,
        body: approvalPayload.editedEmail?.body || log.emailDraft.body,
        threadId: log.emailDraft.threadId
      };

      const execResult = await runExecutionAgent({
        user,
        action: 'send',
        emailDraft: emailToSend,
        userApprovalGiven: true
      });

      log.status = 'executed';
      log.agentsActivated.push({
        name: 'Execution Agent',
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        summary: execResult.summary
      });
      log.toolsCalled.push({
        tool: 'Gmail Send Tool',
        input: { to: emailToSend.to, subject: emailToSend.subject },
        output: execResult.result,
        status: 'success'
      });
      log.executionResult = {
        gmailMessageId: execResult.result.gmailMessageId,
        sentAt: new Date(),
        statusMessage: execResult.summary
      };

      if (isDb()) await log.save();

      return {
        step: 'completed',
        activityId: log._id,
        status: 'executed',
        log,
        message: execResult.summary
      };
    }

    if (approvalPayload.action === 'save_draft') {
      const emailToDraft = {
        to: approvalPayload.editedEmail?.to || log.emailDraft.to,
        cc: approvalPayload.editedEmail?.cc || log.emailDraft.cc,
        bcc: approvalPayload.editedEmail?.bcc || log.emailDraft.bcc,
        subject: approvalPayload.editedEmail?.subject || log.emailDraft.subject,
        body: approvalPayload.editedEmail?.body || log.emailDraft.body
      };

      const draftResult = await runExecutionAgent({
        user,
        action: 'draft',
        emailDraft: emailToDraft,
        userApprovalGiven: true
      });

      log.status = 'approved';
      log.agentsActivated.push({
        name: 'Execution Agent',
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        summary: draftResult.summary
      });
      log.toolsCalled.push({
        tool: 'Gmail Draft Tool',
        input: { to: emailToDraft.to, subject: emailToDraft.subject },
        output: draftResult.result,
        status: 'success'
      });
      if (isDb()) await log.save();

      return {
        step: 'completed',
        activityId: log._id,
        status: 'draft_created',
        log,
        message: draftResult.summary
      };
    }

    if (approvalPayload.action === 'cancel') {
      log.status = 'rejected';
      if (isDb()) await log.save();
      return {
        step: 'cancelled',
        activityId: log._id,
        status: 'rejected',
        log,
        message: 'Action cancelled by user.'
      };
    }
  }

  // Initial Orchestration Run
  const initialLogData = {
    _id: 'act_' + Date.now(),
    userId: user._id,
    command,
    status: 'planning',
    plan: [
      { step: 1, name: 'Intent Understanding', status: 'pending' },
      { step: 2, name: 'Contact & Inbox Research', status: 'pending' },
      { step: 3, name: 'Email Drafting & Tone Alignment', status: 'pending' },
      { step: 4, name: 'Security & Recipient Verification', status: 'pending' },
      { step: 5, name: 'User Explicit Approval Gate', status: 'pending' },
      { step: 6, name: 'Execution via Gmail API', status: 'pending' }
    ],
    agentsActivated: [],
    toolsCalled: [],
    timestamp: new Date()
  };

  let activityLog;
  if (isDb()) {
    activityLog = new ActivityLog(initialLogData);
    await activityLog.save();
  } else {
    activityLog = {
      ...initialLogData,
      save: async function() { return this; }
    };
    memoryStore.activityLogs.unshift(activityLog);
  }

  // Step 1: Intent Agent
  const intentStart = new Date();
  const intentData = await runIntentAgent({ userCommand: command });
  activityLog.plan[0].status = 'completed';
  activityLog.agentsActivated.push({
    name: 'Intent Understanding Agent',
    status: 'completed',
    startedAt: intentStart,
    completedAt: new Date(),
    summary: intentData.summary
  });

  // Step 2: Research Agent
  const researchStart = new Date();
  const researchData = await runResearchAgent({ user, intentData, userCommand: command });
  activityLog.plan[1].status = 'completed';
  activityLog.agentsActivated.push({
    name: 'Email Research Agent',
    status: 'completed',
    startedAt: researchStart,
    completedAt: new Date(),
    summary: researchData.summary
  });

  if (researchData.contacts.length > 0) {
    activityLog.toolsCalled.push({
      tool: 'Contact Lookup Tool',
      input: { query: intentData.recipientKeywords.join(', ') },
      output: researchData.contacts,
      status: 'success'
    });
  }
  if (researchData.relevantThreads.length > 0) {
    activityLog.toolsCalled.push({
      tool: 'Gmail Search Tool',
      input: { query: intentData.recipientKeywords[0] || 'unread' },
      output: researchData.relevantThreads,
      status: 'success'
    });
  }
  if (researchData.calendarEvents.length > 0) {
    activityLog.toolsCalled.push({
      tool: 'Calendar Lookup Tool',
      input: { query: 'meeting' },
      output: researchData.calendarEvents,
      status: 'success'
    });
  }

  let resolvedRecipients = [];
  if (researchData.contacts.length > 0) {
    resolvedRecipients = researchData.contacts.flatMap(c => c.emails);
  } else {
    const emailMatch = command.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      resolvedRecipients = [emailMatch[0]];
    }
  }

  // Step 3: Writing Agent
  const writingStart = new Date();
  const draftData = await runWritingAgent({
    userCommand: command,
    intentData,
    researchData,
    user
  });
  activityLog.plan[2].status = 'completed';
  activityLog.agentsActivated.push({
    name: 'Email Writing Agent',
    status: 'completed',
    startedAt: writingStart,
    completedAt: new Date(),
    summary: draftData.reasoning
  });

  // Step 4: Verification Agent
  const verifyStart = new Date();
  const verificationData = await runVerificationAgent({
    to: resolvedRecipients,
    subject: draftData.subject,
    body: draftData.body
  });
  activityLog.plan[3].status = 'completed';
  activityLog.agentsActivated.push({
    name: 'Email Verification Agent',
    status: 'completed',
    startedAt: verifyStart,
    completedAt: new Date(),
    summary: verificationData.notes
  });

  // Step 5: Gate - Awaiting user approval
  activityLog.emailDraft = {
    to: resolvedRecipients,
    subject: draftData.subject,
    body: draftData.body
  };
  activityLog.verificationReport = verificationData;
  activityLog.status = 'awaiting_approval';
  activityLog.plan[4].status = 'in_progress';
  if (isDb()) await activityLog.save();

  return {
    step: 'awaiting_approval',
    activityId: activityLog._id,
    userCommand: command,
    intent: intentData,
    research: researchData,
    emailDraft: activityLog.emailDraft,
    verification: verificationData,
    plan: activityLog.plan,
    agentsActivated: activityLog.agentsActivated,
    toolsCalled: activityLog.toolsCalled,
    message: "Email draft prepared and verified. Explicit user approval is required to proceed with sending."
  };
};
