'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Scale, Grid3x3, TrendingUp, type LucideIcon } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type ExpType = 'balance' | 'foil' | 'quadratic'

// ── Equation Balance ─────────────────────────────────────────────────────
// A linear equation ax + b = c, shown as a two-pan balance scale.
// Each "step" applies the same operation to both sides, keeping it balanced.
interface BalanceStep {
  leftExpr: string
  rightExpr: string
  leftVal: (x: number) => number
  rightVal: number
  action: string
}

function buildBalanceSteps(a: number, b: number, c: number): BalanceStep[] {
  // Solve ax + b = c  =>  x = (c-b)/a
  const steps: BalanceStep[] = []
  steps.push({
    leftExpr: `${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}`,
    rightExpr: `${c}`,
    leftVal: (x) => a * x + b,
    rightVal: c,
    action: 'Starting equation',
  })
  steps.push({
    leftExpr: `${a}x`,
    rightExpr: `${c - b}`,
    leftVal: (x) => a * x,
    rightVal: c - b,
    action: `Subtract ${b} from both sides`,
  })
  const sol = (c - b) / a
  steps.push({
    leftExpr: 'x',
    rightExpr: sol % 1 === 0 ? `${sol}` : sol.toFixed(3),
    leftVal: () => sol,
    rightVal: sol,
    action: `Divide both sides by ${a}`,
  })
  return steps
}

function BalanceScale({ left, right, tilt }: { left: number; right: number; tilt: number }) {
  // tilt: -1 (left heavy) .. 0 (balanced) .. 1 (right heavy), visually clamped
  const angle = Math.max(-12, Math.min(12, tilt * 12))
  return (
    <svg viewBox="0 0 320 200" className="w-full max-w-md mx-auto">
      {/* stand */}
      <line x1="160" y1="180" x2="160" y2="60" stroke="#52525b" strokeWidth="6" strokeLinecap="round" />
      <rect x="120" y="176" width="80" height="10" rx="3" fill="#3f3f46" />
      {/* beam */}
      <g transform={`rotate(${angle} 160 60)`}>
        <line x1="40" y1="60" x2="280" y2="60" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
        {/* left pan */}
        <line x1="60" y1="60" x2="60" y2="110" stroke="#71717a" strokeWidth="2" />
        <ellipse cx="60" cy="115" rx="42" ry="10" fill="#7c3aed33" stroke="#a78bfa" strokeWidth="2" />
        <text x="60" y="112" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#c4b5fd">{left.toFixed(1)}</text>
        {/* right pan */}
        <line x1="260" y1="60" x2="260" y2="110" stroke="#71717a" strokeWidth="2" />
        <ellipse cx="260" cy="115" rx="42" ry="10" fill="#06b6d433" stroke="#22d3ee" strokeWidth="2" />
        <text x="260" y="112" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#67e8f9">{right.toFixed(1)}</text>
      </g>
      <circle cx="160" cy="60" r="5" fill="#a78bfa" />
    </svg>
  )
}

function EquationBalance() {
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [c, setC] = useState(19)
  const [stepIndex, setStepIndex] = useState(0)

  const steps = buildBalanceSteps(a, b, c)
  const step = steps[stepIndex]
  const xForDisplay = (c - b) / a
  const currentLeft = step.leftVal(xForDisplay)
  const currentRight = step.rightVal
  const tilt = 0 // always balanced — the whole point of the lesson

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Solving <span className="text-violet-300 font-mono">ax + b = c</span> means applying the{' '}
        <span className="text-violet-300">same operation to both sides</span> — the scale always stays balanced.
      </p>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: 'a', val: a, set: setA, min: -9, max: 9 },
          { label: 'b', val: b, set: setB, min: -20, max: 20 },
          { label: 'c', val: c, set: setC, min: -20, max: 30 },
        ].map(({ label, val, set, min, max }) => (
          <div key={label} className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/40 font-mono">{label}</span>
              <span className="text-white/70 font-mono">{val}</span>
            </div>
            <input
              type="range" min={min} max={max} step={1} value={val}
              onChange={(e) => { set(Number(e.target.value)); setStepIndex(0) }}
              className="w-full accent-violet-500"
            />
          </div>
        ))}
      </div>

      <BalanceScale left={currentLeft} right={currentRight} tilt={tilt} />

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer latex={`${step.leftExpr} = ${step.rightExpr}`} display />
        <p className="text-xs text-violet-300 mt-2">{step.action}</p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
          className="rounded-lg border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 text-xs text-white/60 hover:text-white transition-all"
        >
          ← Previous Step
        </button>
        <span className="text-xs text-white/30 font-mono">{stepIndex + 1} / {steps.length}</span>
        <button
          onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
          disabled={stepIndex === steps.length - 1}
          className="rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 text-xs font-semibold text-white transition-all"
        >
          Next Step →
        </button>
      </div>
    </div>
  )
}

// ── FOIL Expander ─────────────────────────────────────────────────────────
// Expands (px + q)(rx + s) step-by-step: First, Outer, Inner, Last
function FoilExpander() {
  const [p, setP] = useState(1)
  const [q, setQ] = useState(2)
  const [r, setR] = useState(1)
  const [s, setS] = useState(3)

  const first = p * r          // x^2 coeff
  const outer = p * s          // x coeff piece
  const inner = q * r          // x coeff piece
  const last = q * s           // constant
  const xCoeff = outer + inner

  const fmt = (n: number) => (n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`)

  const FOIL_STEPS = [
    { name: 'First', calc: `${p}x · ${r}x`, result: `${first}x²`, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/25' },
    { name: 'Outer', calc: `${p}x · ${s >= 0 ? s : `(${s})`}`, result: `${outer}x`, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/25' },
    { name: 'Inner', calc: `${q >= 0 ? q : `(${q})`} · ${r}x`, result: `${inner}x`, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/25' },
    { name: 'Last', calc: `${q >= 0 ? q : `(${q})`} · ${s >= 0 ? s : `(${s})`}`, result: `${last}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
  ]

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        FOIL expands the product of two binomials by multiplying{' '}
        <span className="text-white/60">First, Outer, Inner, Last</span> terms, then combining like terms.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'p (coeff of x, 1st)', val: p, set: setP },
          { label: 'q (const, 1st)', val: q, set: setQ },
          { label: 'r (coeff of x, 2nd)', val: r, set: setR },
          { label: 's (const, 2nd)', val: s, set: setS },
        ].map(({ label, val, set }) => (
          <div key={label} className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-white/40">{label}</span>
              <span className="text-white/70 font-mono">{val}</span>
            </div>
            <input
              type="range" min={-9} max={9} step={1} value={val}
              onChange={(e) => set(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5 text-center">
        <LatexRenderer
          latex={`(${p}x ${q >= 0 ? '+' : '-'} ${Math.abs(q)})(${r}x ${s >= 0 ? '+' : '-'} ${Math.abs(s)})`}
          display
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FOIL_STEPS.map((st) => (
          <div key={st.name} className={`rounded-lg border p-3 text-center ${st.bg}`}>
            <p className={`text-[10px] uppercase tracking-wider mb-1 ${st.color}`}>{st.name}</p>
            <p className="text-[11px] text-white/40 font-mono mb-1">{st.calc}</p>
            <p className={`text-sm font-mono ${st.color}`}>{st.result}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center">
        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Combine like terms (Outer + Inner)</p>
        <LatexRenderer
          latex={`${first}x^2 ${fmt(xCoeff)}x ${fmt(last)}`}
          display
        />
      </div>
    </div>
  )
}

// ── Quadratic Explorer ───────────────────────────────────────────────────
function QuadraticExplorer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 520, h: 320 })
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)
  const [c, setC] = useState(-2)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(240, Math.min(360, w * 0.6)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const discriminant = b * b - 4 * a * c
  const vertex = { x: -b / (2 * a), y: c - (b * b) / (4 * a) }
  const roots =
    discriminant < 0
      ? []
      : discriminant === 0
      ? [-b / (2 * a)]
      : [(-b + Math.sqrt(discriminant)) / (2 * a), (-b - Math.sqrt(discriminant)) / (2 * a)]

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }
    const innerW = W - margin.left - margin.right
    const innerH = H - margin.top - margin.bottom

    const xExtent = 10
    const x = d3.scaleLinear().domain([-xExtent, xExtent]).range([0, innerW])
    const yVals = d3.range(-xExtent, xExtent, 0.2).map((xv) => a * xv * xv + b * xv + c)
    const yMax = Math.max(10, ...yVals.filter((v) => Math.abs(v) < 1000))
    const yMin = Math.min(-10, ...yVals.filter((v) => Math.abs(v) < 1000))
    const y = d3.scaleLinear().domain([yMin, yMax]).range([innerH, 0])

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', '#09090b')

    // grid + axes
    g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', 'rgba(255,255,255,0.15)')
    g.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', 0).attr('y2', innerH).attr('stroke', 'rgba(255,255,255,0.15)')

    // parabola path
    const line = d3.line<number>()
      .x((xv) => x(xv))
      .y((xv) => y(a * xv * xv + b * xv + c))
      .curve(d3.curveBasis)
    const pathData = d3.range(-xExtent, xExtent, 0.15)
    g.append('path').attr('d', line(pathData)).attr('fill', 'none').attr('stroke', '#a78bfa').attr('stroke-width', 2.5)

    // vertex
    if (Math.abs(vertex.x) <= xExtent) {
      g.append('circle').attr('cx', x(vertex.x)).attr('cy', y(vertex.y)).attr('r', 5).attr('fill', '#f59e0b')
    }

    // roots
    roots.forEach((r) => {
      if (Math.abs(r) <= xExtent) {
        g.append('circle').attr('cx', x(r)).attr('cy', y(0)).attr('r', 5).attr('fill', '#22d3ee')
      }
    })

    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dims, a, b, c])

  return (
    <div className="space-y-5">
      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: 'a', val: a, set: setA, min: -5, max: 5 },
          { label: 'b', val: b, set: setB, min: -10, max: 10 },
          { label: 'c', val: c, set: setC, min: -10, max: 10 },
        ].map(({ label, val, set, min, max }) => (
          <div key={label} className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/40 font-mono">{label}</span>
              <span className="text-white/70 font-mono">{val}</span>
            </div>
            <input
              type="range" min={min} max={max} step={1}
              value={val}
              onChange={(e) => set(Number(e.target.value) || 0.001)}
              className="w-full accent-violet-500"
            />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer latex={`f(x) = ${a}x^2 ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`} display />
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Discriminant</p>
          <p className="text-lg font-mono text-white/70">{discriminant.toFixed(1)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Vertex</p>
          <p className="text-lg font-mono text-amber-400">({vertex.x.toFixed(2)}, {vertex.y.toFixed(2)})</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Roots</p>
          <p className="text-sm font-mono text-cyan-400">
            {roots.length === 0 ? 'None (complex)' : roots.map((r) => r.toFixed(2)).join(', ')}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main Lab Component ────────────────────────────────────────────────────
export function AlgebraLab() {
  const [exp, setExp] = useState<ExpType>('balance')

  const EXPS: { id: ExpType; label: string; icon: LucideIcon }[] = [
    { id: 'balance', label: 'Equation Balance', icon: Scale },
    { id: 'foil', label: 'FOIL Expander', icon: Grid3x3 },
    { id: 'quadratic', label: 'Quadratic Explorer', icon: TrendingUp },
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
                ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {exp === 'balance' && <EquationBalance />}
      {exp === 'foil' && <FoilExpander />}
      {exp === 'quadratic' && <QuadraticExplorer />}
    </div>
  )
}
