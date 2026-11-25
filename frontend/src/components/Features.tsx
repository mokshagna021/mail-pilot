import React from 'react'
import { Camera, Bot, BellRing, Repeat, Target, Search } from 'lucide-react'
import { Language } from '../types'
import { translations } from '../utils/translations'

interface FeaturesProps {
  currentLang: Language
}

export const Features: React.FC<FeaturesProps> = ({ currentLang }) => {
  const t = translations[currentLang]

  const featureList = [
    {
      icon: Camera,
      title: t.scanUPI,
      description: t.scanUPIDesc,
      badge: "Gemini Vision AI",
      color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    },
    {
      icon: Bot,
      title: t.aiCoach,
      description: t.aiCoachDesc,
      badge: "Multilingual",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      icon: Repeat,
      title: t.subscriptions,
      description: t.subscriptionsDesc,
      badge: "Auto-Radar",
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    },
    {
      icon: BellRing,
      title: t.predictiveAlerts,
      description: t.predictiveAlertsDesc,
      badge: "Smart Alerts",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    },
    {
      icon: Target,
      title: "Goal-Based Budgeting",
      description: "Set milestone goals like 'Save ₹20,000 for emergency fund'. SpendWise AI automatically calculates weekly targets and spending caps.",
      badge: "Auto Calculation",
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
    },
    {
      icon: Search,
      title: "Natural Language Search",
      description: "Ask 'Show coffee expenses last month' or 'What did I spend over ₹1,000?' and instantly see filtered transactions.",
      badge: "AI Querying",
      color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400">
            {t.features}
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered to Solve Real Financial Blindspots
          </h3>
          <p className="text-slate-400 text-sm sm:text-base">
            SpendWise AI goes far beyond boring spreadsheets. It understands your context, learns your habits, and protects your wallet.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featureList.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition duration-200 hover:-translate-y-1 hover:shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} border`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
