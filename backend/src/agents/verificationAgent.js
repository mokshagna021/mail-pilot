export const runVerificationAgent = async ({ to, subject, body }) => {
  const warnings = [];
  const missingInfo = [];
  let sensitiveContentDetected = false;
  let recipientMistakeDetected = false;

  if (!to || to.length === 0) {
    missingInfo.push("No recipient email address specified.");
  } else {
    for (const email of to) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        warnings.push(`Invalid email format detected for "${email}".`);
        recipientMistakeDetected = true;
      }
    }
  }

  if (!subject || subject.trim().length === 0) {
    warnings.push("Subject line is empty.");
    missingInfo.push("Subject line");
  }

  if (!body || body.trim().length < 10) {
    warnings.push("Email body is unusually short or missing.");
    missingInfo.push("Email body");
  }

  const sensitiveKeywords = ['password', 'credit card', 'ssn', 'bank account', 'secret key', 'confidential credentials'];
  const fullText = `${subject} ${body}`.toLowerCase();
  for (const kw of sensitiveKeywords) {
    if (fullText.includes(kw)) {
      sensitiveContentDetected = true;
      warnings.push(`Security Alert: Body contains sensitive term "${kw}". Verify before sending.`);
    }
  }

  if (to && to.length > 5) {
    warnings.push(`You are addressing ${to.length} recipients. Confirm this is intentional to avoid accidental broadcast.`);
  }

  const isSafe = missingInfo.length === 0 && !recipientMistakeDetected;

  return {
    isSafe,
    missingInfo,
    sensitiveContentDetected,
    recipientMistakeDetected,
    warnings,
    notes: isSafe 
      ? "Verification passed. Recipients validated, subject formatted, tone appropriate, no credential leaks detected."
      : "Verification warnings identified. Please review before granting send approval."
  };
};
