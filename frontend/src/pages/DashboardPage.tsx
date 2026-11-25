import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  FileText, 
  Clock, 
  Bot, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Zap,
  TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/emails/dashboard-stats');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-violet-950/40 via-slate-900 to-[#0F172A] p-6 rounded-2xl border border-violet-500/20">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Welcome, <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">{user?.name}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            MailPilot autonomous multi-agent engine is ready to assist your email workflows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/workspace"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-white shadow-lg shadow-violet-600/25 transition-all flex items-center gap-2 text-sm"
          >
            <Bot className="h-4 w-4" />
            <span>Launch AI Agent</span>
          </Link>
          <Link
            to="/composer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium text-slate-200 border border-slate-700 transition-all text-sm"
          >
            Compose New
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Emails Sent</p>
            <h3 className="text-3xl font-bold text-white mt-2">{data?.stats?.totalSent ?? 0}</h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3 w-3" /> via Gmail Engine
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Send className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Drafts Created</p>
            <h3 className="text-3xl font-bold text-white mt-2">{data?.stats?.totalDrafts ?? 0}</h3>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              Synchronized & ready
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Awaiting Approval</p>
            <h3 className="text-3xl font-bold text-amber-300 mt-2">{data?.stats?.awaitingApproval ?? 0}</h3>
            <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3" /> Security Gate Active
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Connected Gmail</p>
            <h3 className="text-lg font-bold text-white mt-2 truncate max-w-[140px]">
              {data?.stats?.googleConnected ? (data?.stats?.googleEmail || 'Active') : 'Demo Sync'}
            </h3>
            <p className="text-[11px] text-violet-400 mt-1 flex items-center gap-1 font-medium">
              <Zap className="h-3 w-3" /> Real API Bridge
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
            <Mail className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Activity Chart & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-[#0F172A] p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-violet-400" /> Agent Activity & Email Volume
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Real email operations and autonomous agent tasks this week</p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">Weekly</span>
          </div>

          <div className="h-64 w-full">
            {data?.weeklyActivity && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyActivity}>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem' }} 
                    itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="sent" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Emails Sent" />
                  <Bar dataKey="commands" fill="#6366f1" radius={[4, 4, 0, 0]} name="AI Commands" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pending & Recent Agent Actions */}
        <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="h-4 w-4 text-violet-400" /> Recent Agent Runs
              </h2>
              <Link to="/activity" className="text-xs text-violet-400 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {data?.recentActivities?.length ? (
                data.recentActivities.map((act: any) => (
                  <div key={act._id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200 truncate max-w-[180px]">{act.command}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        act.status === 'executed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        act.status === 'awaiting_approval' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {act.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {act.emailDraft?.subject || 'Analyzing task plan...'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">No recent agent runs found.</p>
              )}
            </div>
          </div>

          <Link
            to="/workspace"
            className="mt-4 w-full py-2.5 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <span>Issue Natural-Language Command</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
