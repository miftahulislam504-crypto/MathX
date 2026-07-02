'use client'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { X } from 'lucide-react'

interface Props { placeholder?: string; onSearch: (query: string) => void; className?: string }

export function SearchBar({ placeholder, onSearch, className }: Props) {
  const [value, setValue] = useState('')
  const { tt } = useLanguage()
  const effectivePlaceholder = placeholder ?? tt(t.common.searchPlaceholder)
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setValue(e.target.value); onSearch(e.target.value) }, [onSearch])
  const clear = () => { setValue(''); onSearch('') }
  return (
    <div className={cn('relative', className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm select-none">⌕</span>
      <input type="text" value={value} onChange={handleChange} placeholder={effectivePlaceholder}
        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 transition-all"/>
      {value && <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"><X className="w-3.5 h-3.5" /></button>}
    </div>
  )
}
