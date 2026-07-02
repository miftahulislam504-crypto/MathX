'use client'
import { useEffect } from 'react'
import { AuthForm } from './AuthForm'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { X } from 'lucide-react'

interface Props {
  tab: 'login' | 'signup'
  onTabChange: (tab: 'login' | 'signup') => void
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ tab, onTabChange, onClose, onSuccess }: Props) {
  const { tt } = useLanguage()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all z-20"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] shadow-2xl shadow-black/60 p-6">
          <div className="text-center mb-5">
            <span className="text-2xl font-bold">
              <span className="text-white">Math</span>
              <span className="text-violet-400">X</span>
            </span>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl border border-white/8 bg-white/[0.03] p-1 mb-6">
            {(['login', 'signup'] as const).map(tabId => (
              <button
                key={tabId}
                onClick={() => onTabChange(tabId)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                  tab === tabId
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {tabId === 'login' ? tt(t.common.signIn) : tt(t.common.signUp)}
              </button>
            ))}
          </div>

          <AuthForm mode={tab} onSuccess={onSuccess} />

          {/* Switch link */}
          <p className="text-center text-xs text-white/30 mt-5">
            {tab === 'login' ? (
              <>{tt(t.auth.noAccount)}{' '}
                <button onClick={() => onTabChange('signup')} className="text-violet-400 hover:text-violet-300 transition-colors">
                  {tt(t.auth.createOneFree)}
                </button>
              </>
            ) : (
              <>{tt(t.auth.alreadyHave)}{' '}
                <button onClick={() => onTabChange('login')} className="text-violet-400 hover:text-violet-300 transition-colors">
                  {tt(t.auth.signInLink)}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
