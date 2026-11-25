import React from 'react'
import { Transaction } from '../../types'
import { formatCurrency } from '../../utils/formatters'

interface NeedWantRatioMeterProps {
  transactions: Transaction[]
}

export const NeedWantRatioMeter: React.FC<NeedWantRatioMeterProps> = ({ transactions }) => {
  const expenses = transactions.filter(t => t.type === 'expense')
  const total = expenses.reduce((s, t) => s + t.amount, 0)

  const needTotal = expenses.filter(t => t.needWant === 'Need').reduce((s, t) => s + t.amount, 0)
  const wantTotal = expenses.filter(t => t.needWant === 'Want').reduce((s, t) => s + t.amount, 0)
  const unclearTotal = expenses.filter(t => t.needWant === 'Unclear').reduce((s, t) => s + t.amount, 0)

  const needPct = total > 0 ? Math.round((needTotal / total) * 100) : 50
  const wantPct = total > 0 ? Math.round((wantTotal / total) * 100) : 40
  const unclearPct = total > 0 ? Math.max(0, 100 - needPct - wantPct) : 10

  return (
    <div className="w-full space-y-3">
      {/* Visual Multi-segment Progress Bar */}
      <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
        <div
          style={{ width: `${needPct}%` }}
          className="bg-emerald-500 h-full transition-all duration-300 relative group"
          title={`Needs: ${needPct}%`}
        />
        <div
          style={{ width: `${wantPct}%` }}
          className="bg-amber-500 h-full transition-all duration-300 relative group"
          title={`Wants: ${wantPct}%`}
        />
        {unclearPct > 0 && (
          <div
            style={{ width: `${unclearPct}%` }}
            className="bg-slate-600 h-full transition-all duration-300"
            title={`Unclear: ${unclearPct}%`}
          />
        )}
      </div>

      {/* Legend & Amounts */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Needs ({needPct}%)
          </div>
          <div className="font-bold text-white text-sm mt-0.5">{formatCurrency(needTotal)}</div>
          <div className="text-[10px] text-slate-400">Target: ~50%</div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Wants ({wantPct}%)
          </div>
          <div className="font-bold text-white text-sm mt-0.5">{formatCurrency(wantTotal)}</div>
          <div className="text-[10px] text-slate-400">Target: ~30%</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Unclear ({unclearPct}%)
          </div>
          <div className="font-bold text-white text-sm mt-0.5">{formatCurrency(unclearTotal)}</div>
          <div className="text-[10px] text-slate-400">Needs review</div>
        </div>
      </div>
    </div>
  )
}
