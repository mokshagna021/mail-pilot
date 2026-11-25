export interface SampleReceipt {
  id: string
  title: string
  merchant: string
  items: { name: string; price: number; quantity?: number }[]
  subtotal: number
  tax: number
  total: number
  category: 'Food' | 'Shopping' | 'Groceries'
  date: string
  previewColor: string
}

export interface SampleUPIScreenshot {
  id: string
  app: 'Google Pay' | 'PhonePe' | 'Paytm'
  merchant: string
  amount: number
  date: string
  status: 'Successful' | 'Completed'
  category: 'Food' | 'Transport' | 'Bills'
  referenceNumber: string
  paymentMethod: 'UPI'
  accentColor: string
}

export const sampleReceipts: SampleReceipt[] = [
  {
    id: 'rec_swiggy',
    title: 'Swiggy Food Receipt',
    merchant: 'Swiggy',
    items: [
      { name: 'Veg Supreme Burger', price: 180, quantity: 1 },
      { name: 'Peri Peri Fries', price: 80, quantity: 1 },
    ],
    subtotal: 260,
    tax: 20,
    total: 280,
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    previewColor: 'from-orange-500/20 to-amber-500/20 border-orange-500/40 text-orange-400',
  },
  {
    id: 'rec_reliance',
    title: 'Reliance Digital Receipt',
    merchant: 'Reliance Digital',
    items: [
      { name: 'USB-C Multiport Adapter', price: 1250, quantity: 1 },
      { name: 'Braided HDMI 2.1 Cable', price: 450, quantity: 1 },
    ],
    subtotal: 1700,
    tax: 153,
    total: 1853,
    category: 'Shopping',
    date: new Date().toISOString().split('T')[0],
    previewColor: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-400',
  },
  {
    id: 'rec_dmart',
    title: 'D-Mart Supermarket Receipt',
    merchant: 'D-Mart Supermarket',
    items: [
      { name: 'Whole Wheat Atta 5kg', price: 240, quantity: 1 },
      { name: 'Basmati Rice 5kg', price: 350, quantity: 1 },
      { name: 'Cold Pressed Groundnut Oil', price: 210, quantity: 1 },
    ],
    subtotal: 800,
    tax: 0,
    total: 800,
    category: 'Groceries',
    date: new Date().toISOString().split('T')[0],
    previewColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400',
  },
]

export const sampleUPIScreenshots: SampleUPIScreenshot[] = [
  {
    id: 'upi_gpay_swiggy',
    app: 'Google Pay',
    merchant: 'Swiggy Delivery',
    amount: 450,
    date: new Date().toISOString().split('T')[0],
    status: 'Successful',
    category: 'Food',
    referenceNumber: 'UPI-GPAY-429381029384',
    paymentMethod: 'UPI',
    accentColor: 'from-blue-600/30 to-indigo-600/30 border-blue-500/50 text-blue-400',
  },
  {
    id: 'upi_phonepe_uber',
    app: 'PhonePe',
    merchant: 'Uber Rides India',
    amount: 220,
    date: new Date().toISOString().split('T')[0],
    status: 'Successful',
    category: 'Transport',
    referenceNumber: 'UPI-PHONEPE-981273918234',
    paymentMethod: 'UPI',
    accentColor: 'from-purple-600/30 to-fuchsia-600/30 border-purple-500/50 text-purple-400',
  },
  {
    id: 'upi_paytm_bescom',
    app: 'Paytm',
    merchant: 'BESCOM Electricity Bill',
    amount: 1800,
    date: new Date().toISOString().split('T')[0],
    status: 'Successful',
    category: 'Bills',
    referenceNumber: 'UPI-PAYTM-102938475612',
    paymentMethod: 'UPI',
    accentColor: 'from-cyan-600/30 to-blue-600/30 border-cyan-500/50 text-cyan-400',
  },
]
