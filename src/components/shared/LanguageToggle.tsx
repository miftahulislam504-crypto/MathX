'use client'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { cn } from '@/lib/utils/cn'

interface Props {
  className?: string
  variant?: 'pill' | 'compact'
}

/**
 * Global EN ⇄ BN toggle. Drop this anywhere — it reads/writes the shared
 * LanguageContext, so switching here updates the entire site instantly.
 */
export function LanguageToggle({ className, variant = 'pill' }: Props) {
  const { lang, setLang } = useLanguage()

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
        className={cn(
          'rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-white/60 hover:text-white hover:border-white/20 transition-all',
          className
        )}
        aria-label="Toggle language"
        title={lang === 'en' ? 'Switch to বাংলা' : 'Switch to English'}
      >
        {lang === 'en' ? 'বাং' : 'EN'}
      </button>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5',
        className
      )}
      role="group"
      aria-label="Language switcher"
    >
      <button
        onClick={() => setLang('en')}
        className={cn(
          'rounded-full px-2.5 py-1 text-[11px] font-medium transition-all',
          lang === 'en' ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white/70'
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLang('bn')}
        className={cn(
          'rounded-full px-2.5 py-1 text-[11px] font-medium transition-all',
          lang === 'bn' ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white/70'
        )}
      >
        বাং
      </button>
    </div>
  )
}
