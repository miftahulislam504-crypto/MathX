'use client'
import { useMemo, useState } from 'react'
import { MATHEMATICIANS, Mathematician } from '@/lib/data/mathematicians'

// Parse a year string like '~300 BCE', '~1170', '1643' into a signed integer (BCE negative).
function parseYear(raw: string): number {
  const isBCE = /BCE/i.test(raw)
  const num = parseInt(raw.replace(/[^\d]/g, ''), 10)
  if (Number.isNaN(num)) return 0
  return isBCE ? -num : num
}

function fmtYear(n: number): string {
  return n < 0 ? `${Math.abs(n)} BCE` : `${n} CE`
}

const ERA_COLORS: Record<string, string> = {
  Ancient: '#f59e0b',
  'Islamic Golden Age': '#10b981',
  Medieval: '#38bdf8',
  'Scientific Revolution': '#8b5cf6',
  'Age of Enlightenment': '#06b6d4',
  Modern: '#f472b6',
  Contemporary: '#e5e5e5',
}

interface TimelineEntry {
  m: Mathematician
  bornYear: number
  diedYear: number
}

export function MathematiciansTimeline({ onSelect }: { onSelect?: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const entries: TimelineEntry[] = useMemo(
    () =>
      MATHEMATICIANS.map((m) => ({
        m,
        bornYear: parseYear(m.born),
        diedYear: m.died ? parseYear(m.died) : parseYear(m.born) + 60,
      })).sort((a, b) => a.bornYear - b.bornYear),
    []
  )

  const minYear = Math.min(...entries.map((e) => e.bornYear)) - 20
  const maxYear = Math.max(...entries.map((e) => e.diedYear)) + 20
  const span = maxYear - minYear
  const PX_PER_YEAR = 2.2
  const totalWidth = span * PX_PER_YEAR
  const ROW_H = 46

  // Century gridlines
  const gridlines: number[] = []
  for (let y = Math.ceil(minYear / 100) * 100; y <= maxYear; y += 100) gridlines.push(y)

  const yearToX = (y: number) => (y - minYear) * PX_PER_YEAR

  return (
    <div className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
      <div className="overflow-x-auto">
        <div className="relative" style={{ width: totalWidth, height: entries.length * ROW_H + 40 }}>
          {/* Century gridlines */}
          {gridlines.map((y) => (
            <div key={y} className="absolute top-0 bottom-0 flex flex-col items-center" style={{ left: yearToX(y) }}>
              <div className="w-px h-full bg-white/5" />
              <span className="absolute top-0 text-[9px] font-mono text-white/20 -translate-x-1/2 bg-[#09090b] px-1">
                {fmtYear(y)}
              </span>
            </div>
          ))}

          {/* Lifespan bars */}
          {entries.map((e, i) => {
            const x = yearToX(e.bornYear)
            const w = Math.max(6, yearToX(e.diedYear) - x)
            const color = ERA_COLORS[e.m.era] ?? '#a1a1aa'
            const isHovered = hovered === e.m.id
            return (
              <div
                key={e.m.id}
                className="absolute flex items-center cursor-pointer"
                style={{ left: x, top: 32 + i * ROW_H, width: w }}
                onMouseEnter={() => setHovered(e.m.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect?.(e.m.id)}
              >
                <div
                  className="h-2.5 rounded-full transition-all"
                  style={{ width: w, background: color, opacity: isHovered ? 1 : 0.55 }}
                />
                <span
                  className="ml-2 text-[11px] font-mono whitespace-nowrap transition-colors"
                  style={{ color: isHovered ? color : 'rgba(255,255,255,0.35)' }}
                >
                  {e.m.name} <span className="text-white/20">({e.m.born}–{e.m.died ?? 'present'})</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-4 py-3 border-t border-white/5">
        {Object.entries(ERA_COLORS).map(([era, color]) => (
          <div key={era} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-[10px] text-white/30">{era}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-white/20 text-center pb-3">Scroll horizontally · click a name to jump to their card</p>
    </div>
  )
}
