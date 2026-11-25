import React, { useState, useEffect } from 'react'
import { X, Sparkles, AlertCircle, Check, ArrowRight } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { Category, PaymentMethod, NeedWant, CurrencyCode } from '../../types'
import { categorizeExpense, saveLearnedCategory } from '../../ai/geminiService'
import { translations } from '../../utils/translations'
import { currencySymbols, formatCurrency } from '../../utils/formatters'

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const { user, currency, language, addTransaction, checkDuplicate } = useFinance()
  const t = translations[language] || translations.en

  const [amount, setAmount] = useState<string>('')
  const [merchant, setMerchant] = useState<string>('')
  const [category, setCategory] = useState<Category>('Food')
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI')
  const [needWant, setNeedWant] = useState<NeedWant>('Want')
  const [notes, setNotes] = useState<string>('')
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(currency)
  const [type, setType] = useState<'expense' | 'income'>('expense')
  
  // Duplicate check warning
  const [duplicateWarning, setDuplicateWarning] = useState<boolean>(false)
  const [autoSuggested, setAutoSuggested] = useState<boolean>(false)

  // Auto-suggest category and need/want as merchant changes
  useEffect(() => {
    if (merchant.trim().length >= 3) {
      const suggestion = categorizeExpense(merchant, notes)
      if (suggestion.category !== 'Other') {
        setCategory(suggestion.category)
        setNeedWant(suggestion.needWant)
        setAutoSuggested(true)
      }
    }
  }, [merchant])

  // Check for duplicates when amount and merchant are filled
  useEffect(() => {
    const num = parseFloat(amount)
    if (num > 0 && merchant.trim().length >= 3) {
      const dup = checkDuplicate(merchant, num, date)
      setDuplicateWarning(Boolean(dup))
    } else {
      setDuplicateWarning(false)
    }
  }, [amount, merchant, date])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) return
    if (!merchant.trim()) return

    // Save learning if user modified category
    saveLearnedCategory(merchant, category)

    addTransaction({
      userId: user.id,
      amount: numAmount,
      currency: selectedCurrency,
      merchant: merchant.trim(),
      category: type === 'income' ? 'Salary' : category,
      date,
      paymentMethod,
      notes: notes.trim(),
      needWant: type === 'income' ? 'Need' : needWant,
      source: 'Manual',
      type,
      status: 'Completed',
    })

    // Reset and close
    setAmount('')
    setMerchant('')
    setNotes('')
    onClose()
  }

  const categories: Category[] = [
    'Food', 'Shopping', 'Transport', 'Bills', 'Entertainment',
    'Healthcare', 'Education', 'Travel', 'Subscription', 'Groceries', 'Other'
  ]

  const paymentMethods: PaymentMethod[] = [
    'UPI', 'Cash', 'Credit Card', 'Debit Card', 'Wallet', 'Bank Transfer'
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{t.addExpense}</span>
              <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Manual Entry
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Record an expense or income with smart AI categorization
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          {/* Type Toggle: Expense vs Income */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                type === 'income'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Amount & Currency */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.amount} *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-base font-bold text-emerald-400">
                {currencySymbols[selectedCurrency] || '₹'}
              </span>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl pl-10 pr-20 py-3 text-lg font-bold text-white placeholder-slate-600 outline-none transition"
              />
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                className="absolute right-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-2 py-1.5 border border-slate-700 outline-none"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED</option>
              </select>
            </div>
          </div>

          {/* Merchant / Payee */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {t.merchant} *
              </label>
              {autoSuggested && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-categorized
                </span>
              )}
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Swiggy, Uber, Amazon, BESCOM Electricity"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition"
            />
          </div>

          {/* Duplicate Warning Alert */}
          {duplicateWarning && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <span className="font-bold">Possible duplicate detected!</span>
                <p className="text-[11px] text-amber-300/80 mt-0.5">
                  A transaction for ₹{amount} at "{merchant}" already exists within the last 2 days. You can still save if this was a separate purchase.
                </p>
              </div>
            </div>
          )}

          {/* Category & Need/Want (Only for expenses) */}
          {type === 'expense' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.category}
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as Category)
                    setAutoSuggested(false)
                  }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl px-3 py-2.5 text-xs text-white outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.needWant}
                </label>
                <select
                  value={needWant}
                  onChange={(e) => setNeedWant(e.target.value as NeedWant)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl px-3 py-2.5 text-xs text-white outline-none"
                >
                  <option value="Need">{t.need}</option>
                  <option value="Want">{t.want}</option>
                  <option value="Unclear">{t.unclear}</option>
                </select>
              </div>
            </div>
          )}

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.date}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl px-3 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.paymentMethod}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl px-3 py-2.5 text-xs text-white outline-none"
              >
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.notes} (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Split with Rahul, office dinner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-2xl text-xs transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-2xl text-xs transition shadow-lg shadow-emerald-500/20"
            >
              {duplicateWarning ? 'Save Anyway' : t.confirm}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
