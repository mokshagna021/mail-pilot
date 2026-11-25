import React, { useState } from 'react'
import { CalendarCheck, Plus, CheckCircle2, Clock, AlertCircle, Trash2, X } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { Bill, Category } from '../../types'
import { formatCurrency, formatDate } from '../../utils/formatters'

export const BillsPage: React.FC = () => {
  const { bills, markBillPaid, addBill, deleteBill } = useFinance()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [biller, setBiller] = useState('')
  const [category, setCategory] = useState<Category>('Bills')

  const unpaidBills = bills.filter(b => !b.isPaid)
  const paidBills = bills.filter(b => b.isPaid)
  const totalUnpaid = unpaidBills.reduce((s, b) => s + b.amount, 0)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseFloat(amount)
    if (!num || !name.trim() || !dueDate) return

    addBill({
      name: name.trim(),
      amount: num,
      currency: 'INR',
      dueDate,
      category,
      isPaid: false,
      isRecurring: true,
      reminderDaysBefore: 3,
      biller: biller.trim() || name.trim(),
    })

    setName('')
    setAmount('')
    setBiller('')
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bill Tracker & Due Dates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Never miss an electricity, broadband, or credit card due date
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl transition text-xs shadow-lg shadow-emerald-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Schedule Bill
        </button>
      </div>

      {/* Unpaid Bills Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Total Unpaid Dues This Month</span>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalUnpaid)}</div>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-rose-400">{unpaidBills.length} bills pending</span> • Factored into your daily spending limit
        </div>
      </div>

      {/* Pending Bills */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Pending Due Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unpaidBills.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{b.name}</h4>
                  <div className="text-[11px] text-slate-400">{b.biller}</div>
                </div>
                <button
                  onClick={() => deleteBill(b.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex justify-between items-center text-xs p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block text-[10px]">Due Date:</span>
                  <span className="font-semibold text-rose-300">{formatDate(b.dueDate)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Amount:</span>
                  <span className="font-extrabold text-white text-sm">{formatCurrency(b.amount)}</span>
                </div>
              </div>

              <button
                onClick={() => markBillPaid(b.id)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                Mark as Paid & Record Expense
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Bills */}
      {paidBills.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-400">Completed Payments This Month</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paidBills.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-3xl bg-slate-950/60 border border-slate-850 flex items-center justify-between text-xs opacity-75"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200">{b.name}</div>
                    <div className="text-[10px] text-slate-500">{b.biller}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-300">{formatCurrency(b.amount)}</span>
                  <span className="block text-[10px] text-emerald-400 font-semibold">Settled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Bill Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Schedule a Recurring Bill</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Bill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BESCOM Power, JioFiber WiFi"
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
                    placeholder="1800"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Biller / Company</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore Electricity Board"
                  value={biller}
                  onChange={(e) => setBiller(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                />
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
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
