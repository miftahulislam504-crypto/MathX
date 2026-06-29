'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { buildPoints, numericalIntegral, PlotPoint } from '@/lib/math/plotter'

const MARGIN = { top: 16, right: 16, bottom: 36, left: 48 }

export function IntegralVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [expr, setExpr] = useState('sin(x) + 2')
  const [draft, setDraft] = useState('sin(x) + 2')
  const [a, setA] = useState(0)
  const [b, setB] = useState(Math.PI)
  const [n, setN] = useState(12)           // Riemann rectangles
  const [method, setMethod] = useState<'exact' | 'left' | 'right' | 'midpoint'>('exact')
  const [dims, setDims] = useState({ width: 640, height: 360 })
  const xRange: [number, number] = [-1, 8]
  const yRange: [number, number] = [-1, 5]

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      setDims({ width: Math.max(280, w), height: Math.max(240, Math.min(380, w * 0.55)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.width - MARGIN.left - MARGIN.right
    const H = dims.height - MARGIN.top - MARGIN.bottom

    const xScale = d3.scaleLinear().domain(xRange).range([0, W])
    const yScale = d3.scaleLinear().domain(yRange).range([H, 0])

    const g = svg.attr('width', dims.width).attr('height', dims.height)
      .append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    // Grid
    xScale.ticks(9).forEach((t) => {
      g.append('line').attr('x1', xScale(t)).attr('x2', xScale(t)).attr('y1', 0).attr('y2', H)
        .attr('stroke', 'rgba(255,255,255,0.04)')
    })
    yScale.ticks(6).forEach((t) => {
      g.append('line').attr('x1', 0).attr('x2', W).attr('y1', yScale(t)).attr('y2', yScale(t))
        .attr('stroke', 'rgba(255,255,255,0.04)')
    })

    // Axes
    const ay0 = Math.max(0, Math.min(H, yScale(0)))
    const ax0 = Math.max(0, Math.min(W, xScale(0)))
    g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ay0).attr('y2', ay0)
      .attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-width', 1.5)
    g.append('line').attr('x1', ax0).attr('x2', ax0).attr('y1', 0).attr('y2', H)
      .attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-width', 1.5)

    g.append('g').attr('transform', `translate(0,${ay0})`).call(d3.axisBottom(xScale).ticks(7).tickSize(3))
      .call((a) => {
        a.select('.domain').remove()
        a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace')
        a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.2)')
      })
    g.append('g').attr('transform', `translate(${ax0},0)`).call(d3.axisLeft(yScale).ticks(5).tickSize(3))
      .call((a) => {
        a.select('.domain').remove()
        a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').attr('dx', '-4px')
        a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.2)')
      })

    const clip = svg.append('defs').append('clipPath').attr('id', 'int-clip')
    clip.append('rect').attr('width', W).attr('height', H)
    const pg = g.append('g').attr('clip-path', 'url(#int-clip)')

    const lineGen = d3.line<PlotPoint>().defined((d) => isFinite(d.y))
      .x((d) => xScale(d.x)).y((d) => yScale(d.y)).curve(d3.curveCatmullRom.alpha(0.5))

    // Use mathjs synchronously
    const { create, all } = require('mathjs')
    const math = create(all)
    const evalF = (x: number): number => {
      try { const v = math.compile(expr).evaluate({ x }); return isFinite(v) ? v : NaN }
      catch { return NaN }
    }

    if (method === 'exact') {
      // Smooth shaded area
      const areaData: PlotPoint[] = []
      const steps = 300
      const step = (b - a) / steps
      areaData.push({ x: a, y: 0 })
      for (let i = 0; i <= steps; i++) {
        const x = a + i * step
        const y = evalF(x)
        if (isFinite(y)) areaData.push({ x, y })
      }
      areaData.push({ x: b, y: 0 })

      const areaGen = d3.area<PlotPoint>().defined((d) => isFinite(d.y))
        .x((d) => xScale(d.x)).y0(yScale(0)).y1((d) => yScale(d.y))

      pg.append('path').datum(areaData)
        .attr('d', areaGen)
        .attr('fill', '#06b6d4').attr('fill-opacity', 0.15)
        .attr('stroke', '#06b6d4').attr('stroke-width', 1).attr('stroke-opacity', 0.3)

      // Boundary lines
      ;[a, b].forEach((bnd) => {
        pg.append('line').attr('x1', xScale(bnd)).attr('x2', xScale(bnd))
          .attr('y1', yScale(0)).attr('y2', yScale(evalF(bnd)))
          .attr('stroke', '#06b6d4').attr('stroke-width', 1.5).attr('stroke-dasharray', '5,3').attr('opacity', 0.8)
      })
    } else {
      // Riemann rectangles
      const w = (b - a) / n
      const colors = { left: '#7c3aed', right: '#f59e0b', midpoint: '#10b981' }
      const color = colors[method]

      for (let i = 0; i < n; i++) {
        const x0 = a + i * w
        const x1 = x0 + w
        const xSample = method === 'left' ? x0 : method === 'right' ? x1 : (x0 + x1) / 2
        const y = evalF(xSample)
        if (!isFinite(y)) continue

        const rectY = yScale(Math.max(0, y))
        const rectH = Math.abs(yScale(0) - yScale(y))

        pg.append('rect')
          .attr('x', xScale(x0)).attr('y', rectY).attr('width', Math.max(1, xScale(x1) - xScale(x0)))
          .attr('height', rectH)
          .attr('fill', color).attr('fill-opacity', 0.2)
          .attr('stroke', color).attr('stroke-width', 0.8).attr('stroke-opacity', 0.6)
      }
    }

    // Main curve — on top
    const { points: fpts } = buildPoints(expr, xRange[0], xRange[1])
    pg.append('path').datum(fpts).attr('fill', 'none')
      .attr('stroke', '#7c3aed').attr('stroke-width', 2.5).attr('d', lineGen)

    // a & b labels
    ;[{ v: a, lbl: 'a' }, { v: b, lbl: 'b' }].forEach(({ v, lbl }) => {
      const fy = evalF(v)
      g.append('circle').attr('cx', xScale(v)).attr('cy', isFinite(fy) ? yScale(fy) : ay0)
        .attr('r', 4).attr('fill', '#06b6d4').attr('stroke', '#09090b').attr('stroke-width', 2)
      g.append('text').attr('x', xScale(v)).attr('y', ay0 + 18)
        .attr('fill', '#22d3ee').attr('font-size', '11px').attr('font-family', 'monospace').attr('text-anchor', 'middle')
        .text(lbl)
    })

  }, [expr, a, b, n, method, dims])

  const exact = numericalIntegral(expr, a, b)
  const riemannApprox = (() => {
    try {
      const { create, all } = require('mathjs')
      const math = create(all)
      const compiled = math.compile(expr)
      const evalF = (x: number) => compiled.evaluate({ x }) as number
      const w = (b - a) / n
      let sum = 0
      for (let i = 0; i < n; i++) {
        const x0 = a + i * w
        const xSample = method === 'left' ? x0 : method === 'right' ? x0 + w : x0 + w / 2
        try { const y = evalF(xSample); if (isFinite(y)) sum += y * w } catch {}
      }
      return sum
    } catch { return NaN }
  })()

  const apply = () => {
    const { valid } = buildPoints(draft, -1, 8, 10)
    if (valid) setExpr(draft)
  }

  const METHODS = [
    { key: 'exact',    label: '∫ Exact area' },
    { key: 'left',     label: 'Left Riemann' },
    { key: 'midpoint', label: 'Midpoint' },
    { key: 'right',    label: 'Right Riemann' },
  ] as const

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Left: function + method */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-mono">f(x)</p>
            <div className="flex gap-2">
              <input value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && apply()}
                className="flex-1 bg-black/30 border border-white/10 focus:border-violet-500/50 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none transition-colors"
                placeholder="f(x) = ..." />
              <button onClick={apply}
                className="shrink-0 bg-violet-600 hover:bg-violet-500 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-colors">
                Apply
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['sin(x) + 2', 'x^2', 'cos(x) + 1', 'exp(-x^2/2)', '3 - x^2/4'].map((p) => (
                <button key={p} onClick={() => { setDraft(p); setExpr(p) }}
                  className="text-[11px] font-mono text-violet-300/60 hover:text-violet-200 bg-violet-500/8 border border-violet-500/15 rounded-md px-2 py-0.5 transition-all">
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-mono">Method</p>
            <div className="grid grid-cols-2 gap-1.5">
              {METHODS.map((m) => (
                <button key={m.key} onClick={() => setMethod(m.key)}
                  className={`text-xs rounded-lg px-3 py-2 border transition-all ${
                    method === m.key
                      ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                      : 'border-white/8 text-white/40 hover:text-white/70 hover:border-white/15'
                  }`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: bounds + result */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Bounds [a, b]</p>
            {[
              { label: 'a (lower)', val: a, set: setA },
              { label: 'b (upper)', val: b, set: setB },
            ].map(({ label, val, set }) => (
              <div key={label} className="mb-2">
                <div className="flex justify-between text-[10px] text-white/30 mb-1">
                  <span>{label}</span>
                  <span className="font-mono">{val.toFixed(3)}</span>
                </div>
                <input type="range" min={-0.99} max={7.99} step={0.05} value={val}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full accent-cyan-500" />
              </div>
            ))}
          </div>

          {method !== 'exact' && (
            <div>
              <div className="flex justify-between text-[10px] text-white/30 mb-1">
                <span>Rectangles n = {n}</span>
              </div>
              <input type="range" min={2} max={60} step={1} value={n}
                onChange={(e) => setN(Number(e.target.value))}
                className="w-full accent-violet-500" />
            </div>
          )}

          {/* Results */}
          <div className="space-y-2">
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
              <p className="text-[10px] text-cyan-400/60 mb-1">
                ∫ₐᵇ f(x) dx (Simpson's rule)
              </p>
              <p className="text-lg font-mono font-semibold text-cyan-300">
                ≈ {isFinite(exact) ? exact.toFixed(6) : '—'}
              </p>
            </div>
            {method !== 'exact' && (
              <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-2">
                <p className="text-[10px] text-violet-400/60 mb-1">
                  Riemann ({method}, n={n})
                </p>
                <p className="text-sm font-mono text-violet-300">
                  ≈ {isFinite(riemannApprox) ? riemannApprox.toFixed(6) : '—'}
                </p>
                {isFinite(exact) && isFinite(riemannApprox) && (
                  <p className="text-[10px] text-white/25 mt-1">
                    error: {Math.abs(exact - riemannApprox).toFixed(6)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
