'use client'
import { UserStats } from '@/lib/data/user-progress'

interface Props { stats: UserStats; levelProgress: number; xpToNext: number }

export function StatsRow({ stats, levelProgress, xpToNext }: Props) {
  const cards = [
    { label: 'Level',           value: stats.level,              unit: '',    icon: '⚡', color: 'text-violet-400',  bg: 'bg-violet-500/8  border-violet-500/20' },
    { label: 'Total XP',        value: stats.totalXP,            unit: 'xp', icon: '✨', color: 'text-amber-400',   bg: 'bg-amber-500/8   border-amber-500/20' },
    { label: 'Day Streak',      value: stats.streak,             unit: '🔥', icon: '📅', color: 'text-rose-400',    bg: 'bg-rose-500/8    border-rose-500/20' },
    { label: 'Topics Done',     value: stats.topicsCompleted,    unit: '',    icon: '📚', color: 'text-cyan-400',    bg: 'bg-cyan-500/8    border-cyan-500/20' },
    { label: 'Problems Solved', value: stats.problemsSolved,     unit: '',    icon: '✏️', color: 'text-emerald-400', bg: 'bg-emerald-500/8 border-emerald-500/20' },
    { label: 'Achievements',    value: stats.achievements.length,unit: '',    icon: '🏆', color: 'text-amber-400',   bg: 'bg-amber-500/8   border-amber-500/20' },
  ]

  return (
    <div className="space-y-4">
      {/* Level progress bar */}
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-violet-400 font-mono">Lv {stats.level}</span>
            <span className="text-xs text-white/30">Mathematician</span>
          </div>
          <span className="text-xs text-white/30 font-mono">{xpToNext} XP to next level</span>
        </div>
        <div className="h-2 rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-700"
            style={{ width: `${Math.min(100, levelProgress)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-white/20 font-mono">{stats.totalXP} XP</span>
          <span className="text-[10px] text-white/20 font-mono">{levelProgress}%</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map(c => (
          <div key={c.label} className={`rounded-xl border p-3 ${c.bg}`}>
            <div className="text-lg mb-1">{c.icon}</div>
            <div className={`text-xl font-bold font-mono ${c.color}`}>
              {c.value.toLocaleString()}{c.unit && c.unit !== '🔥' ? ` ${c.unit}` : c.unit}
            </div>
            <div className="text-[10px] text-white/30 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
