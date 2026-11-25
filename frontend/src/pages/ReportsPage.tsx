import React from 'react'
import { FileText, Download, Printer, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { formatCurrency, formatDate } from '../../utils/formatters'

export const ReportsPage: React.FC = () => {
  const { user, transactions, budgets, subscriptions, goals } = useFinance()

  const expenses = transactions.filter(t => t.type === 'expense')
  const totalSpent = expenses.reduce((s, t) => s + t.amount, 0)
  const totalIncome = user.monthlyIncome || 35000
  const saved = Math.max(0, totalIncome - totalSpent)

  // Category totals
  const categoryTotals: Record<string, number> = {}
  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
  })
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])

  const handlePrint = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const headers = ['Merchant', 'Category', 'Amount', 'Date', 'Type', 'Payment Method']
    const rows = transactions.map(t => [
      `"${t.merchant}"`, t.category, t.amount, t.date, t.type, t.paymentMethod
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `SpendWise_Monthly_Statement_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Financial Reports & Statements</span>
            <FileText className="w-6 h-6 text-indigo-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate printable audit summaries and export financial ledgers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3.5 py-2.5 rounded-xl transition text-xs border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2.5 rounded-xl transition text-xs shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Printable Report Paper Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="text-emerald-400 font-black text-xl tracking-tight">SPENDWISE AI</div>
            <div className="text-xs text-slate-400 mt-0.5">Monthly Financial Health & Spending Audit</div>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-400">
            <div>Account Holder: <span className="font-bold text-white">{user.firstName} {user.lastName}</span></div>
            <div>Period: <span className="font-semibold text-slate-200">September 2026</span></div>
          </div>
        </div>

        {/* Section 38: Monthly AI Narrative Summary */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>AI Executive Observation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            "Your total spending this month was {formatCurrency(totalSpent)} against a planned budget of {formatCurrency(user.monthlyBudget)}. Food & Dining was your highest category at {formatCurrency(categoryTotals['Food'] || 0)}, while you successfully preserved {formatCurrency(saved)} in net savings. 4 recurring subscriptions remain active totaling {formatCurrency(1417)}/month."
          </p>
        </div>

        {/* Key Totals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">Total Inflow:</span>
            <span className="text-base font-bold text-emerald-400 mt-1 block">{formatCurrency(totalIncome)}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">Total Outflow:</span>
            <span className="text-base font-bold text-rose-400 mt-1 block">{formatCurrency(totalSpent)}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">Net Saved:</span>
            <span className="text-base font-bold text-white mt-1 block">{formatCurrency(saved)}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block">Budget Efficiency:</span>
            <span className="text-base font-bold text-cyan-400 mt-1 block">{Math.round((totalSpent / (user.monthlyBudget || 1)) * 100)}%</span>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Category Audit</h3>
          <div className="border border-slate-800 rounded-2xl overflow-hidden text-xs">
            <div className="grid grid-cols-3 p-3 bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <span>Category</span>
              <span className="text-center">Share of Total</span>
              <span className="text-right">Amount</span>
            </div>
            {sortedCategories.map(([cat, amt]) => (
              <div key={cat} className="grid grid-cols-3 p-3 border-b border-slate-850 text-slate-200">
                <span className="font-semibold text-white">{cat}</span>
                <span className="text-center text-slate-400">
                  {totalSpent > 0 ? ((amt / totalSpent) * 100).toFixed(1) : 0}%
                </span>
                <span className="text-right font-bold text-white">{formatCurrency(amt)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
