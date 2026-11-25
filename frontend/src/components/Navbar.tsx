import React from 'react'
import { Sparkles, Globe, ArrowRight, Menu, X, Play } from 'lucide-react'
import { Language, AppView } from '../types'
import { translations, languageNames } from '../utils/translations'

interface NavbarProps {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
  onNavigate: (view: AppView) => void
}

export const Navbar: React.FC<NavbarProps> = ({ currentLang, onLanguageChange, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const t = translations[currentLang] || translations.en

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              ₹
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                {t.appName}
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI
                </span>
              </span>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* 10 Languages Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer text-xs font-medium"
              >
                {(Object.keys(languageNames) as Language[]).map((key) => (
                  <option key={key} value={key} className="bg-slate-900 text-slate-200">
                    {languageNames[key].nativeName} ({languageNames[key].name})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Demo Access for Hackathon Judges */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try Live Demo
            </button>

            {/* Auth Buttons */}
            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800/60 transition"
            >
              {t.signIn}
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              {t.getStarted}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-3 bg-slate-950/95 border-b border-slate-800">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Globe className="w-4 h-4 text-emerald-400" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-slate-200 outline-none w-full text-xs"
            >
              {(Object.keys(languageNames) as Language[]).map((key) => (
                <option key={key} value={key} className="bg-slate-900 text-slate-200">
                  {languageNames[key].nativeName} ({languageNames[key].name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('dashboard') }}
            className="w-full text-left py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs"
          >
            Launch Live Demo Dashboard
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('login') }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-slate-300 hover:bg-slate-900 font-medium text-xs"
          >
            {t.signIn}
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('signup') }}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs"
          >
            {t.getStarted}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </nav>
  )
}
