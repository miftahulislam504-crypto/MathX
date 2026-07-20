'use client'
import { useCallback, useRef, useState } from 'react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

interface Vec2 { x: number; y: number }

const VB = 320
const CX = VB / 2
const CY = VB / 2
const SCALE = 24

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

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '')
}

function Grid() {
  const lines = []
  for (let i = -6; i <= 6; i++) {
    const px = CX + i * SCALE
    const py = CY - i * SCALE
    lines.push(<line key={`v${i}`} x1={px} y1={0} x2={px} y2={VB} stroke={i === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)'} strokeWidth={i === 0 ? 1.5 : 1} />)
    lines.push(<line key={`h${i}`} x1={0} y1={py} x2={VB} y2={py} stroke={i === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)'} strokeWidth={i === 0 ? 1.5 : 1} />)
  }
  return <>{lines}</>
}

function ArrowDefs() {
  return (
    <defs>
      <marker id="lac-vse-cyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#22d3ee" />
      </marker>
      <marker id="lac-vse-amber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" />
      </marker>
      <marker id="lac-vse-rose" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#fb7185" />
      </marker>
    </defs>
  )
}

export function VectorSpaceExplorer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVec = useViewBoxVector(svgRef)
  const [v1, setV1] = useState<Vec2>({ x: 2, y: 1 })
  const [v2, setV2] = useState<Vec2>({ x: -1, y: 2 })
  const [c1, setC1] = useState(1)
  const [c2, setC2] = useState(1)
  const [dragging, setDragging] = useState<'v1' | 'v2' | null>(null)

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging) return
    const p = toVec(clientX, clientY)
    if (dragging === 'v1') setV1(p)
    else setV2(p)
  }

  const combo: Vec2 = { x: c1 * v1.x + c2 * v2.x, y: c1 * v1.y + c2 * v2.y }
  const cross = v1.x * v2.y - v1.y * v2.x
  const independent = Math.abs(cross) > 1e-6
  const scaled1 = { x: c1 * v1.x, y: c1 * v1.y }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag <span className="text-cyan-400">v₁</span> and <span className="text-amber-400">v₂</span>, then adjust
        weights c₁ and c₂. The <span className="text-rose-400">rose vector</span> is the linear combination
        c₁v₁ + c₂v₂. As long as v₁ and v₂ point in different directions, every point on the grid is some
        combination — together they <em>span</em> the whole plane.
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

          {/* dashed span lines through origin, showing the 1D subspace each vector spans */}
          <line
            x1={toSvgPoint({ x: -v1.x * 8, y: -v1.y * 8 }).x} y1={toSvgPoint({ x: -v1.x * 8, y: -v1.y * 8 }).y}
            x2={toSvgPoint({ x: v1.x * 8, y: v1.y * 8 }).x} y2={toSvgPoint({ x: v1.x * 8, y: v1.y * 8 }).y}
            stroke="rgba(34,211,238,0.15)" strokeWidth={1}
          />
          <line
            x1={toSvgPoint({ x: -v2.x * 8, y: -v2.y * 8 }).x} y1={toSvgPoint({ x: -v2.x * 8, y: -v2.y * 8 }).y}
            x2={toSvgPoint({ x: v2.x * 8, y: v2.y * 8 }).x} y2={toSvgPoint({ x: v2.x * 8, y: v2.y * 8 }).y}
            stroke="rgba(245,158,11,0.15)" strokeWidth={1}
          />

          <line x1={toSvgPoint({ x: 0, y: 0 }).x} y1={toSvgPoint({ x: 0, y: 0 }).y} x2={toSvgPoint(scaled1).x} y2={toSvgPoint(scaled1).y} stroke="#22d3ee" strokeWidth={2} markerEnd="url(#lac-vse-cyan)" opacity={0.55} />
          <line x1={toSvgPoint(scaled1).x} y1={toSvgPoint(scaled1).y} x2={toSvgPoint(combo).x} y2={toSvgPoint(combo).y} stroke="#f59e0b" strokeWidth={2} markerEnd="url(#lac-vse-amber)" strokeDasharray="5,4" opacity={0.7} />

          <line x1={toSvgPoint({ x: 0, y: 0 }).x} y1={toSvgPoint({ x: 0, y: 0 }).y} x2={toSvgPoint(v1).x} y2={toSvgPoint(v1).y} stroke="#22d3ee" strokeWidth={2.5} markerEnd="url(#lac-vse-cyan)" />
          <line x1={toSvgPoint({ x: 0, y: 0 }).x} y1={toSvgPoint({ x: 0, y: 0 }).y} x2={toSvgPoint(v2).x} y2={toSvgPoint(v2).y} stroke="#f59e0b" strokeWidth={2.5} markerEnd="url(#lac-vse-amber)" />
          <line x1={toSvgPoint({ x: 0, y: 0 }).x} y1={toSvgPoint({ x: 0, y: 0 }).y} x2={toSvgPoint(combo).x} y2={toSvgPoint(combo).y} stroke="#fb7185" strokeWidth={3} markerEnd="url(#lac-vse-rose)" />

          <circle cx={toSvgPoint(v1).x} cy={toSvgPoint(v1).y} r={dragging === 'v1' ? 8 : 6} fill="#22d3ee" stroke="#09090b" strokeWidth="2" className="cursor-grab"
            onMouseDown={(e) => { e.stopPropagation(); setDragging('v1') }} onTouchStart={(e) => { e.stopPropagation(); setDragging('v1') }} />
          <circle cx={toSvgPoint(v2).x} cy={toSvgPoint(v2).y} r={dragging === 'v2' ? 8 : 6} fill="#f59e0b" stroke="#09090b" strokeWidth="2" className="cursor-grab"
            onMouseDown={(e) => { e.stopPropagation(); setDragging('v2') }} onTouchStart={(e) => { e.stopPropagation(); setDragging('v2') }} />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-cyan-400/80 font-mono">c₁</span>
            <span className="text-cyan-300 font-mono">{fmt(c1)}</span>
          </div>
          <input type="range" min={-3} max={3} step={0.1} value={c1} onChange={(e) => setC1(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-amber-400/80 font-mono">c₂</span>
            <span className="text-amber-300 font-mono">{fmt(c2)}</span>
          </div>
          <input type="range" min={-3} max={3} step={0.1} value={c2} onChange={(e) => setC2(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer
          latex={`${fmt(c1)}(${fmt(v1.x)}, ${fmt(v1.y)}) + ${fmt(c2)}(${fmt(v2.x)}, ${fmt(v2.y)}) = (${fmt(combo.x)}, ${fmt(combo.y)})`}
          display
        />
      </div>

      {independent ? (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-center leading-relaxed">
          v₁ and v₂ are <strong>linearly independent</strong> — neither is a scalar multiple of the other, so
          together they form a <strong>basis</strong> for the plane and their span is all of ℝ².
        </p>
      ) : (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2 text-center leading-relaxed">
          v₁ and v₂ are <strong>linearly dependent</strong> — one is a scalar multiple of the other, so every
          combination c₁v₁ + c₂v₂ lands on the <em>same line</em> through the origin. They span only a line, not the
          whole plane.
        </p>
      )}
    </div>
  )
}
