'use client'
import { useCallback, useRef, useState } from 'react'
import { Compass } from 'lucide-react'

type ConstructionType = 'perpendicular-bisector' | 'angle-bisector' | 'perpendicular-from-point'

interface Point { x: number; y: number }

const VB = 340

function useViewBoxPointer(svgRef: React.RefObject<SVGSVGElement | null>) {
  return useCallback(
    (clientX: number, clientY: number) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      const x = ((clientX - rect.left) / rect.width) * VB
      const y = ((clientY - rect.top) / rect.height) * VB
      return { x: Math.max(20, Math.min(VB - 20, x)), y: Math.max(20, Math.min(VB - 20, y)) }
    },
    [svgRef]
  )
}

function dist(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

// ── Perpendicular Bisector ─────────────────────────────────────────────
// Classical method: draw two equal-radius arcs centered at A and B (radius
// greater than half |AB|); their two intersection points define the
// perpendicular bisector line.
function PerpendicularBisector() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVB = useViewBoxPointer(svgRef)
  const [A, setA] = useState<Point>({ x: 100, y: 200 })
  const [B, setB] = useState<Point>({ x: 240, y: 200 })
  const [dragging, setDragging] = useState<'A' | 'B' | null>(null)
  const [step, setStep] = useState(0) // 0=points only, 1=arc from A, 2=arc from B, 3=bisector line

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging) return
    const p = toVB(clientX, clientY)
    if (dragging === 'A') setA(p)
    else setB(p)
  }

  const abDist = dist(A, B)
  const arcRadius = Math.max(abDist * 0.75, abDist / 2 + 20) // always > half |AB|, per the classical requirement

  // Compute the two arc-intersection points (the actual construction result)
  const midAB = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }
  const dirX = B.x - A.x, dirY = B.y - A.y
  const perpX = -dirY, perpY = dirX
  const perpLen = Math.sqrt(perpX ** 2 + perpY ** 2) || 1
  const h = Math.sqrt(Math.max(0, arcRadius ** 2 - (abDist / 2) ** 2))
  const P1 = { x: midAB.x + (perpX / perpLen) * h, y: midAB.y + (perpY / perpLen) * h }
  const P2 = { x: midAB.x - (perpX / perpLen) * h, y: midAB.y - (perpY / perpLen) * h }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag points A and B. The classical method: draw equal-radius arcs centered at each point (radius greater
        than half |AB|) — their two intersections define the perpendicular bisector.
      </p>

      <div className="flex gap-2">
        {[0, 1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 text-xs py-2 rounded-lg border transition-all ${step === s ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'border-white/8 text-white/40'}`}
          >
            Step {s}
          </button>
        ))}
      </div>

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
          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#a78bfa" strokeWidth="2" />

          {step >= 1 && (
            <circle cx={A.x} cy={A.y} r={arcRadius} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,3" />
          )}
          {step >= 2 && (
            <circle cx={B.x} cy={B.y} r={arcRadius} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
          )}
          {step >= 3 && (
            <>
              <line x1={P1.x} y1={P1.y} x2={P2.x} y2={P2.y} stroke="#34d399" strokeWidth="2.5" />
              <circle cx={P1.x} cy={P1.y} r="4" fill="#34d399" />
              <circle cx={P2.x} cy={P2.y} r="4" fill="#34d399" />
            </>
          )}

          <circle cx={A.x} cy={A.y} r={dragging === 'A' ? 9 : 7} fill="#22d3ee" stroke="#09090b" strokeWidth="2" className="cursor-grab" onMouseDown={() => setDragging('A')} onTouchStart={() => setDragging('A')} />
          <circle cx={B.x} cy={B.y} r={dragging === 'B' ? 9 : 7} fill="#f59e0b" stroke="#09090b" strokeWidth="2" className="cursor-grab" onMouseDown={() => setDragging('B')} onTouchStart={() => setDragging('B')} />
          <text x={A.x - 14} y={A.y + 5} fontSize="12" fill="#22d3ee" fontFamily="monospace">A</text>
          <text x={B.x + 10} y={B.y + 5} fontSize="12" fill="#f59e0b" fontFamily="monospace">B</text>
        </svg>
      </div>

      {step >= 3 && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-center">
          Every point on the green line is equidistant from A and B — that&apos;s the defining property of a perpendicular bisector.
        </p>
      )}
    </div>
  )
}

// ── Angle Bisector ─────────────────────────────────────────────────────
// Classical method: draw an arc centered at the vertex crossing both rays,
// then draw two equal-radius arcs from those crossing points — their
// intersection, connected to the vertex, is the angle bisector.
function AngleBisectorConstruction() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVB = useViewBoxPointer(svgRef)
  const [O, setO] = useState<Point>({ x: 100, y: 240 })
  const [A, setA] = useState<Point>({ x: 240, y: 240 })
  const [C, setC] = useState<Point>({ x: 160, y: 100 })
  const [dragging, setDragging] = useState<'O' | 'A' | 'C' | null>(null)
  const [step, setStep] = useState(0)

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging) return
    const p = toVB(clientX, clientY)
    if (dragging === 'O') setO(p)
    else if (dragging === 'A') setA(p)
    else setC(p)
  }

  const r1 = Math.min(dist(O, A), dist(O, C)) * 0.7
  const dirOA = { x: (A.x - O.x) / dist(O, A), y: (A.y - O.y) / dist(O, A) }
  const dirOC = { x: (C.x - O.x) / dist(O, C), y: (C.y - O.y) / dist(O, C) }
  const P = { x: O.x + dirOA.x * r1, y: O.y + dirOA.y * r1 }
  const Q = { x: O.x + dirOC.x * r1, y: O.y + dirOC.y * r1 }

  const r2 = dist(P, Q) * 0.8
  // Bisector direction: midpoint of P,Q extended from O (equivalent to averaging unit vectors)
  const bisectorDir = { x: dirOA.x + dirOC.x, y: dirOA.y + dirOC.y }
  const bisectorLen = Math.sqrt(bisectorDir.x ** 2 + bisectorDir.y ** 2) || 1
  const bisectorEnd = { x: O.x + (bisectorDir.x / bisectorLen) * 140, y: O.y + (bisectorDir.y / bisectorLen) * 140 }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag O (vertex), A and C (ray endpoints). Classical method: arc from O crosses both rays at equal
        distance, then equal-radius arcs from those points intersect — connecting O to that intersection bisects the angle.
      </p>

      <div className="flex gap-2">
        {[0, 1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 text-xs py-2 rounded-lg border transition-all ${step === s ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'border-white/8 text-white/40'}`}
          >
            Step {s}
          </button>
        ))}
      </div>

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
          <line x1={O.x} y1={O.y} x2={A.x} y2={A.y} stroke="#a78bfa" strokeWidth="2" />
          <line x1={O.x} y1={O.y} x2={C.x} y2={C.y} stroke="#a78bfa" strokeWidth="2" />

          {step >= 1 && (
            <path d={`M ${P.x} ${P.y} A ${r1} ${r1} 0 0 0 ${Q.x} ${Q.y}`} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,3" />
          )}
          {step >= 2 && (
            <>
              <circle cx={P.x} cy={P.y} r={r2} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
              <circle cx={Q.x} cy={Q.y} r={r2} fill="none" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
            </>
          )}
          {step >= 3 && (
            <line x1={O.x} y1={O.y} x2={bisectorEnd.x} y2={bisectorEnd.y} stroke="#34d399" strokeWidth="2.5" />
          )}

          <circle cx={O.x} cy={O.y} r={dragging === 'O' ? 9 : 7} fill="#a78bfa" stroke="#09090b" strokeWidth="2" className="cursor-grab" onMouseDown={() => setDragging('O')} onTouchStart={() => setDragging('O')} />
          <circle cx={A.x} cy={A.y} r={dragging === 'A' ? 8 : 6} fill="#22d3ee" stroke="#09090b" strokeWidth="2" className="cursor-grab" onMouseDown={() => setDragging('A')} onTouchStart={() => setDragging('A')} />
          <circle cx={C.x} cy={C.y} r={dragging === 'C' ? 8 : 6} fill="#f59e0b" stroke="#09090b" strokeWidth="2" className="cursor-grab" onMouseDown={() => setDragging('C')} onTouchStart={() => setDragging('C')} />
          <text x={O.x - 16} y={O.y + 5} fontSize="12" fill="#a78bfa" fontFamily="monospace">O</text>
        </svg>
      </div>

      {step >= 3 && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-center">
          The green ray splits the angle into two exactly equal halves — no protractor needed.
        </p>
      )}
    </div>
  )
}

// ── Perpendicular From a Point ───────────────────────────────────────────
// Classical method: draw an arc centered at the point crossing the line at
// two spots, then the perpendicular bisector of those two spots passes
// through the original point and is perpendicular to the line.
function PerpendicularFromPoint() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVB = useViewBoxPointer(svgRef)
  const [A, setA] = useState<Point>({ x: 60, y: 240 })
  const [B, setB] = useState<Point>({ x: 280, y: 240 })
  const [P, setP] = useState<Point>({ x: 170, y: 100 })
  const [dragging, setDragging] = useState<'A' | 'B' | 'P' | null>(null)
  const [step, setStep] = useState(0)

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging) return
    const pt = toVB(clientX, clientY)
    if (dragging === 'A') setA(pt)
    else if (dragging === 'B') setB(pt)
    else setP(pt)
  }

  // Project P onto line AB to find distance, then pick a radius larger than that
  const lineLen = dist(A, B)
  const dirX = (B.x - A.x) / lineLen, dirY = (B.y - A.y) / lineLen
  const APx = P.x - A.x, APy = P.y - A.y
  const projLen = APx * dirX + APy * dirY
  const foot = { x: A.x + dirX * projLen, y: A.y + dirY * projLen }
  const perpDist = dist(P, foot)
  const radius = perpDist * 1.6 + 20

  // circle centered at P, radius `radius`, intersecting line AB at two points
  const h = Math.sqrt(Math.max(0, radius ** 2 - perpDist ** 2))
  const X1 = { x: foot.x - dirX * h, y: foot.y - dirY * h }
  const X2 = { x: foot.x + dirX * h, y: foot.y + dirY * h }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag point P (off the line) and line endpoints A, B. Classical method: an arc from P crosses the line
        twice — the line through P and the midpoint of those crossings is the perpendicular.
      </p>

      <div className="flex gap-2">
        {[0, 1, 2].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 text-xs py-2 rounded-lg border transition-all ${step === s ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'border-white/8 text-white/40'}`}
          >
            Step {s}
          </button>
        ))}
      </div>

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
          <line x1={A.x - (B.x - A.x) * 0.3} y1={A.y - (B.y - A.y) * 0.3} x2={B.x + (B.x - A.x) * 0.3} y2={B.y + (B.y - A.y) * 0.3} stroke="#a78bfa" strokeWidth="2" />

          {step >= 1 && (
            <circle cx={P.x} cy={P.y} r={radius} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,3" />
          )}
          {step >= 2 && (
            <>
              <line x1={P.x} y1={P.y} x2={foot.x} y2={foot.y} stroke="#34d399" strokeWidth="2.5" />
              <rect x={foot.x - 6} y={foot.y - 6} width="12" height="12" fill="none" stroke="#34d399" strokeWidth="1.5" transform={`rotate(${Math.atan2(dirY, dirX) * 180 / Math.PI} ${foot.x} ${foot.y})`} />
              <circle cx={X1.x} cy={X1.y} r="4" fill="#f59e0b" />
              <circle cx={X2.x} cy={X2.y} r="4" fill="#f59e0b" />
            </>
          )}

          <circle cx={P.x} cy={P.y} r={dragging === 'P' ? 9 : 7} fill="#22d3ee" stroke="#09090b" strokeWidth="2" className="cursor-grab" onMouseDown={() => setDragging('P')} onTouchStart={() => setDragging('P')} />
          <circle cx={A.x} cy={A.y} r={dragging === 'A' ? 8 : 6} fill="#a78bfa" stroke="#09090b" strokeWidth="2" className="cursor-grab" onMouseDown={() => setDragging('A')} onTouchStart={() => setDragging('A')} />
          <circle cx={B.x} cy={B.y} r={dragging === 'B' ? 8 : 6} fill="#a78bfa" stroke="#09090b" strokeWidth="2" className="cursor-grab" onMouseDown={() => setDragging('B')} onTouchStart={() => setDragging('B')} />
          <text x={P.x + 10} y={P.y} fontSize="12" fill="#22d3ee" fontFamily="monospace">P</text>
        </svg>
      </div>

      {step >= 2 && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-center">
          The green segment meets the line at exactly 90° — the small square marks the right angle.
        </p>
      )}
    </div>
  )
}

export function ConstructionTools() {
  const [type, setType] = useState<ConstructionType>('perpendicular-bisector')

  const TYPES: { id: ConstructionType; label: string }[] = [
    { id: 'perpendicular-bisector', label: 'Perpendicular Bisector' },
    { id: 'angle-bisector', label: 'Angle Bisector' },
    { id: 'perpendicular-from-point', label: 'Perpendicular from a Point' },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {TYPES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setType(id)}
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all ${
              type === id ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {type === 'perpendicular-bisector' && <PerpendicularBisector />}
      {type === 'angle-bisector' && <AngleBisectorConstruction />}
      {type === 'perpendicular-from-point' && <PerpendicularFromPoint />}
    </div>
  )
}
