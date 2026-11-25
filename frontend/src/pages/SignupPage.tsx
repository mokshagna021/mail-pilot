import React, { useState } from 'react'
import { Sparkles, Eye, EyeOff, Check, X, ArrowLeft, Shield, AlertCircle } from 'lucide-react'
import { Language, AppView } from '../types'
import { checkPasswordStrength, isPasswordValid, isValidEmail } from '../utils/validation'

interface SignupPageProps {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
  onNavigate: (view: AppView) => void
  onSignupSuccess?: (profileData: { firstName: string; email: string; language: Language }) => void
}

export const SignupPage: React.FC<SignupPageProps> = ({
  currentLang,
  onLanguageChange,
  onNavigate,
  onSignupSuccess,
}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const passwordRules = checkPasswordStrength(password)
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const passwordValid = isPasswordValid(passwordRules)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!firstName.trim()) {
      setErrorMessage('Please enter your first name.')
      return
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!passwordValid) {
      setErrorMessage('Password must satisfy all security requirements.')
      return
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsLoading(true)

    // Simulating signup submission (Supabase Auth connection will hook up in Step 9)
    setTimeout(() => {
      setIsLoading(false)
      if (onSignupSuccess) {
        onSignupSuccess({ firstName, email, language: currentLang })
      } else {
        onNavigate('dashboard')
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Back button */}
      <div className="max-w-md w-full mx-auto mb-4">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to SpendWise AI
        </button>
      </div>

      <div className="max-w-md w-full mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/30">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-400">
            Start tracking UPI expenses, subscriptions, and AI coaching.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                First Name <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ramesh"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Kumar"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address <span className="text-emerald-400">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="ramesh@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Preferred Language
            </label>
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Student@123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Real-time Password Strength Requirements Checklist */}
          {password.length > 0 && (
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1.5 text-[11px]">
              <div className="font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Password Security Checklist:
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className={`flex items-center gap-1.5 ${passwordRules.minLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {passwordRules.minLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  8+ characters
                </div>
                <div className={`flex items-center gap-1.5 ${passwordRules.hasUpper ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {passwordRules.hasUpper ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  Uppercase letter (A-Z)
                </div>
                <div className={`flex items-center gap-1.5 ${passwordRules.hasLower ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {passwordRules.hasLower ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  Lowercase letter (a-z)
                </div>
                <div className={`flex items-center gap-1.5 ${passwordRules.hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {passwordRules.hasNumber ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  Number (0-9)
                </div>
                <div className={`col-span-2 flex items-center gap-1.5 ${passwordRules.hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {passwordRules.hasSpecial ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  Special character (@$!%*?&#)
                </div>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Confirm Password <span className="text-emerald-400">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            {confirmPassword.length > 0 && (
              <div className="mt-1 text-[11px] flex items-center gap-1">
                {passwordsMatch ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Passwords match
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !passwordValid || !passwordsMatch}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              'Create Free Account'
            )}
          </button>
        </form>

        {/* Footer switch to Login */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  )
}
