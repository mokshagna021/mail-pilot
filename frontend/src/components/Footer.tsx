import React from 'react'
import { Sparkles, Heart } from 'lucide-react'
import { Language } from '../types'
import { translations } from '../utils/translations'

interface FooterProps {
  currentLang: Language
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = translations[currentLang]

  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base">{t.appName}</span>
          <span className="text-xs text-slate-500">— {t.tagline}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>{t.footerTagline} Built with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>using React, Supabase & Gemini</span>
        </div>
      </div>
    </footer>
  )
}
