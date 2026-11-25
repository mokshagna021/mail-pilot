import React from 'react'
import { formatCurrency } from '../../utils/formatters'

interface IncomeExpenseBarChartProps {
  income: number
  expenses: number
  saved: number
}

export const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({
  income,
  expenses,
  saved,
}) => {
  const max = Math.max(income, expenses + saved, 1000)

  const items = [
    { label: 'Total Income', amount: income, color: 'from-emerald-500 to-teal-400', textColor: 'text-emerald-400', icon: '💰' },
    { label: 'Spent Expenses', amount: expenses, color: 'from-rose-500 to-orange-400', textColor: 'text-rose-400', icon: '💸' },
    { label: 'Net Saved', amount: saved, color: 'from-blue-500 to-indigo-400', textColor: 'text-blue-400', icon: '🛡️' },
  ]

  return (
    <div className="w-full space-y-4">
      {items.map((item) => {
        const percent = Math.min(100, Math.max(2, Math.round((item.amount / max) * 100)))
        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <span>{item.icon}</span>
                {item.label}
              </span>
              <span className={`font-bold ${item.textColor}`}>
                {formatCurrency(item.amount)}
              </span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
