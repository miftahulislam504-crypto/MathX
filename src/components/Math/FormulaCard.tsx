'use client'
import { useState } from 'react'
import { DisplayMath } from './LatexRenderer'
import { FormulaEntry } from '@/lib/data/formulas'
import { cn } from '@/lib/utils/cn'

interface Props { formula: FormulaEntry; compact?: boolean }

export function FormulaCard({ formula, compact = false }: Props) {
  const [copied, setCopied] = useState(false)
  const copyLatex = () => { navigator.clipboard.writeText(formula.latex); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <div className={cn('group relative rounded-xl border border-white/8 bg-white/[0.03] hover:border-violet-500/30 transition-all', compact ? 'p-4' : 'p-5')}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className={cn('font-semibold text-white', compact ? 'text-sm' : 'text-base')}>{formula.title}</h3>
        <button onClick={copyLatex} className="shrink-0 text-[10px] text-white/30 hover:text-white/70 border border-white/10 rounded px-2 py-0.5 transition-colors opacity-0 group-hover:opacity-100">
          {copied ? '✓ Copied' : 'Copy LaTeX'}
        </button>
      </div>
      <div className="bg-black/30 rounded-lg p-4 mb-3 border border-white/5 overflow-x-auto">
        <DisplayMath latex={formula.latex} />
      </div>
      <p className={cn('text-white/50 leading-relaxed', compact ? 'text-xs' : 'text-sm')}>{formula.description}</p>
      {!compact && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {formula.tags.map((tag) => <span key={tag} className="text-[10px] text-violet-400/70 bg-violet-500/8 border border-violet-500/15 rounded-full px-2 py-0.5">{tag}</span>)}
        </div>
      )}
    </div>
  )
}
