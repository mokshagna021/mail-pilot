import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  CornerDownRight, 
  FileCheck, 
  Edit3, 
  XCircle, 
  Sparkles,
  UserCheck,
  Search,
  Calendar,
  Layers
} from 'lucide-react';
import api from '../api/client';

export const AgentWorkspacePage: React.FC = () => {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [orchestratorResult, setOrchestratorResult] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [actionMessage, setActionMessage] = useState('');

  const sampleCommands = [
    "Send an email to my professor requesting two days of leave.",
    "Write a professional email to HR asking about internship opportunities.",
    "Send an email to my project team saying tomorrow's meeting is postponed to 3 PM.",
    "Find the email from my college about examination dates and summarize it.",
    "Prepare an email to my placement officer requesting an internship referral."
  ];

  const handleRunCommand = async (cmdToRun?: string) => {
    const text = cmdToRun || command;
    if (!text.trim()) return;

    setLoading(true);
    setActionMessage('');
    setIsEditing(false);

    try {
      const res = await api.post('/agent/command', { command: text.trim() });
      setOrchestratorResult(res.data);
      if (res.data.emailDraft) {
        setEditedEmail({
          to: (res.data.emailDraft.to || []).join(', '),
          subject: res.data.emailDraft.subject || '',
          body: res.data.emailDraft.body || ''
        });
      }
    } catch (err: any) {
      setActionMessage(err.response?.data?.error || 'Failed to execute agent plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (action: 'approve_send' | 'save_draft' | 'cancel') => {
    if (!orchestratorResult?.activityId) return;

    setLoading(true);
    try {
      const res = await api.post('/agent/approve', {
        activityId: orchestratorResult.activityId,
        action,
        editedEmail: {
          to: editedEmail.to.split(',').map((s) => s.trim()).filter(Boolean),
          subject: editedEmail.subject,
          body: editedEmail.body
        }
      });
      setOrchestratorResult(null);
      setActionMessage(res.data.message || 'Operation processed successfully.');
    } catch (err: any) {
      setActionMessage(err.response?.data?.error || 'Action processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-ping"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold">Autonomous Agent Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">AI Agent Workspace</h1>
          <p className="text-sm text-slate-400">
            Natural-language orchestrator with 5 dedicated agents, tool observations, and explicit approval verification.
          </p>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-xl bg-violet-950/60 border border-violet-500/30 text-violet-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Input Box */}
      <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Natural Language Command
        </label>
        <div className="relative">
          <textarea
            rows={3}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="e.g. 'Send an email to my professor requesting two days of leave for a family function.'"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              onClick={() => handleRunCommand()}
              disabled={loading || !command.trim()}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-white shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 text-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Orchestrating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Execute AI Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-mono text-slate-400 self-center mr-1">Quick prompts:</span>
          {sampleCommands.map((cmd, i) => (
            <button
              key={i}
              onClick={() => {
                setCommand(cmd);
                handleRunCommand(cmd);
              }}
              className="text-[11px] bg-slate-800/80 hover:bg-violet-900/40 hover:text-violet-300 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors truncate max-w-xs"
            >
              "{cmd}"
            </button>
          ))}
        </div>
      </div>

      {/* Execution Results & Explicit Approval Gate */}
      {orchestratorResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Agent Workflow Execution Timeline */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-violet-400" /> Multi-Agent Execution Trace
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {orchestratorResult.agentsActivated?.map((ag: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-violet-300 flex items-center gap-1.5">
                      <Bot className="h-3.5 w-3.5" /> {ag.name.replace(' Agent', '')}
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                      Completed
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{ag.summary}</p>
                </div>
              ))}
            </div>

            {/* Tools Called Observation */}
            {orchestratorResult.toolsCalled?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-indigo-400" /> Function Calling Tools Invoked:
                </p>
                <div className="flex flex-wrap gap-2">
                  {orchestratorResult.toolsCalled.map((t: any, i: number) => (
                    <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-indigo-300 border border-indigo-500/20">
                      🔧 {t.tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Verification Inspection Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-amber-300 uppercase tracking-wide">Verification Agent Inspection</span>
              <p className="text-slate-300">{orchestratorResult.verification?.notes}</p>
              {orchestratorResult.verification?.warnings?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {orchestratorResult.verification.warnings.map((w: string, i: number) => (
                    <p key={i} className="text-amber-400 font-medium flex items-center gap-1">
                      ⚠️ {w}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Explicit Approval Preview Box */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border-2 border-violet-500/50 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-violet-400 uppercase font-bold tracking-widest">
                  Explicit Confirmation Required
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">Email Preview & Approval Gate</h3>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{isEditing ? 'Done Editing' : 'Edit Draft'}</span>
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Recipient(s):</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedEmail.to}
                    onChange={(e) => setEditedEmail({ ...editedEmail, to: e.target.value })}
                    className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  />
                ) : (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {editedEmail.to ? (
                      editedEmail.to.split(',').map((email, i) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-violet-950/80 border border-violet-700/50 text-violet-300 font-mono text-xs">
                          {email.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-rose-400 text-xs">No recipient specified. Click Edit to enter.</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Subject:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedEmail.subject}
                    onChange={(e) => setEditedEmail({ ...editedEmail, subject: e.target.value })}
                    className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs font-semibold"
                  />
                ) : (
                  <p className="mt-1 text-white font-semibold">{editedEmail.subject}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Body:</label>
                {isEditing ? (
                  <textarea
                    rows={6}
                    value={editedEmail.body}
                    onChange={(e) => setEditedEmail({ ...editedEmail, body: e.target.value })}
                    className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs font-mono"
                  />
                ) : (
                  <div className="mt-1 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs whitespace-pre-line leading-relaxed font-sans">
                    {editedEmail.body}
                  </div>
                )}
              </div>
            </div>

            {/* Approval Decision Controls */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> 
                Zero autonomous sending: Action dispatches only upon approval.
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleApprovalAction('cancel')}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <XCircle className="h-4 w-4 text-rose-400" />
                  <span>Cancel</span>
                </button>

                <button
                  onClick={() => handleApprovalAction('save_draft')}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <FileCheck className="h-4 w-4 text-indigo-400" />
                  <span>Save Draft</span>
                </button>

                <button
                  onClick={() => handleApprovalAction('approve_send')}
                  disabled={loading || !editedEmail.to}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-lg shadow-emerald-600/30 text-xs flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Approve & Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
