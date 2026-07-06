'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Mountain, TrendingDown, Flame, type LucideIcon } from 'lucide-react'

type ExpType = 'hillclimb' | 'gradient' | 'annealing'

// Shared bumpy landscape function with multiple local maxima/minima —
// deliberately chosen so naive algorithms visibly get stuck.
function landscape(x: number): number {
  return Math.sin(x * 0.8) * 3 + Math.sin(x * 2.3) * 1.2 + Math.cos(x * 0.3) * 2
}

// ── Hill Climbing ─────────────────────────────────────────────────────────
function HillClimbing() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 560, h: 280 })
  const [pos, setPos] = useState(2)
  const [running, setRunning] = useState(false)
  const [stuck, setStuck] = useState(false)
  const [history, setHistory] = useState<number[]>([2])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(220, Math.min(300, w * 0.5)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!running) return
    const step = 0.05
    const tick = () => {
      setPos((p) => {
        const here = landscape(p)
        const left = landscape(p - step)
        const right = landscape(p + step)
        if (right > here && right >= left) {
          setHistory((h) => [...h, p + step])
          return p + step
        }
        if (left > here) {
          setHistory((h) => [...h, p - step])
          return p - step
        }
        setStuck(true)
        setRunning(false)
        return p
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  const reset = (startX: number) => {
    cancelAnimationFrame(rafRef.current)
    setRunning(false)
    setStuck(false)
    setPos(startX)
    setHistory([startX])
  }

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const margin = { top: 16, right: 16, bottom: 20, left: 16 }
    const innerW = W - margin.left - margin.right
    const innerH = H - margin.top - margin.bottom

    const xDomain: [number, number] = [-8, 8]
    const yVals = d3.range(xDomain[0], xDomain[1], 0.1).map((xv) => landscape(xv))
    const x = d3.scaleLinear().domain(xDomain).range([0, innerW])
    const y = d3.scaleLinear().domain([Math.min(...yVals) - 1, Math.max(...yVals) + 1]).range([innerH, 0])

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', '#09090b')

    const line = d3.line<number>().x((xv) => x(xv)).y((xv) => y(landscape(xv))).curve(d3.curveBasis)
    const pathData = d3.range(xDomain[0], xDomain[1], 0.1)
    g.append('path').attr('d', line(pathData)).attr('fill', 'none').attr('stroke', 'rgba(167,139,250,0.5)').attr('stroke-width', 2)

    // trail
    if (history.length > 1) {
      const trailLine = d3.line<number>().x((xv) => x(xv)).y((xv) => y(landscape(xv)))
      g.append('path').attr('d', trailLine(history)).attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 1.5).attr('stroke-dasharray', '2,2')
    }

    // current position marker
    g.append('circle').attr('cx', x(pos)).attr('cy', y(landscape(pos))).attr('r', 6).attr('fill', stuck ? '#f43f5e' : '#22d3ee')

    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dims, pos, history, stuck])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Hill climbing always moves toward higher ground — simple, but it stops at the{' '}
        <span className="text-rose-400">first peak it finds</span>, even if a taller peak exists elsewhere.
        Try different starting points to see this.
      </p>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="flex flex-wrap gap-2">
        {[-6, -2, 2, 6].map((p) => (
          <button key={p} onClick={() => reset(p)} className="text-xs px-3 py-1.5 rounded-full border border-white/8 text-white/40 hover:text-white/70 transition-all">
            Start at x={p}
          </button>
        ))}
      </div>

      <button
        onClick={() => setRunning((r) => !r)}
        disabled={stuck}
        className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-white transition-all"
      >
        {running ? 'Pause' : stuck ? 'Stuck at local peak' : 'Climb'}
      </button>

      {stuck && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2 text-center">
          Reached a local maximum (height {landscape(pos).toFixed(2)}) — hill climbing has no way to know a
          taller peak might exist elsewhere.
        </p>
      )}
    </div>
  )
}

// ── Gradient Descent ──────────────────────────────────────────────────────
function lossFn(x: number) {
  return 0.05 * x ** 4 - 0.5 * x ** 2 + 0.1 * x + 3
}
function lossGrad(x: number) {
  return 0.2 * x ** 3 - x + 0.1
}

function GradientDescent() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 560, h: 280 })
  const [pos, setPos] = useState(2.5)
  const [learningRate, setLearningRate] = useState(0.1)
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState<number[]>([2.5])
  const [iterations, setIterations] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(220, Math.min(300, w * 0.5)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!running) return
    let count = 0
    const tick = () => {
      setPos((p) => {
        const grad = lossGrad(p)
        const next = p - learningRate * grad
        setHistory((h) => [...h, next])
        return next
      })
      count++
      setIterations((i) => i + 1)
      if (count < 60) rafRef.current = requestAnimationFrame(tick)
      else setRunning(false)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, learningRate])

  const reset = () => {
    cancelAnimationFrame(rafRef.current)
    setRunning(false)
    setPos(2.5)
    setHistory([2.5])
    setIterations(0)
  }

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const margin = { top: 16, right: 16, bottom: 20, left: 16 }
    const innerW = W - margin.left - margin.right
    const innerH = H - margin.top - margin.bottom

    const xDomain: [number, number] = [-3.5, 3.5]
    const yVals = d3.range(xDomain[0], xDomain[1], 0.1).map((xv) => lossFn(xv))
    const x = d3.scaleLinear().domain(xDomain).range([0, innerW])
    const y = d3.scaleLinear().domain([Math.min(...yVals) - 0.5, Math.max(...yVals) + 0.5]).range([innerH, 0])

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', '#09090b')

    const line = d3.line<number>().x((xv) => x(xv)).y((xv) => y(lossFn(xv))).curve(d3.curveBasis)
    g.append('path').attr('d', line(d3.range(xDomain[0], xDomain[1], 0.05))).attr('fill', 'none').attr('stroke', 'rgba(167,139,250,0.5)').attr('stroke-width', 2)

    if (history.length > 1) {
      const trailLine = d3.line<number>().x((xv) => x(xv)).y((xv) => y(lossFn(xv)))
      g.append('path').attr('d', trailLine(history)).attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 1.5).attr('stroke-dasharray', '2,2')
    }

    g.append('circle').attr('cx', x(pos)).attr('cy', y(lossFn(pos))).attr('r', 6).attr('fill', '#f59e0b')

    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dims, pos, history])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Gradient descent follows the <span className="text-amber-400">slope downhill</span> to minimize a loss
        function — the technique behind training most machine learning models. A learning rate too high can
        overshoot; too low converges slowly.
      </p>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/40">Learning rate</span>
          <span className="text-white/70 font-mono">{learningRate.toFixed(2)}</span>
        </div>
        <input type="range" min={0.02} max={0.6} step={0.02} value={learningRate} onChange={(e) => setLearningRate(Number(e.target.value))} className="w-full accent-amber-500" />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setRunning((r) => !r)} className="flex-1 rounded-lg bg-amber-600 hover:bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-all">
          {running ? 'Pause' : 'Descend'}
        </button>
        <button onClick={reset} className="rounded-lg border border-white/10 hover:border-white/20 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-all">
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Iterations</p>
          <p className="text-lg font-mono text-amber-400">{iterations}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Loss</p>
          <p className="text-lg font-mono text-cyan-400">{lossFn(pos).toFixed(3)}</p>
        </div>
      </div>

      {learningRate > 0.45 && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2 text-center">
          High learning rate can cause overshooting — watch the point oscillate instead of settling.
        </p>
      )}
    </div>
  )
}

// ── Simulated Annealing ───────────────────────────────────────────────────
function SimulatedAnnealing() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 560, h: 280 })
  const [pos, setPos] = useState(2)
  const [temperature, setTemperature] = useState(3)
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState<number[]>([2])
  const [bestPos, setBestPos] = useState(2)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(220, Math.min(300, w * 0.5)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!running) return
    let t = temperature
    let count = 0
    const tick = () => {
      setPos((p) => {
        const candidate = p + (Math.random() - 0.5) * 2
        const clamped = Math.max(-8, Math.min(8, candidate))
        const delta = landscape(clamped) - landscape(p)
        const accept = delta > 0 || Math.random() < Math.exp(delta / Math.max(0.01, t))
        const next = accept ? clamped : p
        setHistory((h) => [...h.slice(-40), next])
        setBestPos((b) => (landscape(next) > landscape(b) ? next : b))
        return next
      })
      t *= 0.97
      count++
      if (count < 150) rafRef.current = requestAnimationFrame(tick)
      else setRunning(false)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const reset = () => {
    cancelAnimationFrame(rafRef.current)
    setRunning(false)
    setPos(2)
    setHistory([2])
    setBestPos(2)
  }

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const margin = { top: 16, right: 16, bottom: 20, left: 16 }
    const innerW = W - margin.left - margin.right
    const innerH = H - margin.top - margin.bottom

    const xDomain: [number, number] = [-8, 8]
    const yVals = d3.range(xDomain[0], xDomain[1], 0.1).map((xv) => landscape(xv))
    const x = d3.scaleLinear().domain(xDomain).range([0, innerW])
    const y = d3.scaleLinear().domain([Math.min(...yVals) - 1, Math.max(...yVals) + 1]).range([innerH, 0])

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', '#09090b')

    const line = d3.line<number>().x((xv) => x(xv)).y((xv) => y(landscape(xv))).curve(d3.curveBasis)
    g.append('path').attr('d', line(d3.range(xDomain[0], xDomain[1], 0.1))).attr('fill', 'none').attr('stroke', 'rgba(167,139,250,0.5)').attr('stroke-width', 2)

    if (history.length > 1) {
      const trailLine = d3.line<number>().x((xv) => x(xv)).y((xv) => y(landscape(xv)))
      g.append('path').attr('d', trailLine(history)).attr('fill', 'none').attr('stroke', '#fb923c').attr('stroke-width', 1).attr('opacity', 0.5)
    }

    g.append('circle').attr('cx', x(bestPos)).attr('cy', y(landscape(bestPos))).attr('r', 5).attr('fill', 'none').attr('stroke', '#34d399').attr('stroke-width', 2)
    g.append('circle').attr('cx', x(pos)).attr('cy', y(landscape(pos))).attr('r', 6).attr('fill', '#fb923c')

    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dims, pos, history, bestPos])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Simulated annealing occasionally accepts a <span className="text-orange-400">worse</span> move — this
        lets it escape local peaks that trap plain hill climbing. As the &ldquo;temperature&rdquo; cools, it
        becomes stricter, settling near the best region found.
      </p>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/40">Starting temperature</span>
          <span className="text-white/70 font-mono">{temperature.toFixed(1)}</span>
        </div>
        <input type="range" min={0.5} max={6} step={0.5} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full accent-orange-500" />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setRunning((r) => !r)} className="flex-1 rounded-lg bg-orange-600 hover:bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all">
          {running ? 'Pause' : 'Anneal'}
        </button>
        <button onClick={reset} className="rounded-lg border border-white/10 hover:border-white/20 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-all">
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Current Height</p>
          <p className="text-lg font-mono text-orange-400">{landscape(pos).toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-1">Best Found</p>
          <p className="text-lg font-mono text-emerald-400">{landscape(bestPos).toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Experiment Component ─────────────────────────────────────────────
export function OptimizationExperiments() {
  const [exp, setExp] = useState<ExpType>('hillclimb')

  const EXPS: { id: ExpType; label: string; icon: LucideIcon }[] = [
    { id: 'hillclimb', label: 'Hill Climbing', icon: Mountain },
    { id: 'gradient', label: 'Gradient Descent', icon: TrendingDown },
    { id: 'annealing', label: 'Simulated Annealing', icon: Flame },
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

      {exp === 'hillclimb' && <HillClimbing />}
      {exp === 'gradient' && <GradientDescent />}
      {exp === 'annealing' && <SimulatedAnnealing />}
    </div>
  )
}
