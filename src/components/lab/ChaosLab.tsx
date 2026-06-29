'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

type ChaosType = 'logistic' | 'lorenz'

export function ChaosLab() {
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [type, setType] = useState<ChaosType>('logistic')
  const [r, setR] = useState(3.7)        // logistic r
  const [x0, setX0] = useState(0.5)     // initial condition
  const [x0b, setX0b] = useState(0.500001)  // slightly different
  const [n, setN] = useState(80)
  const [dims, setDims] = useState({ w: 560, h: 280 })
  const [showBifurcation, setShowBifurcation] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280,w), h: Math.max(200, Math.min(320, w*0.48)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Logistic map
  useEffect(() => {
    if (type !== 'logistic') return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const { w, h } = dims
    const M = { t:20, r:20, b:36, l:52 }
    const W = w-M.l-M.r, H = h-M.t-M.b

    // Generate sequences
    const seq1: number[] = [x0], seq2: number[] = [x0b]
    for (let i=1; i<=n; i++) {
      seq1.push(r*seq1[i-1]*(1-seq1[i-1]))
      seq2.push(r*seq2[i-1]*(1-seq2[i-1]))
    }

    const xSc = d3.scaleLinear().domain([0,n]).range([0,W])
    const ySc = d3.scaleLinear().domain([0,1]).range([H,0])

    svg.attr('width',w).attr('height',h)
    const g = svg.append('g').attr('transform',`translate(${M.l},${M.t})`)
    g.append('rect').attr('width',W).attr('height',H).attr('fill','#09090b')

    // Grid
    ySc.ticks(5).forEach(t=>{ g.append('line').attr('x1',0).attr('x2',W).attr('y1',ySc(t)).attr('y2',ySc(t)).attr('stroke','rgba(255,255,255,0.04)') })
    xSc.ticks(8).forEach(t=>{ g.append('line').attr('x1',xSc(t)).attr('x2',xSc(t)).attr('y1',0).attr('y2',H).attr('stroke','rgba(255,255,255,0.04)') })

    const line = d3.line<number>().x((_,i)=>xSc(i)).y(d=>ySc(d))

    g.append('path').datum(seq1).attr('fill','none').attr('stroke','#7c3aed').attr('stroke-width',1.8).attr('d',line)
    g.append('path').datum(seq2).attr('fill','none').attr('stroke','#ef4444').attr('stroke-width',1.8).attr('stroke-dasharray','4,3').attr('d',line)

    // Divergence markers
    seq1.forEach((v,i)=>{ if(i<seq1.length){ g.append('circle').attr('cx',xSc(i)).attr('cy',ySc(v)).attr('r',2).attr('fill','#7c3aed').attr('opacity',0.6) } })

    g.append('g').attr('transform',`translate(0,${H})`).call(d3.axisBottom(xSc).ticks(7).tickSize(3))
      .call(a=>{ a.select('.domain').remove(); a.selectAll('.tick text').attr('fill','rgba(255,255,255,0.3)').attr('font-size','9px').attr('font-family','monospace') })
    g.append('g').call(d3.axisLeft(ySc).ticks(4).tickSize(3))
      .call(a=>{ a.select('.domain').remove(); a.selectAll('.tick text').attr('fill','rgba(255,255,255,0.3)').attr('font-size','9px').attr('font-family','monospace') })

    // Labels
    g.append('text').attr('x',8).attr('y',14).attr('fill','#a78bfa').attr('font-size','10px').attr('font-family','monospace').text(`x₀=${x0} (purple)`)
    g.append('text').attr('x',8).attr('y',26).attr('fill','#f87171').attr('font-size','10px').attr('font-family','monospace').text(`x₀=${x0b} (red, Δ=0.000001)`)
  }, [type, r, x0, x0b, n, dims, showBifurcation])

  // Bifurcation diagram
  useEffect(() => {
    if (!showBifurcation || type !== 'logistic') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dims.w; canvas.height = 200
    ctx.fillStyle = '#09090b'
    ctx.fillRect(0,0,dims.w,200)
    ctx.fillStyle = 'rgba(124,58,237,0.5)'

    const rMin=2.5, rMax=4.0
    for (let px=0; px<dims.w; px++) {
      const rv = rMin + (px/dims.w)*(rMax-rMin)
      let xv = 0.5
      for (let i=0; i<200; i++) xv=rv*xv*(1-xv)  // burn-in
      for (let i=0; i<100; i++) {
        xv=rv*xv*(1-xv)
        const py = Math.round((1-xv)*200)
        ctx.fillRect(px, py, 1, 1)
      }
    }

    // r axis label
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.font = '10px monospace'
    ctx.fillText('r →  2.5', 4, 196)
    ctx.fillText('4.0', dims.w-24, 196)
  }, [showBifurcation, dims, type])

  // Lorenz attractor (2D projection)
  useEffect(() => {
    if (type !== 'lorenz') return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const { w, h } = dims
    const M = { t:16, r:16, b:16, l:16 }
    const W=w-M.l-M.r, H=h-M.t-M.b

    // Runge-Kutta Lorenz
    const sigma=10, rho=28, beta=8/3
    const dt=0.01, steps=5000
    let lx=0.1, ly=0, lz=0
    const pts: {x:number;y:number}[] = []

    for (let i=0; i<steps; i++) {
      const dx=sigma*(ly-lx), dy=lx*(rho-lz)-ly, dz=lx*ly-beta*lz
      lx+=dx*dt; ly+=dy*dt; lz+=dz*dt
      if (i>200) pts.push({x:lx,y:lz})
    }

    const xExt = d3.extent(pts,p=>p.x) as [number,number]
    const yExt = d3.extent(pts,p=>p.y) as [number,number]
    const xSc = d3.scaleLinear().domain(xExt).range([0,W])
    const ySc = d3.scaleLinear().domain(yExt).range([H,0])

    svg.attr('width',w).attr('height',h)
    const g = svg.append('g').attr('transform',`translate(${M.l},${M.t})`)
    g.append('rect').attr('width',W).attr('height',H).attr('fill','#09090b')

    const colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([0, pts.length])
    for (let i=1; i<pts.length; i++) {
      g.append('line')
        .attr('x1',xSc(pts[i-1].x)).attr('y1',ySc(pts[i-1].y))
        .attr('x2',xSc(pts[i].x)).attr('y2',ySc(pts[i].y))
        .attr('stroke',colorScale(i)).attr('stroke-width',0.8).attr('opacity',0.7)
    }
    g.append('text').attr('x',8).attr('y',16).attr('fill','rgba(255,255,255,0.3)').attr('font-size','10px').attr('font-family','monospace').text('Lorenz Attractor (x-z plane) σ=10, ρ=28, β=8/3')
    g.append('rect').attr('width',W).attr('height',H).attr('fill','none').attr('stroke','rgba(255,255,255,0.06)')
  }, [type, dims])

  const divergence = (() => {
    const s1=[x0], s2=[x0b]
    for(let i=1;i<=n;i++){ s1.push(r*s1[i-1]*(1-s1[i-1])); s2.push(r*s2[i-1]*(1-s2[i-1])) }
    return Math.abs(s1[n]-s2[n])
  })()

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {([['logistic','Logistic Map'],['lorenz','Lorenz Attractor']] as const).map(([k,lbl])=>(
          <button key={k} onClick={()=>setType(k as ChaosType)}
            className={`flex-1 text-xs rounded-lg px-3 py-2 border transition-all ${
              type===k ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}>{lbl}</button>
        ))}
      </div>

      <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
        <svg ref={svgRef} className="w-full"/>
      </div>

      {type==='logistic' && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
              <div>
                <p className="text-[10px] text-white/30 mb-1">Growth rate r = {r.toFixed(3)}</p>
                <input type="range" min={1} max={4} step={0.001} value={r} onChange={e=>setR(Number(e.target.value))} className="w-full accent-violet-500"/>
                <div className="flex justify-between text-[10px] text-white/20 mt-1 font-mono">
                  <span>r&lt;3: stable</span><span>3-3.57: period doubling</span><span>&gt;3.57: chaos</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-white/30 mb-1">Iterations: {n}</p>
                <input type="range" min={20} max={200} step={5} value={n} onChange={e=>setN(Number(e.target.value))} className="w-full accent-violet-500"/>
              </div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Butterfly Effect</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Initial Δ</span>
                  <span className="font-mono text-white/60">0.000001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Final |divergence|</span>
                  <span className={`font-mono ${divergence > 0.1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {divergence.toFixed(6)}
                  </span>
                </div>
                <p className="text-[10px] text-white/25 leading-relaxed mt-2">
                  Tiny differences in initial conditions grow exponentially in chaotic systems — the butterfly effect.
                </p>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={()=>setShowBifurcation(s=>!s)}
              className={`w-8 h-4 rounded-full relative transition-colors ${showBifurcation?'bg-violet-600':'bg-white/10'}`}>
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showBifurcation?'translate-x-4':'translate-x-0.5'}`}/>
            </div>
            <span className="text-xs text-white/50">Show Bifurcation Diagram (r: 2.5→4.0)</span>
          </label>
          {showBifurcation && (
            <div className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
              <canvas ref={canvasRef} className="w-full" style={{imageRendering:'pixelated'}}/>
            </div>
          )}
        </>
      )}

      {type==='lorenz' && (
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-white/35 leading-relaxed">
          The Lorenz attractor is a set of chaotic solutions to the Lorenz system — a simplified model of atmospheric convection. Despite deterministic equations, nearby trajectories diverge exponentially, making long-term prediction impossible.
        </div>
      )}
    </div>
  )
}
