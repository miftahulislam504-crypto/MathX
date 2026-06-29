'use client'
import { useEffect } from 'react'
import { AuthForm } from './AuthForm'

interface Props {
  tab: 'login' | 'signup'
  onTabChange: (tab: 'login' | 'signup') => void
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ tab, onTabChange, onClose, onSuccess }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all z-20"
        >
          ✕
        </button>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] shadow-2xl shadow-black/60 p-6">
          {/* Logo */}
          <div className="text-center mb-5">
            <span className="text-2xl font-bold">
              <span className="text-white">Math</span>
              <span className="text-violet-400">X</span>
            </span>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl border border-white/8 bg-white/[0.03] p-1 mb-6">
            {(['login', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => onTabChange(t)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                  tab === t
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <AuthForm
            mode={tab}
            onSuccess={onSuccess}
          />

          {/* Switch link */}
          <p className="text-center text-xs text-white/30 mt-5">
            {tab === 'login' ? (
              <>No account?{' '}
                <button onClick={() => onTabChange('signup')} className="text-violet-400 hover:text-violet-300 transition-colors">
                  Create one free
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => onTabChange('login')} className="text-violet-400 hover:text-violet-300 transition-colors">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
