import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Trash2, 
  Mail, 
  Moon, 
  Bell, 
  CheckCircle2, 
  User, 
  Save, 
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export const SettingsPage: React.FC = () => {
  const { user, connectDemoGoogle, disconnectGoogle, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [signature, setSignature] = useState(user?.preferences?.signature || 'Best regards,\nSent via MailPilot AI');
  const [defaultTone, setDefaultTone] = useState(user?.preferences?.defaultTone || 'professional');
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true);
  const [savedMsg, setSavedMsg] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleConnectRealGoogle = async () => {
    setConnecting(true);
    try {
      const res = await api.get('/auth/google/url');
      if (res.data?.url && res.data.url.startsWith('http')) {
        window.location.href = res.data.url;
      } else {
        await connectDemoGoogle();
        setSavedMsg('Active mode connected.');
      }
    } catch (err: any) {
      await connectDemoGoogle();
      setSavedMsg('Active mode connected.');
    } finally {
      setConnecting(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/settings/profile', { name });
      await api.put('/settings/preferences', {
        signature,
        defaultTone,
        notifications
      });
      await refreshUser();
      setSavedMsg('Settings saved successfully.');
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err: any) {
      alert('Error updating preferences.');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white">Application Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure your Google permissions, AI agent tone, and signature preferences.</p>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Google Account Integration Card */}
      <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Google Account Integration</h3>
              <p className="text-xs text-slate-400">Enables live Gmail API, People API (contacts), and Calendar API tools.</p>
            </div>
          </div>
          <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase ${
            user?.googleConnected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
          }`}>
            {user?.googleConnected ? 'Active Connection' : 'Disconnected'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-200">{user?.googleEmail || user?.email}</p>
            <p className="text-[11px] text-slate-500">Permissions: gmail.send, gmail.compose, gmail.readonly, contacts.readonly</p>
          </div>
          {user?.googleConnected ? (
            <button
              onClick={disconnectGoogle}
              className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnectRealGoogle}
              disabled={connecting}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{connecting ? 'Redirecting to Google...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Agent & Profile Preferences Form */}
      <form onSubmit={handleSavePreferences} className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Profile & AI Persona</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Your Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Default Writing Tone</label>
            <select
              value={defaultTone}
              onChange={(e) => setDefaultTone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="professional">Professional</option>
              <option value="academic">Academic (Professor/Dean)</option>
              <option value="formal">Formal Corporate</option>
              <option value="friendly">Friendly & Casual</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Default Email Signature</label>
          <textarea
            rows={3}
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none font-mono"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notif"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-violet-600 focus:ring-0"
            />
            <label htmlFor="notif" className="text-xs text-slate-300">
              Enable instant browser alerts when agent plans await approval
            </label>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-white text-xs flex items-center gap-1.5 transition-all shadow"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
