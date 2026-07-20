'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import { LatexRenderer } from '@/components/math/LatexRenderer'

interface Pt { x: number; y: number }
interface IterRecord { iter: number; x: number; fx: number }
const MARGIN = { t: 20, r: 20, b: 44, l: 52 }

interface FnDef { label: string; latex: string; f: (x: number) => number; fprime: (x: number) => number; domain: [number, number]; bisectionInterval: [number, number]; newtonStart: number }

const FUNCTIONS: FnDef[] = [
  {
    label: 'x³ − x − 2',
    latex: 'f(x) = x^3 - x - 2',
    f: (x) => x ** 3 - x - 2,
    fprime: (x) => 3 * x ** 2 - 1,
    domain: [-1, 3],
    bisectionInterval: [1, 2],
    newtonStart: 1.5,
  },
  {
    label: 'cos(x) − x',
    latex: 'f(x) = \\cos(x) - x',
    f: (x) => Math.cos(x) - x,
    fprime: (x) => -Math.sin(x) - 1,
    domain: [-1, 2],
    bisectionInterval: [0, 1],
    newtonStart: 0.5,
  },
  {
    label: 'x² − 2 (√2)',
    latex: 'f(x) = x^2 - 2',
    f: (x) => x ** 2 - 2,
    fprime: (x) => 2 * x,
    domain: [0, 3],
    bisectionInterval: [1, 2],
    newtonStart: 1,
  },
]

function fmt(n: number, d = 6): string {
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(d)
}

function bisectionMethod(fn: FnDef, tol: number, maxIter: number): IterRecord[] {
  let [a, b] = fn.bisectionInterval
  const records: IterRecord[] = []
  for (let i = 1; i <= maxIter; i++) {
    const c = (a + b) / 2
    const fc = fn.f(c)
    records.push({ iter: i, x: c, fx: fc })
    if (Math.abs(fc) < tol) break
    if (fn.f(a) * fc < 0) b = c
    else a = c
  }
  return records
}

function newtonMethod(fn: FnDef, tol: number, maxIter: number): IterRecord[] {
  let x = fn.newtonStart
  const records: IterRecord[] = [{ iter: 0, x, fx: fn.f(x) }]
  for (let i = 1; i <= maxIter; i++) {
    const fx = fn.f(x)
    if (Math.abs(fx) < tol) break
    const deriv = fn.fprime(x)
    if (Math.abs(deriv) < 1e-12) break
    x = x - fx / deriv
    records.push({ iter: i, x, fx: fn.f(x) })
  }
  return records
}

export function ComputationalMathematics() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 600, h: 260 })
  const [fnIndex, setFnIndex] = useState(0)
  const fn = FUNCTIONS[fnIndex]

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(300, w), h: Math.max(200, Math.min(300, w * 0.4)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const bisectionSteps = useMemo(() => bisectionMethod(fn, 1e-6, 40), [fn])
  const newtonSteps = useMemo(() => newtonMethod(fn, 1e-6, 40), [fn])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w - MARGIN.l - MARGIN.r
    const H = dims.h - MARGIN.t - MARGIN.b
    svg.attr('width', dims.w).attr('height', dims.h)
    const g = svg.append('g').attr('transform', `translate(${MARGIN.l},${MARGIN.t})`)
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    const points: Pt[] = []
    for (let i = 0; i <= 200; i++) {
      const x = fn.domain[0] + (i / 200) * (fn.domain[1] - fn.domain[0])
      points.push({ x, y: fn.f(x) })
    }
    const yExtent = d3.extent(points, (p) => p.y) as [number, number]
    const yPad = (yExtent[1] - yExtent[0]) * 0.15

    const xSc = d3.scaleLinear().domain(fn.domain).range([0, W])
    const ySc = d3.scaleLinear().domain([yExtent[0] - yPad, yExtent[1] + yPad]).range([H, 0])

    xSc.ticks(6).forEach((tck) => g.append('line').attr('x1', xSc(tck)).attr('x2', xSc(tck)).attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.04)'))
    ySc.ticks(5).forEach((tck) => g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ySc(tck)).attr('y2', ySc(tck)).attr('stroke', 'rgba(255,255,255,0.04)'))
    g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ySc(0)).attr('y2', ySc(0)).attr('stroke', 'rgba(255,255,255,0.15)')

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(xSc).ticks(6).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })
    g.append('g').call(d3.axisLeft(ySc).ticks(5).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').attr('dx', '-4px'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })

    const line = d3.line<Pt>().x((p) => xSc(p.x)).y((p) => ySc(p.y)).curve(d3.curveMonotoneX)
    g.append('path').datum(points).attr('d', line).attr('fill', 'none').attr('stroke', '#a1a1aa').attr('stroke-width', 2)

    // bisection guesses (orange), newton guesses (cyan)
    bisectionSteps.forEach((s, i) => {
      g.append('circle').attr('cx', xSc(s.x)).attr('cy', ySc(0)).attr('r', 3).attr('fill', '#f97316').attr('opacity', 0.3 + 0.7 * (i / bisectionSteps.length))
    })
    newtonSteps.forEach((s, i) => {
      g.append('circle').attr('cx', xSc(s.x)).attr('cy', ySc(0)).attr('r', 3.5).attr('fill', '#22d3ee').attr('opacity', 0.3 + 0.7 * (i / newtonSteps.length))
    })

    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims, fn, bisectionSteps, newtonSteps])

  const bisectionRoot = bisectionSteps[bisectionSteps.length - 1]
  const newtonRoot = newtonSteps[newtonSteps.length - 1]

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Root-finding is at the heart of computational mathematics — solving f(x) = 0 numerically when no
        algebraic formula exists. Bisection always converges but slowly (linear); Newton-Raphson uses the
        derivative to converge much faster (quadratic) — when it converges at all.
      </p>

      <div className="flex flex-wrap gap-2">
        {FUNCTIONS.map((f, i) => (
          <button
            key={f.label}
            onClick={() => setFnIndex(i)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${fnIndex === i ? 'bg-orange-500/15 border-orange-500/40 text-orange-300' : 'border-white/8 text-white/40 hover:text-white/70'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
        <svg ref={svgRef} className="w-full" />
      </div>
      <p className="text-[11px] text-white/25 text-center">
        <span className="text-orange-400">Orange dots = Bisection guesses</span> · <span className="text-cyan-400">Cyan dots = Newton-Raphson guesses</span> (fading in as iterations progress)
      </p>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer latex={fn.latex} display />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
          <p className="text-xs text-orange-400/80 uppercase tracking-wider font-mono mb-2">Bisection Method</p>
          <p className="text-sm font-mono text-orange-300">x ≈ {fmt(bisectionRoot.x, 5)}</p>
          <p className="text-[11px] text-white/30 mt-1">{bisectionSteps.length} iterations</p>
        </div>
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <p className="text-xs text-cyan-400/80 uppercase tracking-wider font-mono mb-2">Newton-Raphson</p>
          <p className="text-sm font-mono text-cyan-300">x ≈ {fmt(newtonRoot.x, 5)}</p>
          <p className="text-[11px] text-white/30 mt-1">{newtonSteps.length - 1} iterations</p>
        </div>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3 max-h-48 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Newton-Raphson iteration trace</p>
        <table className="w-full text-[11px] font-mono">
          <thead>
            <tr className="text-white/30"><td className="pb-1">n</td><td className="pb-1">xₙ</td><td className="pb-1">f(xₙ)</td></tr>
          </thead>
          <tbody>
            {newtonSteps.map((s) => (
              <tr key={s.iter} className="text-white/60">
                <td>{s.iter}</td>
                <td>{fmt(s.x, 6)}</td>
                <td>{fmt(s.fx, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
        <LatexRenderer latex={`x_{n+1} = x_n - \\dfrac{f(x_n)}{f'(x_n)}`} display />
      </div>
    </div>
  )
}
