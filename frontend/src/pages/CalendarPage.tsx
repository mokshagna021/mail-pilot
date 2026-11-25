import React, { useState } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { formatCurrency, formatDate, getCategoryColor, getCategoryEmoji } from '../../utils/formatters'

export const CalendarPage: React.FC = () => {
  const { transactions, setSelectedTransaction } = useFinance()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDayStr, setSelectedDayStr] = useState<string>(new Date().toISOString().split('T')[0])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // First day of month & total days
  const firstDayIndex = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  // Map expenses by YYYY-MM-DD
  const dailySpendMap: Record<string, number> = {}
  transactions.filter(t => t.type === 'expense').forEach(t => {
    dailySpendMap[t.date] = (dailySpendMap[t.date] || 0) + t.amount
  })

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  // Day cells
  const daysArray = []
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null)
  }
  for (let d = 1; d <= totalDays; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    daysArray.push({
      dayNumber: d,
      dateStr: dStr,
      spent: dailySpendMap[dStr] || 0,
    })
  }

  const selectedDayTransactions = transactions.filter(t => t.date === selectedDayStr)
  const selectedDayTotal = selectedDayTransactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Expense Calendar</span>
          <CalendarIcon className="w-6 h-6 text-cyan-400" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Visually map high-spend days and drill down into specific dates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Grid (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">{monthName}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 uppercase">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-xs">
            {daysArray.map((day, idx) => {
              if (!day) {
                return <div key={`empty_${idx}`} className="h-16 rounded-2xl bg-slate-950/20" />
              }

              const isSelected = selectedDayStr === day.dateStr
              const hasSpend = day.spent > 0

              return (
                <button
                  key={day.dateStr}
                  onClick={() => setSelectedDayStr(day.dateStr)}
                  className={`h-16 p-1.5 rounded-2xl border flex flex-col justify-between transition text-left ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                      : hasSpend
                      ? 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-200'
                      : 'bg-slate-950/40 hover:bg-slate-850 border-slate-850 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-[11px]">{day.dayNumber}</span>
                  {hasSpend && (
                    <span className="text-[10px] font-bold text-rose-400 truncate">
                      {formatCurrency(day.spent, 'INR', { compact: true })}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Date Drilldown (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Selected Date
              </span>
              <h3 className="font-bold text-white text-base mt-0.5">{formatDate(selectedDayStr)}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Total Spent:</span>
              <span className="text-lg font-extrabold text-rose-400">{formatCurrency(selectedDayTotal)}</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {selectedDayTransactions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No transactions recorded on this day 🎉
              </div>
            ) : (
              selectedDayTransactions.map(tx => {
                const color = getCategoryColor(tx.category)
                const emoji = getCategoryEmoji(tx.category)
                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:bg-slate-800 cursor-pointer transition text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{emoji}</span>
                      <div>
                        <div className="font-bold text-white">{tx.merchant}</div>
                        <div className="text-[10px] text-slate-400">{tx.category} • {tx.paymentMethod}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
