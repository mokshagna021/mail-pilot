import React, { useEffect, useState } from 'react';
import { Activity as ActivityIcon, Bot, CheckCircle2, AlertCircle, Clock, Search, Layers } from 'lucide-react';
import api from '../api/client';

export const AgentActivityPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/agent/activity');
      setLogs(res.data.logs || []);
      if (res.data.logs?.length > 0) {
        setSelectedLog(res.data.logs[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white">Agent Execution Traces & Logs</h1>
        <p className="text-xs text-slate-400 mt-1">Audit multi-agent handoffs, function calls, and authorization gates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logs List */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-6 text-center text-xs text-slate-500">Loading traces...</div>
          ) : logs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">No agent traces recorded.</div>
          ) : (
            logs.map((l) => (
              <div
                key={l._id}
                onClick={() => setSelectedLog(l)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedLog?._id === l._id
                    ? 'bg-violet-950/40 border-violet-500/50 shadow-md'
                    : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    l.status === 'executed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    l.status === 'awaiting_approval' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {l.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white truncate">{l.command}</h4>
                <p className="text-[11px] text-slate-400 truncate mt-1">
                  Subject: {l.emailDraft?.subject || '(Pending Generation)'}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Selected Log Deep-Dive View */}
        <div className="lg:col-span-2">
          {selectedLog ? (
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-bold">Execution Plan Breakdown</span>
                <h2 className="text-lg font-bold text-white mt-1">"{selectedLog.command}"</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Trace ID: <span className="font-mono text-slate-300">{selectedLog._id}</span> • Started {new Date(selectedLog.timestamp).toLocaleString()}
                </p>
              </div>

              {/* Execution Steps */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-3">Planned Phases</h4>
                <div className="space-y-2">
                  {selectedLog.plan?.map((step: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="h-5 w-5 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-[10px]">
                          {step.step}
                        </span>
                        <span className="font-medium text-slate-200">{step.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        step.status === 'completed' ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agents Activated */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-3">Agents Activated</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedLog.agentsActivated?.map((ag: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-violet-300 flex items-center gap-1.5">
                          <Bot className="h-3.5 w-3.5" /> {ag.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{ag.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools Called */}
              {selectedLog.toolsCalled?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">Tools Called</h4>
                  <div className="space-y-2">
                    {selectedLog.toolsCalled.map((tool: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900 font-mono text-[11px] border border-slate-800 flex items-center justify-between">
                        <span className="text-indigo-300 font-semibold">🔧 {tool.tool}</span>
                        <span className="text-emerald-400 text-[10px] uppercase font-bold">{tool.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Execution Outcome */}
              {selectedLog.executionResult?.statusMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{selectedLog.executionResult.statusMessage}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0F172A] p-12 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs">
              Select an activity from the left to inspect detailed traces.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
