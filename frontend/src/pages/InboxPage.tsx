import React, { useEffect, useState } from 'react';
import { 
  Inbox as InboxIcon, 
  Send, 
  FileText, 
  Search, 
  RefreshCw, 
  Mail, 
  Calendar,
  Sparkles,
  Bot
} from 'lucide-react';
import api from '../api/client';

export const InboxPage: React.FC = () => {
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'unread'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const fetchEmails = async (targetFolder = folder, q = searchQuery) => {
    setLoading(true);
    try {
      const res = await api.get('/emails/list', {
        params: { folder: targetFolder, query: q }
      });
      setMessages(res.data.messages || []);
      setSummary(res.data.summary || '');
      if (res.data.messages?.length > 0) {
        setSelectedMessage(res.data.messages[0]);
      } else {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails(folder, searchQuery);
  }, [folder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmails(folder, searchQuery);
  };

  return (
    <div className="h-full flex flex-col font-sans">
      {/* Inbox Sub-header & Filter Bar */}
      <div className="h-16 border-b border-slate-800 px-8 flex items-center justify-between shrink-0 bg-[#0F172A]/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFolder('inbox')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                folder === 'inbox' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inbox
            </button>
            <button
              onClick={() => setFolder('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                folder === 'unread' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFolder('sent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                folder === 'sent' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sent
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search via Gmail API..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </form>
        </div>

        <button
          onClick={() => fetchEmails()}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Refresh Inbox"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Mail View (Split list + reader) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages List Column */}
        <div className="w-96 border-r border-slate-800 overflow-y-auto divide-y divide-slate-800/60 bg-[#0B0F19]/60">
          {loading && messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">Querying Gmail API...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No emails found in this view.</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id || msg._id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedMessage?.id === msg.id || selectedMessage?._id === msg._id
                    ? 'bg-violet-950/30 border-l-2 border-violet-500'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200 truncate max-w-[180px]">
                    {msg.from || (msg.to && msg.to[0]) || 'Unknown'}
                  </span>
                  <span className="text-[10px] text-slate-500">{msg.date ? new Date(msg.date).toLocaleDateString() : ''}</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate mb-1">{msg.subject || '(No Subject)'}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{msg.snippet || msg.bodySample || msg.bodyText}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Reader Column */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#0B0F19]">
          {selectedMessage ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Message Header */}
              <div className="border-b border-slate-800 pb-6">
                <h2 className="text-2xl font-bold text-white">{selectedMessage.subject || '(No Subject)'}</h2>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <div className="space-y-1">
                    <p><span className="text-slate-500 font-semibold">From:</span> <span className="text-slate-200 font-mono">{selectedMessage.from || 'Me'}</span></p>
                    <p><span className="text-slate-500 font-semibold">To:</span> <span className="text-slate-200 font-mono">{(selectedMessage.to || []).toString()}</span></p>
                  </div>
                  <span className="font-mono">{selectedMessage.date ? new Date(selectedMessage.date).toLocaleString() : ''}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                {selectedMessage.bodyText || selectedMessage.bodySample || selectedMessage.snippet}
              </div>

              {/* Quick AI Action Card */}
              <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-violet-400" />
                  <span className="text-xs text-violet-300 font-medium">Want MailPilot to draft a smart reply?</span>
                </div>
                <a
                  href={`/composer?replyTo=${encodeURIComponent(selectedMessage.from || '')}&subject=${encodeURIComponent('Re: ' + (selectedMessage.subject || ''))}`}
                  className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Draft AI Reply</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-600 text-sm">
              Select an email from the left to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
