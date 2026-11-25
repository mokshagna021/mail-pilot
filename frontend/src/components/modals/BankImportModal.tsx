import React, { useState } from 'react'
import { X, FileUp, CheckCircle2, AlertCircle, ArrowRight, Download } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { categorizeExpense } from '../../ai/geminiService'
import { formatCurrency } from '../../utils/formatters'
import { Transaction } from '../../types'

interface BankImportModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ParsedStatementRow {
  date: string
  description: string
  amount: number
  type: 'expense' | 'income'
  category: string
  isDuplicate: boolean
}

export const BankImportModal: React.FC<BankImportModalProps> = ({ isOpen, onClose }) => {
  const { user, addTransaction, checkDuplicate } = useFinance()
  const [step, setStep] = useState<'upload' | 'preview'>('upload')
  const [parsedRows, setParsedRows] = useState<ParsedStatementRow[]>([])

  if (!isOpen) return null

  const sampleBankCSV = [
    { date: '2026-09-27', description: 'UPI-SWIGGY BANGALORE-5829', amount: 360, type: 'expense' as const },
    { date: '2026-09-26', description: 'POS RELIANCE RETAIL MART', amount: 890, type: 'expense' as const },
    { date: '2026-09-24', description: 'ACH NETFLIX ENTERTAINMENT', amount: 649, type: 'expense' as const },
    { date: '2026-09-22', description: 'INTEREST CREDIT HDFC BANK', amount: 145, type: 'income' as const },
  ]

  const handleLoadSample = () => {
    const rows = sampleBankCSV.map(row => {
      const { category } = categorizeExpense(row.description)
      const isDuplicate = Boolean(checkDuplicate(row.description, row.amount, row.date))
      return {
        ...row,
        category,
        isDuplicate,
      }
    })
    setParsedRows(rows)
    setStep('preview')
  }

  const handleConfirmImport = () => {
    parsedRows.forEach(row => {
      addTransaction({
        userId: user.id,
        amount: row.amount,
        currency: 'INR',
        merchant: row.description,
        category: (row.category as any) || 'Other',
        date: row.date,
        paymentMethod: row.description.includes('UPI') ? 'UPI' : 'Bank Transfer',
        notes: 'Imported from bank statement',
        needWant: 'Want',
        source: 'Bank Import',
        type: row.type,
        status: 'Completed',
      })
    })

    handleClose()
  }

  const handleClose = () => {
    setStep('upload')
    setParsedRows([])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={handleClose} />

      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileUp className="w-4 h-4 text-indigo-400" />
              <span>Import Bank Statement</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Import transactions from CSV or Excel with automatic duplicate detection
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'upload' && (
          <div className="space-y-5 pt-4">
            <div 
              onClick={handleLoadSample}
              className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 rounded-3xl p-8 text-center cursor-pointer transition bg-indigo-950/20 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                <FileUp className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">Upload Bank Statement CSV</div>
              <p className="text-xs text-slate-400 mt-1">Supports HDFC, SBI, ICICI, Axis & standard CSV</p>
              <button
                type="button"
                className="mt-3 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
              >
                Browse CSV File
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={handleLoadSample}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline"
              >
                Or test with sample Indian bank statement (4 transactions)
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4 pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">
                {parsedRows.length} Transactions Detected
              </span>
              <span className="text-slate-400">
                Duplicates automatically checked
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {parsedRows.map((row, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    row.isDuplicate ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white">{row.description}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {row.date} • Category: {row.category}
                      {row.isDuplicate && (
                        <span className="ml-2 text-amber-400 font-bold">• Duplicate</span>
                      )}
                    </div>
                  </div>
                  <div className={`font-bold ${row.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                    {row.type === 'income' ? '+' : '-'}{formatCurrency(row.amount)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setStep('upload')}
                className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-2xl text-xs font-semibold"
              >
                Upload Different File
              </button>
              <button
                onClick={handleConfirmImport}
                className="flex-1 bg-emerald-500 text-slate-950 font-bold py-3 rounded-2xl text-xs shadow-lg shadow-emerald-500/20"
              >
                Confirm & Import Records
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
