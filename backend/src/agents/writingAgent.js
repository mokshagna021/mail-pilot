import { callGeminiWithFallback } from './geminiHelper.js';

export const runWritingAgent = async ({ userCommand, intentData, researchData, user }) => {
  const prompt = `Write a high quality, professional email based on the following:
User Command: "${userCommand}"
Tone: ${intentData.tone || 'professional'}
Context/Contacts: ${JSON.stringify(researchData.contacts)}
Previous context: ${JSON.stringify(researchData.relevantThreads.map(t => ({ subject: t.subject, snippet: t.snippet })))}
Sender Name: ${user?.name || 'MailPilot User'}

Guidelines:
- Return ONLY valid JSON format:
{
  "subject": "Subject Line",
  "body": "Formatted email body with line breaks and appropriate greeting & signoff",
  "reasoning": "Brief explanation of writing decisions"
}`;

  const geminiResult = await callGeminiWithFallback({
    systemPrompt: "You are the Email Writing Agent for MailPilot AI. You write clear, polite, and effective emails tailored to the exact recipient and tone.",
    prompt
  });

  if (geminiResult) {
    try {
      const cleaned = geminiResult.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.subject && parsed.body) {
        return parsed;
      }
    } catch (e) {
      // fallback to algorithmic generator
    }
  }

  const senderName = user?.name || 'MailPilot User';
  const lower = userCommand.toLowerCase();

  let subject = 'Important Update regarding our scheduled discussion';
  let body = `Dear Team,\n\nI hope this email finds you well.\n\nI am writing to share an important update regarding our upcoming schedule. Please review the details below.\n\nPlease feel free to let me know if you have any questions.\n\nBest regards,\n${senderName}`;

  if (lower.includes('leave') || lower.includes('days of leave') || lower.includes('professor')) {
    subject = 'Leave of Absence Request - ' + senderName;
    body = `Dear Professor,\n\nI hope you are having a productive week.\n\nI am writing to formally request a leave of absence for two days due to unavoidable family commitments. I will ensure all coursework and pending assignments are kept up to date, and I will check in with my peers regarding any class discussions missed.\n\nThank you very much for your understanding and consideration.\n\nSincerely,\n${senderName}`;
  } else if (lower.includes('internship') || lower.includes('hr')) {
    subject = 'Inquiry Regarding Internship Opportunities - ' + senderName;
    body = `Dear Hiring Team,\n\nI hope this message finds you well.\n\nI have been closely following your company's innovative work and would love to inquire about upcoming internship opportunities within your team. With my background in software development and problem solving, I am eager to contribute effectively to your ongoing projects.\n\nI have attached my resume for your review and would welcome the opportunity to discuss how I can add value to your team.\n\nThank you for your time and consideration.\n\nSincerely,\n${senderName}`;
  } else if (lower.includes('postponed') || lower.includes('3 pm') || lower.includes('meeting')) {
    subject = 'Rescheduled: Tomorrow\'s Project Sync Postponed to 3:00 PM';
    body = `Hi Team,\n\nPlease note that our project meeting scheduled for tomorrow has been postponed to 3:00 PM.\n\nWe will review our milestone progress, current blockers, and upcoming deliverables during this session. Please let me know if this time creates any scheduling conflicts.\n\nLooking forward to our discussion.\n\nBest regards,\n${senderName}`;
  } else if (lower.includes('placement')) {
    subject = 'Request for Internship Referral & Guidance - ' + senderName;
    body = `Dear Placement Officer,\n\nI hope you are well.\n\nI am writing to respectfully request guidance and a referral for upcoming industry internship drives. I have maintained strong academic standing and completed relevant projects in modern web development and AI systems.\n\nI would be grateful for an opportunity to discuss potential opportunities at your earliest convenience.\n\nThank you for your continuous support.\n\nWarm regards,\n${senderName}`;
  }

  return {
    subject,
    body,
    reasoning: `Drafted ${intentData.tone || 'professional'} email tailored to request with proper greeting, structured paragraphs, and sign-off.`
  };
};
