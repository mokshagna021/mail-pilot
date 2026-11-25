import React, { useState } from 'react'
import { Repeat, Plus, AlertCircle, Trash2, Pause, Play, CheckCircle2, X } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { Subscription } from '../../types'
import { formatCurrency, formatDate } from '../../utils/formatters'

export const SubscriptionsPage: React.FC = () => {
  const { subscriptions, toggleSubscriptionStatus, addSubscription, deleteSubscription } = useFinance()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly')

  const activeSubs = subscriptions.filter(s => s.status === 'active')
  
  // Calculate total monthly and annual costs
  const monthlyTotal = activeSubs.reduce((sum, s) => {
    return sum + (s.frequency === 'yearly' ? s.amount / 12 : s.amount)
  }, 0)

  const annualTotal = monthlyTotal * 12

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseFloat(amount)
    if (!num || !name.trim()) return

    addSubscription({
      name: name.trim(),
      amount: num,
      currency: 'INR',
      frequency,
      category: 'Subscription',
      nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      billingCycle: `${frequency === 'monthly' ? 'Monthly' : 'Yearly'} auto-debit`,
      status: 'active',
      icon: '🔁',
      merchantPattern: name.trim(),
    })

    setName('')
    setAmount('')
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recurring Subscription Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Detect hidden streaming drains, memberships, and forecast annual cost
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl transition text-xs shadow-lg shadow-emerald-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Add Subscription
        </button>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Active Subscriptions</span>
          <div className="text-2xl font-bold text-white">{activeSubs.length} Services</div>
          <span className="text-[10px] text-emerald-400">Monitored for renewal</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Monthly Commitment</span>
          <div className="text-2xl font-bold text-purple-400">{formatCurrency(Math.round(monthlyTotal))}/mo</div>
          <span className="text-[10px] text-slate-400">Drawn automatically</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Estimated Annual Spend</span>
          <div className="text-2xl font-bold text-amber-400">{formatCurrency(Math.round(annualTotal))}/yr</div>
          <span className="text-[10px] text-slate-400">Total yearly drain</span>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => {
          const yearlyEstimate = sub.frequency === 'monthly' ? sub.amount * 12 : sub.amount
          const isActive = sub.status === 'active'

          return (
            <div
              key={sub.id}
              className={`p-5 rounded-3xl bg-slate-900 border transition shadow-lg space-y-4 ${
                isActive ? 'border-slate-800' : 'border-slate-850 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xl flex items-center justify-center">
                    {sub.icon || '🔁'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{sub.name}</h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">{sub.billingCycle}</div>
                  </div>
                </div>

                <button
                  onClick={() => deleteSubscription(sub.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Cost:</span>
                  <span className="font-bold text-white text-sm">
                    {formatCurrency(sub.amount)} / {sub.frequency}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Estimated Yearly Cost:</span>
                  <span className="font-semibold text-purple-400">{formatCurrency(yearlyEstimate)}/yr</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800">
                  <span>Next Renewal:</span>
                  <span className="text-slate-200">{formatDate(sub.nextRenewalDate)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleSubscriptionStatus(sub.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-emerald-500 text-slate-950 font-bold'
                  }`}
                >
                  {isActive ? 'Pause Tracking' : 'Reactivate'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Subscription Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Add Subscription</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Disney+ Hotstar, Gym, iCloud"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="299"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Cycle</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white outline-none"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
