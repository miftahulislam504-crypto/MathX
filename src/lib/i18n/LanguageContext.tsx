'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { t, tr, Lang, TranslationNode } from './translations'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  /** Translate a node from the `t` dictionary directly: tt(t.nav.learn) */
  tt: (node: TranslationNode) => string
  /** Translate a Bengali/English pair given inline: tx('Learn', 'শিখুন') */
  tx: (en: string, bn: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'mathx_lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  const [hydrated, setHydrated] = useState(false)

  // Load persisted language on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
      if (saved === 'en' || saved === 'bn') {
        setLangState(saved)
      } else {
        // Default to browser language if Bengali, else English
        const browserLang = navigator.language || ''
        if (browserLang.startsWith('bn')) setLangState('bn')
      }
    } catch {
      // localStorage unavailable (SSR or privacy mode) — default to 'en'
    }
    setHydrated(true)
  }, [])

  // Apply <html lang="..."> attribute whenever language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang)
    }
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore storage errors
    }
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'bn' : 'en')
  }, [lang, setLang])

  const tt = useCallback((node: TranslationNode) => tr(node, lang), [lang])
  const tx = useCallback((en: string, bn: string) => (lang === 'bn' ? bn : en), [lang])

  // Avoid hydration flash: render with default lang until client mounts,
  // since the html/body would otherwise briefly show English before BN loads.
  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, tt, tx }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}

// Re-export the dictionary so pages can do: import { t } from '@/lib/i18n/LanguageContext'
export { t }
export type { Lang }
