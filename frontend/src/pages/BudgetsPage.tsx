import React, { useState } from 'react'
import { 
  Wallet, Sparkles, Check, X, Edit2, AlertCircle, Plus, 
  CheckCircle2, AlertTriangle, ArrowRight 
} from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { Budget, BudgetRecommendation, Category } from '../../types'
import { formatCurrency, getCategoryColor, getCategoryEmoji } from '../../utils/formatters'

export const BudgetsPage: React.FC = () => {
  const { 
    budgets, updateBudget, budgetRecommendations, 
    acceptBudgetRecommendation 
  } = useFinance()

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [editLimit, setEditLimit] = useState<string>('')
  const [rejectedRecs, setRejectedRecs] = useState<string[]>([])

  const totalBudget = budgets.find(b => b.category === 'Total') || {
    id: 'b_total', category: 'Total' as const, monthlyLimit: 20000, spent: 10150, period: '2026-09', alertThreshold: 80
  }

  const categoryBudgets = budgets.filter(b => b.category !== 'Total')

  const handleOpenEdit = (b: Budget) => {
    setEditingBudget(b)
    setEditLimit(b.monthlyLimit.toString())
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBudget) return
    const num = parseFloat(editLimit)
    if (!num || num <= 0) return

    updateBudget({
      ...editingBudget,
      monthlyLimit: num,
    })
    setEditingBudget(null)
  }

  const handleRejectRec = (category: string) => {
    setRejectedRecs(prev => [...prev, category])
  }

  const activeRecommendations = budgetRecommendations.filter(r => !rejectedRecs.includes(r.category))

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Budgets & Limit Planning
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor category caps and apply intelligent AI recommendations
          </p>
        </div>
      </div>

      {/* 1. Master Budget Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Monthly Budget
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {formatCurrency(totalBudget.spent)} <span className="text-sm text-slate-400 font-normal">/ {formatCurrency(totalBudget.monthlyLimit)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenEdit(totalBudget)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Adjust Total Limit
            </button>
          </div>
        </div>

        {/* Big Progress bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalBudget.spent >= totalBudget.monthlyLimit
                  ? 'bg-rose-500'
                  : totalBudget.spent >= totalBudget.monthlyLimit * 0.8
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (totalBudget.spent / totalBudget.monthlyLimit) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>{((totalBudget.spent / totalBudget.monthlyLimit) * 100).toFixed(0)}% consumed</span>
            <span className="text-emerald-400 font-semibold">
              {formatCurrency(Math.max(0, totalBudget.monthlyLimit - totalBudget.spent))} safe buffer remaining
            </span>
          </div>
        </div>
      </div>

      {/* 2. AI Budget Recommendations */}
      {activeRecommendations.length > 0 && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">AI Smart Budget Optimizations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeRecommendations.map((rec) => (
              <div
                key={rec.category}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white text-sm">{rec.category}</span>
                    <div className="text-emerald-400 font-bold mt-0.5">
                      Suggested Limit: {formatCurrency(rec.suggestedLimit)}
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/20">
                    AI Insight
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {rec.reason}
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => acceptBudgetRecommendation(rec)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRec(rec.category)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Category Budgets Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Category Budget Allocations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBudgets.map((b) => {
            const color = getCategoryColor(b.category)
            const emoji = getCategoryEmoji(b.category)
            const pct = Math.round((b.spent / b.monthlyLimit) * 100)
            const isOver = b.spent >= b.monthlyLimit
            const isNear = pct >= 80 && !isOver

            return (
              <div
                key={b.id}
                className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${color.bg} border ${color.border}`}>
                      {emoji}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{b.category}</div>
                      <div className="text-[10px] text-slate-400">
                        {isOver ? (
                          <span className="text-rose-400 font-bold">Over budget</span>
                        ) : isNear ? (
                          <span className="text-amber-400 font-semibold">Near limit</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">On track</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    title="Edit Category Budget"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Spent:</span>
                    <span className="font-bold text-white">
                      {formatCurrency(b.spent)} <span className="text-slate-500 font-normal">/ {formatCurrency(b.monthlyLimit)}</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>{pct}% utilized</span>
                    <span className={isOver ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {isOver ? `Over by ${formatCurrency(b.spent - b.monthlyLimit)}` : `${formatCurrency(b.monthlyLimit - b.spent)} left`}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setEditingBudget(null)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">
                Set Budget for {editingBudget.category}
              </h3>
              <button onClick={() => setEditingBudget(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Monthly Limit (₹)
                </label>
                <input
                  type="number"
                  required
                  value={editLimit}
                  onChange={(e) => setEditLimit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBudget(null)}
                  className="flex-1 bg-slate-800 text-slate-300 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 text-slate-950 font-bold py-2 rounded-xl text-xs shadow-md shadow-emerald-500/20"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
