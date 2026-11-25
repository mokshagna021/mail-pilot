import { Transaction, Budget, Bill, SavingsGoal, FinancialHealthScore, ParsedSearchQuery, Category, PaymentMethod, NeedWant } from '../types'

/**
 * Calculates dynamic Daily Spending Limit:
 * Remaining budget minus upcoming unpaid bills, divided by days left in current month.
 */
export const calculateDailySpendingLimit = (
  monthlyBudget: number,
  currentSpent: number,
  upcomingBills: Bill[],
  currentDate: Date = new Date()
): { limit: number; daysLeft: number; explanation: string } => {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const currentDay = currentDate.getDate()
  const daysLeft = Math.max(1, totalDays - currentDay)

  const unpaidBillsTotal = upcomingBills
    .filter(b => !b.isPaid)
    .reduce((sum, b) => sum + b.amount, 0)

  const remainingBudget = Math.max(0, monthlyBudget - currentSpent - unpaidBillsTotal)
  const limit = Math.floor(remainingBudget / daysLeft)

  return {
    limit,
    daysLeft,
    explanation: `Calculated from ₹${remainingBudget.toLocaleString('en-IN')} uncommitted budget over ${daysLeft} days remaining in this month.`
  }
}

/**
 * Transparent Financial Health Score Calculation
 */
export const calculateFinancialHealthScore = (
  monthlyIncome: number,
  currentSpent: number,
  monthlyBudget: number,
  subscriptionsTotal: number,
  goals: SavingsGoal[]
): FinancialHealthScore => {
  // 1. Budget Usage Score (0 - 30 pts)
  const budgetRatio = monthlyBudget > 0 ? (currentSpent / monthlyBudget) : 0.8
  let budgetScore = 30
  if (budgetRatio > 1) {
    budgetScore = Math.max(5, 30 - Math.round((budgetRatio - 1) * 50))
  } else if (budgetRatio > 0.85) {
    budgetScore = 20
  } else if (budgetRatio > 0.6) {
    budgetScore = 28
  }

  // 2. Savings Rate Score (0 - 25 pts)
  const savedAmount = Math.max(0, monthlyIncome - currentSpent)
  const savingsRate = monthlyIncome > 0 ? (savedAmount / monthlyIncome) : 0.2
  let savingsScore = 20
  if (savingsRate >= 0.3) savingsScore = 25
  else if (savingsRate >= 0.2) savingsScore = 22
  else if (savingsRate >= 0.1) savingsScore = 15
  else savingsScore = 8

  // 3. Recurring Expense Ratio (0 - 20 pts)
  const recurringRatio = monthlyIncome > 0 ? (subscriptionsTotal / monthlyIncome) : 0.05
  let recurringScore = 20
  if (recurringRatio <= 0.08) recurringScore = 20
  else if (recurringRatio <= 0.15) recurringScore = 16
  else recurringScore = 10

  // 4. Savings Goal Pacing (0 - 25 pts)
  let goalScore = 20
  if (goals.length > 0) {
    const avgProgress = goals.reduce((sum, g) => sum + (g.currentAmount / Math.max(1, g.targetAmount)), 0) / goals.length
    goalScore = Math.min(25, Math.round(avgProgress * 25) + 5)
  }

  const overallScore = Math.min(100, Math.max(10, budgetScore + savingsScore + recurringScore + goalScore))

  let rating: FinancialHealthScore['rating'] = 'Good'
  if (overallScore >= 85) rating = 'Excellent'
  else if (overallScore >= 70) rating = 'Good'
  else if (overallScore >= 50) rating = 'Fair'
  else rating = 'Needs Attention'

  const improvements: string[] = []
  if (budgetRatio > 0.8) {
    improvements.push('Pacing slightly high: 80%+ of budget consumed. Consider curbing non-essential wants.')
  }
  if (savingsRate < 0.2) {
    improvements.push('Aim to save at least 20% of your monthly income.')
  }
  if (recurringRatio > 0.1) {
    improvements.push('Review active subscriptions to eliminate unused streaming or memberships.')
  }
  if (improvements.length === 0) {
    improvements.push('You are managing your finances exceptionally well! Keep your momentum going.')
  }

  return {
    overallScore,
    rating,
    budgetUsageScore: budgetScore,
    savingsProgressScore: savingsScore,
    recurringExpenseScore: recurringScore,
    goalPacingScore: goalScore,
    summary: `Your financial profile shows an ${rating.toLowerCase()} balance. Budget discipline is at ${Math.round((budgetScore / 30) * 100)}% efficiency.`,
    improvements,
  }
}

/**
 * Future Expense Prediction Logic
 */
export const predictMonthEndSpending = (
  transactions: Transaction[],
  upcomingBills: Bill[],
  currentDate: Date = new Date()
): {
  currentSpent: number
  estimatedTotal: number
  dailyAverage: number
  daysRemaining: number
  confidence: string
  note: string
} => {
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const currentDay = currentDate.getDate()
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate()
  const daysRemaining = Math.max(0, totalDays - currentDay)

  const monthExpenses = transactions.filter(t => {
    if (t.type !== 'expense') return false
    const d = new Date(t.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const currentSpent = monthExpenses.reduce((sum, t) => sum + t.amount, 0)
  const daysPassed = Math.max(1, currentDay)
  const dailyAverage = Math.round(currentSpent / daysPassed)

  const unpaidUpcomingBills = upcomingBills
    .filter(b => !b.isPaid)
    .reduce((sum, b) => sum + b.amount, 0)

  const estimatedTotal = currentSpent + (dailyAverage * daysRemaining) + unpaidUpcomingBills

  return {
    currentSpent,
    estimatedTotal,
    dailyAverage,
    daysRemaining,
    confidence: daysPassed >= 7 ? 'High' : 'Moderate',
    note: 'Estimate based on your previous spending pattern and upcoming planned bills.'
  }
}

/**
 * Unusual Spending Detector Logic
 */
export const detectUnusualTransactions = (
  transactions: Transaction[]
): Transaction[] => {
  // Group expenses by category
  const categoryAmounts: Record<string, number[]> = {}
  transactions.forEach(t => {
    if (t.type === 'expense') {
      if (!categoryAmounts[t.category]) categoryAmounts[t.category] = []
      categoryAmounts[t.category].push(t.amount)
    }
  })

  // Calculate baseline averages
  const categoryAverages: Record<string, number> = {}
  Object.keys(categoryAmounts).forEach(cat => {
    const list = categoryAmounts[cat]
    const avg = list.reduce((a, b) => a + b, 0) / list.length
    categoryAverages[cat] = avg
  })

  return transactions.map(t => {
    if (t.type !== 'expense') return t
    const avg = categoryAverages[t.category] || 500
    // If transaction is 2x average and over ₹1,200
    if (t.amount > avg * 1.8 && t.amount >= 1200) {
      return {
        ...t,
        isUnusual: true,
        unusualReason: `Unusual transaction: Amount (₹${t.amount.toLocaleString('en-IN')}) is ${(t.amount / avg).toFixed(1)}x higher than your typical ${t.category} spend.`
      }
    }
    return t
  })
}

/**
 * Natural Language Search Query Parser
 * Interprets queries like "How much did I spend on food this month?", "expenses above 1000", "upi payments"
 */
export const parseNaturalLanguageSearch = (query: string): ParsedSearchQuery => {
  const clean = query.trim().toLowerCase()
  const result: ParsedSearchQuery = {
    rawQuery: query,
    summaryText: 'Showing all matching transactions',
  }

  if (!clean) return result

  // Category matching
  const categories: Category[] = [
    'Food', 'Shopping', 'Transport', 'Bills', 'Entertainment',
    'Healthcare', 'Education', 'Travel', 'Subscription', 'Groceries'
  ]
  for (const cat of categories) {
    if (clean.includes(cat.toLowerCase()) || 
        (cat === 'Food' && (clean.includes('eating') || clean.includes('restaurant') || clean.includes('swiggy') || clean.includes('zomato') || clean.includes('dinner') || clean.includes('lunch') || clean.includes('snack') || clean.includes('ఆహారం') || clean.includes('खाना'))) ||
        (cat === 'Transport' && (clean.includes('uber') || clean.includes('ola') || clean.includes('cab') || clean.includes('metro') || clean.includes('petrol') || clean.includes('fuel'))) ||
        (cat === 'Shopping' && (clean.includes('amazon') || clean.includes('flipkart') || clean.includes('clothes') || clean.includes('electronics'))) ||
        (cat === 'Bills' && (clean.includes('electricity') || clean.includes('recharge') || clean.includes('wifi') || clean.includes('rent') || clean.includes('water')))
    ) {
      result.category = cat
      break
    }
  }

  // Need vs Want
  if (clean.includes('need') || clean.includes('essential') || clean.includes('అవసరం')) {
    result.needWant = 'Need'
  } else if (clean.includes('want') || clean.includes('luxury') || clean.includes('discretionary') || clean.includes('కోరిక')) {
    result.needWant = 'Want'
  }

  // Payment Method
  const methods: PaymentMethod[] = ['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Wallet', 'Bank Transfer']
  for (const method of methods) {
    if (clean.includes(method.toLowerCase()) || (method === 'Credit Card' && clean.includes('card'))) {
      result.paymentMethod = method
      break
    }
  }

  // Date Range
  if (clean.includes('today') || clean.includes('ఈ రోజు') || clean.includes('आज')) {
    result.dateRange = 'today'
  } else if (clean.includes('this week') || clean.includes('ఈ వారం') || clean.includes('इस हफ्ते')) {
    result.dateRange = 'this_week'
  } else if (clean.includes('last month') || clean.includes('పోయిన నెల') || clean.includes('पिछले महीने')) {
    result.dateRange = 'last_month'
  } else if (clean.includes('this month') || clean.includes('ఈ నెల') || clean.includes('इस महीने')) {
    result.dateRange = 'this_month'
  }

  // Amount extraction (e.g. "above 1000", "over 500", "> 2000", "under 500", "below 1000")
  const aboveMatch = clean.match(/(?:above|over|more than|>|greater than|ఎక్కువ)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i)
  if (aboveMatch) {
    result.minAmount = parseInt(aboveMatch[1], 10)
  }

  const belowMatch = clean.match(/(?:under|below|less than|<|తక్కువ)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i)
  if (belowMatch) {
    result.maxAmount = parseInt(belowMatch[1], 10)
  }

  // Build summary description of interpreted query
  const parts: string[] = []
  if (result.category) parts.push(`Category: ${result.category}`)
  if (result.needWant) parts.push(`Type: ${result.needWant}`)
  if (result.paymentMethod) parts.push(`Paid via: ${result.paymentMethod}`)
  if (result.dateRange) parts.push(`Time: ${result.dateRange.replace('_', ' ')}`)
  if (result.minAmount) parts.push(`Amount ≥ ₹${result.minAmount}`)
  if (result.maxAmount) parts.push(`Amount ≤ ₹${result.maxAmount}`)

  if (parts.length > 0) {
    result.summaryText = `Interpreted Query: ${parts.join(' • ')}`
  }

  return result
}
