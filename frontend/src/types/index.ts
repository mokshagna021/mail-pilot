// Core TypeScript Interfaces and Types for SPENDWISE AI

export type Language = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'mr' | 'bn' | 'gu' | 'ur'

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AED'

export type AppView = 
  | 'landing' 
  | 'login' 
  | 'signup' 
  | 'dashboard' 
  | 'transactions' 
  | 'analytics' 
  | 'budgets' 
  | 'ai-coach' 
  | 'goals' 
  | 'subscriptions' 
  | 'bills' 
  | 'challenges' 
  | 'shared-expenses' 
  | 'family' 
  | 'calendar' 
  | 'reports' 
  | 'rewards' 
  | 'settings'

export type TransactionType = 'expense' | 'income'

export type Category = 
  | 'Food' 
  | 'Shopping' 
  | 'Transport' 
  | 'Bills' 
  | 'Entertainment' 
  | 'Healthcare' 
  | 'Education' 
  | 'Travel' 
  | 'Subscription' 
  | 'Groceries' 
  | 'Investment' 
  | 'Salary' 
  | 'Other'

export type PaymentMethod = 
  | 'UPI' 
  | 'Cash' 
  | 'Credit Card' 
  | 'Debit Card' 
  | 'Wallet' 
  | 'Bank Transfer'

export type TransactionSource = 
  | 'Manual' 
  | 'Receipt' 
  | 'UPI Screenshot' 
  | 'Voice' 
  | 'Bank Import'

export type NeedWant = 'Need' | 'Want' | 'Unclear'

export interface Transaction {
  id: string
  userId: string
  amount: number
  currency: CurrencyCode
  merchant: string
  category: Category
  date: string // ISO YYYY-MM-DD
  paymentMethod: PaymentMethod
  notes?: string
  needWant: NeedWant
  source: TransactionSource
  type: TransactionType
  status: 'Completed' | 'Pending' | 'Flagged'
  referenceNumber?: string
  receiptItems?: ReceiptItem[]
  isUnusual?: boolean
  unusualReason?: string
  createdAt: string
  updatedAt: string
}

export interface ReceiptItem {
  name: string
  price: number
  quantity?: number
}

export interface Budget {
  id: string
  category: Category | 'Total'
  monthlyLimit: number
  spent: number
  period: string // YYYY-MM
  alertThreshold: number // percentage e.g. 80
}

export interface BudgetRecommendation {
  category: Category
  suggestedLimit: number
  previousAverage: number
  reason: string
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string // YYYY-MM-DD
  category?: string
  icon?: string
  isPaused?: boolean
  createdAt: string
}

export interface Subscription {
  id: string
  name: string
  amount: number
  currency: CurrencyCode
  frequency: 'monthly' | 'yearly' | 'weekly'
  category: Category
  nextRenewalDate: string
  billingCycle: string
  status: 'active' | 'paused' | 'canceled'
  icon?: string
  merchantPattern: string
}

export interface Bill {
  id: string
  name: string
  amount: number
  currency: CurrencyCode
  dueDate: string
  category: Category
  isPaid: boolean
  isRecurring: boolean
  reminderDaysBefore: number
  biller: string
}

export interface SavingsChallenge {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  targetDays: number
  completedDays: number
  daysLeft: number
  status: 'active' | 'completed' | 'paused' | 'dismissed'
  category?: Category
  badge: string
}

export interface SharedGroup {
  id: string
  name: string
  description: string
  members: GroupMember[]
  totalExpenses: number
  createdAt: string
}

export interface GroupMember {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Member' | 'Viewer'
  avatar?: string
}

export interface SharedExpense {
  id: string
  groupId: string
  title: string
  amount: number
  currency: CurrencyCode
  paidById: string
  paidByName: string
  splitWithIds: string[]
  date: string
  category: Category
  settled: boolean
}

export interface Reward {
  id: string
  source: 'Google Pay' | 'Cred' | 'Credit Card' | 'PhonePe' | 'Coupon'
  title: string
  amount: number
  currency: CurrencyCode
  date: string
  type: 'Cashback' | 'Discount' | 'Points'
}

export interface SmartNotification {
  id: string
  title: string
  message: string
  type: 'unusual_spending' | 'budget_warning' | 'bill_reminder' | 'subscription_alert' | 'challenge_progress' | 'info'
  date: string
  read: boolean
  actionUrl?: string
}

export interface UserProfile {
  id: string
  firstName: string
  lastName?: string
  email: string
  preferredLanguage: Language
  currency: CurrencyCode
  monthlyIncome: number
  monthlyBudget: number
  theme: 'light' | 'dark' | 'system'
  locationEnabled: boolean
  notificationSettings: {
    unusualSpending: boolean
    budgetAlerts: boolean
    billReminders: boolean
    subscriptionRenewals: boolean
    savingsChallenges: boolean
  }
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  content: string
  timestamp: string
  language?: Language
  isEducational?: boolean
  suggestions?: string[]
}

export interface FinancialHealthScore {
  overallScore: number // 0 - 100
  rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention'
  budgetUsageScore: number
  savingsProgressScore: number
  recurringExpenseScore: number
  goalPacingScore: number
  summary: string
  improvements: string[]
}

export interface ParsedSearchQuery {
  rawQuery: string
  category?: Category
  merchant?: string
  minAmount?: number
  maxAmount?: number
  needWant?: NeedWant
  paymentMethod?: PaymentMethod
  dateRange?: 'today' | 'this_week' | 'this_month' | 'last_month' | 'all'
  summaryText: string
}
