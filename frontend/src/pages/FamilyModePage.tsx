import React, { useState } from 'react'
import { Home, ShieldCheck, UserCheck, Plus, CheckCircle2, Lock } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { formatCurrency } from '../../utils/formatters'

interface HouseholdMember {
  id: string
  name: string
  relationship: string
  role: 'Owner' | 'Admin' | 'Member' | 'Viewer'
  avatar: string
  spendingLimit: number
  spentThisMonth: number
}

export const FamilyModePage: React.FC = () => {
  const { user } = useFinance()

  const [members, setMembers] = useState<HouseholdMember[]>([
    { id: '1', name: `${user.firstName} (You)`, relationship: 'Primary Account', role: 'Owner', avatar: '👨‍💼', spendingLimit: 25000, spentThisMonth: 10150 },
    { id: '2', name: 'Priya Verma', relationship: 'Spouse / Partner', role: 'Admin', avatar: '👩‍💼', spendingLimit: 20000, spentThisMonth: 8400 },
    { id: '3', name: 'Aarav Verma', relationship: 'Son / College Student', role: 'Member', avatar: '👦', spendingLimit: 6000, spentThisMonth: 3800 },
    { id: '4', name: 'Grandma Verma', relationship: 'Parent', role: 'Viewer', avatar: '👵', spendingLimit: 4000, spentThisMonth: 1200 },
  ])

  const totalHouseholdBudget = 55000
  const totalHouseholdSpent = members.reduce((s, m) => s + m.spentThisMonth, 0)

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Family & Household Mode</span>
          <Home className="w-6 h-6 text-emerald-400" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Coordinate family budgeting with strict role permissions (Owner, Admin, Member, Viewer)
        </p>
      </div>

      {/* Household Overview Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Household Financial Pool
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {formatCurrency(totalHouseholdSpent)} <span className="text-sm font-normal text-slate-400">/ {formatCurrency(totalHouseholdBudget)}</span>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            <span className="font-bold text-emerald-400">{members.length} Active Members</span> • Synchronized monthly pool
          </div>
        </div>

        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (totalHouseholdSpent / totalHouseholdBudget) * 100)}%` }}
          />
        </div>
      </div>

      {/* Members Grid with Role Permissions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Household Members & Access Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((m) => {
            const pct = Math.round((m.spentThisMonth / m.spendingLimit) * 100)
            return (
              <div
                key={m.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700">
                      {m.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{m.name}</h4>
                      <div className="text-[11px] text-slate-400">{m.relationship}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    m.role === 'Owner'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : m.role === 'Admin'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : m.role === 'Member'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {m.role}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Individual Limit:</span>
                    <span className="font-bold text-white">{formatCurrency(m.spentThisMonth)} / {formatCurrency(m.spendingLimit)}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">
                    {pct}% limit used
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Permissions:</span>
                  <span className="text-slate-300">
                    {m.role === 'Owner' ? 'Full Control & Auditing' : m.role === 'Admin' ? 'Approve Spends & Budgets' : m.role === 'Member' ? 'Record Personal Spends' : 'Read-Only Overview'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
