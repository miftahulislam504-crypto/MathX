'use client'
import { ACHIEVEMENTS, RARITY_STYLE } from '@/lib/data/achievements'

interface Props {
  earned: string[]         // achievement ids
  onlyEarned?: boolean
}

export function AchievementsGrid({ earned, onlyEarned = false }: Props) {
  const list = onlyEarned
    ? ACHIEVEMENTS.filter(a => earned.includes(a.id))
    : ACHIEVEMENTS

  const categories = ['learning', 'practice', 'explorer', 'streak', 'mastery'] as const
  const CAT_LABELS: Record<string, string> = {
    learning: '📚 Learning', practice: '✏️ Practice',
    explorer: '🔭 Explorer', streak: '🔥 Streak', mastery: '🏆 Mastery',
  }

  return (
    <div className="space-y-6">
      {categories.map(cat => {
        const catAchievements = list.filter(a => a.category === cat)
        if (!catAchievements.length) return null
        return (
          <div key={cat}>
            <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">
              {CAT_LABELS[cat]}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {catAchievements.map(a => {
                const isEarned = earned.includes(a.id)
                const style = RARITY_STYLE[a.rarity]
                return (
                  <div
                    key={a.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isEarned
                        ? `${style.bg} ${style.border}`
                        : 'border-white/5 bg-white/[0.01] opacity-40 grayscale'
                    }`}
                  >
                    <div className="text-2xl mb-2" style={{ filter: isEarned ? 'none' : 'grayscale(1)' }}>
                      {a.icon}
                    </div>
                    <p className={`text-xs font-semibold mb-1 ${isEarned ? style.color : 'text-white/30'}`}>
                      {a.title}
                    </p>
                    <p className="text-[10px] text-white/30 leading-relaxed mb-2">
                      {a.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] capitalize font-mono ${style.color} opacity-60`}>
                        {a.rarity}
                      </span>
                      <span className="text-[9px] text-white/20 font-mono">+{a.xp} XP</span>
                    </div>
                    {isEarned && (
                      <div className="mt-2 w-full h-0.5 rounded-full bg-gradient-to-r from-transparent via-current to-transparent opacity-20"
                        style={{ color: style.color.replace('text-','') }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
