'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import { LatexRenderer } from '@/components/math/LatexRenderer'

interface Pt { x: number; y: number }
const MARGIN = { t: 20, r: 20, b: 44, l: 52 }

function fmt(n: number, d = 1): string {
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(d)
}

export function TrafficModels() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 600, h: 280 })

  const [vf, setVf] = useState(100) // free-flow speed, km/h
  const [kj, setKj] = useState(150) // jam density, veh/km
  const [k, setK] = useState(50) // current density, veh/km — user-controlled

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(300, w), h: Math.max(200, Math.min(320, w * 0.42)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const speed = (density: number) => Math.max(0, vf * (1 - density / kj))
  const flow = (density: number) => density * speed(density)

  const currentSpeed = speed(k)
  const currentFlow = flow(k)
  const maxFlowDensity = kj / 2
  const maxFlow = flow(maxFlowDensity)
  const regime = k < maxFlowDensity ? 'free-flow' : k > maxFlowDensity ? 'congested' : 'critical'

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
      const dens = (i / 200) * kj
      points.push({ x: dens, y: flow(dens) })
    }
    const yMax = d3.max(points, (p) => p.y) as number

    const xSc = d3.scaleLinear().domain([0, kj]).range([0, W])
    const ySc = d3.scaleLinear().domain([0, yMax * 1.15]).range([H, 0])

    xSc.ticks(6).forEach((tck) => g.append('line').attr('x1', xSc(tck)).attr('x2', xSc(tck)).attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.04)'))
    ySc.ticks(5).forEach((tck) => g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ySc(tck)).attr('y2', ySc(tck)).attr('stroke', 'rgba(255,255,255,0.04)'))

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(xSc).ticks(6).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })
    g.append('g').call(d3.axisLeft(ySc).ticks(5).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').attr('dx', '-4px'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })

    g.append('text').attr('x', W / 2).attr('y', H + 36).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').text('density k (veh/km)')
    g.append('text').attr('transform', `rotate(-90)`).attr('x', -H / 2).attr('y', -38).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').text('flow q (veh/hr)')

    // free-flow region shading (left of critical density)
    g.append('rect').attr('x', 0).attr('y', 0).attr('width', xSc(maxFlowDensity)).attr('height', H).attr('fill', '#34d399').attr('fill-opacity', 0.04)
    g.append('rect').attr('x', xSc(maxFlowDensity)).attr('y', 0).attr('width', W - xSc(maxFlowDensity)).attr('height', H).attr('fill', '#fb7185').attr('fill-opacity', 0.04)

    const line = d3.line<Pt>().x((p) => xSc(p.x)).y((p) => ySc(p.y)).curve(d3.curveCatmullRom)
    g.append('path').datum(points).attr('d', line).attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 2.5)

    // current operating point
    g.append('line').attr('x1', xSc(k)).attr('x2', xSc(k)).attr('y1', ySc(currentFlow)).attr('y2', H).attr('stroke', '#22d3ee').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3')
    g.append('circle').attr('cx', xSc(k)).attr('cy', ySc(currentFlow)).attr('r', 6).attr('fill', '#22d3ee').attr('stroke', '#09090b').attr('stroke-width', 2)

    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims, vf, kj, k])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        The Greenshields traffic flow model relates vehicle density to speed: as roads get more crowded, drivers
        slow down. Flow (vehicles passing per hour) is density × speed — it peaks at a critical density, then
        <em> falls</em> as congestion sets in, even though more cars are packed onto the road.
      </p>

      <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
        <svg ref={svgRef} className="w-full" />
      </div>
      <p className="text-[11px] text-white/25 text-center">Green region = free-flow · Rose region = congested · Cyan dot = your current density</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Road Parameters</p>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Free-flow speed vf</span><span className="font-mono">{vf} km/h</span></div>
            <input type="range" min={40} max={140} step={5} value={vf} onChange={(e) => setVf(Number(e.target.value))} className="w-full accent-amber-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Jam density kj</span><span className="font-mono">{kj} veh/km</span></div>
            <input type="range" min={80} max={250} step={5} value={kj} onChange={(e) => setKj(Number(e.target.value))} className="w-full accent-amber-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Current density k</span><span className="font-mono text-cyan-300">{fmt(k, 0)} veh/km</span></div>
            <input type="range" min={0} max={kj} step={1} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-cyan-500" />
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Live Results</p>
          <div className="space-y-2.5">
            <div className="flex justify-between"><span className="text-xs text-white/40">Speed</span><span className="text-sm font-mono text-cyan-300">{fmt(currentSpeed)} km/h</span></div>
            <div className="flex justify-between"><span className="text-xs text-white/40">Flow</span><span className="text-sm font-mono text-amber-300">{fmt(currentFlow)} veh/hr</span></div>
            <div className="flex justify-between"><span className="text-xs text-white/40">Max possible flow</span><span className="text-sm font-mono text-white/60">{fmt(maxFlow)} veh/hr</span></div>
            <div className="flex justify-between"><span className="text-xs text-white/40">Regime</span>
              <span className={`text-sm font-mono ${regime === 'congested' ? 'text-rose-400' : regime === 'critical' ? 'text-amber-400' : 'text-emerald-400'}`}>{regime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4 space-y-2">
        <LatexRenderer latex={`v(k) = v_f\\left(1 - \\dfrac{k}{k_j}\\right), \\quad q(k) = k \\cdot v(k)`} display />
      </div>

      <p className="text-[11px] text-white/25 leading-relaxed">
        This is why highway on-ramp metering works: letting fewer cars merge in at once can keep density below
        the critical point and actually move <em>more</em> total traffic per hour than letting everyone in freely.
      </p>
    </div>
  )
}
