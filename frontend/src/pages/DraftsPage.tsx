import React, { useEffect, useState } from 'react';
import { FileText, Trash2, Send, Clock, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export const DraftsPage: React.FC = () => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDrafts = async () => {
    try {
      const res = await api.get('/emails/list', { params: { folder: 'drafts' } });
      setDrafts(res.data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this draft?')) return;
    try {
      await api.delete(`/emails/draft/${id}`);
      fetchDrafts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white">Saved Drafts</h1>
        <p className="text-xs text-slate-400 mt-1">Manage and edit your saved drafts before granting final approval to send.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading drafts...</div>
      ) : drafts.length === 0 ? (
        <div className="bg-[#0F172A] p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-sm">
          <FileText className="h-10 w-10 mx-auto text-slate-600 mb-3" />
          <p>No drafts currently saved.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drafts.map((d) => (
            <div key={d._id} className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-violet-400 truncate max-w-[200px]">
                    To: {(d.to || []).join(', ') || 'No recipient'}
                  </span>
                  <span className="text-slate-500 text-[10px]">{new Date(d.date).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{d.subject || '(No Subject)'}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{d.bodyText || d.snippet}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleDelete(d._id)}
                  className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => navigate('/composer')}
                  className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Open in Composer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
