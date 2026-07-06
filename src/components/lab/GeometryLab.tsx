'use client'
import { useCallback, useRef, useState } from 'react'
import { Triangle, Circle, Hexagon, type LucideIcon } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type ExpType = 'triangle' | 'circle' | 'polygon'

const VB = 320 // shared square viewBox size for all sub-experiments

// ── Shared: convert a pointer/touch event to viewBox coordinates ──────────
function useViewBoxPointer(svgRef: React.RefObject<SVGSVGElement | null>) {
  return useCallback(
    (clientX: number, clientY: number) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      const x = ((clientX - rect.left) / rect.width) * VB
      const y = ((clientY - rect.top) / rect.height) * VB
      return { x: Math.max(10, Math.min(VB - 10, x)), y: Math.max(10, Math.min(VB - 10, y)) }
    },
    [svgRef]
  )
}

// ── Triangle Explorer ────────────────────────────────────────────────────
function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function angleAt(p: { x: number; y: number }, q1: { x: number; y: number }, q2: { x: number; y: number }) {
  const v1 = { x: q1.x - p.x, y: q1.y - p.y }
  const v2 = { x: q2.x - p.x, y: q2.y - p.y }
  const dot = v1.x * v2.x + v1.y * v2.y
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2)
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2)
  if (mag1 === 0 || mag2 === 0) return 0
  const cos = Math.max(-1, Math.min(1, dot / (mag1 * mag2)))
  return (Math.acos(cos) * 180) / Math.PI
}

function TriangleExplorer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVB = useViewBoxPointer(svgRef)
  const [pts, setPts] = useState([
    { x: 90, y: 240 },
    { x: 230, y: 240 },
    { x: 160, y: 80 },
  ])
  const [dragging, setDragging] = useState<number | null>(null)

  const startDrag = (i: number) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setDragging(i)
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (dragging === null) return
    const p = toVB(clientX, clientY)
    setPts((prev) => prev.map((pt, i) => (i === dragging ? p : pt)))
  }

  const sideA = dist(pts[1], pts[2]) // opposite vertex 0
  const sideB = dist(pts[0], pts[2]) // opposite vertex 1
  const sideC = dist(pts[0], pts[1]) // opposite vertex 2
  const angleA = angleAt(pts[0], pts[1], pts[2])
  const angleB = angleAt(pts[1], pts[0], pts[2])
  const angleC = angleAt(pts[2], pts[0], pts[1])
  const area = Math.abs((pts[0].x * (pts[1].y - pts[2].y) + pts[1].x * (pts[2].y - pts[0].y) + pts[2].x * (pts[0].y - pts[1].y)) / 2)
  const perimeter = sideA + sideB + sideC
  const angleSum = angleA + angleB + angleC

  const isDegenerate = area < 4 // vertices nearly collinear

  let triangleType = 'Scalene'
  const sides = [sideA, sideB, sideC].sort((x, y) => x - y)
  if (Math.abs(sides[0] - sides[2]) < 3) triangleType = 'Equilateral'
  else if (Math.abs(sides[0] - sides[1]) < 3 || Math.abs(sides[1] - sides[2]) < 3) triangleType = 'Isosceles'
  const maxAngle = Math.max(angleA, angleB, angleC)
  let angleType = 'Acute'
  if (maxAngle > 95) angleType = 'Obtuse'
  else if (maxAngle > 85 && maxAngle < 95) angleType = 'Right'

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag any vertex. Angles, sides, and area update live — notice the three angles always sum to 180°,
        no matter the shape.
      </p>

      <div
        className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b] touch-none select-none"
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={() => setDragging(null)}
        onMouseLeave={() => setDragging(null)}
        onTouchMove={(e) => { const t = e.touches[0]; handleMove(t.clientX, t.clientY) }}
        onTouchEnd={() => setDragging(null)}
      >
        <svg ref={svgRef} viewBox={`0 0 ${VB} ${VB}`} className="w-full aspect-square">
          <rect width={VB} height={VB} fill="#09090b" />
          <polygon
            points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill={isDegenerate ? '#ef444422' : '#7c3aed22'}
            stroke={isDegenerate ? '#f87171' : '#a78bfa'}
            strokeWidth="2.5"
          />
          {/* side labels */}
          {[
            { mid: { x: (pts[1].x + pts[2].x) / 2, y: (pts[1].y + pts[2].y) / 2 }, val: sideA },
            { mid: { x: (pts[0].x + pts[2].x) / 2, y: (pts[0].y + pts[2].y) / 2 }, val: sideB },
            { mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }, val: sideC },
          ].map((s, i) => (
            <text key={i} x={s.mid.x} y={s.mid.y} fontSize="10" fontFamily="monospace" fill="#67e8f9" textAnchor="middle" dy="-4">
              {(s.val / 20).toFixed(1)}
            </text>
          ))}
          {/* vertices */}
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y} r={dragging === i ? 10 : 8}
              fill={dragging === i ? '#f59e0b' : '#a78bfa'}
              stroke="#09090b" strokeWidth="2"
              className="cursor-grab active:cursor-grabbing"
              onMouseDown={startDrag(i)}
              onTouchStart={startDrag(i)}
            />
          ))}
        </svg>
      </div>

      {isDegenerate && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2">
          Vertices are nearly collinear — this is not a valid triangle.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Angle Sum</p>
          <p className="text-lg font-mono text-violet-400">{angleSum.toFixed(1)}°</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Area</p>
          <p className="text-lg font-mono text-cyan-400">{(area / 400).toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Perimeter</p>
          <p className="text-lg font-mono text-emerald-400">{(perimeter / 20).toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Type</p>
          <p className="text-xs font-mono text-amber-400 mt-1.5">{triangleType} · {angleType}</p>
        </div>
      </div>
    </div>
  )
}

// ── Inscribed Angle Theorem ─────────────────────────────────────────────
function CircleTheorems() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVB = useViewBoxPointer(svgRef)
  const cx = VB / 2, cy = VB / 2, r = 110
  const [pointAngleDeg, setPointAngleDeg] = useState(50) // where the "P" point sits on the circle
  const [dragging, setDragging] = useState(false)
  // Fixed chord endpoints A and B on the circle
  const angleA = 200, angleB = 340

  const toXY = (deg: number) => ({
    x: cx + r * Math.cos((deg * Math.PI) / 180),
    y: cy + r * Math.sin((deg * Math.PI) / 180),
  })

  const A = toXY(angleA)
  const B = toXY(angleB)
  const P = toXY(pointAngleDeg)
  const center = { x: cx, y: cy }

  const inscribedAngle = angleAt(P, A, B)
  const centralAngle = angleAt(center, A, B) // the angle AOB not containing P's arc — approximate via reflex check
  // Use the arc AB that does NOT contain P to get the correct central angle relationship
  const arcAB = Math.abs(angleB - angleA) <= 180 ? Math.abs(angleB - angleA) : 360 - Math.abs(angleB - angleA)

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging) return
    const p = toVB(clientX, clientY)
    const deg = (Math.atan2(p.y - cy, p.x - cx) * 180) / Math.PI
    // keep P on the major arc (not between A and B on the minor side) for a clean demo
    let normalized = deg < 0 ? deg + 360 : deg
    if (normalized > angleA - 5 && normalized < angleB + 5 && !(normalized > angleB || normalized < angleA)) {
      // clamp away from the chord's minor arc
      normalized = normalized < (angleA + angleB) / 2 ? angleA - 5 : angleB + 5
    }
    setPointAngleDeg(normalized)
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag point <span className="text-amber-400 font-mono">P</span> anywhere on the outer arc. The{' '}
        <span className="text-violet-300">inscribed angle</span> stays exactly half the{' '}
        <span className="text-cyan-300">central angle</span> — this is the Inscribed Angle Theorem.
      </p>

      <div
        className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b] touch-none select-none"
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchMove={(e) => { const t = e.touches[0]; handleMove(t.clientX, t.clientY) }}
        onTouchEnd={() => setDragging(false)}
      >
        <svg ref={svgRef} viewBox={`0 0 ${VB} ${VB}`} className="w-full aspect-square">
          <rect width={VB} height={VB} fill="#09090b" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          {/* central angle lines */}
          <line x1={cx} y1={cy} x2={A.x} y2={A.y} stroke="#22d3ee" strokeWidth="2" />
          <line x1={cx} y1={cy} x2={B.x} y2={B.y} stroke="#22d3ee" strokeWidth="2" />
          {/* inscribed angle lines */}
          <line x1={P.x} y1={P.y} x2={A.x} y2={A.y} stroke="#a78bfa" strokeWidth="2" />
          <line x1={P.x} y1={P.y} x2={B.x} y2={B.y} stroke="#a78bfa" strokeWidth="2" />
          {/* chord AB */}
          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4,3" />

          <circle cx={A.x} cy={A.y} r="5" fill="#22d3ee" />
          <circle cx={B.x} cy={B.y} r="5" fill="#22d3ee" />
          <circle cx={cx} cy={cy} r="4" fill="#67e8f9" />
          <circle
            cx={P.x} cy={P.y} r={dragging ? 10 : 8}
            fill={dragging ? '#fbbf24' : '#f59e0b'}
            stroke="#09090b" strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => { e.preventDefault(); setDragging(true) }}
            onTouchStart={(e) => { e.preventDefault(); setDragging(true) }}
          />
          <text x={A.x} y={A.y - 10} fontSize="12" fill="#67e8f9" fontFamily="monospace" textAnchor="middle">A</text>
          <text x={B.x} y={B.y - 10} fontSize="12" fill="#67e8f9" fontFamily="monospace" textAnchor="middle">B</text>
          <text x={P.x} y={P.y - 14} fontSize="12" fill="#fbbf24" fontFamily="monospace" textAnchor="middle">P</text>
          <text x={cx} y={cy + 18} fontSize="10" fill="#67e8f9" fontFamily="monospace" textAnchor="middle">O</text>
        </svg>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Inscribed ∠APB</p>
          <p className="text-lg font-mono text-violet-400">{inscribedAngle.toFixed(1)}°</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Central ∠AOB</p>
          <p className="text-lg font-mono text-cyan-400">{arcAB.toFixed(1)}°</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Ratio</p>
          <p className="text-lg font-mono text-emerald-400">{(arcAB / Math.max(0.1, inscribedAngle)).toFixed(2)}×</p>
        </div>
      </div>
    </div>
  )
}

// ── Polygon Angle Sum ────────────────────────────────────────────────────
function PolygonAngleSum() {
  const [n, setN] = useState(6)
  const cx = VB / 2, cy = VB / 2, r = 120

  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  })

  const interiorSum = (n - 2) * 180
  const interiorEach = interiorSum / n
  const exteriorEach = 360 / n

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag the slider to change the number of sides. Every convex polygon&apos;s interior angles sum to{' '}
        <span className="text-violet-300 font-mono">(n − 2) × 180°</span> — triangulating from one vertex shows why.
      </p>

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg viewBox={`0 0 ${VB} ${VB}`} className="w-full aspect-square">
          <rect width={VB} height={VB} fill="#09090b" />
          {/* triangulation fan from vertex 0 */}
          {n > 3 && pts.slice(1, -1).map((p, i) => (
            <line
              key={i}
              x1={pts[0].x} y1={pts[0].y} x2={p.x} y2={p.y}
              stroke="rgba(167,139,250,0.25)" strokeWidth="1" strokeDasharray="3,3"
            />
          ))}
          <polygon
            points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="#7c3aed1a" stroke="#a78bfa" strokeWidth="2.5"
          />
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="5" fill={i === 0 ? '#f59e0b' : '#a78bfa'} />
          ))}
        </svg>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-white/40">Sides (n)</span>
          <span className="text-white/70 font-mono">{n}</span>
        </div>
        <input
          type="range" min={3} max={12} step={1} value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="w-full accent-violet-500"
        />
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer latex={`\\text{Interior sum} = (n-2) \\times 180° = ${n - 2} \\times 180° = ${interiorSum}°`} display />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Triangles Formed</p>
          <p className="text-lg font-mono text-amber-400">{n - 2}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Each Interior ∠</p>
          <p className="text-lg font-mono text-violet-400">{interiorEach.toFixed(1)}°</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Each Exterior ∠</p>
          <p className="text-lg font-mono text-cyan-400">{exteriorEach.toFixed(1)}°</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Lab Component ────────────────────────────────────────────────────
export function GeometryLab() {
  const [exp, setExp] = useState<ExpType>('triangle')

  const EXPS: { id: ExpType; label: string; icon: LucideIcon }[] = [
    { id: 'triangle', label: 'Triangle Explorer', icon: Triangle },
    { id: 'circle', label: 'Inscribed Angle', icon: Circle },
    { id: 'polygon', label: 'Polygon Angle Sum', icon: Hexagon },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {EXPS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setExp(id)}
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all ${
              exp === id
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {exp === 'triangle' && <TriangleExplorer />}
      {exp === 'circle' && <CircleTheorems />}
      {exp === 'polygon' && <PolygonAngleSum />}
    </div>
  )
}
