import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Language, AppView } from '../types'
import { translations } from '../utils/translations'

interface CTAProps {
  currentLang: Language
  onNavigate: (view: AppView) => void
}

export const CTA: React.FC<CTAProps> = ({ currentLang, onNavigate }) => {
  const t = translations[currentLang]

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-900/60 border border-emerald-500/30 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ship To Build With AI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            {t.startNow}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of smart spenders who analyze UPI screenshots, set goal-based budgets, and grow their wealth with AI.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('signup')}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl transition shadow-xl shadow-emerald-500/20 hover:scale-[1.02]"
            >
              {t.signUp}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
