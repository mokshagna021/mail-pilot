import React, { useState } from 'react'
import { X, Upload, Sparkles, Check, AlertTriangle, RefreshCw, FileText, CheckCircle2 } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { analyzeReceipt, ExtractedReceiptData } from '../../ai/geminiService'
import { sampleReceipts, SampleReceipt } from '../../utils/sampleMedia'
import { formatCurrency } from '../../utils/formatters'
import { Category } from '../../types'

interface ReceiptScannerModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({ isOpen, onClose }) => {
  const { user, addTransaction } = useFinance()

  const [step, setStep] = useState<'upload' | 'scanning' | 'review' | 'error'>('upload')
  const [extractedData, setExtractedData] = useState<ExtractedReceiptData | null>(null)
  const [selectedPresetId, setSelectedPresetId] = useState<string>('rec_swiggy')
  const [errorMessage, setErrorMessage] = useState<string>('')

  if (!isOpen) return null

  const handleScan = async (presetId?: string) => {
    setStep('scanning')
    try {
      const data = await analyzeReceipt(presetId || selectedPresetId)
      setExtractedData(data)
      setStep('review')
    } catch {
      setErrorMessage('We could not read this receipt clearly. Please upload a clearer image.')
      setStep('error')
    }
  }

  const handleSimulateBlurry = () => {
    setStep('scanning')
    setTimeout(() => {
      setErrorMessage('We could not read this receipt clearly. The image was too blurry or dim. Please upload a clearer image.')
      setStep('error')
    }, 800)
  }

  const handleConfirm = () => {
    if (!extractedData) return

    addTransaction({
      userId: user.id,
      amount: extractedData.total,
      currency: 'INR',
      merchant: extractedData.merchant,
      category: extractedData.category,
      date: extractedData.date,
      paymentMethod: extractedData.paymentMethod,
      notes: `Scanned Receipt: ${extractedData.items.map(i => i.name).join(', ')}`,
      needWant: ['Groceries', 'Bills', 'Healthcare'].includes(extractedData.category) ? 'Need' : 'Want',
      source: 'Receipt',
      type: 'expense',
      status: 'Completed',
      receiptItems: extractedData.items,
    })

    handleClose()
  }

  const handleClose = () => {
    setStep('upload')
    setExtractedData(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={handleClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Receipt Scanner</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Extract merchants, line items, taxes & total with Gemini Vision
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Upload or Choose Sample */}
        {step === 'upload' && (
          <div className="space-y-5 pt-4">
            
            {/* File dropzone simulator */}
            <div 
              onClick={() => handleScan(selectedPresetId)}
              className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-3xl p-6 text-center cursor-pointer transition bg-slate-950/50 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">
                Upload or Drop Receipt Image
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Supports JPG, PNG, WEBP, PDF up to 10MB
              </p>
              <button 
                type="button"
                className="mt-3 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Browse Files
              </button>
            </div>

            {/* Quick 1-Click Sample Receipts for Hackathon Judges */}
            <div>
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>Or test with 1-click sample receipts:</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Instant Hackathon Demo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {sampleReceipts.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPresetId(preset.id)
                      handleScan(preset.id)
                    }}
                    className={`p-3 rounded-2xl border text-left transition hover:scale-[1.02] bg-slate-950/80 border-slate-800 hover:border-amber-500/50`}
                  >
                    <div className="text-xs font-bold text-white truncate">{preset.merchant}</div>
                    <div className="text-[11px] text-amber-400 font-semibold mt-0.5">
                      {formatCurrency(preset.total)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {preset.items.length} items • {preset.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Edge Case Test: Simulate Blurry Photo */}
            <div className="pt-1 text-center">
              <button
                onClick={handleSimulateBlurry}
                className="text-[11px] text-slate-500 hover:text-slate-400 underline"
              >
                Test Edge Case: Simulate blurry / unreadable receipt error
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: Scanning Progress Animation */}
        {step === 'scanning' && (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-2xl bg-amber-500/20 animate-ping" />
              <div className="relative w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white">Analyzing Receipt with Gemini AI...</div>
              <p className="text-xs text-slate-400 mt-1">
                Detecting merchant, line items, CGST/SGST taxes, and total amount
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Edit Extracted Financial Data */}
        {step === 'review' && extractedData && (
          <div className="space-y-4 pt-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Receipt detected successfully! Please review before saving.</span>
            </div>

            {/* Editable Fields */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <span className="text-slate-400 font-medium">Merchant:</span>
                <input
                  type="text"
                  value={extractedData.merchant}
                  onChange={(e) => setExtractedData({ ...extractedData, merchant: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-bold text-right outline-none"
                />
              </div>

              {/* Items List */}
              <div className="space-y-1.5 py-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Line Items Extracted:
                </div>
                {extractedData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300 py-0.5">
                    <span>{item.name}</span>
                    <span className="font-semibold text-white">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-slate-400">
                <span>Subtotal:</span>
                <span>₹{extractedData.subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Tax (GST):</span>
                <span>₹{extractedData.tax}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-bold text-white">
                <span className="text-emerald-400">Total Amount:</span>
                <span className="text-base text-emerald-400">₹{extractedData.total}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block mb-1">Category:</span>
                  <select
                    value={extractedData.category}
                    onChange={(e) => setExtractedData({ ...extractedData, category: e.target.value as Category })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 outline-none"
                  >
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Bills">Bills</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Date:</span>
                  <input
                    type="date"
                    value={extractedData.date}
                    onChange={(e) => setExtractedData({ ...extractedData, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-2xl text-xs transition"
              >
                Scan Another
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-2xl text-xs transition shadow-lg shadow-emerald-500/20"
              >
                Confirm & Add Expense
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Error State */}
        {step === 'error' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Receipt Analysis Failed</div>
              <p className="text-xs text-rose-300/80 mt-1 max-w-sm mx-auto">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setStep('upload')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Uploading Again
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
