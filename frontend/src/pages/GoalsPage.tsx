import React, { useState } from 'react'
import { 
  Target, Plus, Sparkles, CheckCircle2, Pause, Play, 
  Trash2, Edit2, ArrowRight, DollarSign, X 
} from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { SavingsGoal } from '../../types'
import { formatCurrency, formatDate } from '../../utils/formatters'

export const GoalsPage: React.FC = () => {
  const { goals, addGoal, updateGoal, depositToGoal, deleteGoal } = useFinance()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState<string>('')

  // New goal form
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('0')
  const [deadline, setDeadline] = useState('2027-02-28')
  const [icon, setIcon] = useState('🎯')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const target = parseFloat(targetAmount)
    if (!target || target <= 0 || !name.trim()) return

    addGoal({
      name: name.trim(),
      targetAmount: target,
      currentAmount: parseFloat(currentAmount) || 0,
      deadline,
      icon,
      isPaused: false,
    })

    setName('')
    setTargetAmount('')
    setIsCreateOpen(false)
  }

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!depositGoalId) return
    const amt = parseFloat(depositAmount)
    if (!amt || amt <= 0) return

    depositToGoal(depositGoalId, amt)
    setDepositAmount('')
    setDepositGoalId(null)
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Savings Goals & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build your financial future with automated pacing and weekly targets
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl transition text-xs shadow-lg shadow-emerald-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          New Savings Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.currentAmount / Math.max(1, g.targetAmount)) * 100))
          const remaining = Math.max(0, g.targetAmount - g.currentAmount)

          // Calculate months & weeks remaining
          const now = new Date()
          const end = new Date(g.deadline)
          const diffDays = Math.max(1, Math.round((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
          const diffMonths = Math.max(1, Math.round(diffDays / 30))
          const diffWeeks = Math.max(1, Math.round(diffDays / 7))
          const monthlyTarget = Math.round(remaining / diffMonths)
          const weeklyTarget = Math.round(remaining / diffWeeks)

          return (
            <div
              key={g.id}
              className={`p-5 rounded-3xl bg-slate-900 border transition shadow-xl space-y-4 ${
                g.isPaused ? 'border-slate-800 opacity-75' : 'border-slate-800 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-2xl flex items-center justify-center shrink-0">
                    {g.icon || '🎯'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{g.name}</h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Target Date: {formatDate(g.deadline)} ({diffMonths} mos left)
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteGoal(g.id)}
                  className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition"
                  title="Delete Goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Numbers */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-extrabold text-white">
                    {formatCurrency(g.currentAmount)}
                  </span>
                  <span className="text-xs text-slate-400">
                    Goal: {formatCurrency(g.targetAmount)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                  <span className="text-emerald-400 font-semibold">{pct}% Complete</span>
                  <span>{formatCurrency(remaining)} to go</span>
                </div>
              </div>

              {/* Pacing Breakdown */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Monthly Target:</span>
                  <span className="font-bold text-slate-200">{formatCurrency(monthlyTarget)}/mo</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Weekly Target:</span>
                  <span className="font-bold text-cyan-400">{formatCurrency(weeklyTarget)}/wk</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setDepositGoalId(g.id)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  Add Funds
                </button>
                <button
                  onClick={() => updateGoal({ ...g, isPaused: !g.isPaused })}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  {g.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>

            </div>
          )
        })}
      </div>

      {/* Deposit Funds Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setDepositGoalId(null)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Deposit towards Goal</h3>
              <button onClick={() => setDepositGoalId(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleDepositSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Deposit Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="flex-1 bg-slate-800 text-slate-300 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 text-slate-950 font-bold py-2 rounded-xl text-xs shadow-md shadow-emerald-500/20"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Goal Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Create New Savings Goal</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Goal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa Trip, New Phone, Emergency Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="50000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Current Saved (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Icon / Emoji</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="💻">💻 Tech / Laptop</option>
                    <option value="🏖️">🏖️ Vacation / Travel</option>
                    <option value="🛡️">🛡️ Emergency Fund</option>
                    <option value="🚗">🚗 Vehicle</option>
                    <option value="📚">📚 Education</option>
                    <option value="💍">💍 Event / Wedding</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
