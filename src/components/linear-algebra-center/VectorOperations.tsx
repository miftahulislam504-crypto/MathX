'use client'
import { useCallback, useRef, useState } from 'react'
import { Plus, Dot, X as XIcon, Ruler } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type OpType = 'add' | 'scalar' | 'dot' | 'cross'

interface Vec2 { x: number; y: number }

const VB = 320
const CX = VB / 2
const CY = VB / 2
const SCALE = 24 // pixels per unit

function toSvgPoint(v: Vec2): Vec2 {
  return { x: CX + v.x * SCALE, y: CY - v.y * SCALE }
}

function useViewBoxVector(svgRef: React.RefObject<SVGSVGElement | null>) {
  return useCallback(
    (clientX: number, clientY: number): Vec2 => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      const px = ((clientX - rect.left) / rect.width) * VB
      const py = ((clientY - rect.top) / rect.height) * VB
      const x = (px - CX) / SCALE
      const y = -(py - CY) / SCALE
      const clamp = (n: number) => Math.max(-6, Math.min(6, n))
      return { x: clamp(Math.round(x * 4) / 4), y: clamp(Math.round(y * 4) / 4) }
    },
    [svgRef]
  )
}

function mag(v: Vec2): number {
  return Math.sqrt(v.x ** 2 + v.y ** 2)
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '')
}

function Grid() {
  const lines = []
  for (let i = -6; i <= 6; i++) {
    const px = CX + i * SCALE
    const py = CY - i * SCALE
    lines.push(
      <line key={`v${i}`} x1={px} y1={0} x2={px} y2={VB} stroke={i === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)'} strokeWidth={i === 0 ? 1.5 : 1} />
    )
    lines.push(
      <line key={`h${i}`} x1={0} y1={py} x2={VB} y2={py} stroke={i === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)'} strokeWidth={i === 0 ? 1.5 : 1} />
    )
  }
  return <>{lines}</>
}

function ArrowDefs() {
  return (
    <defs>
      <marker id="lac-arrow-cyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#22d3ee" />
      </marker>
      <marker id="lac-arrow-amber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" />
      </marker>
      <marker id="lac-arrow-emerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#34d399" />
      </marker>
    </defs>
  )
}

function VectorArrow({ from, to, color, markerId, width = 2.5, dashed = false }: { from: Vec2; to: Vec2; color: string; markerId: string; width?: number; dashed?: boolean }) {
  const p1 = toSvgPoint(from)
  const p2 = toSvgPoint(to)
  return (
    <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth={width}
      strokeDasharray={dashed ? '5,4' : undefined} markerEnd={`url(#${markerId})`} />
  )
}

// ── Vector Addition (tip-to-tail) ────────────────────────────────────────
function VectorAddition() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVec = useViewBoxVector(svgRef)
  const [u, setU] = useState<Vec2>({ x: 3, y: 1 })
  const [v, setV] = useState<Vec2>({ x: 1, y: 2 })
  const [dragging, setDragging] = useState<'u' | 'v' | null>(null)

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging) return
    const p = toVec(clientX, clientY)
    if (dragging === 'u') setU(p)
    else setV(p)
  }

  const sum = { x: u.x + v.x, y: u.y + v.y }
  const uTip = toSvgPoint(u)
  const vFromU = { x: u.x + v.x, y: u.y + v.y }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag the tips of <span className="text-cyan-400">u</span> and <span className="text-amber-400">v</span>.
        The sum <span className="text-emerald-400">u + v</span> is found tip-to-tail: place v&apos;s tail at u&apos;s tip — the
        dashed copy shows this — and the resultant runs from the origin to that final point.
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
          <Grid />
          <ArrowDefs />

          <VectorArrow from={{ x: 0, y: 0 }} to={u} color="#22d3ee" markerId="lac-arrow-cyan" />
          <VectorArrow from={{ x: 0, y: 0 }} to={v} color="#f59e0b" markerId="lac-arrow-amber" />
          {/* dashed copy of v, tail at u's tip */}
          <VectorArrow from={u} to={vFromU} color="#f59e0b" markerId="lac-arrow-amber" width={1.5} dashed />
          <VectorArrow from={{ x: 0, y: 0 }} to={sum} color="#34d399" markerId="lac-arrow-emerald" />

          <circle cx={uTip.x} cy={uTip.y} r={dragging === 'u' ? 8 : 6} fill="#22d3ee" stroke="#09090b" strokeWidth="2" className="cursor-grab"
            onMouseDown={(e) => { e.stopPropagation(); setDragging('u') }} onTouchStart={(e) => { e.stopPropagation(); setDragging('u') }} />
          <circle cx={toSvgPoint(v).x} cy={toSvgPoint(v).y} r={dragging === 'v' ? 8 : 6} fill="#f59e0b" stroke="#09090b" strokeWidth="2" className="cursor-grab"
            onMouseDown={(e) => { e.stopPropagation(); setDragging('v') }} onTouchStart={(e) => { e.stopPropagation(); setDragging('v') }} />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-1">u</p>
          <p className="text-sm font-mono text-cyan-300">({fmt(u.x)}, {fmt(u.y)})</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-amber-400/70 mb-1">v</p>
          <p className="text-sm font-mono text-amber-300">({fmt(v.x)}, {fmt(v.y)})</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-1">u + v</p>
          <p className="text-sm font-mono text-emerald-300">({fmt(sum.x)}, {fmt(sum.y)})</p>
        </div>
      </div>
    </div>
  )
}

// ── Scalar Multiplication ────────────────────────────────────────────────
function ScalarMultiplication() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVec = useViewBoxVector(svgRef)
  const [u, setU] = useState<Vec2>({ x: 2, y: 1.5 })
  const [k, setK] = useState(1.5)
  const [dragging, setDragging] = useState(false)

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging) return
    setU(toVec(clientX, clientY))
  }

  const scaled = { x: u.x * k, y: u.y * k }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag the tip of <span className="text-cyan-400">u</span>, then slide k. Scalar multiplication stretches
        (|k| &gt; 1), shrinks (|k| &lt; 1), or flips (k &lt; 0) the vector — always along the same line through the origin.
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
          <Grid />
          <ArrowDefs />

          <VectorArrow from={{ x: 0, y: 0 }} to={scaled} color="#f59e0b" markerId="lac-arrow-amber" width={2} dashed />
          <VectorArrow from={{ x: 0, y: 0 }} to={u} color="#22d3ee" markerId="lac-arrow-cyan" />

          <circle cx={toSvgPoint(u).x} cy={toSvgPoint(u).y} r={dragging ? 8 : 6} fill="#22d3ee" stroke="#09090b" strokeWidth="2" className="cursor-grab"
            onMouseDown={() => setDragging(true)} onTouchStart={() => setDragging(true)} />
        </svg>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/40 font-mono">k</span>
          <span className="text-amber-300 font-mono">{fmt(k)}</span>
        </div>
        <input type="range" min={-2} max={3} step={0.1} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-amber-500" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-1">u</p>
          <p className="text-sm font-mono text-cyan-300">({fmt(u.x)}, {fmt(u.y)})</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-amber-400/70 mb-1">k · u</p>
          <p className="text-sm font-mono text-amber-300">({fmt(scaled.x)}, {fmt(scaled.y)})</p>
        </div>
      </div>
    </div>
  )
}

// ── Dot Product ───────────────────────────────────────────────────────────
function DotProduct() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVec = useViewBoxVector(svgRef)
  const [u, setU] = useState<Vec2>({ x: 3, y: 1 })
  const [v, setV] = useState<Vec2>({ x: 1, y: 2.5 })
  const [dragging, setDragging] = useState<'u' | 'v' | null>(null)

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging) return
    const p = toVec(clientX, clientY)
    if (dragging === 'u') setU(p)
    else setV(p)
  }

  const dot = u.x * v.x + u.y * v.y
  const magU = mag(u)
  const magV = mag(v)
  const cosTheta = magU > 0 && magV > 0 ? Math.max(-1, Math.min(1, dot / (magU * magV))) : 0
  const theta = (Math.acos(cosTheta) * 180) / Math.PI

  // projection of v onto u
  const projScalar = magU > 0 ? dot / (magU * magU) : 0
  const proj = { x: u.x * projScalar, y: u.y * projScalar }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag the tips of <span className="text-cyan-400">u</span> and <span className="text-amber-400">v</span>.
        u · v = |u||v|cos θ measures how much v points along u. The
        <span className="text-rose-400"> dashed segment</span> is v&apos;s projection onto u.
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
          <Grid />
          <ArrowDefs />

          <VectorArrow from={{ x: 0, y: 0 }} to={proj} color="#fb7185" markerId="lac-arrow-amber" width={3} dashed />
          <line x1={toSvgPoint(v).x} y1={toSvgPoint(v).y} x2={toSvgPoint(proj).x} y2={toSvgPoint(proj).y} stroke="rgba(251,113,133,0.35)" strokeWidth={1} strokeDasharray="2,2" />

          <VectorArrow from={{ x: 0, y: 0 }} to={u} color="#22d3ee" markerId="lac-arrow-cyan" />
          <VectorArrow from={{ x: 0, y: 0 }} to={v} color="#f59e0b" markerId="lac-arrow-amber" />

          <circle cx={toSvgPoint(u).x} cy={toSvgPoint(u).y} r={dragging === 'u' ? 8 : 6} fill="#22d3ee" stroke="#09090b" strokeWidth="2" className="cursor-grab"
            onMouseDown={(e) => { e.stopPropagation(); setDragging('u') }} onTouchStart={(e) => { e.stopPropagation(); setDragging('u') }} />
          <circle cx={toSvgPoint(v).x} cy={toSvgPoint(v).y} r={dragging === 'v' ? 8 : 6} fill="#f59e0b" stroke="#09090b" strokeWidth="2" className="cursor-grab"
            onMouseDown={(e) => { e.stopPropagation(); setDragging('v') }} onTouchStart={(e) => { e.stopPropagation(); setDragging('v') }} />
        </svg>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer latex={`u \\cdot v = (${fmt(u.x)})(${fmt(v.x)}) + (${fmt(u.y)})(${fmt(v.y)}) = ${fmt(dot)}`} display />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">|u|</p>
          <p className="text-sm font-mono text-cyan-300">{fmt(magU)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">|v|</p>
          <p className="text-sm font-mono text-amber-300">{fmt(magV)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">θ</p>
          <p className="text-sm font-mono text-white/70">{fmt(theta)}°</p>
        </div>
      </div>

      {Math.abs(dot) < 0.05 && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-center">
          u · v ≈ 0 — the vectors are perpendicular (orthogonal).
        </p>
      )}
    </div>
  )
}

// ── Cross Product (2D z-component) ───────────────────────────────────────
function CrossProduct() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVec = useViewBoxVector(svgRef)
  const [u, setU] = useState<Vec2>({ x: 3, y: 0.5 })
  const [v, setV] = useState<Vec2>({ x: 1, y: 2.5 })
  const [dragging, setDragging] = useState<'u' | 'v' | null>(null)

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging) return
    const p = toVec(clientX, clientY)
    if (dragging === 'u') setU(p)
    else setV(p)
  }

  const crossZ = u.x * v.y - u.y * v.x
  const area = Math.abs(crossZ)
  const sum = { x: u.x + v.x, y: u.y + v.y }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        In 2D, u × v has only a z-component: u.x·v.y − u.y·v.x. Its absolute value equals the area of the
        parallelogram (shaded) spanned by u and v — a sign tells you whether v is counter-clockwise (+) or
        clockwise (−) from u.
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
          <Grid />
          <ArrowDefs />

          <polygon
            points={[{ x: 0, y: 0 }, u, sum, v].map((p) => { const s = toSvgPoint(p); return `${s.x},${s.y}` }).join(' ')}
            fill={crossZ >= 0 ? '#34d39922' : '#f4304422'}
            stroke="none"
          />

          <VectorArrow from={{ x: 0, y: 0 }} to={u} color="#22d3ee" markerId="lac-arrow-cyan" />
          <VectorArrow from={{ x: 0, y: 0 }} to={v} color="#f59e0b" markerId="lac-arrow-amber" />
          <line x1={toSvgPoint(u).x} y1={toSvgPoint(u).y} x2={toSvgPoint(sum).x} y2={toSvgPoint(sum).y} stroke="rgba(245,158,11,0.3)" strokeWidth={1.5} strokeDasharray="4,3" />
          <line x1={toSvgPoint(v).x} y1={toSvgPoint(v).y} x2={toSvgPoint(sum).x} y2={toSvgPoint(sum).y} stroke="rgba(34,211,238,0.3)" strokeWidth={1.5} strokeDasharray="4,3" />

          <circle cx={toSvgPoint(u).x} cy={toSvgPoint(u).y} r={dragging === 'u' ? 8 : 6} fill="#22d3ee" stroke="#09090b" strokeWidth="2" className="cursor-grab"
            onMouseDown={(e) => { e.stopPropagation(); setDragging('u') }} onTouchStart={(e) => { e.stopPropagation(); setDragging('u') }} />
          <circle cx={toSvgPoint(v).x} cy={toSvgPoint(v).y} r={dragging === 'v' ? 8 : 6} fill="#f59e0b" stroke="#09090b" strokeWidth="2" className="cursor-grab"
            onMouseDown={(e) => { e.stopPropagation(); setDragging('v') }} onTouchStart={(e) => { e.stopPropagation(); setDragging('v') }} />
        </svg>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer latex={`u \\times v = (${fmt(u.x)})(${fmt(v.y)}) - (${fmt(u.y)})(${fmt(v.x)}) = ${fmt(crossZ)}`} display />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Parallelogram Area</p>
          <p className="text-sm font-mono text-white/70">{fmt(area)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Orientation</p>
          <p className={`text-sm font-mono ${crossZ >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{crossZ >= 0 ? 'Counter-clockwise' : 'Clockwise'}</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────
export function VectorOperations() {
  const [op, setOp] = useState<OpType>('add')

  const OPS: { id: OpType; label: string; icon: typeof Plus }[] = [
    { id: 'add', label: 'Addition', icon: Plus },
    { id: 'scalar', label: 'Scalar Multiply', icon: XIcon },
    { id: 'dot', label: 'Dot Product', icon: Dot },
    { id: 'cross', label: 'Cross Product', icon: Ruler },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {OPS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setOp(id)}
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all ${
              op === id ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {op === 'add' && <VectorAddition />}
      {op === 'scalar' && <ScalarMultiplication />}
      {op === 'dot' && <DotProduct />}
      {op === 'cross' && <CrossProduct />}
    </div>
  )
}
