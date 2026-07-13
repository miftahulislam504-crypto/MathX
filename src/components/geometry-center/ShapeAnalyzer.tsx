'use client'
import { useCallback, useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface Point { x: number; y: number }

const VB = 320

function useViewBoxPointer(svgRef: React.RefObject<SVGSVGElement | null>) {
  return useCallback(
    (clientX: number, clientY: number) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      const x = ((clientX - rect.left) / rect.width) * VB
      const y = ((clientY - rect.top) / rect.height) * VB
      return { x: Math.max(16, Math.min(VB - 16, x)), y: Math.max(16, Math.min(VB - 16, y)) }
    },
    [svgRef]
  )
}

function dist(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

function shoelaceArea(points: Point[]): number {
  let sum = 0
  const n = points.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    sum += points[i].x * points[j].y - points[j].x * points[i].y
  }
  return Math.abs(sum) / 2
}

function perimeter(points: Point[]): number {
  let sum = 0
  const n = points.length
  for (let i = 0; i < n; i++) sum += dist(points[i], points[(i + 1) % n])
  return sum
}

function angleAt(p: Point, prev: Point, next: Point): number {
  const v1 = { x: prev.x - p.x, y: prev.y - p.y }
  const v2 = { x: next.x - p.x, y: next.y - p.y }
  const dot = v1.x * v2.x + v1.y * v2.y
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2)
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2)
  if (mag1 === 0 || mag2 === 0) return 0
  const cos = Math.max(-1, Math.min(1, dot / (mag1 * mag2)))
  return (Math.acos(cos) * 180) / Math.PI
}

function classifyShape(points: Point[], angles: number[], sides: number[]): string {
  const n = points.length
  if (n === 3) {
    const sorted = [...sides].sort((a, b) => a - b)
    const isRight = angles.some((a) => Math.abs(a - 90) < 1)
    const isEquilateral = Math.abs(sorted[0] - sorted[2]) < 2
    const isIsosceles = Math.abs(sorted[0] - sorted[1]) < 2 || Math.abs(sorted[1] - sorted[2]) < 2
    if (isEquilateral) return 'Equilateral Triangle'
    if (isRight) return 'Right Triangle'
    if (isIsosceles) return 'Isosceles Triangle'
    return 'Scalene Triangle'
  }
  if (n === 4) {
    const allRight = angles.every((a) => Math.abs(a - 90) < 2)
    const sorted = [...sides].sort((a, b) => a - b)
    const allEqualSides = Math.abs(sorted[0] - sorted[3]) < 2
    if (allRight && allEqualSides) return 'Square'
    if (allRight) return 'Rectangle'
    if (allEqualSides) return 'Rhombus'
    return 'Quadrilateral'
  }
  if (n === 5) return 'Pentagon'
  if (n === 6) return 'Hexagon'
  return `${n}-gon`
}

const DEFAULT_SHAPE: Point[] = [
  { x: 80, y: 220 }, { x: 240, y: 220 }, { x: 240, y: 60 }, { x: 80, y: 60 },
]

export function ShapeAnalyzer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVB = useViewBoxPointer(svgRef)
  const [points, setPoints] = useState<Point[]>(DEFAULT_SHAPE)
  const [dragging, setDragging] = useState<number | null>(null)
  const [addMode, setAddMode] = useState(false)

  const handleMove = (clientX: number, clientY: number) => {
    if (dragging === null) return
    const p = toVB(clientX, clientY)
    setPoints((prev) => prev.map((pt, i) => (i === dragging ? p : pt)))
  }

  const addPoint = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!addMode) return
    const p = toVB(e.clientX, e.clientY)
    setPoints((prev) => [...prev, p])
  }

  const removeLastPoint = () => {
    if (points.length > 3) setPoints((prev) => prev.slice(0, -1))
  }

  const reset = () => setPoints(DEFAULT_SHAPE)

  const n = points.length
  const area = n >= 3 ? shoelaceArea(points) : 0
  const perim = n >= 3 ? perimeter(points) : 0
  const angles = n >= 3 ? points.map((p, i) => angleAt(p, points[(i - 1 + n) % n], points[(i + 1) % n])) : []
  const sides = n >= 3 ? points.map((p, i) => dist(p, points[(i + 1) % n])) : []
  const angleSum = angles.reduce((a, b) => a + b, 0)
  const expectedAngleSum = (n - 2) * 180
  const classification = n >= 3 ? classifyShape(points, angles, sides) : '—'
  const isConvex = n >= 3 && Math.abs(angleSum - expectedAngleSum) < 2

  // Scale factor: viewBox units to "real" units, arbitrary but consistent (1 unit = 20px)
  const SCALE = 20

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag any vertex to reshape the polygon. Toggle &ldquo;Add Point&rdquo; and click inside the canvas to add
        new vertices.
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => setAddMode((m) => !m)}
          className={`flex-1 flex items-center justify-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all ${addMode ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'border-white/8 text-white/40'}`}
        >
          <Plus className="w-3.5 h-3.5" /> {addMode ? 'Click canvas to add point' : 'Add Point'}
        </button>
        <button onClick={removeLastPoint} disabled={points.length <= 3} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-white/8 text-white/40 hover:text-rose-400 hover:border-rose-500/30 disabled:opacity-30 transition-all">
          <Trash2 className="w-3.5 h-3.5" /> Remove Last
        </button>
        <button onClick={reset} className="text-xs px-3 py-2 rounded-lg border border-white/8 text-white/40 hover:text-white/70 transition-all">
          Reset
        </button>
      </div>

      <div
        className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b] touch-none select-none"
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={() => setDragging(null)}
        onMouseLeave={() => setDragging(null)}
        onTouchMove={(e) => { const t = e.touches[0]; handleMove(t.clientX, t.clientY) }}
        onTouchEnd={() => setDragging(null)}
      >
        <svg ref={svgRef} viewBox={`0 0 ${VB} ${VB}`} className="w-full aspect-square" onClick={addPoint}>
          <rect width={VB} height={VB} fill="#09090b" />
          <polygon
            points={points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill={isConvex ? '#7c3aed22' : '#f4304422'}
            stroke={isConvex ? '#a78bfa' : '#f87171'}
            strokeWidth="2.5"
          />
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x} cy={p.y} r={dragging === i ? 9 : 7}
                fill={dragging === i ? '#f59e0b' : '#a78bfa'}
                stroke="#09090b" strokeWidth="2"
                className="cursor-grab"
                onMouseDown={(e) => { e.stopPropagation(); setDragging(i) }}
                onTouchStart={(e) => { e.stopPropagation(); setDragging(i) }}
              />
              {angles[i] !== undefined && (
                <text x={p.x} y={p.y - 14} fontSize="9" fill="#67e8f9" fontFamily="monospace" textAnchor="middle">
                  {angles[i].toFixed(0)}°
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {!isConvex && n >= 3 && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2 text-center">
          This polygon is self-intersecting or non-convex — area/angle values may not be meaningful. Try reshaping it.
        </p>
      )}

      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-center">
        <p className="text-[10px] uppercase tracking-wider text-violet-400/70 mb-1">Classification</p>
        <p className="text-lg font-semibold text-violet-300">{classification}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Vertices</p>
          <p className="text-lg font-mono text-white/70">{n}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Area</p>
          <p className="text-lg font-mono text-cyan-400">{(area / SCALE ** 2).toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Perimeter</p>
          <p className="text-lg font-mono text-emerald-400">{(perim / SCALE).toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Angle Sum</p>
          <p className="text-lg font-mono text-amber-400">{angleSum.toFixed(0)}°</p>
        </div>
      </div>

      <p className="text-[11px] text-white/25 text-center">
        Expected angle sum for {n} sides: (n−2)×180° = {expectedAngleSum}°
      </p>
    </div>
  )
}
