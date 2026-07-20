'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as math from 'mathjs'

type TestType = 'z' | 't'
type Tail = 'two' | 'left' | 'right'

interface PlotPoint { x: number; y: number }

const MARGIN = { t: 20, r: 20, b: 48, l: 52 }

// ── Distribution math ─────────────────────────────────────────────────
function normalPDF(x: number, mu = 0, sigma = 1): number {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2)
}
function normalCDF(z: number): number {
  return 0.5 * (1 + (math.erf(z / Math.SQRT2) as number))
}

function tPDF(x: number, df: number): number {
  const logNum = math.lgamma((df + 1) / 2) as number
  const logDen = 0.5 * Math.log(df * Math.PI) + (math.lgamma(df / 2) as number)
  const coeff = Math.exp(logNum - logDen)
  return coeff * Math.pow(1 + (x * x) / df, -(df + 1) / 2)
}
// Numeric CDF via trapezoidal integration — stable at any df thanks to log-gamma PDF above.
function tCDF(x: number, df: number): number {
  const steps = 4000
  const lo = -12
  if (x <= lo) return 0
  const hi = Math.min(x, 12)
  const h = (hi - lo) / steps
  let sum = 0.5 * (tPDF(lo, df) + tPDF(hi, df))
  for (let i = 1; i < steps; i++) sum += tPDF(lo + i * h, df)
  return sum * h
}

function fmt(n: number, d = 4): string {
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(d)
}

// ── Main component ────────────────────────────────────────────────────
export function HypothesisTestExplorer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 600, h: 300 })

  const [testType, setTestType] = useState<TestType>('z')
  const [tail, setTail] = useState<Tail>('two')

  // Sample / hypothesis inputs
  const [mu0, setMu0] = useState(100) // hypothesized population mean
  const [xbar, setXbar] = useState(104) // sample mean
  const [sigmaOrS, setSigmaOrS] = useState(12) // population sigma (z) or sample s (t)
  const [n, setN] = useState(25) // sample size
  const [alpha, setAlpha] = useState(0.05)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(300, w), h: Math.max(220, Math.min(340, w * 0.48)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const df = Math.max(1, n - 1)

  const { statistic, pValue, critical } = useMemo(() => {
    const se = sigmaOrS / Math.sqrt(Math.max(1, n))
    const stat = se > 0 ? (xbar - mu0) / se : 0

    if (testType === 'z') {
      let p: number
      if (tail === 'two') p = 2 * (1 - normalCDF(Math.abs(stat)))
      else if (tail === 'right') p = 1 - normalCDF(stat)
      else p = normalCDF(stat)

      // critical value(s) for shading
      const zForAlpha = (a: number) => {
        // invert normalCDF via bisection — good enough for UI-grade critical value display
        let lo = -8, hi = 8
        for (let i = 0; i < 60; i++) {
          const mid = (lo + hi) / 2
          if (normalCDF(mid) < 1 - a) lo = mid
          else hi = mid
        }
        return (lo + hi) / 2
      }
      const crit = tail === 'two' ? zForAlpha(alpha / 2) : tail === 'right' ? zForAlpha(alpha) : -zForAlpha(alpha)
      return { statistic: stat, pValue: Math.min(1, Math.max(0, p)), critical: crit }
    } else {
      let p: number
      if (tail === 'two') p = 2 * (1 - tCDF(Math.abs(stat), df))
      else if (tail === 'right') p = 1 - tCDF(stat, df)
      else p = tCDF(stat, df)

      const tForAlpha = (a: number) => {
        let lo = -12, hi = 12
        for (let i = 0; i < 60; i++) {
          const mid = (lo + hi) / 2
          if (tCDF(mid, df) < 1 - a) lo = mid
          else hi = mid
        }
        return (lo + hi) / 2
      }
      const crit = tail === 'two' ? tForAlpha(alpha / 2) : tail === 'right' ? tForAlpha(alpha) : -tForAlpha(alpha)
      return { statistic: stat, pValue: Math.min(1, Math.max(0, p)), critical: crit }
    }
  }, [testType, tail, mu0, xbar, sigmaOrS, n, alpha, df])

  const reject = pValue < alpha

  // ── Draw distribution + rejection region ──────────────────────────
  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w - MARGIN.l - MARGIN.r
    const H = dims.h - MARGIN.t - MARGIN.b

    svg.attr('width', dims.w).attr('height', dims.h)
    const g = svg.append('g').attr('transform', `translate(${MARGIN.l},${MARGIN.t})`)
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    const pdf = (x: number) => (testType === 'z' ? normalPDF(x) : tPDF(x, df))
    const xMax = testType === 'z' ? 4.2 : Math.max(4.2, Math.abs(critical) + 1.5)
    const points: PlotPoint[] = []
    for (let i = 0; i <= 400; i++) {
      const x = -xMax + (i / 400) * (2 * xMax)
      points.push({ x, y: pdf(x) })
    }

    const yMax = d3.max(points, (d) => d.y) as number
    const xSc = d3.scaleLinear().domain([-xMax, xMax]).range([0, W])
    const ySc = d3.scaleLinear().domain([0, yMax * 1.15]).range([H, 0])

    xSc.ticks(8).forEach((tck) => {
      g.append('line').attr('x1', xSc(tck)).attr('x2', xSc(tck)).attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.04)')
    })
    ySc.ticks(5).forEach((tck) => {
      g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ySc(tck)).attr('y2', ySc(tck)).attr('stroke', 'rgba(255,255,255,0.04)')
    })

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(xSc).ticks(8).tickSize(4))
      .call((a) => {
        a.select('.domain').remove()
        a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace')
        a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)')
      })
    g.append('g').call(d3.axisLeft(ySc).ticks(5).tickSize(4))
      .call((a) => {
        a.select('.domain').remove()
        a.selectAll('.tick text').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace').attr('dx', '-4px')
        a.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)')
      })

    const clip = svg.append('defs').append('clipPath').attr('id', 'ht-clip')
    clip.append('rect').attr('width', W).attr('height', H)
    const pg = g.append('g').attr('clip-path', 'url(#ht-clip)')

    // Rejection region(s) shaded in rose
    const rejectRanges: [number, number][] =
      tail === 'two' ? [[-xMax, -Math.abs(critical)], [Math.abs(critical), xMax]]
      : tail === 'right' ? [[critical, xMax]]
      : [[-xMax, critical]]

    rejectRanges.forEach(([a, b]) => {
      const rpts = points.filter((p) => p.x >= a && p.x <= b)
      if (!rpts.length) return
      const area = d3.area<PlotPoint>().x((d) => xSc(d.x)).y0(H).y1((d) => ySc(d.y)).curve(d3.curveCatmullRom)
      pg.append('path').datum(rpts).attr('d', area).attr('fill', '#fb7185').attr('fill-opacity', 0.22)
    })

    // Main curve
    const line = d3.line<PlotPoint>().x((d) => xSc(d.x)).y((d) => ySc(d.y)).curve(d3.curveCatmullRom)
    pg.append('path').datum(points).attr('d', line).attr('fill', 'none').attr('stroke', '#7c3aed').attr('stroke-width', 2.5)

    // Critical value line(s)
    const critLines = tail === 'two' ? [-Math.abs(critical), Math.abs(critical)] : [critical]
    critLines.forEach((c) => {
      if (Math.abs(c) > xMax) return
      g.append('line').attr('x1', xSc(c)).attr('x2', xSc(c)).attr('y1', 0).attr('y2', H)
        .attr('stroke', '#fb7185').attr('stroke-width', 1.5).attr('stroke-dasharray', '5,3').attr('opacity', 0.75)
    })

    // Test statistic marker
    if (Math.abs(statistic) <= xMax) {
      const sy = ySc(pdf(statistic))
      g.append('line').attr('x1', xSc(statistic)).attr('x2', xSc(statistic)).attr('y1', sy).attr('y2', H)
        .attr('stroke', '#22d3ee').attr('stroke-width', 2)
      g.append('circle').attr('cx', xSc(statistic)).attr('cy', sy).attr('r', 5).attr('fill', '#22d3ee').attr('stroke', '#09090b').attr('stroke-width', 2)
      g.append('text').attr('x', xSc(statistic)).attr('y', sy - 12).attr('fill', '#22d3ee').attr('font-size', '11px')
        .attr('font-family', 'monospace').attr('text-anchor', 'middle')
        .text(`${testType === 'z' ? 'z' : 't'} = ${fmt(statistic, 3)}`)
    }

    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [testType, tail, dims, statistic, critical, df])

  return (
    <div className="space-y-4">
      {/* Test type + tail selectors */}
      <div className="flex flex-wrap gap-2">
        {(['z', 't'] as TestType[]).map((tt) => (
          <button
            key={tt}
            onClick={() => setTestType(tt)}
            className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 border transition-all ${
              testType === tt ? 'bg-violet-600/20 border-violet-500/40 text-violet-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <span>{tt === 'z' ? 'One-sample z-test' : 'One-sample t-test'}</span>
            <span className="font-mono opacity-60">{tt === 'z' ? '(σ known)' : '(σ unknown)'}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {([
          { id: 'two' as Tail, label: 'Two-tailed', formula: 'H₁: μ ≠ μ₀' },
          { id: 'left' as Tail, label: 'Left-tailed', formula: 'H₁: μ < μ₀' },
          { id: 'right' as Tail, label: 'Right-tailed', formula: 'H₁: μ > μ₀' },
        ]).map((opt) => (
          <button
            key={opt.id}
            onClick={() => setTail(opt.id)}
            className={`text-xs rounded-lg px-3 py-1.5 border transition-all ${
              tail === opt.id ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <span>{opt.label}</span>{' '}
            <span className="font-mono opacity-60">{opt.formula}</span>
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
        <svg ref={svgRef} className="w-full" />
      </div>
      <p className="text-[11px] text-white/25 text-center">
        Rose region = rejection region at α = {fmt(alpha, 2)} · Cyan marker = your test statistic
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Inputs */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Hypothesis &amp; Sample</p>

          {[
            { label: 'μ₀ (hypothesized mean)', val: mu0, set: setMu0, min: -50, max: 250, step: 1 },
            { label: 'x̄ (sample mean)', val: xbar, set: setXbar, min: -50, max: 250, step: 0.5 },
            { label: testType === 'z' ? 'σ (population std dev)' : 's (sample std dev)', val: sigmaOrS, set: setSigmaOrS, min: 0.5, max: 50, step: 0.5 },
            { label: 'n (sample size)', val: n, set: setN, min: 2, max: 200, step: 1 },
          ].map(({ label, val, set, min, max, step }) => (
            <div key={label}>
              <div className="flex justify-between text-[10px] text-white/30 mb-1">
                <span>{label}</span>
                <span className="font-mono">{val}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(Number(e.target.value))} className="w-full accent-violet-500" />
            </div>
          ))}

          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1">
              <span>α (significance level)</span>
              <span className="font-mono">{fmt(alpha, 2)}</span>
            </div>
            <div className="flex gap-1.5">
              {[0.01, 0.05, 0.1].map((a) => (
                <button
                  key={a}
                  onClick={() => setAlpha(a)}
                  className={`flex-1 text-xs py-1.5 rounded-lg border transition-all ${
                    Math.abs(alpha - a) < 1e-9 ? 'bg-violet-600/20 border-violet-500/40 text-violet-300' : 'border-white/8 text-white/40'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Test Results</p>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">Test statistic</span>
              <span className="text-sm font-mono font-semibold text-cyan-400">
                {testType === 'z' ? 'z' : 't'} = {fmt(statistic, 4)}
              </span>
            </div>
            {testType === 't' && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">Degrees of freedom</span>
                <span className="text-sm font-mono font-semibold text-white/60">df = {df}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">p-value</span>
              <span className={`text-sm font-mono font-semibold ${reject ? 'text-rose-400' : 'text-emerald-400'}`}>{fmt(pValue, 4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">Critical value{tail === 'two' ? 's' : ''}</span>
              <span className="text-sm font-mono font-semibold text-white/60">
                {tail === 'two' ? `±${fmt(Math.abs(critical), 3)}` : fmt(critical, 3)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5">
            <p className={`text-xs font-semibold mb-1 ${reject ? 'text-rose-400' : 'text-emerald-400'}`}>
              {reject ? 'Reject H₀' : 'Fail to reject H₀'}
            </p>
            <p className="text-[10px] text-white/25 leading-relaxed">
              {reject
                ? `p-value (${fmt(pValue, 4)}) < α (${fmt(alpha, 2)}) — the sample result would be unusual if H₀ were true, so the evidence favors H₁.`
                : `p-value (${fmt(pValue, 4)}) ≥ α (${fmt(alpha, 2)}) — the sample result is plausible under H₀, so there isn't enough evidence to reject it.`}
            </p>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-white/25 leading-relaxed px-1">
        Note: &quot;fail to reject H₀&quot; is not the same as &quot;prove H₀ true&quot; — it only means this sample
        didn&apos;t give strong enough evidence against it.
      </p>
    </div>
  )
}
