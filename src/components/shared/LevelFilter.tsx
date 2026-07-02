'use client'
import { Level } from '@/types'
import { cn } from '@/lib/utils/cn'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'

interface Props { active: Level | 'ALL';onChange: (level: Level | 'ALL') => void }

export function LevelFilter({ active, onChange }: Props) {
  const { tt } = useLanguage()

  const LEVELS: { value: Level | 'ALL';label: string } [] = [
    { value: 'ALL', label: tt(t.levels.ALL) }, { value: 'SCHOOL', label: tt(t.levels.SCHOOL) },
    { value: 'COLLEGE', label: tt(t.levels.COLLEGE) }, { value: 'UNIVERSITY', label: tt(t.levels.UNIVERSITY) },
    { value: 'ADVANCED', label: tt(t.levels.ADVANCED) }, { value: 'RESEARCH', label: tt(t.levels.RESEARCH) },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {LEVELS.map((l) => (
        <button key={l.value} onClick={() => onChange(l.value)}
          className={cn('rounded-full px-3 py-1 text-xs font-medium border transition-all',
            active === l.value ? 'bg-violet-600 border-violet-500 text-white' : 'bg-white/[0.03] border-white/10 text-white/50 hover:text-white/80 hover:border-white/20')}>
          {l.label}
        </button>
      ))}
    </div>
  )
}
