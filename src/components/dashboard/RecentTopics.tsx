'use client'
import Link from 'next/link'
import { TopicProgress } from '@/lib/data/user-progress'
import { TOPICS } from '@/lib/data/topics'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { BookOpen } from 'lucide-react'

interface Props { progress: Record<string, TopicProgress> }

export function RecentTopics({ progress }: Props) {
  const recent = Object.values(progress)
    .sort((a, b) => new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime())
    .slice(0, 8)

  if (!recent.length) {
    return (
      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-6 text-center">
        <BookOpen className="w-8 h-8 mb-2 text-white/30" />
        <p className="text-sm text-white/30">No topics studied yet</p>
        <Link href="/learn"
          className="inline-block mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors">
          Start Learning →
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/70">Recently Studied</h3>
        <Link href="/learn" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
          All topics →
        </Link>
      </div>
      <div className="space-y-2">
        {recent.map(p => {
          const topic  = TOPICS.find(t => t.slug === p.topicSlug)
          const branch = topic ? MATH_BRANCHES.find(b => b.id === topic.branchId) : null
          if (!topic) return null

          const daysAgo = Math.floor(
            (Date.now() - new Date(p.lastStudied).getTime()) / 86400000
          )
          const timeLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`

          return (
            <Link
              key={p.topicSlug}
              href={`/learn/${branch?.slug ?? 'math'}/${p.topicSlug}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/[0.04] transition-all group"
            >
              <span className="text-base shrink-0">{branch?.icon ?? '∑'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/70 group-hover:text-white truncate transition-colors">
                  {topic.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all"
                      style={{ width: `${p.mastery}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/25 font-mono shrink-0">{p.mastery}%</span>
                </div>
              </div>
              <span className="text-[10px] text-white/20 shrink-0">{timeLabel}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
