import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  UserProfile, Transaction, Budget, BudgetRecommendation, SavingsGoal, 
  Subscription, Bill, SavingsChallenge, SharedGroup, SharedExpense, 
  Reward, SmartNotification, Language, CurrencyCode, AppView, Category, NeedWant 
} from '../types'
import { 
  initialUserProfile, initialTransactions, initialBudgets, 
  initialBudgetRecommendations, initialSavingsGoals, initialSubscriptions, 
  initialBills, initialChallenges, initialSharedGroup, initialSharedExpenses, 
  initialRewards, initialNotifications 
} from '../utils/mockData'
import { detectUnusualTransactions } from '../utils/calculations'

export interface ToastMessage {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

interface FinanceContextType {
  // Navigation & User
  currentView: AppView
  setCurrentView: (view: AppView) => void
  user: UserProfile
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>
  language: Language
  setLanguage: (lang: Language) => void
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Entities
  transactions: Transaction[]
  budgets: Budget[]
  budgetRecommendations: BudgetRecommendation[]
  goals: SavingsGoal[]
  subscriptions: Subscription[]
  bills: Bill[]
  challenges: SavingsChallenge[]
  sharedGroup: SharedGroup
  sharedExpenses: SharedExpense[]
  rewards: Reward[]
  notifications: SmartNotification[]

  // Modals & Active State
  isAddExpenseOpen: boolean
  setIsAddExpenseOpen: (open: boolean) => void
  isReceiptScannerOpen: boolean
  setIsReceiptScannerOpen: (open: boolean) => void
  isUPIScannerOpen: boolean
  setIsUPIScannerOpen: (open: boolean) => void
  isBankImportOpen: boolean
  setIsBankImportOpen: (open: boolean) => void
  isHealthModalOpen: boolean
  setIsHealthModalOpen: (open: boolean) => void
  selectedTransaction: Transaction | null
  setSelectedTransaction: (tx: Transaction | null) => void

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; isDuplicate?: boolean }
  updateTransaction: (tx: Transaction) => void
  deleteTransaction: (id: string) => void
  duplicateTransaction: (id: string) => void
  dismissUnusualAlert: (id: string) => void
  
  // Budget & Goals
  updateBudget: (budget: Budget) => void
  acceptBudgetRecommendation: (rec: BudgetRecommendation) => void
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void
  updateGoal: (goal: SavingsGoal) => void
  depositToGoal: (id: string, amount: number) => void
  deleteGoal: (id: string) => void

  // Subscriptions & Bills
  toggleSubscriptionStatus: (id: string) => void
  addSubscription: (sub: Omit<Subscription, 'id'>) => void
  deleteSubscription: (id: string) => void
  markBillPaid: (id: string) => void
  addBill: (bill: Omit<Bill, 'id'>) => void
  deleteBill: (id: string) => void

  // Challenges & Shared
  updateChallengeProgress: (id: string, progressDelta: number) => void
  addSharedExpense: (exp: Omit<SharedExpense, 'id'>) => void
  settleSharedExpense: (id: string) => void

  // Notifications & Data Reset
  markNotificationRead: (id: string) => void
  clearAllNotifications: () => void
  resetToDemoData: () => void
  clearAllData: () => void

  // Toasts
  toasts: ToastMessage[]
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void
  dismissToast: (id: string) => void

  // Duplicate Check
  checkDuplicate: (merchant: string, amount: number, date: string) => Transaction | undefined
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

const STORAGE_KEY_PREFIX = 'spendwise_v1_'

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<AppView>(() => {
    return (localStorage.getItem(`${STORAGE_KEY_PREFIX}view`) as AppView) || 'landing'
  })

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`)
    return saved ? JSON.parse(saved) : initialUserProfile
  })

  // Language & Currency
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(`${STORAGE_KEY_PREFIX}lang`) as Language) || user.preferredLanguage || 'en'
  })
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem(`${STORAGE_KEY_PREFIX}curr`) as CurrencyCode) || user.currency || 'INR'
  })
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`) as 'light' | 'dark' | 'system') || user.theme || 'dark'
  })

  // Entities with local storage fallback
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}transactions`)
    return saved ? JSON.parse(saved) : detectUnusualTransactions(initialTransactions)
  })

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}budgets`)
    return saved ? JSON.parse(saved) : initialBudgets
  })

  const [budgetRecommendations, setBudgetRecommendations] = useState<BudgetRecommendation[]>(initialBudgetRecommendations)

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}goals`)
    return saved ? JSON.parse(saved) : initialSavingsGoals
  })

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}subscriptions`)
    return saved ? JSON.parse(saved) : initialSubscriptions
  })

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}bills`)
    return saved ? JSON.parse(saved) : initialBills
  })

  const [challenges, setChallenges] = useState<SavingsChallenge[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}challenges`)
    return saved ? JSON.parse(saved) : initialChallenges
  })

  const [sharedGroup, setSharedGroup] = useState<SharedGroup>(initialSharedGroup)
  const [sharedExpenses, setSharedExpenses] = useState<SharedExpense[]>(initialSharedExpenses)
  const [rewards, setRewards] = useState<Reward[]>(initialRewards)
  const [notifications, setNotifications] = useState<SmartNotification[]>(initialNotifications)

  // Modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState(false)
  const [isUPIScannerOpen, setIsUPIScannerOpen] = useState(false)
  const [isBankImportOpen, setIsBankImportOpen] = useState(false)
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    setToasts(prev => [...prev, { id, title, message, type }])
    setTimeout(() => {
      dismissToast(id)
    }, 4500)
  }

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Theme synchronization with DOM
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // System
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }
  }, [theme])

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}view`, currentView)
  }, [currentView])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}lang`, language)
  }, [language])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}curr`, currency)
  }, [currency])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}transactions`, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}budgets`, JSON.stringify(budgets))
  }, [budgets])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}goals`, JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}subscriptions`, JSON.stringify(subscriptions))
  }, [subscriptions])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}bills`, JSON.stringify(bills))
  }, [bills])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}challenges`, JSON.stringify(challenges))
  }, [challenges])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    setUser(prev => ({ ...prev, preferredLanguage: lang }))
    showToast('Language Updated', `Switched interface language.`, 'success')
  }

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr)
    setUser(prev => ({ ...prev, currency: curr }))
    showToast('Currency Updated', `Display currency set to ${curr}.`, 'success')
  }

  const setTheme = (th: 'light' | 'dark' | 'system') => {
    setThemeState(th)
    setUser(prev => ({ ...prev, theme: th }))
  }

  // Duplicate Check logic
  const checkDuplicate = (merchant: string, amount: number, date: string): Transaction | undefined => {
    const targetDate = new Date(date).getTime()
    return transactions.find(t => {
      if (t.merchant.toLowerCase().trim() !== merchant.toLowerCase().trim()) return false
      if (Math.abs(t.amount - amount) > 0.01) return false
      // Check within 2 days
      const tDate = new Date(t.date).getTime()
      const diffDays = Math.abs(tDate - targetDate) / (1000 * 60 * 60 * 24)
      return diffDays <= 2
    })
  }

  // Add Transaction
  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const existing = checkDuplicate(tx.merchant, tx.amount, tx.date)
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTransactions(prev => detectUnusualTransactions([newTx, ...prev]))

    // Update budget category spent amount
    if (tx.type === 'expense') {
      setBudgets(prev => prev.map(b => {
        if (b.category === tx.category || b.category === 'Total') {
          return { ...b, spent: b.spent + tx.amount }
        }
        return b
      }))
    }

    showToast(
      'Transaction Added',
      `${tx.merchant} • ${tx.type === 'income' ? '+' : '-'}₹${tx.amount.toLocaleString('en-IN')}`,
      'success'
    )

    return { success: true, isDuplicate: Boolean(existing) }
  }

  const updateTransaction = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : t))
    showToast('Transaction Updated', `Changes to ${updated.merchant} saved.`, 'success')
  }

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id)
    setTransactions(prev => prev.filter(t => t.id !== id))
    if (tx && tx.type === 'expense') {
      // Revert budget allocation
      setBudgets(prev => prev.map(b => {
        if (b.category === tx.category || b.category === 'Total') {
          return { ...b, spent: Math.max(0, b.spent - tx.amount) }
        }
        return b
      }))
    }
    showToast('Transaction Deleted', 'The expense record was removed.', 'info')
  }

  const duplicateTransaction = (id: string) => {
    const orig = transactions.find(t => t.id === id)
    if (!orig) return
    const copy: Transaction = {
      ...orig,
      id: `tx_${Date.now()}_copy`,
      date: new Date().toISOString().split('T')[0],
      notes: `${orig.notes ? orig.notes + ' ' : ''}(Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTransactions(prev => [copy, ...prev])
    showToast('Transaction Duplicated', `Created a copy of ${orig.merchant}.`, 'success')
  }

  const dismissUnusualAlert = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, isUnusual: false } : t))
    showToast('Alert Dismissed', 'Transaction marked as verified/expected.', 'info')
  }

  const updateBudget = (updated: Budget) => {
    setBudgets(prev => prev.map(b => b.id === updated.id ? updated : b))
    showToast('Budget Updated', `${updated.category} limit set to ₹${updated.monthlyLimit.toLocaleString('en-IN')}.`, 'success')
  }

  const acceptBudgetRecommendation = (rec: BudgetRecommendation) => {
    setBudgets(prev => prev.map(b => {
      if (b.category === rec.category) {
        return { ...b, monthlyLimit: rec.suggestedLimit }
      }
      return b
    }))
    setBudgetRecommendations(prev => prev.filter(r => r.category !== rec.category))
    showToast('Recommendation Applied', `${rec.category} budget adjusted to ₹${rec.suggestedLimit.toLocaleString('en-IN')}.`, 'success')
  }

  const addGoal = (g: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...g,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setGoals(prev => [...prev, newGoal])
    showToast('Savings Goal Created', `${g.name} added to your active plans.`, 'success')
  }

  const updateGoal = (updated: SavingsGoal) => {
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g))
    showToast('Goal Updated', `${updated.name} updated.`, 'success')
  }

  const depositToGoal = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextAmount = g.currentAmount + amount
        return { ...g, currentAmount: nextAmount }
      }
      return g
    }))
    showToast('Goal Deposit Added', `Deposited ₹${amount.toLocaleString('en-IN')} towards your goal.`, 'success')
  }

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
    showToast('Goal Removed', 'Savings goal has been deleted.', 'info')
  }

  const toggleSubscriptionStatus = (id: string) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'active' ? 'paused' : 'active'
        return { ...s, status: nextStatus }
      }
      return s
    }))
    showToast('Subscription Updated', 'Status changed.', 'info')
  }

  const addSubscription = (sub: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...sub,
      id: `sub_${Date.now()}`,
    }
    setSubscriptions(prev => [...prev, newSub])
    showToast('Subscription Added', `${sub.name} added to tracker.`, 'success')
  }

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id))
    showToast('Subscription Removed', 'Removed from active monitoring.', 'info')
  }

  const markBillPaid = (id: string) => {
    const bill = bills.find(b => b.id === id)
    if (!bill) return

    setBills(prev => prev.map(b => b.id === id ? { ...b, isPaid: true } : b))
    
    // Automatically record an expense for the paid bill
    addTransaction({
      userId: user.id,
      amount: bill.amount,
      currency: bill.currency,
      merchant: bill.biller || bill.name,
      category: bill.category,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      notes: `Bill payment for ${bill.name}`,
      needWant: 'Need',
      source: 'Manual',
      type: 'expense',
      status: 'Completed',
    })

    showToast('Bill Marked as Paid', `${bill.name} logged in transactions.`, 'success')
  }

  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...bill,
      id: `bill_${Date.now()}`,
    }
    setBills(prev => [...prev, newBill])
    showToast('Bill Created', `${bill.name} scheduled for ${bill.dueDate}.`, 'success')
  }

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id))
    showToast('Bill Removed', 'Bill reminder deleted.', 'info')
  }

  const updateChallengeProgress = (id: string, delta: number) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        const nextAmount = Math.min(c.targetAmount, c.currentAmount + delta)
        const isDone = nextAmount >= c.targetAmount
        return {
          ...c,
          currentAmount: nextAmount,
          completedDays: c.completedDays + 1,
          status: isDone ? 'completed' : c.status
        }
      }
      return c
    }))
    showToast('Challenge Progress', 'Great job sticking to your challenge!', 'success')
  }

  const addSharedExpense = (exp: Omit<SharedExpense, 'id'>) => {
    const newExp: SharedExpense = {
      ...exp,
      id: `se_${Date.now()}`,
    }
    setSharedExpenses(prev => [newExp, ...prev])
    showToast('Shared Expense Logged', `Split ${exp.title} with group.`, 'success')
  }

  const settleSharedExpense = (id: string) => {
    setSharedExpenses(prev => prev.map(e => e.id === id ? { ...e, settled: true } : e))
    showToast('Expense Settled', 'Marked as settled.', 'success')
  }

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const clearAllNotifications = () => {
    setNotifications([])
    showToast('Notifications Cleared', 'All alerts cleared.', 'info')
  }

  const resetToDemoData = () => {
    localStorage.clear()
    setUser(initialUserProfile)
    setTransactions(detectUnusualTransactions(initialTransactions))
    setBudgets(initialBudgets)
    setBudgetRecommendations(initialBudgetRecommendations)
    setGoals(initialSavingsGoals)
    setSubscriptions(initialSubscriptions)
    setBills(initialBills)
    setChallenges(initialChallenges)
    setSharedGroup(initialSharedGroup)
    setSharedExpenses(initialSharedExpenses)
    setRewards(initialRewards)
    setNotifications(initialNotifications)
    setLanguageState('en')
    setCurrencyState('INR')
    setThemeState('dark')
    showToast('Demo Data Restored', 'All sample transactions and budgets restored.', 'info')
  }

  const clearAllData = () => {
    setTransactions([])
    setBudgets([{ id: 'b_total', category: 'Total', monthlyLimit: 20000, spent: 0, period: '2026-09', alertThreshold: 80 }])
    setGoals([])
    setSubscriptions([])
    setBills([])
    setChallenges([])
    showToast('Data Cleared', 'All personal records wiped.', 'warning')
  }

  return (
    <FinanceContext.Provider
      value={{
        currentView,
        setCurrentView,
        user,
        setUser,
        language,
        setLanguage,
        currency,
        setCurrency,
        theme,
        setTheme,
        transactions,
        budgets,
        budgetRecommendations,
        goals,
        subscriptions,
        bills,
        challenges,
        sharedGroup,
        sharedExpenses,
        rewards,
        notifications,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        isReceiptScannerOpen,
        setIsReceiptScannerOpen,
        isUPIScannerOpen,
        setIsUPIScannerOpen,
        isBankImportOpen,
        setIsBankImportOpen,
        isHealthModalOpen,
        setIsHealthModalOpen,
        selectedTransaction,
        setSelectedTransaction,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        duplicateTransaction,
        dismissUnusualAlert,
        updateBudget,
        acceptBudgetRecommendation,
        addGoal,
        updateGoal,
        depositToGoal,
        deleteGoal,
        toggleSubscriptionStatus,
        addSubscription,
        deleteSubscription,
        markBillPaid,
        addBill,
        deleteBill,
        updateChallengeProgress,
        addSharedExpense,
        settleSharedExpense,
        markNotificationRead,
        clearAllNotifications,
        resetToDemoData,
        clearAllData,
        toasts,
        showToast,
        dismissToast,
        checkDuplicate,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
