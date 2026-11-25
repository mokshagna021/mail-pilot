import React from 'react'
import { 
  X, Repeat, CalendarCheck, Users, Flame, Home, 
  Calendar as CalendarIcon, FileUp, FileText, Gift, Settings, Globe, ChevronRight 
} from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { translations } from '../../utils/translations'
import { AppView } from '../../types'

interface MoreDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const MoreDrawer: React.FC<MoreDrawerProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, language } = useFinance()
  const t = translations[language] || translations.en

  if (!isOpen) return null

  const moreItems: { view: AppView; label: string; desc: string; icon: any; color: string }[] = [
    { view: 'subscriptions', label: t.navSubscriptions, desc: 'Auto-detect recurring charges & annual cost', icon: Repeat, color: 'text-purple-400 bg-purple-500/10' },
    { view: 'bills', label: t.navBills, desc: 'Upcoming electricity, WiFi, and postpaid dues', icon: CalendarCheck, color: 'text-rose-400 bg-rose-500/10' },
    { view: 'shared-expenses', label: t.navShared, desc: 'Split bills with flatmates, friends & trips', icon: Users, color: 'text-blue-400 bg-blue-500/10' },
    { view: 'family', label: t.navFamily, desc: 'Household budgets & multi-member permissions', icon: Home, color: 'text-emerald-400 bg-emerald-500/10' },
    { view: 'challenges', label: t.navChallenges, desc: 'No-spend days, save ₹500, zero food delivery', icon: Flame, color: 'text-amber-400 bg-amber-500/10' },
    { view: 'calendar', label: t.navCalendar, desc: 'Daily expense visual calendar & drilldown', icon: CalendarIcon, color: 'text-cyan-400 bg-cyan-500/10' },
    { view: 'reports', label: t.navReports, desc: 'AI summary, monthly statements, CSV/PDF export', icon: FileText, color: 'text-indigo-400 bg-indigo-500/10' },
    { view: 'rewards', label: t.navRewards, desc: 'Track GPay cashback, Cred coins & coupons', icon: Gift, color: 'text-pink-400 bg-pink-500/10' },
    { view: 'settings', label: t.navSettings, desc: 'Profile, language, dark mode, API keys & privacy', icon: Settings, color: 'text-slate-300 bg-slate-800' },
  ]

  const handleSelect = (view: AppView) => {
    setCurrentView(view)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-5 shadow-2xl flex flex-col justify-between z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Explore Features</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                  100% Functional
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                All SpendWise AI tools, splitters, and settings
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid of Navigation Items */}
          <div className="grid grid-cols-1 gap-2.5 py-4">
            {moreItems.map((item) => {
              const Icon = item.icon
              const isCurrent = currentView === item.view
              return (
                <button
                  key={item.view}
                  onClick={() => handleSelect(item.view)}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                    isCurrent
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          SpendWise AI • Built for Ship to Build Hackathon
        </div>
      </div>
    </div>
  )
}
