'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Compass, Layers, GitMerge, type LucideIcon } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type ExpType = 'eigen' | 'composition' | 'linsystem'

interface Mat2 { a: number; b: number; c: number; d: number }

function apply(m: Mat2, v: { x: number; y: number }) {
  return { x: m.a * v.x + m.b * v.y, y: m.c * v.x + m.d * v.y }
}
function multiply(m1: Mat2, m2: Mat2): Mat2 {
  return {
    a: m1.a * m2.a + m1.b * m2.c, b: m1.a * m2.b + m1.b * m2.d,
    c: m1.c * m2.a + m1.d * m2.c, d: m1.c * m2.b + m1.d * m2.d,
  }
}
function eigenvalues(m: Mat2): { real: [number, number]; complex: boolean } {
  const tr = m.a + m.d
  const det = m.a * m.d - m.b * m.c
  const disc = tr * tr - 4 * det
  if (disc < 0) return { real: [tr / 2, tr / 2], complex: true }
  const sq = Math.sqrt(disc)
  return { real: [(tr + sq) / 2, (tr - sq) / 2], complex: false }
}
function eigenvector(m: Mat2, lambda: number): { x: number; y: number } {
  // Solve (A - λI)v = 0. Use row [a-λ, b] if not both zero, else [c, d-λ].
  const a = m.a - lambda, b = m.b
  if (Math.abs(b) > 1e-9) {
    const v = { x: 1, y: -a / b }
    const mag = Math.sqrt(v.x ** 2 + v.y ** 2)
    return { x: v.x / mag, y: v.y / mag }
  }
  const c = m.c, d = m.d - lambda
  if (Math.abs(c) > 1e-9) {
    const v = { x: -d / c, y: 1 }
    const mag = Math.sqrt(v.x ** 2 + v.y ** 2)
    return { x: v.x / mag, y: v.y / mag }
  }
  return { x: 1, y: 0 }
}

// ── Eigenvector Visualizer ─────────────────────────────────────────────
function EigenvectorVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 500, h: 380 })
  const [mat, setMat] = useState<Mat2>({ a: 2, b: 1, c: 1, d: 2 })
  const [probeAngle, setProbeAngle] = useState(30) // degrees, position of draggable probe vector
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(280, Math.min(400, w * 0.75)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const eig = eigenvalues(mat)
  const ev1 = !eig.complex ? eigenvector(mat, eig.real[0]) : null
  const ev2 = !eig.complex ? eigenvector(mat, eig.real[1]) : null

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const cx = W / 2, cy = H / 2
    const scale = Math.min(W, H) / 8

    const g = svg.attr('width', W).attr('height', H).append('g')
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')
    g.append('line').attr('x1', 0).attr('x2', W).attr('y1', cy).attr('y2', cy).attr('stroke', 'rgba(255,255,255,0.1)')
    g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.1)')

    // unit circle (input space reference)
    g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', scale).attr('fill', 'none').attr('stroke', 'rgba(167,139,250,0.2)').attr('stroke-dasharray', '3,3')

    const toSvg = (v: { x: number; y: number }) => ({ x: cx + v.x * scale, y: cy - v.y * scale })

    // eigenvector lines (full lines through origin, both directions) — drawn first, underneath
    ;[ev1, ev2].forEach((ev, i) => {
      if (!ev) return
      const p1 = toSvg({ x: ev.x * 4, y: ev.y * 4 })
      const p2 = toSvg({ x: -ev.x * 4, y: -ev.y * 4 })
      g.append('line').attr('x1', p1.x).attr('y1', p1.y).attr('x2', p2.x).attr('y2', p2.y)
        .attr('stroke', i === 0 ? 'rgba(52,211,153,0.4)' : 'rgba(251,191,36,0.4)').attr('stroke-width', 1.5).attr('stroke-dasharray', '5,4')
    })

    // probe vector: input (on unit circle) and its transform
    const rad = (probeAngle * Math.PI) / 180
    const inputV = { x: Math.cos(rad), y: Math.sin(rad) }
    const outputV = apply(mat, inputV)

    const pIn = toSvg(inputV)
    const pOut = toSvg(outputV)
    const pOrigin = toSvg({ x: 0, y: 0 })

    // input vector (faint)
    g.append('line').attr('x1', pOrigin.x).attr('y1', pOrigin.y).attr('x2', pIn.x).attr('y2', pIn.y)
      .attr('stroke', 'rgba(103,232,249,0.5)').attr('stroke-width', 2)
    // output vector (bold, what the matrix produces)
    g.append('line').attr('x1', pOrigin.x).attr('y1', pOrigin.y).attr('x2', pOut.x).attr('y2', pOut.y)
      .attr('stroke', '#22d3ee').attr('stroke-width', 2.5).attr('marker-end', 'url(#arrowOut)')

    svg.append('defs').append('marker').attr('id', 'arrowOut').attr('markerWidth', 8).attr('markerHeight', 8)
      .attr('refX', 6).attr('refY', 4).attr('orient', 'auto')
      .append('path').attr('d', 'M0,0 L8,4 L0,8 Z').attr('fill', '#22d3ee')

    // draggable probe handle
    g.append('circle').attr('cx', pIn.x).attr('cy', pIn.y).attr('r', dragging ? 9 : 7)
      .attr('fill', dragging ? '#fbbf24' : '#f59e0b').attr('stroke', '#09090b').attr('stroke-width', 2)
      .attr('class', 'cursor-grab')
      .on('mousedown touchstart', () => setDragging(true))

  }, [dims, mat, probeAngle, dragging, ev1, ev2])

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const cx = rect.width / 2, cy = rect.height / 2
    const dx = clientX - rect.left - cx
    const dy = -(clientY - rect.top - cy)
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    setProbeAngle(angle)
  }

  const MATRIX_PRESETS = [
    { label: 'Symmetric (real eigen)', m: { a: 2, b: 1, c: 1, d: 2 } },
    { label: 'Rotation-like (complex)', m: { a: 0, b: -1, c: 1, d: 0 } },
    { label: 'Shear', m: { a: 1, b: 1, c: 0, d: 1 } },
    { label: 'Stretch (diagonal)', m: { a: 3, b: 0, c: 0, d: 0.5 } },
  ]

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag the orange handle around the circle. The cyan output vector rotates — except along the{' '}
        <span className="text-emerald-400">eigenvector directions</span> (dashed lines), where it only stretches
        or shrinks, never rotates. Those directions are eigenvectors; the stretch factor is the eigenvalue.
      </p>

      <div className="flex flex-wrap gap-2">
        {MATRIX_PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setMat(p.m)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              JSON.stringify(mat) === JSON.stringify(p.m) ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b] touch-none select-none"
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchMove={(e) => { const tt = e.touches[0]; handleMove(tt.clientX, tt.clientY) }}
        onTouchEnd={() => setDragging(false)}
      >
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(['a', 'b', 'c', 'd'] as const).map((k) => (
          <div key={k} className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40 font-mono">{k}</span><span className="text-white/70 font-mono">{mat[k]}</span></div>
            <input type="range" min={-3} max={3} step={0.5} value={mat[k]} onChange={(e) => setMat({ ...mat, [k]: Number(e.target.value) })} className="w-full accent-violet-500" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer latex={`A = \\begin{pmatrix} ${mat.a} & ${mat.b} \\\\ ${mat.c} & ${mat.d} \\end{pmatrix}`} display />
      </div>

      {eig.complex ? (
        <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2 text-center">
          This matrix has complex eigenvalues — every vector rotates, none stay fixed in direction (this is what pure rotation looks like).
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
            <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-1">λ₁</p>
            <p className="text-lg font-mono text-emerald-400">{eig.real[0].toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
            <p className="text-[10px] uppercase tracking-wider text-amber-400/70 mb-1">λ₂</p>
            <p className="text-lg font-mono text-amber-400">{eig.real[1].toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Matrix Composition (order matters) ───────────────────────────────────
function MatrixComposition() {
  const [matA, setMatA] = useState<Mat2>({ a: 1, b: -0.6, c: 0, d: 1 }) // shear
  const [matB, setMatB] = useState<Mat2>({ a: 0.5, b: 0, c: 0, d: 2 })  // stretch
  const [order, setOrder] = useState<'AB' | 'BA'>('AB')

  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 500, h: 320 })

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(240, Math.min(340, w * 0.65)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const combined = order === 'AB' ? multiply(matB, matA) : multiply(matA, matB) // AB means "apply A then B" => B(A(v))

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const cx = W / 2, cy = H / 2
    const scale = Math.min(W, H) / 8

    const g = svg.attr('width', W).attr('height', H).append('g')
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')
    g.append('line').attr('x1', 0).attr('x2', W).attr('y1', cy).attr('y2', cy).attr('stroke', 'rgba(255,255,255,0.1)')
    g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.1)')

    const toSvg = (v: { x: number; y: number }) => ({ x: cx + v.x * scale, y: cy - v.y * scale })

    const square = [{ x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }]

    // original square (faint reference)
    g.append('polygon').attr('points', square.map((p) => { const s = toSvg(p); return `${s.x},${s.y}` }).join(' '))
      .attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-dasharray', '3,3')

    // final combined-transform square
    const transformed = square.map((p) => apply(combined, p))
    g.append('polygon').attr('points', transformed.map((p) => { const s = toSvg(p); return `${s.x},${s.y}` }).join(' '))
      .attr('fill', '#22d3ee22').attr('stroke', '#22d3ee').attr('stroke-width', 2.5)

  }, [dims, combined])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Matrix multiplication represents <span className="text-white/60">composing transformations</span> — but
        order matters. Applying A then B is usually{' '}
        <span className="text-cyan-400">not the same</span> as applying B then A.
      </p>

      <div className="flex gap-2">
        {(['AB', 'BA'] as const).map((o) => (
          <button
            key={o}
            onClick={() => setOrder(o)}
            className={`flex-1 text-xs px-3 py-2.5 rounded-lg border transition-all font-mono ${
              order === o ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            {o === 'AB' ? 'Apply A, then B' : 'Apply B, then A'}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
          <p className="text-[10px] uppercase tracking-wider text-violet-400/70 mb-2">Matrix A (shear)</p>
          <div className="grid grid-cols-2 gap-2">
            {(['a', 'b', 'c', 'd'] as const).map((k) => (
              <input key={k} type="number" step={0.1} value={matA[k]}
                onChange={(e) => setMatA({ ...matA, [k]: Number(e.target.value) })}
                className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/70 font-mono w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-[10px] uppercase tracking-wider text-amber-400/70 mb-2">Matrix B (stretch)</p>
          <div className="grid grid-cols-2 gap-2">
            {(['a', 'b', 'c', 'd'] as const).map((k) => (
              <input key={k} type="number" step={0.1} value={matB[k]}
                onChange={(e) => setMatB({ ...matB, [k]: Number(e.target.value) })}
                className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/70 font-mono w-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer
          latex={`${order === 'AB' ? 'BA' : 'AB'} = \\begin{pmatrix} ${combined.a.toFixed(2)} & ${combined.b.toFixed(2)} \\\\ ${combined.c.toFixed(2)} & ${combined.d.toFixed(2)} \\end{pmatrix}`}
          display
        />
      </div>
    </div>
  )
}

// ── Linear System Solver (Geometric) ─────────────────────────────────────
// a1 x + b1 y = c1
// a2 x + b2 y = c2
function LinearSystemSolver() {
  const [a1, setA1] = useState(2)
  const [b1, setB1] = useState(1)
  const [c1, setC1] = useState(8)
  const [a2, setA2] = useState(1)
  const [b2, setB2] = useState(-1)
  const [c2, setC2] = useState(1)

  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 500, h: 340 })

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(240, Math.min(360, w * 0.68)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const det = a1 * b2 - a2 * b1
  const hasUniqueSolution = Math.abs(det) > 1e-6
  const solX = hasUniqueSolution ? (c1 * b2 - c2 * b1) / det : NaN
  const solY = hasUniqueSolution ? (a1 * c2 - a2 * c1) / det : NaN

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const range = 10
    const x = d3.scaleLinear().domain([-range, range]).range([0, W])
    const y = d3.scaleLinear().domain([-range, range]).range([H, 0])

    const g = svg.attr('width', W).attr('height', H).append('g')
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')
    g.append('line').attr('x1', 0).attr('x2', W).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', 'rgba(255,255,255,0.12)')
    g.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.12)')

    // Line 1: a1 x + b1 y = c1  =>  y = (c1 - a1 x) / b1
    const drawLine = (a: number, b: number, c: number, color: string) => {
      let pts: [number, number][]
      if (Math.abs(b) > 1e-9) {
        pts = [[-range, (c - a * -range) / b], [range, (c - a * range) / b]]
      } else {
        // vertical line x = c/a
        const xv = c / a
        pts = [[xv, -range], [xv, range]]
      }
      g.append('line')
        .attr('x1', x(pts[0][0])).attr('y1', y(pts[0][1]))
        .attr('x2', x(pts[1][0])).attr('y2', y(pts[1][1]))
        .attr('stroke', color).attr('stroke-width', 2.5)
    }
    drawLine(a1, b1, c1, '#22d3ee')
    drawLine(a2, b2, c2, '#f43f5e')

    if (hasUniqueSolution && Math.abs(solX) <= range && Math.abs(solY) <= range) {
      g.append('circle').attr('cx', x(solX)).attr('cy', y(solY)).attr('r', 6).attr('fill', '#fbbf24').attr('stroke', '#09090b').attr('stroke-width', 2)
    }

    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dims, a1, b1, c1, a2, b2, c2, det, hasUniqueSolution, solX, solY])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Each equation is a line. The solution to the system is where they{' '}
        <span className="text-amber-400">intersect</span>. When det = 0, the lines are parallel — either no
        solution, or infinitely many if they&apos;re the same line.
      </p>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-2">Equation 1: a₁x + b₁y = c₁</p>
          <div className="grid grid-cols-3 gap-2">
            {[{ l: 'a₁', v: a1, s: setA1 }, { l: 'b₁', v: b1, s: setB1 }, { l: 'c₁', v: c1, s: setC1 }].map((f) => (
              <div key={f.l}>
                <p className="text-[9px] text-white/30 mb-0.5">{f.l}</p>
                <input type="number" step={1} value={f.v} onChange={(e) => f.s(Number(e.target.value))}
                  className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/70 font-mono w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
          <p className="text-[10px] uppercase tracking-wider text-rose-400/70 mb-2">Equation 2: a₂x + b₂y = c₂</p>
          <div className="grid grid-cols-3 gap-2">
            {[{ l: 'a₂', v: a2, s: setA2 }, { l: 'b₂', v: b2, s: setB2 }, { l: 'c₂', v: c2, s: setC2 }].map((f) => (
              <div key={f.l}>
                <p className="text-[9px] text-white/30 mb-0.5">{f.l}</p>
                <input type="number" step={1} value={f.v} onChange={(e) => f.s(Number(e.target.value))}
                  className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/70 font-mono w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {hasUniqueSolution ? (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-amber-400/70 mb-2">Unique Solution</p>
          <LatexRenderer latex={`x = ${solX.toFixed(2)}, \\quad y = ${solY.toFixed(2)}`} display />
        </div>
      ) : (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2 text-center">
          det = 0 — lines are parallel. No solution (or infinitely many, if they&apos;re the same line).
        </p>
      )}
    </div>
  )
}

// ── Main Lab Component ────────────────────────────────────────────────────
export function MatrixLab() {
  const [exp, setExp] = useState<ExpType>('eigen')

  const EXPS: { id: ExpType; label: string; icon: LucideIcon }[] = [
    { id: 'eigen', label: 'Eigenvectors', icon: Compass },
    { id: 'composition', label: 'Composition Order', icon: Layers },
    { id: 'linsystem', label: 'Linear Systems', icon: GitMerge },
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
                ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {exp === 'eigen' && <EigenvectorVisualizer />}
      {exp === 'composition' && <MatrixComposition />}
      {exp === 'linsystem' && <LinearSystemSolver />}
    </div>
  )
}
