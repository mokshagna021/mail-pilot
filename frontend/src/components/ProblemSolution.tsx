import React from 'react'
import { XCircle, CheckCircle2 } from 'lucide-react'
import { Language } from '../types'
import { translations } from '../utils/translations'

interface ProblemSolutionProps {
  currentLang: Language
}

export const ProblemSolution: React.FC<ProblemSolutionProps> = ({ currentLang }) => {
  const t = translations[currentLang]

  const problems = [
    "Manual typing: 90% of users quit after 2 weeks because logging expenses takes too long.",
    "Boring charts without insights: Numbers tell you what happened, but never why or how to fix it.",
    "Hidden subscription drains: Forgotten Netflix or gym memberships silently chew into savings.",
    "Zero language inclusivity: Most apps force English terminology that confuses everyday users.",
  ]

  const solutions = [
    "Frictionless AI Capture: Snap a UPI screenshot or speak naturally. Done in 3 seconds.",
    "Conversational Financial Coach: Ask real questions in English, Telugu, or Hindi and get actionable tips.",
    "Autonomous Subscription Radar: Flags recurring monthly patterns and alerts before renewals.",
    "Multilingual & Regional: Budget in the language you speak at home with native fluency.",
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Problem Card */}
          <div className="bg-rose-950/10 border border-rose-900/30 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <XCircle className="w-4 h-4" />
                {t.problemTitle}
              </div>
              <h3 className="text-2xl font-bold text-white">
                Why Traditional Budgeting Apps Fail
              </h3>
              <ul className="space-y-4 pt-2">
                {problems.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="p-1 rounded-full bg-rose-500/20 text-rose-400 mt-0.5 shrink-0">
                      <XCircle className="w-3.5 h-3.5" />
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solution Card */}
          <div className="bg-emerald-950/10 border border-emerald-900/40 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                {t.solutionTitle}
              </div>
              <h3 className="text-2xl font-bold text-white">
                The SpendWise AI Advantage
              </h3>
              <ul className="space-y-4 pt-2">
                {solutions.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
