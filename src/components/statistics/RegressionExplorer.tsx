'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'

interface Point { x: number; y: number }

const MARGIN = { t: 16, r: 16, b: 44, l: 52 }

// Least squares linear regression
function linReg(pts: Point[]): { m: number; b: number; r2: number } {
  if (pts.length < 2) return { m: 0, b: 0, r2: 0 }
  const n = pts.length
  const sx = pts.reduce((s, p) => s + p.x, 0)
  const sy = pts.reduce((s, p) => s + p.y, 0)
  const sxy = pts.reduce((s, p) => s + p.x * p.y, 0)
  const sx2 = pts.reduce((s, p) => s + p.x ** 2, 0)
  const m = (n * sxy - sx * sy) / (n * sx2 - sx ** 2)
  const b = (sy - m * sx) / n
  const yBar = sy / n
  const ssTot = pts.reduce((s, p) => s + (p.y - yBar) ** 2, 0)
  const ssRes = pts.reduce((s, p) => s + (p.y - (m * p.x + b)) ** 2, 0)
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0
  return { m, b, r2 }
}

const PRESETS: { label: string; pts: Point[] }[] = [
  { label: 'Linear',     pts: [{x:1,y:2},{x:2,y:4.1},{x:3,y:5.8},{x:4,y:8},{x:5,y:10.2},{x:6,y:11.8},{x:7,y:14},{x:8,y:16.1}] },
  { label: 'Scattered',  pts: [{x:1,y:5},{x:2,y:2},{x:3,y:8},{x:4,y:3},{x:5,y:9},{x:6,y:4},{x:7,y:7},{x:8,y:6}] },
  { label: 'No corr.',   pts: [{x:1,y:4},{x:2,y:9},{x:3,y:1},{x:4,y:7},{x:5,y:3},{x:6,y:8},{x:7,y:2},{x:8,y:6}] },
  { label: 'Strong',     pts: [{x:1,y:1.1},{x:2,y:1.9},{x:3,y:3.1},{x:4,y:3.9},{x:5,y:5.1},{x:6,y:5.9},{x:7,y:7.1},{x:8,y:8.1}] },
]

export function RegressionExplorer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [points, setPoints] = useState<Point[]>(PRESETS[0].pts)
  const [showLine, setShowLine] = useState(true)
  const [showResiduals, setShowResiduals] = useState(false)
  const [dims, setDims] = useState({ w: 600, h: 340 })

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(e => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(300, w), h: Math.max(240, Math.min(380, w * 0.54)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const { m, b, r2 } = linReg(points)

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const px = e.clientX - rect.left - MARGIN.l
    const py = e.clientY - rect.top - MARGIN.t
    const W = dims.w - MARGIN.l - MARGIN.r
    const H = dims.h - MARGIN.t - MARGIN.b
    const allX = points.map(p => p.x), allY = points.map(p => p.y)
    const xMin = Math.min(...allX, 0), xMax = Math.max(...allX, 10)
    const yMin = Math.min(...allY, 0), yMax = Math.max(...allY, 10)
    const x = xMin + (px / W) * (xMax - xMin)
    const y = yMax - (py / H) * (yMax - yMin)
    if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
      setPoints(prev => [...prev, { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }])
    }
  }, [points, dims])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    if (!points.length) return

    const W = dims.w - MARGIN.l - MARGIN.r
    const H = dims.h - MARGIN.t - MARGIN.b

    const xVals = points.map(p => p.x), yVals = points.map(p => p.y)
    const xPad = (Math.max(...xVals) - Math.min(...xVals)) * 0.1 || 1
    const yPad = (Math.max(...yVals) - Math.min(...yVals)) * 0.15 || 1

    const xSc = d3.scaleLinear()
      .domain([Math.min(...xVals) - xPad, Math.max(...xVals) + xPad]).range([0, W]).nice()
    const ySc = d3.scaleLinear()
      .domain([Math.min(...yVals) - yPad, Math.max(...yVals) + yPad]).range([H, 0]).nice()

    svg.attr('width', dims.w).attr('height', dims.h)
    const g = svg.append('g').attr('transform', `translate(${MARGIN.l},${MARGIN.t})`)
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    // Grid
    xSc.ticks(7).forEach(t => g.append('line').attr('x1',xSc(t)).attr('x2',xSc(t)).attr('y1',0).attr('y2',H).attr('stroke','rgba(255,255,255,0.04)'))
    ySc.ticks(6).forEach(t => g.append('line').attr('x1',0).attr('x2',W).attr('y1',ySc(t)).attr('y2',ySc(t)).attr('stroke','rgba(255,255,255,0.04)'))

    // Axes
    g.append('g').attr('transform',`translate(0,${H})`).call(d3.axisBottom(xSc).ticks(7).tickSize(4))
      .call(a=>{ a.select('.domain').remove(); a.selectAll('.tick text').attr('fill','rgba(255,255,255,0.3)').attr('font-size','10px').attr('font-family','monospace'); a.selectAll('.tick line').attr('stroke','rgba(255,255,255,0.15)') })
    g.append('g').call(d3.axisLeft(ySc).ticks(5).tickSize(4))
      .call(a=>{ a.select('.domain').remove(); a.selectAll('.tick text').attr('fill','rgba(255,255,255,0.3)').attr('font-size','10px').attr('font-family','monospace').attr('dx','-4px'); a.selectAll('.tick line').attr('stroke','rgba(255,255,255,0.15)') })

    const xDom = xSc.domain()

    // Residuals
    if (showResiduals && showLine) {
      points.forEach(pt => {
        const yPred = m * pt.x + b
        g.append('line')
          .attr('x1', xSc(pt.x)).attr('y1', ySc(pt.y))
          .attr('x2', xSc(pt.x)).attr('y2', ySc(yPred))
          .attr('stroke', '#ef4444').attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '3,2').attr('opacity', 0.7)
      })
    }

    // Regression line
    if (showLine && points.length >= 2) {
      g.append('line')
        .attr('x1', xSc(xDom[0])).attr('y1', ySc(m * xDom[0] + b))
        .attr('x2', xSc(xDom[1])).attr('y2', ySc(m * xDom[1] + b))
        .attr('stroke', '#06b6d4').attr('stroke-width', 2)

      // Equation label
      const mid = (xDom[0] + xDom[1]) / 2
      g.append('text')
        .attr('x', xSc(mid)).attr('y', ySc(m * mid + b) - 10)
        .attr('fill', '#22d3ee').attr('font-size', '11px').attr('font-family', 'monospace')
        .attr('text-anchor', 'middle')
        .text(`ŷ = ${m.toFixed(3)}x + ${b.toFixed(3)}  R²=${r2.toFixed(3)}`)
    }

    // Points
    points.forEach((pt, i) => {
      g.append('circle').attr('cx', xSc(pt.x)).attr('cy', ySc(pt.y)).attr('r', 5)
        .attr('fill', '#7c3aed').attr('stroke', '#09090b').attr('stroke-width', 2)
        .attr('cursor', 'pointer')
        .on('dblclick', () => setPoints(prev => prev.filter((_, j) => j !== i)))
    })

    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.06)')
  }, [points, showLine, showResiduals, dims, m, b, r2])

  const r = Math.sign(m) * Math.sqrt(Math.max(0, r2))

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden cursor-crosshair"
        title="Click to add points, double-click a point to remove">
        <svg ref={svgRef} className="w-full" onClick={handleClick}/>
      </div>
      <p className="text-[11px] text-white/25 text-center">Click canvas to add points · Double-click point to remove</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Controls</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(pre => (
              <button key={pre.label} onClick={() => setPoints(pre.pts)}
                className="text-xs rounded-lg px-3 py-1.5 border border-white/8 text-white/40 hover:text-white/80 hover:border-white/20 transition-all">
                {pre.label}
              </button>
            ))}
            <button onClick={() => setPoints([])}
              className="text-xs rounded-lg px-3 py-1.5 border border-rose-500/20 text-rose-400/60 hover:text-rose-400 transition-all">
              Clear
            </button>
          </div>
          {[
            { label:'Show regression line', state:showLine, set:setShowLine },
            { label:'Show residuals', state:showResiduals, set:setShowResiduals },
          ].map(({label,state,set}) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => set(s=>!s)}
                className={`w-8 h-4 rounded-full relative transition-colors ${state?'bg-violet-600':'bg-white/10'}`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${state?'translate-x-4':'translate-x-0.5'}`}/>
              </div>
              <span className="text-xs text-white/50">{label}</span>
            </label>
          ))}
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Results</p>
          {points.length >= 2 ? (
            <div className="space-y-2.5">
              {[
                { label:'Slope (m)',    val:m.toFixed(4),  color:'text-cyan-400' },
                { label:'Intercept (b)',val:b.toFixed(4),  color:'text-violet-400' },
                { label:'R² (fit)',    val:r2.toFixed(4),  color: r2>0.9?'text-emerald-400':r2>0.5?'text-amber-400':'text-rose-400' },
                { label:'r (corr.)',   val:r.toFixed(4),   color: Math.abs(r)>0.8?'text-emerald-400':Math.abs(r)>0.4?'text-amber-400':'text-rose-400' },
                { label:'n (points)',  val:String(points.length), color:'text-white/60' },
              ].map(s => (
                <div key={s.label} className="flex justify-between">
                  <span className="text-xs text-white/40">{s.label}</span>
                  <span className={`text-sm font-mono font-semibold ${s.color}`}>{s.val}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/25">
                  {r2>0.9?'Very strong fit':r2>0.7?'Strong fit':r2>0.4?'Moderate fit':'Weak fit or nonlinear'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/25">Add at least 2 points</p>
          )}
        </div>
      </div>
    </div>
  )
}
