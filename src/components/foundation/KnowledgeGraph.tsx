'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { MATH_BRANCHES } from '@/lib/data/branches'

// Branch-level prerequisite chain. Tier = how deep into the curriculum a branch
// typically sits; deps = branches a learner should know reasonably well first.
// Sourced from standard undergraduate/graduate curriculum ordering (verified
// against MIT 18.102, Cornell MATH 6110/4140, UChicago first-year sequence).
const DEPENDENCY_PLAN: Record<string, { tier: number; deps: string[] }> = {
  'arithmetic':              { tier: 0, deps: [] },
  'set-theory':              { tier: 0, deps: [] },
  'algebra':                 { tier: 1, deps: ['arithmetic'] },
  'geometry':                { tier: 2, deps: ['algebra'] },
  'number-theory':           { tier: 2, deps: ['algebra'] },
  'trigonometry':            { tier: 3, deps: ['algebra', 'geometry'] },
  'linear-algebra':          { tier: 3, deps: ['algebra'] },
  'statistics':              { tier: 3, deps: ['algebra'] },
  'abstract-algebra':        { tier: 3, deps: ['algebra', 'set-theory'] },
  'calculus':                { tier: 4, deps: ['algebra', 'trigonometry'] },
  'probability':             { tier: 4, deps: ['statistics'] },
  'category-theory':         { tier: 4, deps: ['linear-algebra', 'abstract-algebra'] },
  'differential-eq':         { tier: 5, deps: ['calculus', 'linear-algebra'] },
  'real-analysis':           { tier: 5, deps: ['calculus', 'set-theory'] },
  'numerical-methods':       { tier: 5, deps: ['calculus', 'linear-algebra'] },
  'complex-analysis':        { tier: 6, deps: ['real-analysis'] },
  'topology':                { tier: 6, deps: ['real-analysis', 'set-theory'] },
  'measure-theory':          { tier: 6, deps: ['real-analysis'] },
  'functional-analysis':     { tier: 7, deps: ['linear-algebra', 'measure-theory'] },
  'algebraic-topology':      { tier: 7, deps: ['topology', 'abstract-algebra'] },
  'differential-geometry':   { tier: 7, deps: ['topology', 'calculus'] },
}

const TIER_LABELS = [
  'Foundations', 'Core Skills', 'Building Blocks', 'Intermediate',
  'Calculus \u0026 Beyond', 'Advanced', 'Graduate-Level', 'Frontier',
]

const NODE_W = 148
const NODE_H = 40
const COL_GAP = 26
const ROW_GAP = 76
const PADDING = 40

export function KnowledgeGraph() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const branchBySlug = useMemo(() => {
    const map: Record<string, (typeof MATH_BRANCHES)[number]> = {}
    MATH_BRANCHES.forEach((b) => { map[b.slug] = b })
    return map
  }, [])

  // Group slugs by tier, in a stable order
  const tiers = useMemo(() => {
    const groups: string[][] = []
    Object.entries(DEPENDENCY_PLAN).forEach(([slug, info]) => {
      if (!groups[info.tier]) groups[info.tier] = []
      groups[info.tier].push(slug)
    })
    return groups
  }, [])

  const maxCols = Math.max(...tiers.map((t) => t.length))
  const width = maxCols * (NODE_W + COL_GAP) - COL_GAP + PADDING * 2
  const height = tiers.length * (NODE_H + ROW_GAP) - ROW_GAP + PADDING * 2

  // Compute a fixed (x, y) position for every node, centering shorter rows.
  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {}
    tiers.forEach((rowSlugs, tierIdx) => {
      const rowWidth = rowSlugs.length * (NODE_W + COL_GAP) - COL_GAP
      const startX = PADDING + (width - PADDING * 2 - rowWidth) / 2
      rowSlugs.forEach((slug, colIdx) => {
        pos[slug] = {
          x: startX + colIdx * (NODE_W + COL_GAP),
          y: PADDING + tierIdx * (NODE_H + ROW_GAP),
        }
      })
    })
    return pos
  }, [tiers, width])

  // Which slugs are connected to the currently hovered/selected node (for highlighting)
  const activeId = hoveredId ?? selectedId
  const relatedSlugs = useMemo(() => {
    if (!activeId) return new Set<string>()
    const set = new Set<string>([activeId])
    DEPENDENCY_PLAN[activeId]?.deps.forEach((d) => set.add(d))
    Object.entries(DEPENDENCY_PLAN).forEach(([slug, info]) => {
      if (info.deps.includes(activeId)) set.add(slug)
    })
    return set
  }, [activeId])

  const selectedBranch = selectedId ? branchBySlug[selectedId] : null

  return (
    <div className="space-y-4">
      <p className="text-xs text-white/40 leading-relaxed">
        Every branch of math builds on others. Hover or tap a branch to see what feeds into it (below) and what
        it unlocks (above). This is a typical ordering — many valid paths exist, and some branches can be
        studied in a different sequence depending on your goals.
      </p>

      <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-auto">
        <svg width={width} height={height} className="block">
          <defs>
            <marker id="kg-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="rgba(255,255,255,0.25)" />
            </marker>
            <marker id="kg-arrow-active" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#a78bfa" />
            </marker>
          </defs>

          {/* Tier background bands + labels */}
          {tiers.map((_, i) => (
            <g key={`tier-${i}`}>
              <text x={PADDING} y={PADDING + i * (NODE_H + ROW_GAP) - 10} fontSize="10" fontFamily="monospace" fill="rgba(255,255,255,0.2)">
                {TIER_LABELS[i] ?? `Tier ${i}`}
              </text>
            </g>
          ))}

          {/* Edges */}
          {Object.entries(DEPENDENCY_PLAN).map(([slug, info]) =>
            info.deps.map((dep) => {
              const p1 = positions[dep]
              const p2 = positions[slug]
              if (!p1 || !p2) return null
              const isActive = activeId && relatedSlugs.has(slug) && relatedSlugs.has(dep)
              const x1 = p1.x + NODE_W / 2
              const y1 = p1.y + NODE_H
              const x2 = p2.x + NODE_W / 2
              const y2 = p2.y
              const midY = (y1 + y2) / 2
              return (
                <path
                  key={`${dep}->${slug}`}
                  d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                  fill="none"
                  stroke={isActive ? '#a78bfa' : 'rgba(255,255,255,0.12)'}
                  strokeWidth={isActive ? 2 : 1.2}
                  markerEnd={isActive ? 'url(#kg-arrow-active)' : 'url(#kg-arrow)'}
                />
              )
            })
          )}

          {/* Nodes */}
          {Object.keys(DEPENDENCY_PLAN).map((slug) => {
            const branch = branchBySlug[slug]
            const p = positions[slug]
            if (!branch || !p) return null
            const isActive = activeId ? relatedSlugs.has(slug) : true
            const isFocus = activeId === slug
            return (
              <g
                key={slug}
                transform={`translate(${p.x}, ${p.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredId(slug)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedId((s) => (s === slug ? null : slug))}
              >
                <rect
                  width={NODE_W} height={NODE_H} rx={8}
                  fill={isFocus ? `${branch.color}33` : 'rgba(255,255,255,0.03)'}
                  stroke={isFocus ? branch.color : isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}
                  strokeWidth={isFocus ? 2 : 1}
                  opacity={activeId && !isActive ? 0.25 : 1}
                />
                <text x={NODE_W / 2} y={NODE_H / 2 + 4} textAnchor="middle" fontSize="11" fontFamily="system-ui"
                  fill={activeId && !isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.8)'}>
                  {branch.name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {selectedBranch && (
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: selectedBranch.color }}>{selectedBranch.name}</p>
            <p className="text-[11px] text-white/30 mt-1">
              {DEPENDENCY_PLAN[selectedBranch.slug].deps.length > 0
                ? `Builds on: ${DEPENDENCY_PLAN[selectedBranch.slug].deps.map((d) => branchBySlug[d]?.name).join(', ')}`
                : 'No prerequisites \u2014 a great starting point.'}
            </p>
          </div>
          <Link
            href={`/learn/${selectedBranch.slug}`}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 transition-all"
          >
            Study this branch →
          </Link>
        </div>
      )}
    </div>
  )
}
