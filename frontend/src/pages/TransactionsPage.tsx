import React, { useState, useMemo } from 'react'
import { 
  Search, Filter, Plus, Camera, Smartphone, FileUp, Download, 
  ArrowUpDown, Sparkles, X, ChevronRight, AlertCircle, Copy, Trash2, Edit2 
} from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { parseNaturalLanguageSearch } from '../../utils/calculations'
import { formatCurrency, formatDate, getCategoryColor, getCategoryEmoji } from '../../utils/formatters'
import { Category, PaymentMethod, NeedWant, TransactionSource, Transaction } from '../../types'

export const TransactionsPage: React.FC = () => {
  const { 
    transactions, setIsAddExpenseOpen, setIsReceiptScannerOpen, 
    setIsUPIScannerOpen, setIsBankImportOpen, setSelectedTransaction,
    duplicateTransaction, deleteTransaction 
  } = useFinance()

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedMethod, setSelectedMethod] = useState<string>('All')
  const [selectedNeedWant, setSelectedNeedWant] = useState<string>('All')
  const [selectedSource, setSelectedSource] = useState<string>('All')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'this_week' | 'this_month' | 'last_month'>('all')
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc')
  const [showFilters, setShowFilters] = useState(false)

  // Parse natural language query
  const parsedNL = useMemo(() => {
    return parseNaturalLanguageSearch(searchQuery)
  }, [searchQuery])

  // Filter & sort logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // 1. Text Search matching merchant or notes
      const matchesText = searchQuery === '' || 
        t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()))

      // 2. NL Search filters
      if (parsedNL.category && t.category !== parsedNL.category) return false
      if (parsedNL.needWant && t.needWant !== parsedNL.needWant) return false
      if (parsedNL.paymentMethod && t.paymentMethod !== parsedNL.paymentMethod) return false
      if (parsedNL.minAmount && t.amount < parsedNL.minAmount) return false
      if (parsedNL.maxAmount && t.amount > parsedNL.maxAmount) return false

      // 3. UI Dropdown filters
      if (selectedCategory !== 'All' && t.category !== selectedCategory) return false
      if (selectedMethod !== 'All' && t.paymentMethod !== selectedMethod) return false
      if (selectedNeedWant !== 'All' && t.needWant !== selectedNeedWant) return false
      if (selectedSource !== 'All' && t.source !== selectedSource) return false

      // 4. Date Filter
      const txDate = new Date(t.date)
      const now = new Date()
      const effectiveDateFilter = parsedNL.dateRange || dateFilter

      if (effectiveDateFilter === 'today') {
        const todayStr = now.toISOString().split('T')[0]
        if (t.date !== todayStr) return false
      } else if (effectiveDateFilter === 'this_week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        if (txDate < oneWeekAgo) return false
      } else if (effectiveDateFilter === 'this_month') {
        if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false
      } else if (effectiveDateFilter === 'last_month') {
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
        const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
        if (txDate.getMonth() !== lastMonth || txDate.getFullYear() !== lastMonthYear) return false
      }

      // If text query wasn't consumed completely by NL filters, check text
      if (!parsedNL.category && !parsedNL.minAmount && !matchesText) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime()
      if (sortBy === 'amount-desc') return b.amount - a.amount
      if (sortBy === 'amount-asc') return a.amount - b.amount
      return 0
    })
  }, [transactions, searchQuery, parsedNL, selectedCategory, selectedMethod, selectedNeedWant, selectedSource, dateFilter, sortBy])

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Merchant', 'Category', 'Amount', 'Currency', 'Type', 'Payment Method', 'Need/Want', 'Source', 'Notes']
    const rows = filteredTransactions.map(t => [
      t.id, t.date, `"${t.merchant}"`, t.category, t.amount, t.currency, t.type, t.paymentMethod, t.needWant, t.source, `"${t.notes || ''}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `spendwise_transactions_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const categories: Category[] = [
    'Food', 'Shopping', 'Transport', 'Bills', 'Entertainment',
    'Healthcare', 'Education', 'Travel', 'Subscription', 'Groceries', 'Salary', 'Other'
  ]

  const totalFilteredExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header and Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Transactions & Spends
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search with natural language, filter categories, scan receipts & UPI
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2.5 rounded-xl transition text-xs shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Expense
          </button>
          <button
            onClick={() => setIsReceiptScannerOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold px-3 py-2.5 rounded-xl transition text-xs border border-slate-800"
            title="Scan Receipt"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            Receipt
          </button>
          <button
            onClick={() => setIsUPIScannerOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold px-3 py-2.5 rounded-xl transition text-xs border border-slate-800"
            title="Analyze UPI Screenshot"
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            UPI Scan
          </button>
          <button
            onClick={() => setIsBankImportOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold px-3 py-2.5 rounded-xl transition text-xs border border-slate-800"
            title="Import Bank Statement"
          >
            <FileUp className="w-4 h-4 text-indigo-400" />
            Import
          </button>
          <button
            onClick={handleExportCSV}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition border border-slate-800"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Smart Natural Language Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search naturally: 'How much did I spend on food this month?' or 'expenses above 1000'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl pl-11 pr-24 py-3 text-sm text-white placeholder-slate-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-12 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 p-1.5 rounded-xl text-xs flex items-center gap-1 border transition ${
              showFilters 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Natural Language Interpretation Badge */}
        {searchQuery && parsedNL.summaryText !== 'Showing all matching transactions' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span className="font-semibold">{parsedNL.summaryText}</span>
          </div>
        )}

        {/* Quick Example Searches */}
        {!searchQuery && (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-slate-500">Try asking:</span>
            <button
              onClick={() => setSearchQuery('food this month')}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded-lg text-slate-300"
            >
              "food this month"
            </button>
            <button
              onClick={() => setSearchQuery('above 1000')}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded-lg text-slate-300"
            >
              "above 1000"
            </button>
            <button
              onClick={() => setSearchQuery('upi payments')}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded-lg text-slate-300"
            >
              "upi payments"
            </button>
            <button
              onClick={() => setSearchQuery('wants')}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded-lg text-slate-300"
            >
              "wants"
            </button>
          </div>
        )}

        {/* Collapsible Filter Bar */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3 border-t border-slate-800 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 outline-none"
              >
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Time Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Payment Method</label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 outline-none"
              >
                <option value="All">All Methods</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Need vs Want</label>
              <select
                value={selectedNeedWant}
                onChange={(e) => setSelectedNeedWant(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 outline-none"
              >
                <option value="All">All Classifications</option>
                <option value="Need">Need (Essential)</option>
                <option value="Want">Want (Luxury)</option>
                <option value="Unclear">Unclear</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 outline-none"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        )}

      </div>

      {/* Summary Row */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <span className="font-bold text-white">{filteredTransactions.length}</span> transactions
        </div>
        <div>
          Filtered Total: <span className="font-bold text-rose-400">{formatCurrency(totalFilteredExpense)}</span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-white">No transactions found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any expenses matching your search or filters. Try adjusting your query or record a new expense.
            </p>
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20"
            >
              Add Your First Expense
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const color = getCategoryColor(tx.category)
            const emoji = getCategoryEmoji(tx.category)
            return (
              <div
                key={tx.id}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 transition"
              >
                {/* Left info & Click target */}
                <div 
                  onClick={() => setSelectedTransaction(tx)}
                  className="flex items-center gap-3.5 flex-1 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${color.bg} border ${color.border} shrink-0`}>
                    {emoji}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                      <span>{tx.merchant}</span>
                      {tx.isUnusual && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 font-semibold px-2 py-0.2 rounded-full border border-amber-500/20">
                          Unusual
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span className={color.text}>{tx.category}</span>
                      <span>•</span>
                      <span>{tx.paymentMethod}</span>
                      {tx.referenceNumber && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[10px] text-slate-500">{tx.referenceNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Amount & Quick Row Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-md font-medium">
                        {tx.needWant}
                      </span>
                      <span className="text-[9px] text-slate-500 hidden sm:inline">
                        {tx.source}
                      </span>
                    </div>
                  </div>

                  {/* Actions Dropdown / Buttons */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => duplicateTransaction(tx.id)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
