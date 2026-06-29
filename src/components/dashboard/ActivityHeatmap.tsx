'use client'
import { useMemo } from 'react'

interface DayData { date: string; minutes: number; day: number }

interface Props { heatmap: DayData[] }

function getColor(minutes: number): string {
  if (minutes === 0) return 'bg-white/[0.04]'
  if (minutes < 10)  return 'bg-violet-700/40'
  if (minutes < 30)  return 'bg-violet-600/60'
  if (minutes < 60)  return 'bg-violet-500/80'
  return 'bg-violet-400'
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function ActivityHeatmap({ heatmap }: Props) {
  // Group into weeks (columns)
  const weeks = useMemo(() => {
    const result: DayData[][] = []
    for (let i = 0; i < heatmap.length; i += 7) {
      result.push(heatmap.slice(i, i + 7))
    }
    return result
  }, [heatmap])

  // Month labels
  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = []
    let lastMonth = -1
    weeks.forEach((week, wi) => {
      const m = new Date(week[0]?.date).getMonth()
      if (m !== lastMonth) { labels.push({ label: MONTHS[m], col: wi }); lastMonth = m }
    })
    return labels
  }, [weeks])

  const totalMinutes = heatmap.reduce((s, d) => s + d.minutes, 0)
  const activeDays   = heatmap.filter(d => d.minutes > 0).length

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/70">Activity — Last 52 Weeks</h3>
        <div className="flex gap-4 text-xs text-white/30 font-mono">
          <span>{activeDays} active days</span>
          <span>{Math.round(totalMinutes / 60)}h studied</span>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex gap-[3px] mb-1 ml-7 overflow-x-auto">
        {weeks.map((_, wi) => {
          const ml = monthLabels.find(m => m.col === wi)
          return (
            <div key={wi} className="w-3 shrink-0 text-[9px] text-white/20 font-mono">
              {ml ? ml.label : ''}
            </div>
          )
        })}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1">
          {DAYS.map((d, i) => (
            <div key={d} className="h-3 text-[9px] text-white/20 font-mono flex items-center">
              {i % 2 === 1 ? d : ''}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] overflow-x-auto">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={`${day.date}: ${day.minutes} min`}
                  className={`w-3 h-3 rounded-[2px] cursor-default transition-opacity hover:opacity-70 ${getColor(day.minutes)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[9px] text-white/20">Less</span>
        {['bg-white/[0.04]','bg-violet-700/40','bg-violet-600/60','bg-violet-500/80','bg-violet-400'].map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-[2px] ${c}`} />
        ))}
        <span className="text-[9px] text-white/20">More</span>
      </div>
    </div>
  )
}
