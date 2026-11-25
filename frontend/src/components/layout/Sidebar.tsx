import React from 'react'
import { 
  LayoutDashboard, ReceiptText, PieChart, Wallet, Bot, Target, 
  MoreHorizontal, Plus, Camera, Smartphone, HeartPulse, ChevronRight 
} from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { translations } from '../../utils/translations'
import { AppView } from '../../types'

interface SidebarProps {
  onOpenMore: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenMore }) => {
  const { 
    currentView, setCurrentView, language, 
    setIsAddExpenseOpen, setIsReceiptScannerOpen, setIsUPIScannerOpen,
    setIsHealthModalOpen 
  } = useFinance()

  const t = translations[language] || translations.en

  const navItems: { view: AppView; label: string; icon: any; badge?: string }[] = [
    { view: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { view: 'transactions', label: t.navTransactions, icon: ReceiptText },
    { view: 'analytics', label: t.navAnalytics, icon: PieChart },
    { view: 'budgets', label: t.navBudgets, icon: Wallet },
    { view: 'ai-coach', label: t.navAICoach, icon: Bot, badge: 'AI' },
    { view: 'goals', label: t.navGoals, icon: Target },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 p-4 shrink-0 justify-between select-none">
      
      {/* Top Section: Quick Add Actions & Primary Navigation */}
      <div className="space-y-6">
        
        {/* Quick Actions Card */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl space-y-2">
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-2.5 rounded-xl transition text-xs shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            {t.addExpense}
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsReceiptScannerOpen(true)}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold py-2 px-2 rounded-xl transition border border-slate-700/60"
              title="Scan Bill or Receipt"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              Receipt
            </button>
            <button
              onClick={() => setIsUPIScannerOpen(true)}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold py-2 px-2 rounded-xl transition border border-slate-700/60"
              title="Analyze UPI Screenshot"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              UPI Scan
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Core Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.view
            return (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}

          {/* More Items Button */}
          <button
            onClick={onOpenMore}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-slate-300 hover:bg-slate-900 hover:text-white`}
          >
            <div className="flex items-center gap-3">
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
              <span>{t.navMore}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </nav>

      </div>

      {/* Bottom Mini Banner: Financial Health Quick Card */}
      <div 
        onClick={() => setIsHealthModalOpen(true)}
        className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-3 rounded-2xl cursor-pointer hover:border-emerald-500/40 transition group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white group-hover:text-emerald-300 transition">
                Financial Health
              </div>
              <div className="text-[10px] text-slate-400">Score: 84 / 100 (Good)</div>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
        </div>
      </div>

    </aside>
  )
}
