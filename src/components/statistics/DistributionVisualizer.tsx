'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

type DistType = 'normal' | 'binomial' | 'poisson' | 'uniform'

interface PlotPoint { x: number; y: number }

// ── PDF/PMF calculations ─────────────────────────────────────────────
function normalPDF(x: number, mu: number, sigma: number): number {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * ((x - mu) / sigma) ** 2)
}

function binomialPMF(k: number, n: number, p: number): number {
  if (k < 0 || k > n) return 0
  const logC = logBinom(n, k)
  return Math.exp(logC + k * Math.log(p) + (n - k) * Math.log(1 - p))
}

function logBinom(n: number, k: number): number {
  let res = 0
  for (let i = 0; i < k; i++) res += Math.log(n - i) - Math.log(i + 1)
  return res
}

function poissonPMF(k: number, lambda: number): number {
  if (k < 0) return 0
  let logP = -lambda + k * Math.log(lambda)
  for (let i = 1; i <= k; i++) logP -= Math.log(i)
  return Math.exp(logP)
}

const MARGIN = { t: 20, r: 20, b: 48, l: 52 }

export function DistributionVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState<DistType>('normal')
  const [dims, setDims] = useState({ w: 600, h: 300 })

  // Normal params
  const [mu, setMu]       = useState(0)
  const [sigma, setSigma] = useState(1)
  const [showSD, setShowSD] = useState(true)

  // Binomial params
  const [n, setN] = useState(20)
  const [p, setP] = useState(0.5)

  // Poisson params
  const [lambda, setLambda] = useState(4)

  // Uniform params
  const [uA, setUA] = useState(0)
  const [uB, setUB] = useState(10)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(e => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(300, w), h: Math.max(220, Math.min(340, w * 0.48)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w - MARGIN.l - MARGIN.r
    const H = dims.h - MARGIN.t - MARGIN.b

    svg.attr('width', dims.w).attr('height', dims.h)
    const g = svg.append('g').attr('transform', `translate(${MARGIN.l},${MARGIN.t})`)
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    let points: PlotPoint[] = []
    let isDiscrete = false

    if (dist === 'normal') {
      const xMin = mu - 4 * sigma, xMax = mu + 4 * sigma
      for (let i = 0; i <= 400; i++) {
        const x = xMin + (i / 400) * (xMax - xMin)
        points.push({ x, y: normalPDF(x, mu, sigma) })
      }
    } else if (dist === 'binomial') {
      isDiscrete = true
      for (let k = 0; k <= n; k++) points.push({ x: k, y: binomialPMF(k, n, p) })
    } else if (dist === 'poisson') {
      isDiscrete = true
      const kMax = Math.min(40, Math.ceil(lambda * 3))
      for (let k = 0; k <= kMax; k++) points.push({ x: k, y: poissonPMF(k, lambda) })
    } else {
      points = [{ x: uA, y: 0 }, { x: uA, y: 1/(uB-uA) }, { x: uB, y: 1/(uB-uA) }, { x: uB, y: 0 }]
    }

    const xExt = d3.extent(points, d => d.x) as [number,number]
    const yMax = d3.max(points, d => d.y) as number

    const xSc = d3.scaleLinear().domain(xExt).range([0, W]).nice()
    const ySc = d3.scaleLinear().domain([0, yMax * 1.1]).range([H, 0])

    // Grid
    xSc.ticks(8).forEach(t => {
      g.append('line').attr('x1', xSc(t)).attr('x2', xSc(t)).attr('y1', 0).attr('y2', H)
        .attr('stroke', 'rgba(255,255,255,0.04)')
    })
    ySc.ticks(5).forEach(t => {
      g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ySc(t)).attr('y2', ySc(t))
        .attr('stroke', 'rgba(255,255,255,0.04)')
    })

    // Axes
    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(xSc).ticks(8).tickSize(4))
      .call(a => {
        a.select('.domain').remove()
        a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace')
        a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)')
      })
    g.append('g').call(d3.axisLeft(ySc).ticks(5).tickSize(4))
      .call(a => {
        a.select('.domain').remove()
        a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').attr('dx', '-4px')
        a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)')
      })

    const clip = svg.append('defs').append('clipPath').attr('id', 'dist-clip')
    clip.append('rect').attr('width', W).attr('height', H)
    const pg = g.append('g').attr('clip-path', 'url(#dist-clip)')

    if (isDiscrete) {
      // Bars
      const bw = Math.max(2, W / points.length * 0.7)
      points.forEach(pt => {
        pg.append('rect')
          .attr('x', xSc(pt.x) - bw / 2).attr('y', ySc(pt.y))
          .attr('width', bw).attr('height', H - ySc(pt.y))
          .attr('fill', '#7c3aed').attr('opacity', 0.7)
          .attr('rx', 2)
      })
    } else {
      // Area + line
      const area = d3.area<PlotPoint>()
        .x(d => xSc(d.x)).y0(H).y1(d => ySc(d.y)).curve(d3.curveCatmullRom)
      const line = d3.line<PlotPoint>()
        .x(d => xSc(d.x)).y(d => ySc(d.y)).curve(d3.curveCatmullRom)

      pg.append('path').datum(points).attr('d', area)
        .attr('fill', '#7c3aed').attr('fill-opacity', 0.15)
      pg.append('path').datum(points).attr('d', line)
        .attr('fill', 'none').attr('stroke', '#7c3aed').attr('stroke-width', 2.5)

      // SD regions for normal
      if (dist === 'normal' && showSD) {
        const regions = [
          { lo: mu - sigma, hi: mu + sigma, color: '#06b6d4', label: '68%' },
          { lo: mu - 2*sigma, hi: mu + 2*sigma, color: '#7c3aed', label: '95%' },
        ]
        regions.forEach(r => {
          const rpts = points.filter(pt => pt.x >= r.lo && pt.x <= r.hi)
          if (!rpts.length) return
          const rArea = d3.area<PlotPoint>()
            .x(d => xSc(d.x)).y0(H).y1(d => ySc(d.y))
          pg.append('path').datum(rpts).attr('d', rArea)
            .attr('fill', r.color).attr('fill-opacity', 0.12)
          // Vertical lines
          ;[r.lo, r.hi].forEach(v => {
            const vy = normalPDF(v, mu, sigma)
            g.append('line')
              .attr('x1', xSc(v)).attr('x2', xSc(v))
              .attr('y1', ySc(vy)).attr('y2', H)
              .attr('stroke', r.color).attr('stroke-width', 1)
              .attr('stroke-dasharray', '4,3').attr('opacity', 0.6)
          })
        })
        // μ line
        g.append('line')
          .attr('x1', xSc(mu)).attr('x2', xSc(mu))
          .attr('y1', 0).attr('y2', H)
          .attr('stroke', '#f59e0b').attr('stroke-width', 1.5).attr('stroke-dasharray', '5,3')
      }
    }

    // Border
    g.append('rect').attr('width', W).attr('height', H)
      .attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dist, mu, sigma, n, p, lambda, uA, uB, showSD, dims])

  // Stats
  const stats = (() => {
    if (dist === 'normal') return { mean: mu.toFixed(2), variance: (sigma**2).toFixed(3), std: sigma.toFixed(2) }
    if (dist === 'binomial') return { mean: (n*p).toFixed(2), variance: (n*p*(1-p)).toFixed(3), std: Math.sqrt(n*p*(1-p)).toFixed(3) }
    if (dist === 'poisson') return { mean: lambda.toFixed(2), variance: lambda.toFixed(2), std: Math.sqrt(lambda).toFixed(3) }
    return { mean: ((uA+uB)/2).toFixed(2), variance: (((uB-uA)**2)/12).toFixed(3), std: ((uB-uA)/Math.sqrt(12)).toFixed(3) }
  })()

  const DISTS: { key: DistType; label: string; formula: string }[] = [
    { key:'normal',   label:'Normal',   formula:'N(μ, σ²)' },
    { key:'binomial', label:'Binomial', formula:'B(n, p)' },
    { key:'poisson',  label:'Poisson',  formula:'P(λ)' },
    { key:'uniform',  label:'Uniform',  formula:'U(a, b)' },
  ]

  return (
    <div className="space-y-4">
      {/* Distribution tabs */}
      <div className="flex gap-2 flex-wrap">
        {DISTS.map(d => (
          <button key={d.key} onClick={() => setDist(d.key)}
            className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 border transition-all ${
              dist===d.key ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}>
            <span>{d.label}</span>
            <span className="font-mono opacity-60">{d.formula}</span>
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
        <svg ref={svgRef} className="w-full"/>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Parameters */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Parameters</p>

          {dist === 'normal' && <>
            {[{label:'μ (mean)', val:mu, set:setMu, min:-5, max:5},
              {label:'σ (std dev)', val:sigma, set:setSigma, min:0.1, max:5}].map(({label,val,set,min,max})=>(
              <div key={label}>
                <div className="flex justify-between text-[10px] text-white/30 mb-1">
                  <span>{label}</span><span className="font-mono">{val.toFixed(2)}</span>
                </div>
                <input type="range" min={min} max={max} step={0.1} value={val}
                  onChange={e=>set(Number(e.target.value))} className="w-full accent-violet-500"/>
              </div>
            ))}
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={()=>setShowSD(s=>!s)}
                className={`w-8 h-4 rounded-full relative transition-colors ${showSD?'bg-violet-600':'bg-white/10'}`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showSD?'translate-x-4':'translate-x-0.5'}`}/>
              </div>
              <span className="text-xs text-white/50">Show ±1σ / ±2σ regions</span>
            </label>
          </>}

          {dist === 'binomial' && <>
            {[{label:'n (trials)', val:n, set:setN, min:1, max:50, step:1},
              {label:'p (probability)', val:p, set:setP, min:0.01, max:0.99, step:0.01}].map(({label,val,set,min,max,step})=>(
              <div key={label}>
                <div className="flex justify-between text-[10px] text-white/30 mb-1">
                  <span>{label}</span><span className="font-mono">{val}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={val}
                  onChange={e=>set(Number(e.target.value))} className="w-full accent-violet-500"/>
              </div>
            ))}
          </>}

          {dist === 'poisson' && (
            <div>
              <div className="flex justify-between text-[10px] text-white/30 mb-1">
                <span>λ (rate)</span><span className="font-mono">{lambda}</span>
              </div>
              <input type="range" min={0.5} max={20} step={0.5} value={lambda}
                onChange={e=>setLambda(Number(e.target.value))} className="w-full accent-violet-500"/>
            </div>
          )}

          {dist === 'uniform' && <>
            {[{label:'a (min)', val:uA, set:setUA},{label:'b (max)', val:uB, set:setUB}].map(({label,val,set})=>(
              <div key={label}>
                <div className="flex justify-between text-[10px] text-white/30 mb-1">
                  <span>{label}</span><span className="font-mono">{val}</span>
                </div>
                <input type="range" min={-10} max={20} step={1} value={val}
                  onChange={e=>set(Number(e.target.value))} className="w-full accent-violet-500"/>
              </div>
            ))}
          </>}
        </div>

        {/* Stats */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Distribution Stats</p>
          <div className="space-y-2.5">
            {[
              {label:'Mean (μ)', val:stats.mean, color:'text-violet-400'},
              {label:'Variance (σ²)', val:stats.variance, color:'text-cyan-400'},
              {label:'Std Dev (σ)', val:stats.std, color:'text-amber-400'},
            ].map(s=>(
              <div key={s.label} className="flex justify-between items-center">
                <span className="text-xs text-white/40">{s.label}</span>
                <span className={`text-sm font-mono font-semibold ${s.color}`}>{s.val}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5">
            <p className="text-[10px] text-white/25 leading-relaxed">
              {dist==='normal' && '68% within ±1σ · 95% within ±2σ · 99.7% within ±3σ (Empirical Rule)'}
              {dist==='binomial' && `P(X=k) = C(n,k) · p^k · (1-p)^(n-k)`}
              {dist==='poisson' && `P(X=k) = e^(-λ) · λ^k / k!  Models rare events.`}
              {dist==='uniform' && `f(x) = 1/(b-a) for x∈[a,b]. All outcomes equally likely.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
