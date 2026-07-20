'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import { LatexRenderer } from '@/components/math/LatexRenderer'

interface Pt { x: number; y: number }
const MARGIN = { t: 20, r: 20, b: 44, l: 56 }

function fmt(n: number, d = 1): string {
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(d)
}

function simulate(emission: number, absorption: number, c0: number, duration: number, steps: number): Pt[] {
  const dt = duration / steps
  let C = c0
  const pts: Pt[] = [{ x: 0, y: C }]
  for (let i = 1; i <= steps; i++) {
    const dC = emission - absorption * C
    C += dC * dt
    pts.push({ x: i * dt, y: C })
  }
  return pts
}

export function EnvironmentalModels() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 600, h: 280 })

  const [emission, setEmission] = useState(10) // units/year added
  const [absorption, setAbsorption] = useState(0.08) // fraction absorbed per year (oceans, forests, etc.)
  const [c0, setC0] = useState(20) // starting concentration
  const [years, setYears] = useState(100)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(300, w), h: Math.max(200, Math.min(320, w * 0.42)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const equilibrium = absorption > 0 ? emission / absorption : Infinity
  const points = useMemo(() => simulate(emission, absorption, c0, years, 400), [emission, absorption, c0, years])
  const finalValue = points[points.length - 1].y

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w - MARGIN.l - MARGIN.r
    const H = dims.h - MARGIN.t - MARGIN.b
    svg.attr('width', dims.w).attr('height', dims.h)
    const g = svg.append('g').attr('transform', `translate(${MARGIN.l},${MARGIN.t})`)
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    const yMax = Math.max(...points.map((p) => p.y), equilibrium * 1.1, 1) * 1.1
    const xSc = d3.scaleLinear().domain([0, years]).range([0, W])
    const ySc = d3.scaleLinear().domain([0, yMax]).range([H, 0])

    xSc.ticks(6).forEach((tck) => g.append('line').attr('x1', xSc(tck)).attr('x2', xSc(tck)).attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.04)'))
    ySc.ticks(5).forEach((tck) => g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ySc(tck)).attr('y2', ySc(tck)).attr('stroke', 'rgba(255,255,255,0.04)'))

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(xSc).ticks(6).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })
    g.append('g').call(d3.axisLeft(ySc).ticks(5).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').attr('dx', '-4px'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })

    g.append('text').attr('x', W / 2).attr('y', H + 36).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').text('time (years)')
    g.append('text').attr('transform', `rotate(-90)`).attr('x', -H / 2).attr('y', -42).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').text('concentration C')

    if (Number.isFinite(equilibrium)) {
      g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ySc(equilibrium)).attr('y2', ySc(equilibrium))
        .attr('stroke', '#facc15').attr('stroke-width', 1.5).attr('stroke-dasharray', '5,4').attr('opacity', 0.6)
    }

    const area = d3.area<Pt>().x((p) => xSc(p.x)).y0(H).y1((p) => ySc(p.y)).curve(d3.curveMonotoneX)
    g.append('path').datum(points).attr('d', area).attr('fill', '#84cc16').attr('fill-opacity', 0.12)
    const line = d3.line<Pt>().x((p) => xSc(p.x)).y((p) => ySc(p.y)).curve(d3.curveMonotoneX)
    g.append('path').datum(points).attr('d', line).attr('fill', 'none').attr('stroke', '#84cc16').attr('stroke-width', 2.5)

    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims, points, equilibrium, years])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Pollutants (or CO₂) build up in a reservoir — the atmosphere, a lake, soil — while natural processes
        (oceans, forests, chemical breakdown) remove a fraction of it every year. This tug-of-war between
        emission and absorption settles at an equilibrium concentration: C* = emission rate ÷ absorption rate.
      </p>

      <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
        <svg ref={svgRef} className="w-full" />
      </div>
      <p className="text-[11px] text-white/25 text-center">Gold dashed line = equilibrium concentration C*</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Model Parameters</p>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Emission rate</span><span className="font-mono">{fmt(emission)} units/yr</span></div>
            <input type="range" min={0} max={40} step={1} value={emission} onChange={(e) => setEmission(Number(e.target.value))} className="w-full accent-lime-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Absorption rate (fraction/yr)</span><span className="font-mono">{fmt(absorption * 100, 1)}%</span></div>
            <input type="range" min={0.01} max={0.3} step={0.01} value={absorption} onChange={(e) => setAbsorption(Number(e.target.value))} className="w-full accent-lime-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Starting concentration C₀</span><span className="font-mono">{fmt(c0)}</span></div>
            <input type="range" min={0} max={200} step={5} value={c0} onChange={(e) => setC0(Number(e.target.value))} className="w-full accent-lime-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Time horizon</span><span className="font-mono">{years} yrs</span></div>
            <input type="range" min={10} max={300} step={10} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-lime-500" />
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Live Results</p>
          <div className="space-y-2.5">
            <div className="flex justify-between"><span className="text-xs text-white/40">Equilibrium C*</span><span className="text-sm font-mono text-amber-300">{fmt(equilibrium)}</span></div>
            <div className="flex justify-between"><span className="text-xs text-white/40">Value at t = {years}</span><span className="text-sm font-mono text-lime-300">{fmt(finalValue)}</span></div>
            <div className="flex justify-between"><span className="text-xs text-white/40">% of equilibrium reached</span><span className="text-sm font-mono text-white/60">{fmt((finalValue / equilibrium) * 100, 0)}%</span></div>
          </div>
          <p className="text-[10px] text-white/25 mt-3 leading-relaxed">
            Even if emissions stopped changing today, concentration keeps drifting toward C* for years — this
            delayed response is why environmental policy effects take decades to fully show up.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
        <LatexRenderer latex={`\\dfrac{dC}{dt} = E - aC, \\quad C^{*} = \\dfrac{E}{a} = ${fmt(equilibrium)}`} display />
      </div>
    </div>
  )
}
