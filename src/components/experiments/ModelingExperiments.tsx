'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Users, Activity, Rabbit, type LucideIcon } from 'lucide-react'

type ExpType = 'population' | 'epidemic' | 'predatorprey'

// ── Population Growth ─────────────────────────────────────────────────────
function PopulationGrowth() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 560, h: 300 })
  const [growthRate, setGrowthRate] = useState(0.3)
  const [carryingCapacity, setCarryingCapacity] = useState(1000)
  const [showExponential, setShowExponential] = useState(true)
  const [showLogistic, setShowLogistic] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(240, Math.min(340, w * 0.55)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const initial = 20
  const tMax = 40

  const exponential = (t: number) => initial * Math.exp(growthRate * t)
  const logistic = (t: number) => (carryingCapacity * initial * Math.exp(growthRate * t)) / (carryingCapacity + initial * (Math.exp(growthRate * t) - 1))

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const margin = { top: 16, right: 16, bottom: 30, left: 50 }
    const innerW = W - margin.left - margin.right
    const innerH = H - margin.top - margin.bottom

    const x = d3.scaleLinear().domain([0, tMax]).range([0, innerW])
    const maxY = Math.max(carryingCapacity * 1.2, exponential(Math.min(tMax, 15)))
    const y = d3.scaleLinear().domain([0, maxY]).range([innerH, 0])

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', '#09090b')

    // carrying capacity line
    g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', y(carryingCapacity)).attr('y2', y(carryingCapacity))
      .attr('stroke', 'rgba(52,211,153,0.3)').attr('stroke-dasharray', '4,3')
    g.append('text').attr('x', innerW - 4).attr('y', y(carryingCapacity) - 6).attr('fontSize', 9).attr('fill', 'rgba(52,211,153,0.6)').attr('textAnchor', 'end').attr('fontFamily', 'monospace').text('carrying capacity')

    const line = d3.line<number>().x((t) => x(t)).defined((t) => isFinite(t))

    if (showExponential) {
      g.append('path')
        .attr('d', line.y((t) => y(exponential(t)))(d3.range(0, tMax, 0.5)))
        .attr('fill', 'none').attr('stroke', '#f43f5e').attr('stroke-width', 2)
    }
    if (showLogistic) {
      g.append('path')
        .attr('d', line.y((t) => y(logistic(t)))(d3.range(0, tMax, 0.5)))
        .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2.5)
    }

    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dims, growthRate, carryingCapacity, showExponential, showLogistic])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        <span className="text-rose-400">Exponential growth</span> assumes unlimited resources and grows forever.
        <span className="text-cyan-400"> Logistic growth</span> adds a carrying capacity — growth slows as the
        population approaches what the environment can sustain.
      </p>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setShowExponential((s) => !s)} className={`flex-1 text-xs px-3 py-2 rounded-lg border transition-all ${showExponential ? 'bg-rose-500/15 border-rose-500/40 text-rose-300' : 'border-white/8 text-white/40'}`}>
          Exponential
        </button>
        <button onClick={() => setShowLogistic((s) => !s)} className={`flex-1 text-xs px-3 py-2 rounded-lg border transition-all ${showLogistic ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'border-white/8 text-white/40'}`}>
          Logistic
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Growth rate r</span><span className="text-white/70 font-mono">{growthRate.toFixed(2)}</span></div>
          <input type="range" min={0.05} max={0.6} step={0.05} value={growthRate} onChange={(e) => setGrowthRate(Number(e.target.value))} className="w-full accent-violet-500" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Carrying capacity K</span><span className="text-white/70 font-mono">{carryingCapacity}</span></div>
          <input type="range" min={200} max={2000} step={100} value={carryingCapacity} onChange={(e) => setCarryingCapacity(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
      </div>
    </div>
  )
}

// ── Epidemic Spread (SIR Model) ───────────────────────────────────────────
function EpidemicSpread() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 560, h: 300 })
  const [beta, setBeta] = useState(0.3) // infection rate
  const [gamma, setGamma] = useState(0.1) // recovery rate

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(240, Math.min(340, w * 0.55)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Simulate SIR via simple Euler integration
  const N = 1000
  const days = 120
  const dt = 1
  const series = (() => {
    let S = N - 5, I = 5, R = 0
    const out: { t: number; S: number; I: number; R: number }[] = [{ t: 0, S, I, R }]
    for (let t = 1; t <= days; t++) {
      const newInfections = (beta * S * I) / N
      const newRecoveries = gamma * I
      S = Math.max(0, S - newInfections * dt)
      I = Math.max(0, I + (newInfections - newRecoveries) * dt)
      R = Math.max(0, R + newRecoveries * dt)
      out.push({ t, S, I, R })
    }
    return out
  })()

  const peakInfected = Math.max(...series.map((d) => d.I))
  const peakDay = series.find((d) => d.I === peakInfected)?.t ?? 0
  const totalInfected = N - series[series.length - 1].S
  const r0 = beta / gamma

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const margin = { top: 16, right: 16, bottom: 30, left: 50 }
    const innerW = W - margin.left - margin.right
    const innerH = H - margin.top - margin.bottom

    const x = d3.scaleLinear().domain([0, days]).range([0, innerW])
    const y = d3.scaleLinear().domain([0, N]).range([innerH, 0])

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', '#09090b')

    const mkLine = (key: 'S' | 'I' | 'R') => d3.line<{ t: number; S: number; I: number; R: number }>().x((d) => x(d.t)).y((d) => y(d[key]))

    g.append('path').attr('d', mkLine('S')(series)).attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2)
    g.append('path').attr('d', mkLine('I')(series)).attr('fill', 'none').attr('stroke', '#f43f5e').attr('stroke-width', 2.5)
    g.append('path').attr('d', mkLine('R')(series)).attr('fill', 'none').attr('stroke', '#34d399').attr('stroke-width', 2)

    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dims, series])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        The SIR model splits a population into <span className="text-cyan-400">Susceptible</span>,{' '}
        <span className="text-rose-400">Infected</span>, and <span className="text-emerald-400">Recovered</span> —
        a foundational model in epidemiology. R₀ (average people each infected person infects) determines whether
        an outbreak grows or dies out.
      </p>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="flex gap-4 justify-center text-[11px]">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />Susceptible</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" />Infected</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />Recovered</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Infection rate β</span><span className="text-white/70 font-mono">{beta.toFixed(2)}</span></div>
          <input type="range" min={0.05} max={0.6} step={0.05} value={beta} onChange={(e) => setBeta(Number(e.target.value))} className="w-full accent-rose-500" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Recovery rate γ</span><span className="text-white/70 font-mono">{gamma.toFixed(2)}</span></div>
          <input type="range" min={0.02} max={0.3} step={0.02} value={gamma} onChange={(e) => setGamma(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">R₀</p>
          <p className={`text-lg font-mono ${r0 > 1 ? 'text-rose-400' : 'text-emerald-400'}`}>{r0.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Peak Day</p>
          <p className="text-lg font-mono text-amber-400">{peakDay}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Total Infected</p>
          <p className="text-lg font-mono text-cyan-400">{Math.round(totalInfected)}</p>
        </div>
      </div>

      {r0 <= 1 && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-center">
          R₀ ≤ 1 — the outbreak dies out on its own; each infected person infects fewer than one other, on average.
        </p>
      )}
    </div>
  )
}

// ── Predator-Prey (Lotka-Volterra) ────────────────────────────────────────
function PredatorPrey() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 560, h: 300 })
  const [alpha, setAlpha] = useState(1.0) // prey growth rate
  const [beta, setBeta] = useState(0.1)  // predation rate
  const [delta, setDelta] = useState(0.075) // predator growth from predation
  const [gamma, setGamma] = useState(1.5) // predator death rate

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(240, Math.min(340, w * 0.55)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const series = (() => {
    let prey = 10, pred = 5
    const dt = 0.05
    const steps = 2000
    const out: { t: number; prey: number; pred: number }[] = [{ t: 0, prey, pred }]
    for (let i = 1; i <= steps; i++) {
      const dPrey = alpha * prey - beta * prey * pred
      const dPred = delta * prey * pred - gamma * pred
      prey = Math.max(0, prey + dPrey * dt)
      pred = Math.max(0, pred + dPred * dt)
      if (i % 10 === 0) out.push({ t: i * dt, prey, pred })
    }
    return out
  })()

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const margin = { top: 16, right: 16, bottom: 30, left: 50 }
    const innerW = W - margin.left - margin.right
    const innerH = H - margin.top - margin.bottom

    const tMax = series[series.length - 1].t
    const maxPop = Math.max(...series.map((d) => Math.max(d.prey, d.pred)))
    const x = d3.scaleLinear().domain([0, tMax]).range([0, innerW])
    const y = d3.scaleLinear().domain([0, maxPop * 1.1]).range([innerH, 0])

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', '#09090b')

    const preyLine = d3.line<{ t: number; prey: number; pred: number }>().x((d) => x(d.t)).y((d) => y(d.prey))
    const predLine = d3.line<{ t: number; prey: number; pred: number }>().x((d) => x(d.t)).y((d) => y(d.pred))

    g.append('path').attr('d', preyLine(series)).attr('fill', 'none').attr('stroke', '#34d399').attr('stroke-width', 2)
    g.append('path').attr('d', predLine(series)).attr('fill', 'none').attr('stroke', '#f43f5e').attr('stroke-width', 2)

    g.append('rect').attr('width', innerW).attr('height', innerH).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dims, series])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        The Lotka-Volterra equations model two species locked in a cycle: more{' '}
        <span className="text-emerald-400">prey</span> feeds more{' '}
        <span className="text-rose-400">predators</span>, which then reduces prey, which then starves
        predators — repeating forever in an oscillating cycle.
      </p>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="flex gap-4 justify-center text-[11px]">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />Prey</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" />Predators</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Prey growth (α)', v: alpha, s: setAlpha, min: 0.3, max: 2, step: 0.1 },
          { label: 'Predation rate (β)', v: beta, s: setBeta, min: 0.02, max: 0.3, step: 0.02 },
          { label: 'Predator growth (δ)', v: delta, s: setDelta, min: 0.02, max: 0.2, step: 0.01 },
          { label: 'Predator death (γ)', v: gamma, s: setGamma, min: 0.5, max: 3, step: 0.1 },
        ].map((f) => (
          <div key={f.label} className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <div className="flex justify-between text-[11px] mb-1.5"><span className="text-white/40">{f.label}</span><span className="text-white/70 font-mono">{f.v.toFixed(2)}</span></div>
            <input type="range" min={f.min} max={f.max} step={f.step} value={f.v} onChange={(e) => f.s(Number(e.target.value))} className="w-full accent-violet-500" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Experiment Component ─────────────────────────────────────────────
export function ModelingExperiments() {
  const [exp, setExp] = useState<ExpType>('population')

  const EXPS: { id: ExpType; label: string; icon: LucideIcon }[] = [
    { id: 'population', label: 'Population Growth', icon: Users },
    { id: 'epidemic', label: 'Epidemic Spread', icon: Activity },
    { id: 'predatorprey', label: 'Predator-Prey', icon: Rabbit },
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

      {exp === 'population' && <PopulationGrowth />}
      {exp === 'epidemic' && <EpidemicSpread />}
      {exp === 'predatorprey' && <PredatorPrey />}
    </div>
  )
}
