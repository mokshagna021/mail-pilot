import React from 'react'
import { Flame, CheckCircle2, Trophy, Plus, Sparkles, ArrowRight } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { formatCurrency } from '../../utils/formatters'

export const ChallengesPage: React.FC = () => {
  const { challenges, updateChallengeProgress } = useFinance()

  const activeChallenges = challenges.filter(c => c.status === 'active')
  const completedChallenges = challenges.filter(c => c.status === 'completed')

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <span>Gamified Savings Challenges</span>
          <Flame className="w-7 h-7 text-amber-400 fill-amber-400" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Form long-lasting financial discipline through personalized mini-challenges
        </p>
      </div>

      {/* Active Challenges Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>Active Quests ({activeChallenges.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeChallenges.map((ch) => {
            const pct = Math.min(100, Math.round((ch.currentAmount / ch.targetAmount) * 100))
            const remaining = Math.max(0, ch.targetAmount - ch.currentAmount)

            return (
              <div
                key={ch.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-amber-500/40 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      {ch.badge}
                    </span>
                    <h4 className="font-bold text-white text-base mt-1">{ch.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{ch.description}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Target: {formatCurrency(ch.targetAmount)}</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(ch.currentAmount)} saved</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{pct}% Completed</span>
                    <span className="text-amber-400 font-semibold">{ch.daysLeft} days remaining</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => updateChallengeProgress(ch.id, 100)}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    Log Progress (+₹100)
                  </button>
                  <button
                    onClick={() => updateChallengeProgress(ch.id, remaining)}
                    className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Completed Trophies</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedChallenges.map((ch) => (
              <div
                key={ch.id}
                className="p-4 rounded-3xl bg-slate-950/70 border border-slate-850 flex items-center justify-between text-xs opacity-80"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-lg">
                    🏆
                  </div>
                  <div>
                    <div className="font-bold text-slate-200">{ch.title}</div>
                    <div className="text-[10px] text-slate-500">{ch.badge} • Saved {formatCurrency(ch.targetAmount)}</div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
