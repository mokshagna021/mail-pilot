import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  FileCheck, 
  Wand2, 
  Languages, 
  Minimize2, 
  Briefcase, 
  Smile, 
  CheckCircle2 
} from 'lucide-react';
import api from '../api/client';

export const ComposerPage: React.FC = () => {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [instruction, setInstruction] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleAiAction = async (action: string, tone = 'professional') => {
    setAiLoading(true);
    setStatusMsg('');
    try {
      const res = await api.post('/emails/compose-ai', {
        instruction,
        currentText: body,
        tone,
        action
      });
      if (res.data.subject && !subject) setSubject(res.data.subject);
      if (res.data.body) setBody(res.data.body);
      setStatusMsg(`AI applied: ${action.replace('_', ' ')}`);
    } catch (err: any) {
      setStatusMsg('AI composition helper failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendManual = async () => {
    if (!to || !subject || !body) {
      alert('Please fill in To, Subject and Body.');
      return;
    }
    setAiLoading(true);
    try {
      const recipients = to.split(',').map((s) => s.trim()).filter(Boolean);
      await api.post('/emails/send-manual', {
        to: recipients,
        cc: cc ? cc.split(',').map((s) => s.trim()).filter(Boolean) : [],
        bcc: bcc ? bcc.split(',').map((s) => s.trim()).filter(Boolean) : [],
        subject,
        body
      });
      setIsError(false);
      setStatusMsg('✅ Email sent successfully!');
      setTo('');
      setSubject('');
      setBody('');
    } catch (err: any) {
      setIsError(true);
      setStatusMsg('❌ ' + (err.response?.data?.error || 'Send failed — is the backend server running?'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setAiLoading(true);
    try {
      const recipients = to ? to.split(',').map((s) => s.trim()).filter(Boolean) : [];
      await api.post('/emails/save-draft-manual', {
        to: recipients,
        subject,
        body
      });
      setIsError(false);
      setStatusMsg('✅ Draft saved successfully!');
    } catch (err: any) {
      setIsError(true);
      setStatusMsg('❌ ' + (err.response?.data?.error || 'Draft save failed — is the backend server running?'));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 font-sans">
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">AI-Powered Email Composer</h1>
          <p className="text-xs text-slate-400 mt-1">Compose manually or accelerate your draft with native Gemini intelligence.</p>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${isError ? 'bg-red-950/60 border-red-500/30 text-red-200' : 'bg-violet-950/60 border-violet-500/30 text-violet-200'}`}>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* AI Assistant Quick Tool Bar */}
      <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">AI Writing Copilot</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Prompt AI: e.g., 'Politely decline meeting and propose Friday 10 AM'..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          <button
            onClick={() => handleAiAction('generate')}
            disabled={aiLoading}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Generate</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          <button
            onClick={() => handleAiAction('formal', 'formal')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
          >
            <Briefcase className="h-3 w-3" /> Formal
          </button>
          <button
            onClick={() => handleAiAction('friendly', 'friendly')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
          >
            <Smile className="h-3 w-3" /> Friendly
          </button>
          <button
            onClick={() => handleAiAction('shorten')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
          >
            <Minimize2 className="h-3 w-3" /> Shorten
          </button>
          <button
            onClick={() => handleAiAction('grammar')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
          >
            Improve Grammar
          </button>
        </div>
      </div>

      {/* Email Form */}
      <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-4 text-xs">
          <span className="w-16 font-semibold text-slate-400">To:</span>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com (comma-separated)"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="w-16 font-semibold text-slate-400">Subject:</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject line"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-medium placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div>
          <textarea
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your email here or let MailPilot AI draft it for you..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none font-sans leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleSaveDraft}
            disabled={aiLoading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileCheck className="h-4 w-4" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handleSendManual}
            disabled={aiLoading || !to || !subject}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold text-white shadow-lg shadow-violet-600/30 text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>Send Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
