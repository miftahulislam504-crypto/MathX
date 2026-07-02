'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import {
  buildPoints,
  buildDerivativePoints,
  buildIntegralRegion,
  numericalIntegral,
  tangentLine,
  pickColor,
  PlotPoint,
} from '@/lib/math/plotter'
import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────
interface FnEntry {
  id: string
  expr: string
  color: string
  visible: boolean
  error?: string
}

interface PlotMode {
  derivative: boolean
  integral: boolean
  tangent: boolean
}

// ─── Constants ───────────────────────────────────────────────────────
const MARGIN = { top: 20, right: 24, bottom: 44, left: 52 }
const GRID_COLOR = 'rgba(255,255,255,0.04)'
const AXIS_COLOR = 'rgba(255,255,255,0.15)'
const TICK_COLOR = 'rgba(255,255,255,0.3)'

// ─── Component ───────────────────────────────────────────────────────
export function FunctionPlotter() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [functions, setFunctions] = useState<FnEntry[]>([
    { id: '1', expr: 'x^2', color: pickColor(0), visible: true },
  ])
  const [inputDraft, setInputDraft] = useState('')
  const [xRange, setXRange] = useState<[number, number]>([-8, 8])
  const [yRange, setYRange] = useState<[number, number]>([-5, 12])
  const [mode, setMode] = useState<PlotMode>({ derivative: false, integral: false, tangent: false })
  const [tangentX, setTangentX] = useState(1)
  const [integralA, setIntegralA] = useState(-2)
  const [integralB, setIntegralB] = useState(2)
  const [integralResult, setIntegralResult] = useState<number | null>(null)
  const [dims, setDims] = useState({ width: 700, height: 420 })

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      setDims({ width: Math.max(300, width), height: Math.min(480, Math.max(300, width * 0.55)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // ─── Draw ──────────────────────────────────────────────────────────
  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const W = dims.width - MARGIN.left - MARGIN.right
    const H = dims.height - MARGIN.top - MARGIN.bottom

    const g = svg
      .attr('width', dims.width)
      .attr('height', dims.height)
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const xScale = d3.scaleLinear().domain(xRange).range([0, W])
    const yScale = d3.scaleLinear().domain(yRange).range([H, 0])

    // ── Background ──
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    // ── Grid lines ──
    const xTicks = xScale.ticks(10)
    const yTicks = yScale.ticks(8)

    g.selectAll('.grid-x').data(xTicks).join('line')
      .attr('class', 'grid-x')
      .attr('x1', (d) => xScale(d)).attr('x2', (d) => xScale(d))
      .attr('y1', 0).attr('y2', H)
      .attr('stroke', GRID_COLOR).attr('stroke-width', 1)

    g.selectAll('.grid-y').data(yTicks).join('line')
      .attr('class', 'grid-y')
      .attr('x1', 0).attr('x2', W)
      .attr('y1', (d) => yScale(d)).attr('y2', (d) => yScale(d))
      .attr('stroke', GRID_COLOR).attr('stroke-width', 1)

    // ── Axes ──
    const x0 = Math.max(0, Math.min(W, xScale(0)))
    const y0 = Math.max(0, Math.min(H, yScale(0)))

    g.append('line').attr('x1', 0).attr('x2', W).attr('y1', y0).attr('y2', y0)
      .attr('stroke', AXIS_COLOR).attr('stroke-width', 1.5)
    g.append('line').attr('x1', x0).attr('x2', x0).attr('y1', 0).attr('y2', H)
      .attr('stroke', AXIS_COLOR).attr('stroke-width', 1.5)

    // ── Axis labels ──
    const xAxis = d3.axisBottom(xScale).ticks(8).tickSize(4)
    const yAxis = d3.axisLeft(yScale).ticks(6).tickSize(4)

    g.append('g').attr('transform', `translate(0,${y0})`).call(xAxis)
      .call((ax) => {
        ax.select('.domain').remove()
        ax.selectAll('.tick line').attr('stroke', TICK_COLOR)
        ax.selectAll('.tick text')
          .attr('fill', TICK_COLOR).attr('font-size', '10px').attr('font-family', 'monospace')
      })

    g.append('g').attr('transform', `translate(${x0},0)`).call(yAxis)
      .call((ax) => {
        ax.select('.domain').remove()
        ax.selectAll('.tick line').attr('stroke', TICK_COLOR)
        ax.selectAll('.tick text')
          .attr('fill', TICK_COLOR).attr('font-size', '10px').attr('font-family', 'monospace')
          .attr('dx', '-4px')
      })

    const clip = svg.append('defs').append('clipPath').attr('id', 'plot-clip')
    clip.append('rect').attr('width', W).attr('height', H)
    const plotG = g.append('g').attr('clip-path', 'url(#plot-clip)')

    const lineGen = d3.line<PlotPoint>()
      .defined((d) => isFinite(d.y))
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveCatmullRom.alpha(0.5))

    // ── Integral shading (first visible fn) ──
    const firstVis = functions.find((f) => f.visible)
    if (mode.integral && firstVis) {
      const region = buildIntegralRegion(firstVis.expr, integralA, integralB)
      const areaGen = d3.area<PlotPoint>()
        .defined((d) => isFinite(d.y))
        .x((d) => xScale(d.x))
        .y0(yScale(0))
        .y1((d) => yScale(d.y))

      plotG.append('path')
        .datum(region)
        .attr('d', areaGen)
        .attr('fill', firstVis.color)
        .attr('fill-opacity', 0.18)
        .attr('stroke', firstVis.color)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.4)
        .attr('stroke-dasharray', '4,3')

      // Boundary lines
      ;[integralA, integralB].forEach((bnd) => {
        g.append('line')
          .attr('x1', xScale(bnd)).attr('x2', xScale(bnd))
          .attr('y1', 0).attr('y2', H)
          .attr('stroke', firstVis.color).attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '6,3').attr('opacity', 0.7)
      })

      // Result label
      const result = numericalIntegral(firstVis.expr, integralA, integralB)
      setIntegralResult(result)
    } else {
      setIntegralResult(null)
    }

    // ── Function curves ──
    functions.forEach((fn) => {
      if (!fn.visible) return
      const { points, valid } = buildPoints(fn.expr, xRange[0], xRange[1])
      if (!valid) return

      plotG.append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', fn.color)
        .attr('stroke-width', 2.2)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', lineGen)

      // ── Derivative overlay ──
      if (mode.derivative) {
        const dpts = buildDerivativePoints(fn.expr, xRange[0], xRange[1])
        plotG.append('path')
          .datum(dpts)
          .attr('fill', 'none')
          .attr('stroke', fn.color)
          .attr('stroke-width', 1.6)
          .attr('stroke-dasharray', '6,4')
          .attr('opacity', 0.65)
          .attr('d', lineGen)
      }

      // ── Tangent line ──
      if (mode.tangent) {
        const tpts = tangentLine(fn.expr, tangentX, xRange[0], xRange[1])
        plotG.append('line')
          .attr('x1', xScale(tpts[0].x)).attr('y1', yScale(tpts[0].y))
          .attr('x2', xScale(tpts[1].x)).attr('y2', yScale(tpts[1].y))
          .attr('stroke', fn.color).attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '5,3').attr('opacity', 0.8)

        // Touch point dot
        const { points: fp } = buildPoints(fn.expr, tangentX - 0.001, tangentX + 0.001, 3)
        const tp = fp.find((p) => isFinite(p.y))
        if (tp) {
          plotG.append('circle')
            .attr('cx', xScale(tangentX)).attr('cy', yScale(tp.y))
            .attr('r', 5).attr('fill', fn.color)
            .attr('stroke', '#09090b').attr('stroke-width', 2)
        }
      }
    })

    // ── Border ──
    g.append('rect')
      .attr('width', W).attr('height', H)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.06)')
      .attr('stroke-width', 1)

  }, [functions, xRange, yRange, mode, tangentX, integralA, integralB, dims])

  // ── Handlers ──────────────────────────────────────────────────────
  const addFunction = useCallback(() => {
    const expr = inputDraft.trim()
    if (!expr) return
    const id = Date.now().toString()
    const color = pickColor(functions.length)
    const { valid, error } = buildPoints(expr, xRange[0], xRange[1], 10)
    setFunctions((prev) => [...prev, { id, expr, color, visible: true, error: valid ? undefined : error }])
    setInputDraft('')
  }, [inputDraft, functions.length, xRange])

  const removeFunction = (id: string) =>
    setFunctions((prev) => prev.filter((f) => f.id !== id))

  const toggleVisible = (id: string) =>
    setFunctions((prev) => prev.map((f) => f.id === id ? { ...f, visible: !f.visible } : f))

  const updateExpr = (id: string, expr: string) =>
    setFunctions((prev) => prev.map((f) => {
      if (f.id !== id) return f
      const { valid, error } = buildPoints(expr, xRange[0], xRange[1], 10)
      return { ...f, expr, error: valid ? undefined : error }
    }))

  const PRESETS = [
    { label: 'sin(x)', expr: 'sin(x)' },
    { label: 'e^x', expr: 'exp(x)' },
    { label: '1/x', expr: '1/x' },
    { label: 'ln(x)', expr: 'log(x)' },
    { label: 'x³−3x', expr: 'x^3 - 3*x' },
    { label: '√x', expr: 'sqrt(x)' },
  ]

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Plot canvas ── */}
      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      {/* ── Controls row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Functions panel */}
        <div className="lg:col-span-2 rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Functions</p>

          {/* Existing functions */}
          <div className="space-y-2 mb-3">
            {functions.map((fn) => (
              <div key={fn.id} className="flex items-center gap-2">
                {/* Color dot / visibility toggle */}
                <button
                  onClick={() => toggleVisible(fn.id)}
                  className="w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-white/10 transition-opacity"
                  style={{ backgroundColor: fn.color, opacity: fn.visible ? 1 : 0.3 }}
                />
                {/* Expression input */}
                <input
                  value={fn.expr}
                  onChange={(e) => updateExpr(fn.id, e.target.value)}
                  className={cn(
                    'flex-1 bg-black/30 border rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:outline-none transition-colors',
                    fn.error ? 'border-rose-500/50 focus:border-rose-400' : 'border-white/10 focus:border-violet-500/50'
                  )}
                  placeholder="f(x) = ..."
                />
                <button
                  onClick={() => removeFunction(fn.id)}
                  className="shrink-0 text-white/25 hover:text-rose-400 transition-colors px-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new function */}
          <div className="flex gap-2">
            <input
              value={inputDraft}
              onChange={(e) => setInputDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFunction()}
              placeholder="Add function... (e.g. sin(x)*x)"
              className="flex-1 bg-black/30 border border-white/10 focus:border-violet-500/50 rounded-lg px-3 py-1.5 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none transition-colors"
            />
            <button
              onClick={addFunction}
              className="shrink-0 rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors"
            >
              + Add
            </button>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="text-[10px] text-white/20 pt-1">Presets:</span>
            {PRESETS.map((p) => (
              <button
                key={p.expr}
                onClick={() => {
                  const id = Date.now().toString()
                  const color = pickColor(functions.length)
                  setFunctions((prev) => [...prev, { id, expr: p.expr, color, visible: true }])
                }}
                className="text-[11px] font-mono text-violet-300/70 hover:text-violet-200 bg-violet-500/8 hover:bg-violet-500/15 border border-violet-500/15 rounded-md px-2 py-0.5 transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* View + Modes panel */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">View Range</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'x min', val: xRange[0], set: (v: number) => setXRange([v, xRange[1]]) },
                { label: 'x max', val: xRange[1], set: (v: number) => setXRange([xRange[0], v]) },
                { label: 'y min', val: yRange[0], set: (v: number) => setYRange([v, yRange[1]]) },
                { label: 'y max', val: yRange[1], set: (v: number) => setYRange([yRange[0], v]) },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <p className="text-[10px] text-white/25 mb-1">{label}</p>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => set(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/10 rounded-md px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Overlays</p>
            <div className="space-y-2">
              {/* Derivative toggle */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setMode((m) => ({ ...m, derivative: !m.derivative }))}
                  className={cn(
                    'w-8 h-4 rounded-full transition-colors relative',
                    mode.derivative ? 'bg-violet-600' : 'bg-white/10'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform',
                    mode.derivative ? 'translate-x-4' : 'translate-x-0.5'
                  )} />
                </div>
                <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                  Show f′(x) <span className="text-white/25">(dashed)</span>
                </span>
              </label>

              {/* Tangent toggle + slider */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setMode((m) => ({ ...m, tangent: !m.tangent }))}
                  className={cn(
                    'w-8 h-4 rounded-full transition-colors relative',
                    mode.tangent ? 'bg-amber-500' : 'bg-white/10'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform',
                    mode.tangent ? 'translate-x-4' : 'translate-x-0.5'
                  )} />
                </div>
                <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                  Tangent line
                </span>
              </label>
              {mode.tangent && (
                <div className="pl-10">
                  <p className="text-[10px] text-white/25 mb-1">x = {tangentX.toFixed(2)}</p>
                  <input
                    type="range"
                    min={xRange[0]} max={xRange[1]} step={0.05}
                    value={tangentX}
                    onChange={(e) => setTangentX(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              )}

              {/* Integral toggle */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setMode((m) => ({ ...m, integral: !m.integral }))}
                  className={cn(
                    'w-8 h-4 rounded-full transition-colors relative',
                    mode.integral ? 'bg-cyan-500' : 'bg-white/10'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform',
                    mode.integral ? 'translate-x-4' : 'translate-x-0.5'
                  )} />
                </div>
                <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                  Integral area ∫
                </span>
              </label>
              {mode.integral && (
                <div className="pl-10 space-y-2">
                  {[
                    { label: 'a (lower)', val: integralA, set: setIntegralA },
                    { label: 'b (upper)', val: integralB, set: setIntegralB },
                  ].map(({ label, val, set }) => (
                    <div key={label}>
                      <p className="text-[10px] text-white/25 mb-1">{label} = {val.toFixed(2)}</p>
                      <input
                        type="range"
                        min={xRange[0]} max={xRange[1]} step={0.1}
                        value={val}
                        onChange={(e) => set(Number(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  ))}
                  {integralResult !== null && (
                    <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/8 px-3 py-2">
                      <p className="text-[10px] text-cyan-400/60 mb-0.5">∫ result</p>
                      <p className="text-sm font-mono text-cyan-300">
                        ≈ {integralResult.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
