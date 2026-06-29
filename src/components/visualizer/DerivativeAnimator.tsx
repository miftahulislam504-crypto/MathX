'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { buildPoints, tangentLine, buildDerivativePoints, PlotPoint } from '@/lib/math/plotter'
import { create, all } from 'mathjs'

const math = create(all)

const MARGIN = { top: 16, right: 16, bottom: 36, left: 48 }

function evalAt(expr: string, x: number): number {
  try {
    const v = math.compile(expr).evaluate({ x }) as number
    return isFinite(v) ? v : NaN
  } catch { return NaN }
}

export function DerivativeAnimator() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const [expr, setExpr] = useState('x^3 - 3*x')
  const [draft, setDraft] = useState('x^3 - 3*x')
  const [x0, setX0] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [dims, setDims] = useState({ width: 640, height: 380 })
  const xRange: [number, number] = [-4, 4]
  const yRange: [number, number] = [-8, 8]

  // Resize
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      setDims({ width: Math.max(280, width), height: Math.max(260, Math.min(400, width * 0.58)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Animation loop
  useEffect(() => {
    if (!playing) { cancelAnimationFrame(rafRef.current); return }
    let direction = 1
    let val = x0

    const tick = () => {
      val += direction * 0.025
      if (val >= xRange[1] - 0.2) direction = -1
      if (val <= xRange[0] + 0.2) direction = 1
      setX0(Number(val.toFixed(3)))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, expr])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.width - MARGIN.left - MARGIN.right
    const H = dims.height - MARGIN.top - MARGIN.bottom

    const xScale = d3.scaleLinear().domain(xRange).range([0, W])
    const yScale = d3.scaleLinear().domain(yRange).range([H, 0])

    const g = svg
      .attr('width', dims.width).attr('height', dims.height)
      .append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    // Grid
    xScale.ticks(8).forEach((t) => {
      g.append('line').attr('x1', xScale(t)).attr('x2', xScale(t))
        .attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.04)')
    })
    yScale.ticks(6).forEach((t) => {
      g.append('line').attr('x1', 0).attr('x2', W)
        .attr('y1', yScale(t)).attr('y2', yScale(t)).attr('stroke', 'rgba(255,255,255,0.04)')
    })

    // Axes
    const ax0 = Math.max(0, Math.min(W, xScale(0)))
    const ay0 = Math.max(0, Math.min(H, yScale(0)))
    g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ay0).attr('y2', ay0)
      .attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-width', 1.5)
    g.append('line').attr('x1', ax0).attr('x2', ax0).attr('y1', 0).attr('y2', H)
      .attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-width', 1.5)

    // Tick labels
    g.append('g').attr('transform', `translate(0,${ay0})`).call(d3.axisBottom(xScale).ticks(7).tickSize(3))
      .call((a) => {
        a.select('.domain').remove()
        a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.2)')
        a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace')
      })
    g.append('g').attr('transform', `translate(${ax0},0)`).call(d3.axisLeft(yScale).ticks(5).tickSize(3))
      .call((a) => {
        a.select('.domain').remove()
        a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.2)')
        a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').attr('dx', '-4px')
      })

    const clip = svg.append('defs').append('clipPath').attr('id', 'da-clip')
    clip.append('rect').attr('width', W).attr('height', H)
    const pg = g.append('g').attr('clip-path', 'url(#da-clip)')

    const line = d3.line<PlotPoint>().defined((d) => isFinite(d.y))
      .x((d) => xScale(d.x)).y((d) => yScale(d.y)).curve(d3.curveCatmullRom.alpha(0.5))

    // f(x)
    const { points: fpts } = buildPoints(expr, xRange[0], xRange[1])
    pg.append('path').datum(fpts).attr('fill', 'none')
      .attr('stroke', '#7c3aed').attr('stroke-width', 2.5).attr('d', line)

    // f′(x)
    const dpts = buildDerivativePoints(expr, xRange[0], xRange[1])
    pg.append('path').datum(dpts).attr('fill', 'none')
      .attr('stroke', '#06b6d4').attr('stroke-width', 1.8).attr('stroke-dasharray', '6,4').attr('d', line)

    // Tangent line at x0
    const tpts = tangentLine(expr, x0, xRange[0], xRange[1])
    pg.append('line')
      .attr('x1', xScale(tpts[0].x)).attr('y1', yScale(tpts[0].y))
      .attr('x2', xScale(tpts[1].x)).attr('y2', yScale(tpts[1].y))
      .attr('stroke', '#f59e0b').attr('stroke-width', 1.8).attr('stroke-dasharray', '5,3').attr('opacity', 0.9)

    // Point on f(x)
    const fy = evalAt(expr, x0)
    if (isFinite(fy)) {
      pg.append('circle').attr('cx', xScale(x0)).attr('cy', yScale(fy))
        .attr('r', 5).attr('fill', '#7c3aed').attr('stroke', '#09090b').attr('stroke-width', 2)
    }

    // Point on f′(x)
    const dy = evalAt(expr, x0)
    const h = 1e-6
    const slope = (evalAt(expr, x0 + h) - evalAt(expr, x0 - h)) / (2 * h)
    if (isFinite(slope)) {
      pg.append('circle').attr('cx', xScale(x0)).attr('cy', yScale(slope))
        .attr('r', 4).attr('fill', '#06b6d4').attr('stroke', '#09090b').attr('stroke-width', 2)
    }

    // Vertical dashed guide
    pg.append('line').attr('x1', xScale(x0)).attr('x2', xScale(x0))
      .attr('y1', 0).attr('y2', H)
      .attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-dasharray', '3,3')

    // Info annotation
    const infoX = x0 > 0 ? xScale(x0) - 8 : xScale(x0) + 8
    const anchor = x0 > 0 ? 'end' : 'start'
    if (isFinite(fy) && isFinite(slope)) {
      const bg = g.append('g').attr('transform', `translate(${infoX},${yScale(fy) - 28})`)
      bg.append('rect').attr('x', anchor === 'end' ? -110 : 0).attr('y', -14)
        .attr('width', 110).attr('height', 36).attr('rx', 5)
        .attr('fill', 'rgba(0,0,0,0.7)').attr('stroke', 'rgba(255,255,255,0.08)')
      bg.append('text').attr('x', anchor === 'end' ? -6 : 6).attr('y', 0)
        .attr('fill', '#a78bfa').attr('font-size', '10px').attr('font-family', 'monospace').attr('text-anchor', anchor)
        .text(`x=${x0.toFixed(2)}  f=${fy.toFixed(2)}`)
      bg.append('text').attr('x', anchor === 'end' ? -6 : 6).attr('y', 14)
        .attr('fill', '#22d3ee').attr('font-size', '10px').attr('font-family', 'monospace').attr('text-anchor', anchor)
        .text(`slope f′=${slope.toFixed(3)}`)
    }

    // Legend
    const leg = [
      { color: '#7c3aed', label: 'f(x)', dash: '' },
      { color: '#06b6d4', label: "f′(x)", dash: '4,3' },
      { color: '#f59e0b', label: 'tangent', dash: '5,3' },
    ]
    leg.forEach((l, i) => {
      const lx = 12, ly = 12 + i * 16
      g.append('line').attr('x1', lx).attr('x2', lx + 20).attr('y1', ly).attr('y2', ly)
        .attr('stroke', l.color).attr('stroke-width', 2)
        .attr('stroke-dasharray', l.dash || '0')
      g.append('text').attr('x', lx + 26).attr('y', ly + 4)
        .attr('fill', l.color).attr('font-size', '10px').attr('font-family', 'monospace')
        .text(l.label)
    })

  }, [expr, x0, dims])

  const apply = () => {
    const { valid } = buildPoints(draft, xRange[0], xRange[1], 10)
    if (valid) setExpr(draft)
  }

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      {/* Controls */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Function</p>
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && apply()}
              placeholder="f(x) = ..."
              className="flex-1 bg-black/30 border border-white/10 focus:border-violet-500/50 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none transition-colors"
            />
            <button onClick={apply}
              className="shrink-0 rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition-colors">
              Apply
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {['sin(x)', 'cos(x)', 'x^3 - 3*x', 'exp(-x^2)', 'tan(x)'].map((p) => (
              <button key={p} onClick={() => { setDraft(p); setExpr(p) }}
                className="text-[11px] font-mono text-violet-300/60 hover:text-violet-200 bg-violet-500/8 border border-violet-500/15 rounded-md px-2 py-0.5 transition-all">
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Tangent Point x₀</p>
          <div className="flex items-center gap-3 mb-3">
            <input type="range" min={-3.8} max={3.8} step={0.02}
              value={x0} onChange={(e) => setX0(Number(e.target.value))}
              className="flex-1 accent-violet-500" />
            <span className="text-sm font-mono text-white/70 w-12 text-right">{x0.toFixed(2)}</span>
          </div>
          <button onClick={() => setPlaying((p) => !p)}
            className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all ${
              playing ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-700 hover:bg-emerald-600'
            }`}>
            {playing ? '⏸ Pause Animation' : '▶ Animate Tangent'}
          </button>
          <p className="text-[10px] text-white/20 text-center mt-2">
            Watch how slope f′(x) changes as x₀ moves
          </p>
        </div>
      </div>
    </div>
  )
}
