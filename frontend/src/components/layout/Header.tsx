import React, { useState, useRef, useEffect } from 'react'
import { 
  Bell, Globe, Moon, Sun, Laptop, User, LogOut, RotateCcw, 
  CheckCircle2, AlertTriangle, Info, Sparkles, ChevronDown 
} from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { translations, languageNames } from '../../utils/translations'
import { formatCurrency } from '../../utils/formatters'
import { Language } from '../../types'

interface HeaderProps {
  onOpenMoreMenu?: () => void
}

export const Header: React.FC<HeaderProps> = () => {
  const { 
    user, language, setLanguage, theme, setTheme, 
    notifications, markNotificationRead, clearAllNotifications,
    transactions, resetToDemoData, setCurrentView
  } = useFinance()

  const t = translations[language] || translations.en
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Calculate current balance
  const balance = user.monthlyIncome - transactions
    .filter(tx => tx.type === 'expense')
    .reduce((s, tx) => s + tx.amount, 0)

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false)
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div 
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition">
            ₹
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">
                {t.appName}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Sparkles className="w-2.5 h-2.5" /> AI 2.0
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block truncate max-w-[200px]">
              {t.tagline}
            </div>
          </div>
        </div>

        {/* Center: Live Balance Chip */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs">
          <span className="text-slate-400 font-medium">Balance:</span>
          <span className="font-bold text-white tracking-tight">{formatCurrency(balance)}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        {/* Right: Controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">{languageNames[language]?.nativeName || 'EN'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select Language (10 Indian)
                </div>
                {(Object.keys(languageNames) as Language[]).map((langKey) => (
                  <button
                    key={langKey}
                    onClick={() => {
                      setLanguage(langKey)
                      setIsLangOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition ${
                      language === langKey ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span>{languageNames[langKey].nativeName}</span>
                    <span className="text-[10px] text-slate-500">{languageNames[langKey].name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            title={`Toggle Theme (Current: ${theme})`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-full font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No notifications right now 🎉
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          n.read
                            ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                            : 'bg-slate-800/80 border-slate-700 text-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {n.type === 'unusual_spending' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          ) : n.type === 'bill_reminder' ? (
                            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-slate-100">{n.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.message}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                {user.firstName[0]}
              </div>
              <span className="text-xs font-semibold text-white hidden sm:inline">
                {user.firstName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-800">
                  <div className="text-xs font-bold text-white">{user.firstName} {user.lastName}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
                    Indian Student Demo User (INR)
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentView('settings')
                      setIsProfileOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Profile & Settings
                  </button>
                  <button
                    onClick={() => {
                      resetToDemoData()
                      setIsProfileOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-amber-400 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Demo Data
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setCurrentView('landing')
                      setIsProfileOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out / Exit
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  )
}
