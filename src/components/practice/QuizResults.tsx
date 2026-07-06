'use client'
import { Trophy, RotateCcw } from 'lucide-react'
import { ModeStats } from '@/lib/data/practice-progress'

interface Props {
  score: number
  total: number
  stats: ModeStats
  onRetry: () => void
}

export function QuizResults({ score, total, stats, onRetry }: Props) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0
  const isNewBest = percent >= stats.bestScore && percent > 0

  return (
    <div className="text-center py-8 space-y-6">
      <Trophy className={`w-12 h-12 mx-auto ${percent >= 70 ? 'text-amber-400' : 'text-white/30'}`} />

      <div>
        <p className="text-4xl font-bold text-white mb-1">{score} / {total}</p>
        <p className="text-sm text-white/40">{percent}% correct</p>
      </div>

      {isNewBest && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 inline-block">
          New personal best for this mode!
        </p>
      )}

      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Best Score</p>
          <p className="text-lg font-mono text-cyan-400">{stats.bestScore}%</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Best Streak</p>
          <p className="text-lg font-mono text-amber-400">{stats.bestStreak}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Attempts</p>
          <p className="text-lg font-mono text-violet-400">{stats.attemptsCount}</p>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-all"
      >
        <RotateCcw className="w-4 h-4" /> Practice Again
      </button>
    </div>
  )
}
