'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

// ── Shape generators: each returns N points around a closed curve ──────────
function circlePoints(n: number, r: number, cx: number, cy: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number]
  })
}

function squarePoints(n: number, s: number, cx: number, cy: number) {
  // Walk the perimeter of a square with n evenly spaced points
  const pts: [number, number][] = []
  const perim = 8 * s
  for (let i = 0; i < n; i++) {
    const d = (i / n) * perim
    let x = 0, y = 0
    if (d < 2 * s) { x = -s + d; y = -s }
    else if (d < 4 * s) { x = s; y = -s + (d - 2 * s) }
    else if (d < 6 * s) { x = s - (d - 4 * s); y = s }
    else { x = -s; y = s - (d - 6 * s) }
    pts.push([cx + x, cy + y])
  }
  return pts
}

function blobPoints(n: number, r: number, cx: number, cy: number, wobble: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    const rr = r + Math.sin(a * 3) * wobble
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)] as [number, number]
  })
}

function ellipsePoints(n: number, rx: number, ry: number, cx: number, cy: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as [number, number]
  })
}

const N_POINTS = 64

const SHAPES: Record<string, (cx: number, cy: number) => [number, number][]> = {
  circle: (cx, cy) => circlePoints(N_POINTS, 90, cx, cy),
  square: (cx, cy) => squarePoints(N_POINTS, 85, cx, cy),
  blob:   (cx, cy) => blobPoints(N_POINTS, 90, cx, cy, 22),
  ellipse:(cx, cy) => ellipsePoints(N_POINTS, 130, 60, cx, cy),
}

const SHAPE_ORDER = ['circle', 'square', 'blob', 'ellipse'] as const
type ShapeKey = typeof SHAPE_ORDER[number]

const SURFACES: { name: string; genus: number; euler: number; desc: string }[] = [
  { name: 'Sphere',        genus: 0, euler: 2,  desc: 'A ball\'s surface. No holes — every loop drawn on it can shrink to a point.' },
  { name: 'Torus',         genus: 1, euler: 0,  desc: 'A donut\'s surface. One hole — a loop around the hole cannot shrink to a point.' },
  { name: 'Double Torus',  genus: 2, euler: -2, desc: 'A figure-eight-shaped donut. Two holes — two independent non-shrinkable loop types.' },
  { name: 'Triple Torus',  genus: 3, euler: -4, desc: 'Three holes fused into one surface. Genus grows, Euler characteristic drops further.' },
]

export function TopologyMorph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ width: 500, height: 380 })
  const [shapeIndex, setShapeIndex] = useState(0)
  const [morphT, setMorphT] = useState(0) // 0 = current shape, 1 = next shape
  const [animating, setAnimating] = useState(false)
  const [selectedSurface, setSelectedSurface] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      setDims({ width: Math.max(280, w), height: Math.max(280, Math.min(400, w * 0.72)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Animate morph from shapeIndex -> shapeIndex+1 when "animating" is triggered
  useEffect(() => {
    if (!animating) return
    let raf: number
    const start = performance.now()
    const duration = 1400
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setMorphT(t)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setAnimating(false)
        setShapeIndex((i) => (i + 1) % SHAPE_ORDER.length)
        setMorphT(0)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animating])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const W = dims.width, H = dims.height
    const cx = W / 2, cy = H / 2

    const g = svg.attr('width', W).attr('height', H).append('g')
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    const fromKey = SHAPE_ORDER[shapeIndex]
    const toKey = SHAPE_ORDER[(shapeIndex + 1) % SHAPE_ORDER.length]
    const fromPts = SHAPES[fromKey](cx, cy)
    const toPts = SHAPES[toKey](cx, cy)

    const interp = fromPts.map(([x, y], i) => {
      const [tx, ty] = toPts[i]
      return [x + (tx - x) * morphT, y + (ty - y) * morphT] as [number, number]
    })

    const line = d3.line().curve(d3.curveCatmullRomClosed.alpha(0.5))

    g.append('path')
      .attr('d', line(interp))
      .attr('fill', '#7c3aed22')
      .attr('stroke', '#a78bfa')
      .attr('stroke-width', 2.5)

    // Vertex dots to make the point-correspondence during morph visible
    interp.forEach(([x, y], i) => {
      if (i % 8 !== 0) return
      g.append('circle').attr('cx', x).attr('cy', y).attr('r', 3).attr('fill', '#22d3ee')
    })

    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-width', 1)

  }, [dims, shapeIndex, morphT])

  const fromLabel = SHAPE_ORDER[shapeIndex]
  const toLabel = SHAPE_ORDER[(shapeIndex + 1) % SHAPE_ORDER.length]
  const surface = SURFACES[selectedSurface]

  return (
    <div className="space-y-6">
      {/* Morph canvas */}
      <div>
        <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
          <svg ref={svgRef} className="w-full" />
        </div>
        <div className="flex items-center justify-between mt-4 gap-4">
          <p className="text-xs text-white/40 font-mono">
            {fromLabel} → {toLabel} <span className="text-white/20">({Math.round(morphT * 100)}%)</span>
          </p>
          <button
            onClick={() => setAnimating(true)}
            disabled={animating}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2 text-sm font-semibold text-white transition-all"
          >
            {animating ? 'Morphing…' : 'Morph Shape →'}
          </button>
        </div>
        <p className="text-xs text-white/35 leading-relaxed mt-3">
          A circle, square, and blob are <span className="text-violet-300">topologically equivalent</span> —
          each can be continuously stretched into the others without cutting or gluing. This is a
          <span className="text-violet-300"> homeomorphism</span>: the property topology actually studies,
          ignoring exact distances and angles.
        </p>
      </div>

      {/* Genus / Euler characteristic explorer */}
      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-4 font-mono">Genus & Euler Characteristic</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {SURFACES.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setSelectedSurface(i)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                selectedSurface === i
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                  : 'border-white/8 text-white/40 hover:text-white/70'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Simple genus visual: n loops on a torus-like blob */}
        <div className="flex items-center justify-center py-6">
          <svg width="220" height="120" viewBox="0 0 220 120">
            <ellipse cx="110" cy="60" rx="95" ry="45" fill="#0ea5e922" stroke="#38bdf8" strokeWidth="2" />
            {Array.from({ length: surface.genus }).map((_, i) => {
              const holeX = surface.genus === 1 ? 110 : 55 + i * (110 / Math.max(1, surface.genus - 1))
              return (
                <ellipse
                  key={i}
                  cx={surface.genus === 1 ? 110 : holeX}
                  cy="60"
                  rx="14"
                  ry="22"
                  fill="#09090b"
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                />
              )
            })}
            {surface.genus === 0 && (
              <circle cx="110" cy="60" r="3" fill="#7dd3fc" opacity="0.6" />
            )}
          </svg>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 text-center mb-4">
          <div className="rounded-lg bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Genus (g)</p>
            <p className="text-xl font-mono text-cyan-400">{surface.genus}</p>
          </div>
          <div className="rounded-lg bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Euler Char. (χ)</p>
            <p className="text-xl font-mono text-violet-400">{surface.euler}</p>
          </div>
          <div className="rounded-lg bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Formula</p>
            <p className="text-sm font-mono text-white/60 mt-1.5">χ = 2 − 2g</p>
          </div>
        </div>
        <p className="text-xs text-white/45 leading-relaxed">{surface.desc}</p>
      </div>
    </div>
  )
}
