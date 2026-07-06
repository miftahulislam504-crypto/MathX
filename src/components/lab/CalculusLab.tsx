'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { create, all } from 'mathjs'
import { GitBranch, Move3d, Layers3, type LucideIcon } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'
import { buildPoints } from '@/lib/math/plotter'

const math = create(all)

function evalAt(expr: string, x: number): number {
  try {
    const v = math.compile(expr).evaluate({ x }) as number
    return isFinite(v) ? v : NaN
  } catch { return NaN }
}

type ExpType = 'limits' | 'relatedrates' | 'taylor'

// ── Limits Explorer ───────────────────────────────────────────────────────
// Shows a function with a potential discontinuity, and a table of values
// approaching x0 from left and right — makes "the limit exists iff both
// one-sided limits agree" concrete rather than abstract.
const LIMIT_PRESETS = [
  { label: '(x²−1)/(x−1) at x=1 — removable', expr: '(x^2 - 1) / (x - 1)', x0: 1, discontinuous: 'removable' },
  { label: 'Step: x<0 ? -1 : 1 — jump', expr: 'x < 0 ? -1 : 1', x0: 0, discontinuous: 'jump' },
  { label: 'sin(x)/x at x=0 — famous limit', expr: 'sin(x)/x', x0: 0, discontinuous: 'removable' },
  { label: '1/x at x=0 — infinite', expr: '1/x', x0: 0, discontinuous: 'infinite' },
]

function LimitsExplorer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 560, h: 300 })
  const [presetIdx, setPresetIdx] = useState(0)
  const [approachDist, setApproachDist] = useState(1) // how close we are currently approaching, in powers of 10

  const preset = LIMIT_PRESETS[presetIdx]

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(220, Math.min(320, w * 0.55)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const margin = { top: 16, right: 16, bottom: 30, left: 40 }
    const innerW = W - margin.left - margin.right
    const innerH = H - margin.top - margin.bottom

    const xMin = preset.x0 - 4, xMax = preset.x0 + 4
    const { points } = buildPoints(preset.expr, xMin, xMax, 500)
    const finitePts = points.filter((p) => isFinite(p.y) && Math.abs(p.y) < 20)
    const yMin = Math.min(-4, ...finitePts.map((p) => p.y))
    const yMax = Math.max(4, ...finitePts.map((p) => p.y))

    const x = d3.scaleLinear().domain([xMin, xMax]).range([0, innerW])
    const y = d3.scaleLinear().domain([yMin, yMax]).range([innerH, 0])

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', '#09090b')
    g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', 'rgba(255,255,255,0.12)')
    g.append('line').attr('x1', x(preset.x0)).attr('x2', x(preset.x0)).attr('y1', 0).attr('y2', innerH).attr('stroke', 'rgba(245,158,11,0.3)').attr('stroke-dasharray', '4,3')

    // plot function, breaking at NaN
    const line = d3.line<{ x: number; y: number }>().defined((d) => isFinite(d.y)).x((d) => x(d.x)).y((d) => y(d.y))
    g.append('path').attr('d', line(points)).attr('fill', 'none').attr('stroke', '#a78bfa').attr('stroke-width', 2)

    // open circle at x0 if discontinuous
    if (preset.discontinuous !== 'infinite') {
      g.append('circle').attr('cx', x(preset.x0)).attr('cy', y(0)).attr('r', 4).attr('fill', '#09090b').attr('stroke', '#f59e0b').attr('stroke-width', 1.5)
    }

    // approach markers: points getting closer from left/right
    const d = 1 / Math.pow(10, approachDist)
    const leftX = preset.x0 - d
    const rightX = preset.x0 + d
    const leftY = evalAt(preset.expr, leftX)
    const rightY = evalAt(preset.expr, rightX)
    if (isFinite(leftY) && Math.abs(leftY) < yMax * 1.5) {
      g.append('circle').attr('cx', x(leftX)).attr('cy', y(leftY)).attr('r', 5).attr('fill', '#22d3ee')
    }
    if (isFinite(rightY) && Math.abs(rightY) < yMax * 1.5) {
      g.append('circle').attr('cx', x(rightX)).attr('cy', y(rightY)).attr('r', 5).attr('fill', '#f43f5e')
    }

    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dims, preset, approachDist])

  const d = 1 / Math.pow(10, approachDist)
  const leftVal = evalAt(preset.expr, preset.x0 - d)
  const rightVal = evalAt(preset.expr, preset.x0 + d)
  const agree = isFinite(leftVal) && isFinite(rightVal) && Math.abs(leftVal - rightVal) < 0.01

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        A limit exists at x₀ only if approaching from the <span className="text-cyan-400">left</span> and{' '}
        <span className="text-rose-400">right</span> give the same value — even if the function isn&apos;t
        defined at x₀ itself.
      </p>

      <select
        value={presetIdx}
        onChange={(e) => { setPresetIdx(Number(e.target.value)); setApproachDist(1) }}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 font-mono"
      >
        {LIMIT_PRESETS.map((p, i) => (
          <option key={p.label} value={i} className="bg-zinc-900">{p.label}</option>
        ))}
      </select>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/40">Approach distance (10⁻ⁿ)</span>
          <span className="text-white/70 font-mono">±{d.toFixed(6)}</span>
        </div>
        <input type="range" min={1} max={6} step={1} value={approachDist} onChange={(e) => setApproachDist(Number(e.target.value))} className="w-full accent-violet-500" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-1">From Left</p>
          <p className="text-lg font-mono text-cyan-400">{isFinite(leftVal) ? leftVal.toFixed(4) : '±∞'}</p>
        </div>
        <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-rose-400/70 mb-1">From Right</p>
          <p className="text-lg font-mono text-rose-400">{isFinite(rightVal) ? rightVal.toFixed(4) : '±∞'}</p>
        </div>
      </div>

      <p className={`text-xs text-center rounded-lg px-3 py-2 border ${agree ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' : 'text-amber-400 bg-amber-500/10 border-amber-500/25'}`}>
        {agree ? 'Both sides agree — the limit appears to exist.' : 'Sides differ — the limit does not exist at this point (or hasn\'t converged yet).'}
      </p>
    </div>
  )
}

// ── Related Rates: Sliding Ladder ────────────────────────────────────────
// Classic problem: a ladder of fixed length L slides down a wall. As the
// bottom slides away at rate dx/dt, how fast does the top fall (dy/dt)?
function RelatedRatesLadder() {
  const [ladderLength, setLadderLength] = useState(10)
  const [bottomX, setBottomX] = useState(6)
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!playing) { cancelAnimationFrame(rafRef.current); return }
    const tick = () => {
      setBottomX((x) => {
        const next = x + 0.03
        if (next >= ladderLength - 0.3) { setPlaying(false); return ladderLength - 0.3 }
        return next
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, ladderLength])

  const dxdt = 1 // fixed rate: bottom slides away at 1 unit/time
  const topY = Math.sqrt(Math.max(0, ladderLength ** 2 - bottomX ** 2))
  // Related rates: x^2 + y^2 = L^2  =>  x(dx/dt) + y(dy/dt) = 0  =>  dy/dt = -x/y * dx/dt
  const dydt = topY > 0.01 ? -(bottomX / topY) * dxdt : -Infinity

  // SVG layout
  const scale = 18
  const originX = 40, originY = 260
  const bottomPx = originX + bottomX * scale
  const topPy = originY - topY * scale

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        A {ladderLength}m ladder leans on a wall. As the bottom slides away at a constant{' '}
        <span className="text-cyan-400">1 m/s</span>, the top&apos;s falling speed{' '}
        <span className="text-rose-400">isn&apos;t constant</span> — it accelerates as the ladder flattens.
        This is what &ldquo;related rates&rdquo; means: two changing quantities, linked by one equation.
      </p>

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg viewBox="0 0 320 280" className="w-full aspect-[320/280]">
          <rect width="320" height="280" fill="#09090b" />
          {/* wall + floor */}
          <line x1={originX} y1="20" x2={originX} y2={originY} stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          <line x1={originX} y1={originY} x2="300" y2={originY} stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          {/* ladder */}
          <line x1={originX} y1={topPy} x2={bottomPx} y2={originY} stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
          <circle cx={originX} cy={topPy} r="6" fill="#f43f5e" />
          <circle cx={bottomPx} cy={originY} r="6" fill="#22d3ee" />
          {/* labels */}
          <text x={originX + 8} y={topPy - 8} fontSize="10" fill="#f43f5e" fontFamily="monospace">top: y={topY.toFixed(2)}</text>
          <text x={bottomPx + 8} y={originY - 8} fontSize="10" fill="#22d3ee" fontFamily="monospace">bottom: x={bottomX.toFixed(2)}</text>
        </svg>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Ladder length L</span><span className="text-white/70 font-mono">{ladderLength}m</span></div>
          <input type="range" min={6} max={16} step={1} value={ladderLength} onChange={(e) => { setLadderLength(Number(e.target.value)); setBottomX(Math.min(bottomX, Number(e.target.value) - 1)) }} className="w-full accent-violet-500" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Bottom distance x</span><span className="text-white/70 font-mono">{bottomX.toFixed(2)}m</span></div>
          <input type="range" min={0.5} max={ladderLength - 0.3} step={0.05} value={bottomX} onChange={(e) => setBottomX(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
      </div>

      <button
        onClick={() => setPlaying((p) => !p)}
        className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-all"
      >
        {playing ? 'Pause' : 'Animate: Slide the Ladder'}
      </button>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer latex="x^2 + y^2 = L^2 \\;\\Rightarrow\\; x\\frac{dx}{dt} + y\\frac{dy}{dt} = 0" display />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-1">dx/dt (given)</p>
          <p className="text-lg font-mono text-cyan-400">+{dxdt.toFixed(2)} m/s</p>
        </div>
        <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-rose-400/70 mb-1">dy/dt (derived)</p>
          <p className="text-lg font-mono text-rose-400">{isFinite(dydt) ? dydt.toFixed(2) : '−∞'} m/s</p>
        </div>
      </div>
    </div>
  )
}

// ── Taylor Series Builder ────────────────────────────────────────────────
// Add polynomial terms one at a time and watch the approximation converge
// to the real function around x=0 — makes visible *why* more terms help.
function factorial(n: number): number {
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

const TAYLOR_FUNCTIONS = [
  { label: 'eˣ', expr: 'exp(x)', terms: (n: number, x: number) => Array.from({ length: n + 1 }, (_, k) => Math.pow(x, k) / factorial(k)).reduce((a, b) => a + b, 0) },
  { label: 'sin(x)', expr: 'sin(x)', terms: (n: number, x: number) => {
      let sum = 0
      for (let k = 0; k <= n; k++) {
        const power = 2 * k + 1
        sum += (Math.pow(-1, k) * Math.pow(x, power)) / factorial(power)
      }
      return sum
    } },
  { label: 'cos(x)', expr: 'cos(x)', terms: (n: number, x: number) => {
      let sum = 0
      for (let k = 0; k <= n; k++) {
        const power = 2 * k
        sum += (Math.pow(-1, k) * Math.pow(x, power)) / factorial(power)
      }
      return sum
    } },
  { label: '1/(1−x)', expr: '1 / (1 - x)', terms: (n: number, x: number) => Array.from({ length: n + 1 }, (_, k) => Math.pow(x, k)).reduce((a, b) => a + b, 0) },
]

function TaylorSeriesBuilder() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 560, h: 320 })
  const [fnIdx, setFnIdx] = useState(1) // sin(x) default — visually satisfying
  const [numTerms, setNumTerms] = useState(1)

  const fn = TAYLOR_FUNCTIONS[fnIdx]

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(240, Math.min(360, w * 0.6)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const margin = { top: 16, right: 16, bottom: 30, left: 40 }
    const innerW = W - margin.left - margin.right
    const innerH = H - margin.top - margin.bottom

    const xMin = -6, xMax = 6
    const { points: realPts } = buildPoints(fn.expr, xMin, xMax, 500)
    const finiteReal = realPts.filter((p) => isFinite(p.y) && Math.abs(p.y) < 30)

    const approxPts = d3.range(xMin, xMax, 0.05).map((xv) => ({ x: xv, y: fn.terms(numTerms, xv) }))

    const yMin = Math.min(-4, ...finiteReal.map((p) => p.y))
    const yMax = Math.max(4, ...finiteReal.map((p) => p.y))

    const x = d3.scaleLinear().domain([xMin, xMax]).range([0, innerW])
    const y = d3.scaleLinear().domain([yMin, yMax]).range([innerH, 0])

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', '#09090b')
    g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', 'rgba(255,255,255,0.12)')
    g.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', 0).attr('y2', innerH).attr('stroke', 'rgba(255,255,255,0.12)')

    // real function (background reference)
    const lineReal = d3.line<{ x: number; y: number }>().defined((d) => isFinite(d.y)).x((d) => x(d.x)).y((d) => y(d.y))
    g.append('path').attr('d', lineReal(realPts)).attr('fill', 'none').attr('stroke', 'rgba(167,139,250,0.35)').attr('stroke-width', 2)

    // taylor approximation
    const lineApprox = d3.line<{ x: number; y: number }>().defined((d) => isFinite(d.y)).x((d) => x(d.x)).y((d) => y(d.y))
    g.append('path').attr('d', lineApprox(approxPts)).attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2.5)

    // center point (x=0)
    g.append('circle').attr('cx', x(0)).attr('cy', y(fn.terms(numTerms, 0))).attr('r', 4).attr('fill', '#f59e0b')

    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dims, fn, numTerms])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        The <span className="text-violet-300">real function</span> (faint) vs. its{' '}
        <span className="text-cyan-400">Taylor polynomial</span> approximation centered at x=0. Add terms and
        watch the approximation hug the real curve over a wider and wider range.
      </p>

      <div className="flex flex-wrap gap-2">
        {TAYLOR_FUNCTIONS.map((f, i) => (
          <button
            key={f.label}
            onClick={() => { setFnIdx(i); setNumTerms(1) }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${fnIdx === i ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'border-white/8 text-white/40 hover:text-white/70'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/40">Terms included</span>
          <span className="text-white/70 font-mono">{numTerms + 1}</span>
        </div>
        <input type="range" min={0} max={10} step={1} value={numTerms} onChange={(e) => setNumTerms(Number(e.target.value))} className="w-full accent-cyan-500" />
      </div>

      <p className="text-xs text-white/35 text-center">
        More terms → the cyan approximation matches the violet real function over a wider interval around x=0.
      </p>
    </div>
  )
}

// ── Main Lab Component ────────────────────────────────────────────────────
export function CalculusLab() {
  const [exp, setExp] = useState<ExpType>('limits')

  const EXPS: { id: ExpType; label: string; icon: LucideIcon }[] = [
    { id: 'limits', label: 'Limits Explorer', icon: GitBranch },
    { id: 'relatedrates', label: 'Related Rates', icon: Move3d },
    { id: 'taylor', label: 'Taylor Series', icon: Layers3 },
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
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {exp === 'limits' && <LimitsExplorer />}
      {exp === 'relatedrates' && <RelatedRatesLadder />}
      {exp === 'taylor' && <TaylorSeriesBuilder />}
    </div>
  )
}
