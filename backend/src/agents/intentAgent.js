import { callGeminiWithFallback } from './geminiHelper.js';

export const runIntentAgent = async ({ userCommand, conversationContext }) => {
  const prompt = `Analyze this user email command: "${userCommand}".
Identify:
1. Primary Goal (send_email, search_email, reply_email, draft_email, calendar_check, summarize_inbox)
2. Target Recipient Keywords or names (e.g. professor, project team, HR, individual name)
3. Topic/Purpose
4. Key information extracted (e.g. 2 days leave, meeting at 3 PM, internship)
5. Missing information that needs clarification or confirmation.

Return JSON in this format:
{
  "goal": "send_email|search_email|reply_email|draft_email|summarize_inbox|meeting_reminder",
  "recipientKeywords": ["..."],
  "purpose": "...",
  "tone": "formal|friendly|professional|academic",
  "missingInfo": [],
  "needsRecipientSelection": true|false,
  "summary": "..."
}`;

  const geminiResult = await callGeminiWithFallback({
    systemPrompt: "You are the Intent Understanding Agent for MailPilot AI. You accurately classify instructions into structured goals.",
    prompt
  });

  if (geminiResult) {
    try {
      const cleaned = geminiResult.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      // fallback
    }
  }

  const lower = userCommand.toLowerCase();
  let goal = 'send_email';
  let tone = 'professional';
  const recipientKeywords = [];

  if (lower.includes('professor') || lower.includes('faculty') || lower.includes('dean')) {
    recipientKeywords.push('professor');
    tone = 'academic';
  } else if (lower.includes('team') || lower.includes('project')) {
    recipientKeywords.push('project team');
    tone = 'professional';
  } else if (lower.includes('hr') || lower.includes('recruiter') || lower.includes('internship')) {
    recipientKeywords.push('HR');
    tone = 'formal';
  } else if (lower.includes('placement')) {
    recipientKeywords.push('placement officer');
    tone = 'formal';
  }

  if (lower.includes('find') || lower.includes('search') || lower.includes('unread')) {
    goal = 'search_email';
  } else if (lower.includes('draft') && !lower.includes('send')) {
    goal = 'draft_email';
  } else if (lower.includes('reply')) {
    goal = 'reply_email';
  }

  return {
    goal,
    recipientKeywords,
    purpose: userCommand,
    tone,
    missingInfo: recipientKeywords.length === 0 ? ['Specific recipient email address or name'] : [],
    needsRecipientSelection: recipientKeywords.length > 0 && recipientKeywords[0].includes('team'),
    summary: `Identified goal '${goal}' with requested tone '${tone}'. Target recipients: ${recipientKeywords.join(', ') || 'unspecified'}.`
  };
};
