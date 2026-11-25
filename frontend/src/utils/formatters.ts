import { CurrencyCode } from '../types'

export const currencySymbols: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AED: 'AED ',
}

export const formatCurrency = (
  amount: number,
  currency: CurrencyCode = 'INR',
  options?: { hideSymbol?: boolean; compact?: boolean }
): string => {
  const symbol = options?.hideSymbol ? '' : currencySymbols[currency] || '₹'
  
  if (options?.compact && Math.abs(amount) >= 100000) {
    // Indian Lakhs / Crores or international format
    if (currency === 'INR') {
      if (Math.abs(amount) >= 10000000) {
        return `${symbol}${(amount / 10000000).toFixed(2)} Cr`
      }
      return `${symbol}${(amount / 100000).toFixed(2)} L`
    }
    return `${symbol}${(amount / 1000).toFixed(1)}k`
  }

  // Format with standard locale
  const formattedNumber = Math.abs(amount).toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  })

  const sign = amount < 0 ? '-' : ''
  return `${sign}${symbol}${formattedNumber}`
}

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export const formatTimeAgo = (dateStr: string): string => {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60))
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateStr)
  } catch {
    return dateStr
  }
}

export const getCategoryColor = (category: string): { bg: string; text: string; border: string; hex: string } => {
  switch (category) {
    case 'Food':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', hex: '#f59e0b' }
    case 'Shopping':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', hex: '#a855f7' }
    case 'Transport':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', hex: '#3b82f6' }
    case 'Bills':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', hex: '#f43f5e' }
    case 'Entertainment':
      return { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', hex: '#ec4899' }
    case 'Healthcare':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', hex: '#10b981' }
    case 'Education':
      return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', hex: '#6366f1' }
    case 'Travel':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', hex: '#06b6d4' }
    case 'Subscription':
      return { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', hex: '#8b5cf6' }
    case 'Groceries':
      return { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', hex: '#14b8a6' }
    case 'Salary':
      return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', hex: '#22c55e' }
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', hex: '#64748b' }
  }
}

export const getCategoryEmoji = (category: string): string => {
  switch (category) {
    case 'Food': return '🍔'
    case 'Shopping': return '🛍️'
    case 'Transport': return '🚖'
    case 'Bills': return '⚡'
    case 'Entertainment': return '🎬'
    case 'Healthcare': return '💊'
    case 'Education': return '📚'
    case 'Travel': return '✈️'
    case 'Subscription': return '🔁'
    case 'Groceries': return '🥦'
    case 'Salary': return '💰'
    default: return '🏷️'
  }
}
