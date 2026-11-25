import { searchEmails } from '../tools/gmailSearchTool.js';
import { lookupContacts } from '../tools/contactLookupTool.js';
import { lookupCalendar } from '../tools/calendarLookupTool.js';

export const runResearchAgent = async ({ user, intentData, userCommand }) => {
  const findings = {
    contacts: [],
    relevantThreads: [],
    calendarEvents: [],
    summary: ''
  };

  if (intentData.recipientKeywords && intentData.recipientKeywords.length > 0) {
    for (const kw of intentData.recipientKeywords) {
      const contactRes = await lookupContacts(user, { nameOrQuery: kw });
      if (contactRes.contacts && contactRes.contacts.length > 0) {
        findings.contacts.push(...contactRes.contacts);
      }
    }
  }

  if (intentData.goal === 'search_email' || intentData.goal === 'reply_email' || userCommand.toLowerCase().includes('email from') || userCommand.toLowerCase().includes('summarize')) {
    const q = intentData.recipientKeywords[0] || 'important';
    const emailRes = await searchEmails(user, { query: q, maxResults: 3 });
    findings.relevantThreads = emailRes.messages || [];
  }

  if (userCommand.toLowerCase().includes('meeting') || userCommand.toLowerCase().includes('schedule')) {
    const calRes = await lookupCalendar(user, { query: 'meeting' });
    findings.calendarEvents = calRes.events || [];
  }

  findings.summary = `Retrieved ${findings.contacts.length} candidate contact(s), ${findings.relevantThreads.length} relevant email thread(s), and ${findings.calendarEvents.length} calendar event(s).`;
  return findings;
};
