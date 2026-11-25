import React, { useState } from 'react'
import { Users, Plus, CheckCircle2, ArrowRight, X, ShieldCheck } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { SharedExpense } from '../../types'
import { formatCurrency, formatDate } from '../../utils/formatters'

export const SharedExpensesPage: React.FC = () => {
  const { user, sharedGroup, sharedExpenses, addSharedExpense, settleSharedExpense } = useFinance()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidById, setPaidById] = useState(sharedGroup.members[1]?.id || 'usr_rahul_002')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseFloat(amount)
    if (!num || !title.trim()) return

    const payer = sharedGroup.members.find(m => m.id === paidById) || sharedGroup.members[0]

    addSharedExpense({
      groupId: sharedGroup.id,
      title: title.trim(),
      amount: num,
      currency: 'INR',
      paidById: payer.id,
      paidByName: payer.name,
      splitWithIds: sharedGroup.members.map(m => m.id),
      date: new Date().toISOString().split('T')[0],
      category: 'Groceries',
      settled: false,
    })

    setTitle('')
    setAmount('')
    setIsAddOpen(false)
  }

  // Calculate user's net balance in the group
  // When Rahul paid ₹1200 for 3 people, Rahul paid 1200, each share is 400.
  // Alex (You) owes Rahul ₹400.
  let youOwe = 0
  let youAreOwed = 0

  sharedExpenses.filter(e => !e.settled).forEach(e => {
    const splitCount = e.splitWithIds.length || 1
    const sharePerPerson = e.amount / splitCount
    if (e.paidById === user.id) {
      // Alex paid for others
      youAreOwed += (e.amount - sharePerPerson)
    } else if (e.splitWithIds.includes(user.id)) {
      // Someone else paid, Alex owes his share
      youOwe += sharePerPerson
    }
  })

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Shared Expenses & Bill Splitting</span>
            <Users className="w-6 h-6 text-blue-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Split apartment groceries, Wi-Fi, and vacation dinners without awkward math
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl transition text-xs shadow-lg shadow-blue-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Split an Expense
        </button>
      </div>

      {/* Group Card & Balance Ledger */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
              Active Group
            </span>
            <h3 className="text-lg font-bold text-white">{sharedGroup.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{sharedGroup.description}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {sharedGroup.members.map(m => (
              <div 
                key={m.id} 
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200"
                title={`${m.name} (${m.role})`}
              >
                {m.name[0]}
              </div>
            ))}
          </div>
        </div>

        {/* You Owe / You Are Owed Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">You Owe Group:</span>
              <div className="text-xl font-bold text-rose-400 mt-0.5">{formatCurrency(youOwe)}</div>
            </div>
            <span className="text-[10px] text-slate-500">To Rahul & flatmates</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">You Are Owed:</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{formatCurrency(youAreOwed)}</div>
            </div>
            <span className="text-[10px] text-slate-500">From others</span>
          </div>
        </div>
      </div>

      {/* Shared Expenses Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Expense Ledger</h3>
        <div className="space-y-3">
          {sharedExpenses.map((exp) => {
            const share = exp.amount / exp.splitWithIds.length
            return (
              <div
                key={exp.id}
                className={`p-4 rounded-3xl bg-slate-900 border transition shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  exp.settled ? 'border-slate-850 opacity-60' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                    👥
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{exp.title}</h4>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      <span className="text-blue-300 font-semibold">{exp.paidByName}</span> paid {formatCurrency(exp.amount)} • {exp.splitWithIds.length} people (Each {formatCurrency(Math.round(share))})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {exp.settled ? (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Settled
                    </span>
                  ) : (
                    <button
                      onClick={() => settleSharedExpense(exp.id)}
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-blue-500/20"
                    >
                      Mark Settled
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Split Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Split a Group Expense</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiggy party order, WiFi recharge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Total Bill Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="1200"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Who Paid?</label>
                <select
                  value={paidById}
                  onChange={(e) => setPaidById(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                >
                  {sharedGroup.members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
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
                  className="flex-1 bg-blue-500 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg shadow-blue-500/20"
                >
                  Split Equally
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
