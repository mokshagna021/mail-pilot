import React, { useState } from 'react'
import { X, Copy, Trash2, Edit2, AlertTriangle, CheckCircle2, Tag, Calendar, CreditCard, FileText } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { Transaction, Category, NeedWant } from '../../types'
import { formatCurrency, formatDate, getCategoryColor, getCategoryEmoji } from '../../utils/formatters'

interface TransactionDetailModalProps {
  transaction: Transaction | null
  onClose: () => void
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose }) => {
  const { updateTransaction, deleteTransaction, duplicateTransaction, dismissUnusualAlert } = useFinance()
  const [isEditing, setIsEditing] = useState(false)
  const [editNotes, setEditNotes] = useState(transaction?.notes || '')
  const [editCategory, setEditCategory] = useState<Category>(transaction?.category || 'Food')
  const [editNeedWant, setEditNeedWant] = useState<NeedWant>(transaction?.needWant || 'Want')

  if (!transaction) return null

  const color = getCategoryColor(transaction.category)
  const emoji = getCategoryEmoji(transaction.category)

  const handleSaveEdit = () => {
    updateTransaction({
      ...transaction,
      notes: editNotes,
      category: editCategory,
      needWant: editNeedWant,
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteTransaction(transaction.id)
    onClose()
  }

  const handleDuplicate = () => {
    duplicateTransaction(transaction.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${color.bg} border ${color.border}`}>
              {emoji}
            </div>
            <div>
              <h3 className="text-base font-bold text-white truncate max-w-[200px]">{transaction.merchant}</h3>
              <div className="text-[11px] text-slate-400">{formatDate(transaction.date)}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unusual Warning Banner if present */}
        {transaction.isUnusual && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-start gap-2 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Unusual spending detected</span>
                <p className="text-[11px] text-amber-300/80 mt-0.5">{transaction.unusualReason}</p>
              </div>
            </div>
            <button
              onClick={() => dismissUnusualAlert(transaction.id)}
              className="text-[11px] font-semibold text-amber-400 bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1 rounded-xl transition"
            >
              Mark as Expected / Verified
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="py-5 space-y-4">
          <div className="text-center py-2 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <div className="text-xs text-slate-400">Total Transaction Value</div>
            <div className={`text-2xl font-black mt-1 ${transaction.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
            </div>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
                {transaction.category}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                {transaction.needWant}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                {transaction.source}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Payment Method:</span>
              <span className="font-medium text-white">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Transaction Status:</span>
              <span className="text-emerald-400 font-semibold">{transaction.status}</span>
            </div>
            {transaction.referenceNumber && (
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Ref / UPI Number:</span>
                <span className="font-mono text-slate-300 text-[11px]">{transaction.referenceNumber}</span>
              </div>
            )}
            {transaction.notes && (
              <div className="py-1">
                <span className="text-slate-400 block mb-0.5">Notes:</span>
                <span className="text-slate-200">{transaction.notes}</span>
              </div>
            )}

            {/* Receipt line items if available */}
            {transaction.receiptItems && transaction.receiptItems.length > 0 && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Itemized Breakdown:
                </span>
                <div className="space-y-1">
                  {transaction.receiptItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                      <span>{item.name}</span>
                      <span className="font-semibold text-white">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inline Edit Form */}
          {isEditing && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="font-bold text-white">Quick Edit</div>
              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as Category)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                >
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transport">Transport</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Need vs Want</label>
                <select
                  value={editNeedWant}
                  onChange={(e) => setEditNeedWant(e.target.value as NeedWant)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                >
                  <option value="Need">Need</option>
                  <option value="Want">Want</option>
                  <option value="Unclear">Unclear</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Notes</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-slate-800 text-slate-300 py-1.5 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-emerald-500 text-slate-950 py-1.5 rounded-xl font-bold"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Edit, Duplicate, Delete */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={handleDuplicate}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition"
          >
            <Copy className="w-3.5 h-3.5" />
            Duplicate
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition border border-rose-500/30"
            title="Delete Transaction"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
