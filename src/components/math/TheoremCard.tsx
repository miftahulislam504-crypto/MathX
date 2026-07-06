'use client'
import Link from 'next/link'
import { DisplayMath } from './LatexRenderer'
import { TheoremEntry } from '@/lib/data/theorems'
import { cn } from '@/lib/utils/cn'

interface Props {
  theorem: TheoremEntry
  compact?: boolean
}

export function TheoremCard({ theorem, compact = false }: Props) {
  return (
    <Link
      href={`/theorems/${theorem.slug}`}
      className={cn(
        'group relative block rounded-xl border border-white/8 bg-white/[0.03] hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all',
        compact ? 'p-4' : 'p-5'
      )}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className={cn('font-semibold text-white group-hover:text-cyan-300 transition-colors', compact ? 'text-sm' : 'text-base')}>
          {theorem.title}
        </h3>
        <span className="shrink-0 text-[10px] text-white/25 font-mono">{theorem.year}</span>
      </div>

      {/* LaTeX statement, if present */}
      {theorem.latex && (
        <div className="bg-black/30 rounded-lg p-4 mb-3 border border-white/5 overflow-x-auto">
          <DisplayMath latex={theorem.latex} />
        </div>
      )}

      {/* Statement */}
      <p className={cn('text-white/50 leading-relaxed', compact ? 'text-xs line-clamp-3' : 'text-sm')}>
        {theorem.statement}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 mt-3 text-[11px] text-white/25">
        <span>{theorem.discoveredBy.split(',')[0].split(';')[0]}</span>
        <span>·</span>
        <span>{theorem.proofMethod}</span>
      </div>

      {/* Tags */}
      {!compact && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {theorem.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-cyan-400/70 bg-cyan-500/8 border border-cyan-500/15 rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
