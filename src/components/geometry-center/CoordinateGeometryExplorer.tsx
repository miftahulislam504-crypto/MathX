'use client'
import { useCallback, useRef, useState } from 'react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

interface Point { x: number; y: number }

const VB = 320
const SCALE = 20 // pixels per unit
const ORIGIN = { x: VB / 2, y: VB / 2 }

function useViewBoxPointer(svgRef: React.RefObject<SVGSVGElement | null>) {
  return useCallback(
    (clientX: number, clientY: number) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      const px = ((clientX - rect.left) / rect.width) * VB
      const py = ((clientY - rect.top) / rect.height) * VB
      // convert pixel coords to math coords (y flipped, origin centered)
      const mathX = (px - ORIGIN.x) / SCALE
      const mathY = -(py - ORIGIN.y) / SCALE
      return { x: Math.round(mathX * 2) / 2, y: Math.round(mathY * 2) / 2 } // snap to 0.5 grid
    },
    [svgRef]
  )
}

function toPixel(p: Point) {
  return { x: ORIGIN.x + p.x * SCALE, y: ORIGIN.y - p.y * SCALE }
}

export function CoordinateGeometryExplorer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVB = useViewBoxPointer(svgRef)
  const [A, setA] = useState<Point>({ x: -3, y: -2 })
  const [B, setB] = useState<Point>({ x: 4, y: 3 })
  const [dragging, setDragging] = useState<'A' | 'B' | null>(null)

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging) return
    const p = toVB(clientX, clientY)
    if (dragging === 'A') setA(p)
    else setB(p)
  }

  const distance = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2)
  const midpoint = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }
  const dx = B.x - A.x
  const isVertical = Math.abs(dx) < 1e-9
  const slope = isVertical ? null : (B.y - A.y) / dx
  const yIntercept = slope !== null ? A.y - slope * A.x : null

  const pA = toPixel(A)
  const pB = toPixel(B)
  const pMid = toPixel(midpoint)

  // grid lines every 1 unit
  const gridLines = []
  for (let i = -8; i <= 8; i++) {
    gridLines.push(
      <line key={`v${i}`} x1={ORIGIN.x + i * SCALE} y1={0} x2={ORIGIN.x + i * SCALE} y2={VB} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    )
    gridLines.push(
      <line key={`h${i}`} x1={0} y1={ORIGIN.y + i * SCALE} x2={VB} y2={ORIGIN.y + i * SCALE} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag points A and B on the coordinate grid to compute the distance, midpoint, slope, and equation of the
        line through them.
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
          {gridLines}
          <line x1={0} y1={ORIGIN.y} x2={VB} y2={ORIGIN.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <line x1={ORIGIN.x} y1={0} x2={ORIGIN.x} y2={VB} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

          <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#a78bfa" strokeWidth="2" />
          <circle cx={pMid.x} cy={pMid.y} r="4" fill="#34d399" />

          <circle cx={pA.x} cy={pA.y} r={dragging === 'A' ? 9 : 7} fill="#22d3ee" stroke="#09090b" strokeWidth="2" className="cursor-grab" onMouseDown={() => setDragging('A')} onTouchStart={() => setDragging('A')} />
          <circle cx={pB.x} cy={pB.y} r={dragging === 'B' ? 9 : 7} fill="#f59e0b" stroke="#09090b" strokeWidth="2" className="cursor-grab" onMouseDown={() => setDragging('B')} onTouchStart={() => setDragging('B')} />

          <text x={pA.x - 16} y={pA.y - 8} fontSize="11" fill="#22d3ee" fontFamily="monospace">A({A.x},{A.y})</text>
          <text x={pB.x + 10} y={pB.y - 8} fontSize="11" fill="#f59e0b" fontFamily="monospace">B({B.x},{B.y})</text>
        </svg>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-2">Distance |AB|</p>
          <LatexRenderer latex={`\\sqrt{(${B.x}-(${A.x}))^2 + (${B.y}-(${A.y}))^2} = ${distance.toFixed(3)}`} />
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-2">Midpoint</p>
          <p className="text-sm font-mono text-white/80">({midpoint.x.toFixed(2)}, {midpoint.y.toFixed(2)})</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5 text-center">
        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-3">Slope & Line Equation</p>
        {isVertical ? (
          <>
            <p className="text-sm text-amber-400 mb-2">Undefined slope (vertical line)</p>
            <LatexRenderer latex={`x = ${A.x}`} display />
          </>
        ) : (
          <>
            <p className="text-sm text-white/60 mb-3">slope m = {slope!.toFixed(4)}</p>
            <LatexRenderer latex={`y = ${slope!.toFixed(3)}x ${yIntercept! >= 0 ? '+' : '-'} ${Math.abs(yIntercept!).toFixed(3)}`} display />
          </>
        )}
      </div>
    </div>
  )
}
