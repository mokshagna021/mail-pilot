import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  Mail, 
  ArrowRight, 
  Cpu, 
  Search, 
  Layers, 
  Lock, 
  Zap, 
  Users, 
  Clock 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-violet-600 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md bg-[#0B0F19]/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              MailPilot <span className="text-violet-400 font-light text-sm px-2 py-0.5 rounded bg-violet-950 border border-violet-800">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#agents" className="hover:text-white transition-colors">5-Agent Architecture</a>
            <a href="#security" className="hover:text-white transition-colors">Security & Gate</a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/60 border border-violet-800/60 text-violet-300 text-xs font-semibold mb-8 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>Autonomous AI Email Management & Sending Agent</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Email Smarter. <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
              Work Faster.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            "Your inbox. Your AI. Your time back." <br />
            Let your personal autonomous AI agent research, draft, verify, and manage your communication while you stay in complete control with explicit approval gates.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-white shadow-xl shadow-violet-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Start Commanding Your Inbox</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 font-semibold text-slate-300 transition-all flex items-center justify-center gap-2"
            >
              <span>View Live Demo</span>
            </Link>
          </div>

          {/* Natural Language Examples Carousel */}
          <div className="mt-16 max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Bot className="h-4 w-4 text-violet-400" /> Natural Language Commands MailPilot Handles
              </span>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-medium">
                Autonomous Planning
              </span>
            </div>
            <div className="space-y-2.5 text-sm text-slate-300 font-mono">
              <p className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-violet-500/40 transition-colors">
                💬 <span className="text-violet-300 font-semibold">"Send an email to my professor requesting two days of leave."</span>
              </p>
              <p className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-violet-500/40 transition-colors">
                💬 <span className="text-indigo-300 font-semibold">"Write a professional email to HR asking about internship opportunities."</span>
              </p>
              <p className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-violet-500/40 transition-colors">
                💬 <span className="text-sky-300 font-semibold">"Send an email to my project team saying tomorrow's meeting is postponed to 3 PM."</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Agent Architecture Section */}
      <section id="agents" className="py-24 bg-[#0A0E17] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest">Multi-Agent Intelligence</h2>
            <p className="mt-3 text-3xl md:text-4xl font-extrabold text-white">Central Orchestrator & 5 Specialized Agents</p>
            <p className="mt-4 text-slate-400">
              Not a static single prompt. MailPilot AI coordinates dedicated agents with native function calling, tool observations, and verification protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl hover:border-violet-500/50 transition-all">
              <div className="h-10 w-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-semibold text-white text-base">Intent Understanding</h3>
              <p className="text-xs text-slate-400 mt-2">Understands context, detects objectives, extracts recipient names, and identifies missing information.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl hover:border-violet-500/50 transition-all">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-semibold text-white text-base">Email Research</h3>
              <p className="text-xs text-slate-400 mt-2">Searches Gmail inbox, resolves contacts via Google People API, and inspects Google Calendar meetings.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl hover:border-violet-500/50 transition-all">
              <div className="h-10 w-10 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-semibold text-white text-base">Email Writing</h3>
              <p className="text-xs text-slate-400 mt-2">Crafts tailored subjects & body text in academic, formal, business, or friendly tone without hallucinating facts.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl hover:border-violet-500/50 transition-all border-amber-500/20">
              <div className="h-10 w-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold mb-4">4</div>
              <h3 className="font-semibold text-white text-base">Email Verification</h3>
              <p className="text-xs text-slate-400 mt-2">Validates addresses, checks sensitive data leaks, flags accidental broadcasts, and prepares preview.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl hover:border-violet-500/50 transition-all border-emerald-500/20">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold mb-4">5</div>
              <h3 className="font-semibold text-white text-base">Execution Agent</h3>
              <p className="text-xs text-slate-400 mt-2">Creates Gmail drafts and executes real sends through Gmail API only after explicit user confirmation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Explicit Approval Gate */}
      <section id="security" className="py-20 bg-[#0B0F19] border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-6">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">The Explicit User Approval Principle</h2>
          <p className="mt-4 text-slate-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            MailPilot AI strictly enforces that <strong>an AI agent must never send an email autonomously without explicit confirmation</strong>. 
            Before any transmission, you inspect the exact recipient list, subject, and drafted body with full editing and draft-saving privileges.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 text-center text-xs text-slate-500">
        <p>© 2026 MailPilot AI. Built with Google Gemini API, Gmail API, and Express + React.</p>
      </footer>
    </div>
  );
};
