import Link from 'next/link'
import { Topic } from '@/types'
import { cn } from '@/lib/utils/cn'
import { MATH_BRANCHES } from '@/lib/data/branches'

const LEVEL_BADGE: Record<string, { label: string; color: string }> = {
  SCHOOL:     { label: 'School',     color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  COLLEGE:    { label: 'College',    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  UNIVERSITY: { label: 'University', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  ADVANCED:   { label: 'Advanced',   color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  RESEARCH:   { label: 'Research',   color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
}

interface Props {
  topic: Topic
  mastery?: number
  href?: string
}

export function TopicCard({ topic, mastery, href }: Props) {
  const badge = LEVEL_BADGE[topic.level]
  const branch = MATH_BRANCHES.find((b) => b.id === topic.branchId)
  const link = href ?? `/learn/${branch?.slug ?? 'math'}/${topic.slug}`

  return (
    <Link
      href={link}
      className="group flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05] p-4 transition-all"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <span className={cn('text-[10px] font-medium border rounded-full px-2 py-0.5', badge.color)}>
          {badge.label}
        </span>
        {mastery !== undefined && (
          <span className="text-[10px] text-white/30 font-mono">{Math.round(mastery)}%</span>
        )}
      </div>

      {/* Title */}
      <div>
        <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
          {topic.title}
        </h3>
        {topic.titleBn && (
          <p className="text-xs text-white/30 mt-0.5">{topic.titleBn}</p>
        )}
      </div>

      {/* Mastery bar */}
      {mastery !== undefined && (
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-violet-500 transition-all"
            style={{ width: `${mastery}%` }}
          />
        </div>
      )}

      <span className="text-[11px] text-white/25 group-hover:text-white/40 transition-colors mt-auto">
        Study →
      </span>
    </Link>
  )
}
