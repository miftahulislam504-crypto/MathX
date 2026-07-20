'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import { LatexRenderer } from '@/components/math/LatexRenderer'

interface Pt { x: number; y: number }
const MARGIN = { t: 20, r: 20, b: 44, l: 52 }

function fmt(n: number, d = 3): string {
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(d)
}

// Semi-implicit (symplectic) Euler — stable for oscillatory systems even with modest step sizes.
function simulate(m: number, k: number, c: number, x0: number, duration: number, steps: number): Pt[] {
  const dt = duration / steps
  let x = x0, v = 0
  const pts: Pt[] = [{ x: 0, y: x }]
  for (let i = 1; i <= steps; i++) {
    const a = (-k * x - c * v) / m
    v += a * dt
    x += v * dt
    pts.push({ x: i * dt, y: x })
  }
  return pts
}

export function EngineeringModels() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 600, h: 280 })

  const [m, setM] = useState(1)
  const [k, setK] = useState(4)
  const [c, setC] = useState(0.5)
  const [x0, setX0] = useState(1)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(300, w), h: Math.max(200, Math.min(320, w * 0.42)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const zeta = c / (2 * Math.sqrt(m * k))
  const omega0 = Math.sqrt(k / m)
  const regime = zeta < 1 ? 'underdamped' : Math.abs(zeta - 1) < 0.02 ? 'critically damped' : 'overdamped'

  const duration = Math.min(30, Math.max(8, 16 / Math.max(0.15, omega0)))
  const points = useMemo(() => simulate(m, k, c, x0, duration, 600), [m, k, c, x0, duration])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w - MARGIN.l - MARGIN.r
    const H = dims.h - MARGIN.t - MARGIN.b
    svg.attr('width', dims.w).attr('height', dims.h)
    const g = svg.append('g').attr('transform', `translate(${MARGIN.l},${MARGIN.t})`)
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    const yExtent = Math.max(Math.abs(x0), 0.1) * 1.2
    const xSc = d3.scaleLinear().domain([0, duration]).range([0, W])
    const ySc = d3.scaleLinear().domain([-yExtent, yExtent]).range([H, 0])

    xSc.ticks(6).forEach((tck) => g.append('line').attr('x1', xSc(tck)).attr('x2', xSc(tck)).attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.04)'))
    ySc.ticks(5).forEach((tck) => g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ySc(tck)).attr('y2', ySc(tck)).attr('stroke', 'rgba(255,255,255,0.04)'))
    g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ySc(0)).attr('y2', ySc(0)).attr('stroke', 'rgba(255,255,255,0.15)')

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(xSc).ticks(6).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })
    g.append('g').call(d3.axisLeft(ySc).ticks(5).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').attr('dx', '-4px'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })

    g.append('text').attr('x', W / 2).attr('y', H + 36).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').text('time t (s)')
    g.append('text').attr('transform', `rotate(-90)`).attr('x', -H / 2).attr('y', -38).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').text('position x')

    const line = d3.line<Pt>().x((p) => xSc(p.x)).y((p) => ySc(p.y)).curve(d3.curveMonotoneX)
    g.append('path').datum(points).attr('d', line).attr('fill', 'none').attr('stroke', '#94a3b8').attr('stroke-width', 2.5)

    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims, points, x0, duration])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        A mass on a spring with friction — the classic engineering model behind car suspensions, building
        earthquake dampers, and vibration control. The damping ratio ζ determines whether the system oscillates
        as it settles or glides straight back to rest.
      </p>

      <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">System Parameters</p>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Mass m</span><span className="font-mono">{fmt(m, 1)} kg</span></div>
            <input type="range" min={0.2} max={5} step={0.1} value={m} onChange={(e) => setM(Number(e.target.value))} className="w-full accent-slate-400" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Spring stiffness k</span><span className="font-mono">{fmt(k, 1)} N/m</span></div>
            <input type="range" min={0.5} max={20} step={0.5} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-slate-400" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Damping coefficient c</span><span className="font-mono">{fmt(c, 2)} N·s/m</span></div>
            <input type="range" min={0} max={8} step={0.1} value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full accent-slate-400" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Initial displacement x₀</span><span className="font-mono">{fmt(x0, 2)} m</span></div>
            <input type="range" min={0.2} max={2} step={0.1} value={x0} onChange={(e) => setX0(Number(e.target.value))} className="w-full accent-slate-400" />
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Live Results</p>
          <div className="space-y-2.5">
            <div className="flex justify-between"><span className="text-xs text-white/40">Damping ratio ζ</span><span className="text-sm font-mono text-slate-300">{fmt(zeta)}</span></div>
            <div className="flex justify-between"><span className="text-xs text-white/40">Natural frequency ω₀</span><span className="text-sm font-mono text-slate-300">{fmt(omega0)} rad/s</span></div>
            <div className="flex justify-between"><span className="text-xs text-white/40">Regime</span>
              <span className={`text-sm font-mono ${regime === 'underdamped' ? 'text-cyan-400' : regime === 'overdamped' ? 'text-amber-400' : 'text-emerald-400'}`}>{regime}</span>
            </div>
          </div>
          <p className="text-[10px] text-white/25 mt-3 leading-relaxed">
            {regime === 'underdamped' && 'ζ < 1 — the system oscillates, with amplitude shrinking each cycle.'}
            {regime === 'overdamped' && 'ζ > 1 — too much damping; the system creeps back to rest without oscillating.'}
            {regime === 'critically damped' && 'ζ ≈ 1 — the fastest possible return to rest with no oscillation at all. This is the design target for car shock absorbers.'}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
        <LatexRenderer latex={`m\\ddot{x} + c\\dot{x} + kx = 0, \\quad \\zeta = \\dfrac{c}{2\\sqrt{mk}} = ${fmt(zeta)}`} display />
      </div>
    </div>
  )
}
