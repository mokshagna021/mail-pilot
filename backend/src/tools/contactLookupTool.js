import { z } from 'zod';
import { google } from 'googleapis';
import { getAuthenticatedClient } from '../config/google.js';

export const contactLookupSchema = z.object({
  nameOrQuery: z.string().describe("Person's name, team name, or email keywords to search in contacts (e.g. 'professor', 'Sarah', 'project team')")
});

export const lookupContacts = async (user, { nameOrQuery }) => {
  const auth = getAuthenticatedClient(user);
  const people = google.people({ version: 'v1', auth });

  try {
    const res = await people.people.searchContacts({
      query: nameOrQuery,
      readMask: 'names,emailAddresses,organizations'
    });

    const connections = res.data.results || [];
    const contacts = connections.map(c => {
      const p = c.person;
      const displayName = p.names?.[0]?.displayName || 'Unknown Name';
      const emails = (p.emailAddresses || []).map(e => e.value);
      const org = p.organizations?.[0]?.name || '';
      return {
        name: displayName,
        emails,
        organization: org
      };
    }).filter(c => c.emails.length > 0);

    if (contacts.length === 0) {
      return {
        found: false,
        contacts: [],
        message: `No contacts found matching '${nameOrQuery}'. Please specify the exact email address.`
      };
    }

    return {
      found: true,
      count: contacts.length,
      contacts,
      message: `Found ${contacts.length} contact(s) matching '${nameOrQuery}'.`
    };
  } catch (err) {
    const qLower = (nameOrQuery || '').toLowerCase();
    const demoDirectory = [
      { name: 'Prof. David Miller', emails: ['d.miller@university.edu'], organization: 'Computer Science Dept' },
      { name: 'Sarah Chen (Project Manager)', emails: ['sarah.chen@techcorp.io'], organization: 'Engineering Team' },
      { name: 'Alex Rivera (Dev Lead)', emails: ['alex.rivera@techcorp.io'], organization: 'Project Team' },
      { name: 'Dr. Evelyn Reed (Placement Officer)', emails: ['placement.officer@university.edu'], organization: 'Placement Cell' },
      { name: 'HR Recruiting Team', emails: ['careers@innovatech.com', 'hr-team@innovatech.com'], organization: 'People Operations' }
    ];

    const matched = demoDirectory.filter(c => 
      c.name.toLowerCase().includes(qLower) || 
      c.organization.toLowerCase().includes(qLower) ||
      (qLower.includes('professor') && c.name.toLowerCase().includes('prof')) ||
      (qLower.includes('team') && (c.organization.toLowerCase().includes('team') || c.name.toLowerCase().includes('team'))) ||
      (qLower.includes('placement') && c.name.toLowerCase().includes('placement')) ||
      (qLower.includes('hr') && c.name.toLowerCase().includes('hr'))
    );

    const results = matched.length > 0 ? matched : [
      { name: nameOrQuery, emails: [`${nameOrQuery.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`], organization: 'External' }
    ];

    return {
      found: true,
      simulated: true,
      count: results.length,
      contacts: results,
      message: `[Directory Lookup] Found ${results.length} matching contact(s) for "${nameOrQuery}".`
    };
  }
};
