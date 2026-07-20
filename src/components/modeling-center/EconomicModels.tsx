'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { LatexRenderer } from '@/components/math/LatexRenderer'

interface Pt { x: number; y: number }
const MARGIN = { t: 20, r: 20, b: 44, l: 52 }

function fmt(n: number, d = 2): string {
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(d)
}

function SupplyDemand() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 600, h: 280 })

  const [supplyA, setSupplyA] = useState(10) // Qs = a + b*P
  const [supplyB, setSupplyB] = useState(2)
  const [demandC, setDemandC] = useState(100) // Qd = c - d*P
  const [demandD, setDemandD] = useState(3)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(300, w), h: Math.max(200, Math.min(320, w * 0.42)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const pStar = (demandC - supplyA) / (supplyB + demandD)
  const qStar = supplyA + supplyB * pStar
  const valid = pStar > 0 && qStar > 0

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w - MARGIN.l - MARGIN.r
    const H = dims.h - MARGIN.t - MARGIN.b
    svg.attr('width', dims.w).attr('height', dims.h)
    const g = svg.append('g').attr('transform', `translate(${MARGIN.l},${MARGIN.t})`)
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    const pMax = Math.max(demandC / demandD, pStar * 1.6, 10)
    const supplyPts: Pt[] = [{ x: 0, y: supplyA }, { x: pMax, y: supplyA + supplyB * pMax }]
    const demandPts: Pt[] = [{ x: 0, y: demandC }, { x: demandC / demandD, y: 0 }]
    const qMax = Math.max(supplyA + supplyB * pMax, demandC) * 1.1

    const xSc = d3.scaleLinear().domain([0, pMax]).range([0, W])
    const ySc = d3.scaleLinear().domain([0, qMax]).range([H, 0])

    xSc.ticks(6).forEach((tck) => g.append('line').attr('x1', xSc(tck)).attr('x2', xSc(tck)).attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.04)'))
    ySc.ticks(5).forEach((tck) => g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ySc(tck)).attr('y2', ySc(tck)).attr('stroke', 'rgba(255,255,255,0.04)'))

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(xSc).ticks(6).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })
    g.append('g').call(d3.axisLeft(ySc).ticks(5).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').attr('dx', '-4px'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })

    g.append('text').attr('x', W / 2).attr('y', H + 36).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').text('price P')
    g.append('text').attr('transform', `rotate(-90)`).attr('x', -H / 2).attr('y', -38).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').text('quantity Q')

    const line = d3.line<Pt>().x((p) => xSc(p.x)).y((p) => ySc(Math.max(0, p.y))).curve(d3.curveLinear)
    g.append('path').datum(supplyPts).attr('d', line).attr('fill', 'none').attr('stroke', '#34d399').attr('stroke-width', 2.5)
    g.append('path').datum(demandPts).attr('d', line).attr('fill', 'none').attr('stroke', '#f87171').attr('stroke-width', 2.5)

    if (valid) {
      g.append('line').attr('x1', xSc(pStar)).attr('x2', xSc(pStar)).attr('y1', ySc(qStar)).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.2)').attr('stroke-dasharray', '4,3')
      g.append('line').attr('x1', 0).attr('x2', xSc(pStar)).attr('y1', ySc(qStar)).attr('y2', ySc(qStar)).attr('stroke', 'rgba(255,255,255,0.2)').attr('stroke-dasharray', '4,3')
      g.append('circle').attr('cx', xSc(pStar)).attr('cy', ySc(qStar)).attr('r', 6).attr('fill', '#facc15').attr('stroke', '#09090b').attr('stroke-width', 2)
    }

    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims, supplyA, supplyB, demandC, demandD, pStar, qStar, valid])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Supply rises with price (producers offer more); demand falls with price (buyers want less). The market
        settles where the two lines cross — the equilibrium price and quantity.
      </p>

      <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
        <svg ref={svgRef} className="w-full" />
      </div>
      <p className="text-[11px] text-white/25 text-center">
        <span className="text-emerald-400">Green = Supply</span> · <span className="text-rose-400">Red = Demand</span> · <span className="text-amber-300">Gold dot = Equilibrium</span>
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs text-emerald-400/80 uppercase tracking-wider font-mono">Supply: Qs = a + bP</p>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>a (base supply)</span><span className="font-mono">{supplyA}</span></div>
            <input type="range" min={0} max={50} step={1} value={supplyA} onChange={(e) => setSupplyA(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>b (supply sensitivity)</span><span className="font-mono">{supplyB}</span></div>
            <input type="range" min={0.2} max={6} step={0.2} value={supplyB} onChange={(e) => setSupplyB(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs text-rose-400/80 uppercase tracking-wider font-mono">Demand: Qd = c − dP</p>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>c (max demand)</span><span className="font-mono">{demandC}</span></div>
            <input type="range" min={20} max={200} step={5} value={demandC} onChange={(e) => setDemandC(Number(e.target.value))} className="w-full accent-rose-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>d (demand sensitivity)</span><span className="font-mono">{demandD}</span></div>
            <input type="range" min={0.2} max={6} step={0.2} value={demandD} onChange={(e) => setDemandD(Number(e.target.value))} className="w-full accent-rose-500" />
          </div>
        </div>
      </div>

      {valid ? (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 grid grid-cols-2 gap-3 text-center">
          <div><p className="text-[10px] uppercase tracking-wider text-amber-400/70 mb-1">Equilibrium Price</p><p className="text-xl font-mono text-amber-300">{fmt(pStar)}</p></div>
          <div><p className="text-[10px] uppercase tracking-wider text-amber-400/70 mb-1">Equilibrium Quantity</p><p className="text-xl font-mono text-amber-300">{fmt(qStar)}</p></div>
        </div>
      ) : (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2 text-center">
          No positive equilibrium with these values — try increasing demand (c) or lowering base supply (a).
        </p>
      )}

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
        <LatexRenderer latex={`Q_s = Q_d \\Rightarrow P^* = \\dfrac{c-a}{b+d} = ${fmt(pStar)}`} display />
      </div>
    </div>
  )
}

function CompoundGrowth() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 600, h: 280 })

  const [principal, setPrincipal] = useState(1000)
  const [rate, setRate] = useState(0.06)
  const [years, setYears] = useState(20)
  const [compounds, setCompounds] = useState(12)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(300, w), h: Math.max(200, Math.min(320, w * 0.42)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const amountAt = (t: number) => principal * Math.pow(1 + rate / compounds, compounds * t)
  const finalAmount = amountAt(years)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w - MARGIN.l - MARGIN.r
    const H = dims.h - MARGIN.t - MARGIN.b
    svg.attr('width', dims.w).attr('height', dims.h)
    const g = svg.append('g').attr('transform', `translate(${MARGIN.l},${MARGIN.t})`)
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    const points: Pt[] = []
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * years
      points.push({ x: t, y: amountAt(t) })
    }
    const yMax = d3.max(points, (p) => p.y) as number

    const xSc = d3.scaleLinear().domain([0, years]).range([0, W])
    const ySc = d3.scaleLinear().domain([0, yMax * 1.1]).range([H, 0])

    xSc.ticks(6).forEach((tck) => g.append('line').attr('x1', xSc(tck)).attr('x2', xSc(tck)).attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.04)'))
    ySc.ticks(5).forEach((tck) => g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ySc(tck)).attr('y2', ySc(tck)).attr('stroke', 'rgba(255,255,255,0.04)'))

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(xSc).ticks(6).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })
    g.append('g').call(d3.axisLeft(ySc).ticks(5).tickFormat((v) => `${(Number(v) / 1000).toFixed(0)}k`).tickSize(4))
      .call((a) => { a.select('.domain').remove(); a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').attr('dx', '-4px'); a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)') })

    const area = d3.area<Pt>().x((p) => xSc(p.x)).y0(H).y1((p) => ySc(p.y)).curve(d3.curveMonotoneX)
    g.append('path').datum(points).attr('d', area).attr('fill', '#34d399').attr('fill-opacity', 0.12)
    const line = d3.line<Pt>().x((p) => xSc(p.x)).y((p) => ySc(p.y)).curve(d3.curveMonotoneX)
    g.append('path').datum(points).attr('d', line).attr('fill', 'none').attr('stroke', '#34d399').attr('stroke-width', 2.5)

    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims, principal, rate, years, compounds])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Compound growth is exponential: interest earns interest. Small changes in the rate or the compounding
        frequency lead to surprisingly large differences over long time horizons.
      </p>

      <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Principal</span><span className="font-mono">{principal.toLocaleString()}</span></div>
            <input type="range" min={100} max={20000} step={100} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Annual rate</span><span className="font-mono">{(rate * 100).toFixed(1)}%</span></div>
            <input type="range" min={0.005} max={0.2} step={0.005} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Years</span><span className="font-mono">{years}</span></div>
            <input type="range" min={1} max={50} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Compounds / year</span><span className="font-mono">{compounds}</span></div>
            <input type="range" min={1} max={365} step={1} value={compounds} onChange={(e) => setCompounds(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
        <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-2">Final Amount after {years} years</p>
        <p className="text-3xl font-mono font-bold text-emerald-300">{finalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
        <LatexRenderer latex={`A = P\\left(1+\\dfrac{r}{n}\\right)^{nt} = ${principal}\\left(1+\\dfrac{${fmt(rate, 3)}}{${compounds}}\\right)^{${compounds}\\times ${years}}`} display />
      </div>
    </div>
  )
}

export function EconomicModels() {
  const [mode, setMode] = useState<'supply-demand' | 'growth'>('supply-demand')

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setMode('supply-demand')} className={`flex-1 rounded-lg border px-4 py-2.5 text-xs transition-all ${mode === 'supply-demand' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'border-white/8 text-white/40'}`}>
          Supply &amp; Demand
        </button>
        <button onClick={() => setMode('growth')} className={`flex-1 rounded-lg border px-4 py-2.5 text-xs transition-all ${mode === 'growth' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'border-white/8 text-white/40'}`}>
          Compound Growth
        </button>
      </div>
      {mode === 'supply-demand' ? <SupplyDemand /> : <CompoundGrowth />}
    </div>
  )
}
