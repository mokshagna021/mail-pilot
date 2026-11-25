import React from 'react'
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Bot } from 'lucide-react'
import { Language, AppView } from '../types'
import { translations } from '../utils/translations'

interface HeroProps {
  currentLang: Language
  onNavigate: (view: AppView) => void
}

export const Hero: React.FC<HeroProps> = ({ currentLang, onNavigate }) => {
  const t = translations[currentLang]

  return (
    <div className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Personal Finance</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {t.heroTitle}{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {t.heroHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.heroDescription}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => onNavigate('signup')}
                className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02]"
              >
                {t.getStarted}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-700/80 transition"
              >
                Explore Live Demo
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Bank Password Storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Private & Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive UI Showcase Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-emerald-950/40 space-y-5">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-slate-400">Total Balance</div>
                  <div className="text-2xl font-bold text-white tracking-tight">₹42,850.00</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    +₹12,400 Saved
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">Daily Limit: ₹1,250</div>
                </div>
              </div>

              {/* Sample AI Extracted Receipt */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Recent AI Extraction
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> UPI Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-sm">
                      🍔
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Swiggy Order</div>
                      <div className="text-xs text-slate-400">Category: Food & Dining (Want)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-rose-400">-₹450.00</div>
                    <div className="text-[10px] text-slate-500">Today, 1:45 PM</div>
                  </div>
                </div>
              </div>

              {/* AI Coach Suggestion Bubble */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex gap-3 items-start">
                <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-emerald-300">SpendWise AI Coach</div>
                  <p className="text-slate-300 leading-relaxed">
                    "You've spent ₹1,850 on food this week. Keeping weekend orders below ₹600 will hit your ₹20,000 monthly savings goal!"
                  </p>
                </div>
              </div>

              {/* Mini Trend Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Monthly Budget Used</span>
                  <span className="text-slate-200 font-medium">62% (₹26,500 / ₹42,000)</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[62%]" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
