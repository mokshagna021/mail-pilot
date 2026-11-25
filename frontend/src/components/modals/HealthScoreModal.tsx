import React from 'react'
import { X, HeartPulse, CheckCircle2, ShieldCheck, AlertCircle, Info } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { calculateFinancialHealthScore } from '../../utils/calculations'

interface HealthScoreModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HealthScoreModal: React.FC<HealthScoreModalProps> = ({ isOpen, onClose }) => {
  const { user, transactions, subscriptions, goals } = useFinance()

  if (!isOpen) return null

  const spent = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  const subsTotal = subscriptions
    .filter(s => s.status === 'active')
    .reduce((s, sub) => s + (sub.frequency === 'yearly' ? sub.amount / 12 : sub.amount), 0)

  const health = calculateFinancialHealthScore(
    user.monthlyIncome,
    spent,
    user.monthlyBudget,
    subsTotal,
    goals
  )

  const pillars = [
    {
      title: 'Budget Discipline',
      score: health.budgetUsageScore,
      max: 30,
      desc: 'How well you stay within your ₹20,000 monthly target without overrunning.',
    },
    {
      title: 'Savings Ratio',
      score: health.savingsProgressScore,
      max: 25,
      desc: 'Proportion of monthly income saved after all essential and discretionary expenses.',
    },
    {
      title: 'Recurring Commitments',
      score: health.recurringExpenseScore,
      max: 20,
      desc: 'Impact of recurring subscriptions and utility bills relative to monthly cash flow.',
    },
    {
      title: 'Savings Goal Pacing',
      score: health.goalPacingScore,
      max: 25,
      desc: 'On-schedule progress toward targets like your New Laptop and Emergency Fund.',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Financial Health Breakdown</h3>
              <p className="text-xs text-slate-400">Transparent mathematical breakdown & methodology</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Score Banner */}
        <div className="py-5 text-center bg-slate-950/80 rounded-2xl border border-slate-800/80 my-4 space-y-1">
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            {health.overallScore} / 100
          </div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Rating: {health.rating}
          </div>
          <p className="text-xs text-slate-300 px-6 pt-1 leading-relaxed">
            {health.summary}
          </p>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Evaluation Pillars:
          </div>
          {pillars.map((pillar) => (
            <div key={pillar.title} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">{pillar.title}</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {pillar.score} / {pillar.max} pts
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(pillar.score / pillar.max) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">{pillar.desc}</div>
            </div>
          ))}
        </div>

        {/* Actionable Insights */}
        <div className="pt-4 space-y-2">
          <div className="text-xs font-bold text-slate-300">Key AI Recommendations:</div>
          {health.improvements.map((imp, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{imp}</span>
            </div>
          ))}
        </div>

        {/* Educational Disclaimer */}
        <div className="mt-5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] text-slate-500 flex items-start gap-2 leading-relaxed">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
          <span>
            Disclaimer: SpendWise AI calculates this health score purely for educational tracking based on user-provided transaction records. It does not constitute certified financial or investment advice.
          </span>
        </div>

      </div>
    </div>
  )
}
