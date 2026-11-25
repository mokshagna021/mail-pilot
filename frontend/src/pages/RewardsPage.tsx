import React from 'react'
import { Gift, Sparkles, Plus, CheckCircle2 } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { formatCurrency, formatDate } from '../../utils/formatters'

export const RewardsPage: React.FC = () => {
  const { rewards } = useFinance()

  const totalRewards = rewards.reduce((s, r) => s + r.amount, 0)
  const cashbackTotal = rewards.filter(r => r.type === 'Cashback').reduce((s, r) => s + r.amount, 0)
  const discountTotal = rewards.filter(r => r.type === 'Discount').reduce((s, r) => s + r.amount, 0)

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Cashback & Rewards Tracker</span>
          <Gift className="w-6 h-6 text-pink-400" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor your UPI scratch cards, credit card cashbacks, and coupon savings
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Unlocked Savings</span>
          <div className="text-3xl font-extrabold text-emerald-400">{formatCurrency(totalRewards)}</div>
          <span className="text-[10px] text-slate-500">Excluded from active income</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Direct Cashback</span>
          <div className="text-2xl font-bold text-white">{formatCurrency(cashbackTotal)}</div>
          <span className="text-[10px] text-slate-400">Google Pay & Cred cards</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Discounts & Coupons</span>
          <div className="text-2xl font-bold text-pink-400">{formatCurrency(discountTotal)}</div>
          <span className="text-[10px] text-slate-400">Swiggy & eCommerce deals</span>
        </div>
      </div>

      {/* Rewards Log */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Reward Receipts</h3>
        <div className="space-y-2.5">
          {rewards.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-base">
                  🎁
                </div>
                <div>
                  <div className="font-bold text-white">{r.title}</div>
                  <div className="text-[10px] text-slate-400">{formatDate(r.date)} • {r.source}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-400 text-sm">+{formatCurrency(r.amount)}</div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.2 rounded-md font-semibold">
                  {r.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
