import React, { useState } from 'react'
import { 
  PieChart, BarChart3, TrendingUp, TrendingDown, AlertTriangle, 
  Sparkles, Calendar, ChevronRight, CheckCircle2, ArrowRight, ShieldCheck 
} from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { formatCurrency, formatDate, getCategoryColor, getCategoryEmoji } from '../../utils/formatters'
import { predictMonthEndSpending } from '../../utils/calculations'
import { SpendingTrendChart } from '../../components/charts/SpendingTrendChart'
import { CategoryDonutChart } from '../../components/charts/CategoryDonutChart'
import { IncomeExpenseBarChart } from '../../components/charts/IncomeExpenseBarChart'
import { NeedWantRatioMeter } from '../../components/charts/NeedWantRatioMeter'
import { Category, Transaction } from '../../types'

export const AnalyticsPage: React.FC = () => {
  const { 
    user, transactions, bills, setSelectedTransaction, 
    dismissUnusualAlert, setCurrentView 
  } = useFinance()

  const [timeRange, setTimeRange] = useState<'30d' | '14d' | '7d'>('14d')
  const [drillCategory, setDrillCategory] = useState<Category | null>(null)

  const expenses = transactions.filter(t => t.type === 'expense')
  const totalSpent = expenses.reduce((s, t) => s + t.amount, 0)
  const totalIncome = user.monthlyIncome || 35000
  const saved = Math.max(0, totalIncome - totalSpent)

  // Prediction calculations
  const prediction = predictMonthEndSpending(transactions, bills)

  // Payment Method Breakdown
  const paymentBreakdown: Record<string, number> = {}
  expenses.forEach(t => {
    paymentBreakdown[t.paymentMethod] = (paymentBreakdown[t.paymentMethod] || 0) + t.amount
  })
  const paymentSorted = Object.entries(paymentBreakdown).sort((a, b) => b[1] - a[1])

  // Merchant Leaderboard
  const merchantTotals: Record<string, { total: number; count: number; category: Category }> = {}
  expenses.forEach(t => {
    if (!merchantTotals[t.merchant]) {
      merchantTotals[t.merchant] = { total: 0, count: 0, category: t.category }
    }
    merchantTotals[t.merchant].total += t.amount
    merchantTotals[t.merchant].count += 1
  })
  const topMerchants = Object.entries(merchantTotals)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5)

  // Unusual Transactions
  const unusualTransactions = transactions.filter(t => t.isUnusual)

  // Drilled transactions
  const drilledTransactions = drillCategory 
    ? transactions.filter(t => t.category === drillCategory)
    : []

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Analytics & Forecasting
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deep dive into spending habits, merchant leaderboards, and AI projections
          </p>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-2xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${timeRange === '7d' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('14d')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${timeRange === '14d' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            14 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${timeRange === '30d' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* 1. Future Expense Prediction Card */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/30 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Month-End Expense Prediction</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  AI Model
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {prediction.note}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400">Estimated Total:</span>
            <div className="text-2xl font-extrabold text-cyan-400">
              {formatCurrency(prediction.estimatedTotal)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400">Current Spending:</div>
            <div className="font-bold text-white text-sm mt-0.5">{formatCurrency(prediction.currentSpent)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400">Daily Average:</div>
            <div className="font-bold text-emerald-400 text-sm mt-0.5">{formatCurrency(prediction.dailyAverage)}/day</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400">Days Remaining:</div>
            <div className="font-bold text-white text-sm mt-0.5">{prediction.daysRemaining} days</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400">Confidence:</div>
            <div className="font-bold text-cyan-400 text-sm mt-0.5">{prediction.confidence}</div>
          </div>
        </div>
      </div>

      {/* 2. Unusual Spending Detection Banner if any */}
      {unusualTransactions.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Unusual Spending Detected ({unusualTransactions.length})</h3>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-semibold">
              Category Spikes
            </span>
          </div>

          <div className="space-y-2">
            {unusualTransactions.map(tx => (
              <div 
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{tx.merchant}</span>
                    <span className="text-amber-400 font-extrabold">{formatCurrency(tx.amount)}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.2 rounded-md">{tx.category}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">{tx.unusualReason}</div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setSelectedTransaction(tx)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => dismissUnusualAlert(tx.id)}
                    className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-xl font-semibold"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trend Area Chart (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Spending Pace & Velocity</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily aggregate transactions showing spending velocity
            </p>
          </div>
          <SpendingTrendChart 
            transactions={transactions} 
            days={timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30} 
          />
        </div>

        {/* Category Breakdown Donut (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Category Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Click category to drill down</p>
            </div>
            {drillCategory && (
              <button
                onClick={() => setDrillCategory(null)}
                className="text-xs text-amber-400 font-semibold"
              >
                Reset
              </button>
            )}
          </div>
          <CategoryDonutChart
            transactions={transactions}
            selectedCategory={drillCategory}
            onSelectCategory={setDrillCategory}
          />
        </div>

      </div>

      {/* 4. Drilled Down Category Transactions Table if clicked */}
      {drillCategory && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{drillCategory} Transactions ({drilledTransactions.length})</span>
            </h3>
            <button
              onClick={() => setDrillCategory(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close Drilldown
            </button>
          </div>

          <div className="space-y-2">
            {drilledTransactions.map(tx => (
              <div
                key={tx.id}
                onClick={() => setSelectedTransaction(tx)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:bg-slate-800 cursor-pointer text-xs"
              >
                <div>
                  <div className="font-bold text-white">{tx.merchant}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(tx.date)} • {tx.paymentMethod}</div>
                </div>
                <div className="font-bold text-slate-100">
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Income vs Expenses & Payment Methods Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Income vs Expenses Bar (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Monthly Cash Flow Balance</h3>
          <IncomeExpenseBarChart
            income={totalIncome}
            expenses={totalSpent}
            saved={saved}
          />
        </div>

        {/* Payment Methods (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Payment Method Distribution</h3>
          <div className="space-y-3">
            {paymentSorted.map(([method, amount]) => {
              const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
              return (
                <div key={method} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">{method}</span>
                    <span className="font-bold text-white">
                      {formatCurrency(amount)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* 6. Top Merchants Leaderboard */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Top Merchants & Payees</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topMerchants.map(([merchant, data]) => {
            const color = getCategoryColor(data.category)
            const emoji = getCategoryEmoji(data.category)
            return (
              <div
                key={merchant}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${color.bg}`}>
                    {emoji}
                  </div>
                  <div>
                    <div className="font-bold text-white truncate max-w-[120px]">{merchant}</div>
                    <div className="text-[10px] text-slate-400">{data.count} purchases</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{formatCurrency(data.total)}</div>
                  <div className="text-[10px] text-emerald-400">
                    {totalSpent > 0 ? ((data.total / totalSpent) * 100).toFixed(1) : 0}% of spend
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
