import React, { useState, useRef, useEffect } from 'react'
import { 
  Bot, Send, Sparkles, User, RefreshCw, Mic, Volume2, 
  CheckCircle2, Info, ChevronRight, Globe 
} from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { answerFinancialQuestion } from '../../ai/geminiService'
import { ChatMessage, Language } from '../../types'
import { languageNames, translations } from '../../utils/translations'

export const AICoachPage: React.FC = () => {
  const { user, language, setLanguage, transactions, budgets, goals } = useFinance()
  const t = translations[language] || translations.en

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      content: `Hello ${user.firstName}! 👋 I am your **SpendWise AI Financial Coach**.\n\nI have real-time access to your current transactions, category budgets, and savings goals. Ask me anything in **English**, **తెలుగు (Telugu)**, **हिन्दी (Hindi)**, or any of the 10 supported Indian languages!\n\nTry clicking any question below or type your own question.`,
      timestamp: 'Just now',
      isEducational: true,
      suggestions: [
        "How much did I spend on food?",
        "Why did I spend so much this month?",
        "How can I save ₹2,000 this month?",
        "ఈ నెల ఆహారం మీద ఎంత ఖర్చు చేశాను?",
        "What are my biggest recurring expenses?",
      ]
    }
  ])

  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking])

  const handleSend = async (questionText?: string) => {
    const text = (questionText || input).trim()
    if (!text || isThinking) return

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: 'Just now',
    }

    setMessages(prev => [...prev, userMsg])
    if (!questionText) setInput('')
    setIsThinking(true)

    try {
      const response = await answerFinancialQuestion(
        text,
        transactions,
        budgets,
        goals,
        user,
        language
      )

      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        content: response,
        timestamp: 'Just now',
        isEducational: true,
        suggestions: [
          "Where am I spending too much?",
          "Can I afford a ₹5,000 weekend trip?",
          "Show my savings challenges progress",
        ]
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          content: 'I had trouble calculating that insight. Please try asking again!',
          timestamp: 'Just now',
        }
      ])
    } finally {
      setIsThinking(false)
    }
  }

  // Pre-configured questions by language
  const samplePrompts = [
    { label: "🍔 Food Spending", q: "How much did I spend on food?" },
    { label: "🔍 Why spends spiked", q: "Why did I spend so much this month?" },
    { label: "💰 Save ₹2,000", q: "How can I save ₹2,000 this month?" },
    { label: "🔁 Subscriptions", q: "What are my biggest recurring expenses?" },
    { label: "🇮🇳 తెలుగు: ఆహారం ఖర్చు", q: "ఈ నెల నేను ఆహారం మీద ఎంత ఖర్చు చేశాను?" },
    { label: "🇮🇳 తెలుగు: ఎందుకు పెరిగాయి", q: "నా ఖర్చులు ఎందుకు పెరిగాయి?" },
    { label: "🇮🇳 हिन्दी: खाने पर खर्च", q: "इस महीने मैंने खाने पर कितना खर्च किया?" },
  ]

  return (
    <div className="space-y-4 pb-16 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">SpendWise AI Financial Coach</h1>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/20">
                  Multilingual AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ask anything about your actual transactions, budgets & savings in your preferred tongue.
              </p>
            </div>
          </div>

          {/* Quick Language Toggle */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-200 outline-none"
            >
              {(Object.keys(languageNames) as Language[]).map(l => (
                <option key={l} value={l}>{languageNames[l].nativeName} ({languageNames[l].name})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-slate-900/70 border border-slate-800 rounded-3xl p-4 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user'
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-sm shadow-lg shadow-emerald-500/15'
                    : 'bg-slate-950 border border-slate-850 text-slate-200 rounded-tl-sm shadow-md'
                }`}
              >
                {/* Content formatted with markdown line breaks */}
                <div className="whitespace-pre-line space-y-2">
                  {msg.content}
                </div>

                {/* Educational Disclaimer on assistant responses */}
                {msg.isEducational && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>SpendWise AI provides educational insights based on your data and is not professional financial advice.</span>
                  </div>
                )}

                {/* Clickable Quick Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-850 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(s)}
                        className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 px-2.5 py-1 rounded-xl transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  {user.firstName[0]}
                </div>
              )}
            </div>
          )
        })}

        {/* AI Typing / Reasoning Indicator */}
        {isThinking && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 text-slate-400 text-xs py-3 px-4 rounded-2xl flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Analyzing your transactions and generating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions Scroll Row */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs shrink-0 no-scrollbar">
        <span className="text-[11px] text-slate-500 shrink-0">Prompts:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.q)}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition text-xs"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Bottom Message Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-2.5 shadow-xl shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask in English, తెలుగు, हिन्दी... (e.g. 'How much did I spend on food?')"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 outline-none"
          />
          <button
            type="button"
            onClick={() => handleSend("ఈ నెల నేను ఆహారం మీద ఎంత ఖర్చు చేశాను?")}
            className="hidden sm:inline-flex px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            title="Telugu demo query"
          >
            తెలుగు Test
          </button>
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="p-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-2xl transition shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  )
}
