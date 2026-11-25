# MailPilot AI 🛫
### Autonomous AI Email Management & Sending Agent
> *"Your inbox. Your AI. Your time back."*

MailPilot AI is a complete, autonomous AI email agent designed for students, professionals, and organizations. It translates natural language instructions into concrete email actions, plans tasks using Gemini AI function calling, researches inboxes and contacts via Google APIs, verifies drafts for security, and sends emails through Gmail with **strict explicit user approval**.

---

## 🌟 Key Features

- **Multi-Agent Architecture**:
  - **Intent Understanding Agent**: Classifies objectives, extracts recipients, purpose, and missing context.
  - **Email Research Agent**: Gathers context with Gmail Search Tool, Google People Contact Lookup, and Google Calendar.
  - **Email Writing Agent**: Composes tailored emails in academic, formal, business, or friendly tones.
  - **Email Verification Agent**: Inspects recipients, missing fields, and flags sensitive data leaks.
  - **Execution Agent**: Creates Gmail drafts and dispatches approved emails.
- **Explicit Approval Gate**: Guarantees that no email is sent autonomously without user inspection and confirmation.
- **Gmail & Google Integration**: Supports Google OAuth 2.0, Gmail API, People API, and Calendar API.
- **9 Modern Web Pages**: SaaS Landing Page, Authentication, Dashboard with Recharts, AI Workspace, Inbox, Composer, Drafts Manager, Execution Traces, and Settings.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React, Axios, React Router, Recharts
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Zod
- **Database**: MongoDB / Resilient In-Memory Fallback
- **AI & Tools**: Google Gemini API, Gmail API, Google People API, Google Calendar API

---

## 🚀 Quickstart

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔒 Security Guarantee
MailPilot AI strictly abides by user consent: an AI model can propose, draft, and verify emails, but execution through the Gmail API requires explicit human confirmation.
