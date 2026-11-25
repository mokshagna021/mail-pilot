import React from 'react'
import { LayoutDashboard, ReceiptText, PieChart, Bot, MoreHorizontal } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { translations } from '../../utils/translations'
import { AppView } from '../../types'

interface MobileNavProps {
  onOpenMore: () => void
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenMore }) => {
  const { currentView, setCurrentView, language } = useFinance()
  const t = translations[language] || translations.en

  const navItems: { view: AppView; label: string; icon: any }[] = [
    { view: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { view: 'transactions', label: 'Spends', icon: ReceiptText },
    { view: 'analytics', label: t.navAnalytics, icon: PieChart },
    { view: 'ai-coach', label: 'Coach', icon: Bot },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.view
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          )
        })}

        {/* More Trigger */}
        <button
          onClick={onOpenMore}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{t.navMore}</span>
        </button>
      </div>
    </nav>
  )
}
