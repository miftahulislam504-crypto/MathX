'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface WalkConfig { dims: number; steps: number; color: string }

const CONFIGS: WalkConfig[] = [
  { dims: 1, steps: 200, color: '#7c3aed' },
  { dims: 2, steps: 500, color: '#06b6d4' },
]

function generate1D(n: number): number[] {
  const path = [0]
  for (let i = 1; i < n; i++) path.push(path[i-1] + (Math.random() < 0.5 ? 1 : -1))
  return path
}

function generate2D(n: number): {x:number;y:number}[] {
  const path = [{x:0,y:0}]
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  for (let i = 1; i < n; i++) {
    const d = dirs[Math.floor(Math.random()*4)]
    path.push({x:path[i-1].x+d[0], y:path[i-1].y+d[1]})
  }
  return path
}

export function RandomWalk() {
  const svg1Ref = useRef<SVGSVGElement>(null)
  const svg2Ref = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [steps1D, setSteps1D] = useState(300)
  const [steps2D, setSteps2D] = useState(800)
  const [walks1D, setWalks1D] = useState(1)
  const [dims, setDims] = useState({ w: 560, h: 220 })
  const [seed, setSeed] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(180, Math.min(260, w * 0.38)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Draw 1D
  useEffect(() => {
    const svg = d3.select(svg1Ref.current)
    svg.selectAll('*').remove()
    const { w, h } = dims
    const M = { t:16, r:16, b:32, l:44 }
    const W = w - M.l - M.r, H = h - M.t - M.b

    const paths = Array.from({length: walks1D}, () => generate1D(steps1D))
    const allVals = paths.flat()
    const yMin = Math.min(...allVals), yMax = Math.max(...allVals)

    const xSc = d3.scaleLinear().domain([0, steps1D-1]).range([0, W])
    const ySc = d3.scaleLinear().domain([yMin, yMax]).range([H, 0])

    svg.attr('width', w).attr('height', h)
    const g = svg.append('g').attr('transform', `translate(${M.l},${M.t})`)
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    xSc.ticks(6).forEach(t => {
      g.append('line').attr('x1',xSc(t)).attr('x2',xSc(t)).attr('y1',0).attr('y2',H)
        .attr('stroke','rgba(255,255,255,0.04)')
    })
    ySc.ticks(5).forEach(t => {
      g.append('line').attr('x1',0).attr('x2',W).attr('y1',ySc(t)).attr('y2',ySc(t))
        .attr('stroke','rgba(255,255,255,0.04)')
    })

    // Zero line
    if (yMin < 0 && yMax > 0) {
      g.append('line').attr('x1',0).attr('x2',W).attr('y1',ySc(0)).attr('y2',ySc(0))
        .attr('stroke','rgba(255,255,255,0.15)').attr('stroke-dasharray','4,3')
    }

    const colors = ['#7c3aed','#06b6d4','#f59e0b','#10b981','#ef4444']
    paths.forEach((path, pi) => {
      const lineGen = d3.line<number>().x((_,i)=>xSc(i)).y(d=>ySc(d))
      g.append('path').datum(path).attr('fill','none')
        .attr('stroke', colors[pi % colors.length]).attr('stroke-width', 1.5)
        .attr('opacity', 0.85).attr('d', lineGen)
    })

    g.append('g').attr('transform',`translate(0,${H})`).call(d3.axisBottom(xSc).ticks(5).tickSize(3))
      .call(a=>{ a.select('.domain').remove(); a.selectAll('.tick text').attr('fill','rgba(255,255,255,0.3)').attr('font-size','9px').attr('font-family','monospace') })
    g.append('g').call(d3.axisLeft(ySc).ticks(4).tickSize(3))
      .call(a=>{ a.select('.domain').remove(); a.selectAll('.tick text').attr('fill','rgba(255,255,255,0.3)').attr('font-size','9px').attr('font-family','monospace') })

    g.append('text').attr('x', 8).attr('y', 12).attr('fill','rgba(255,255,255,0.3)')
      .attr('font-size','10px').attr('font-family','monospace').text('1D Random Walk — Position')
  }, [steps1D, walks1D, dims, seed])

  // Draw 2D
  useEffect(() => {
    const svg = d3.select(svg2Ref.current)
    svg.selectAll('*').remove()
    const { w, h } = dims
    const M = { t:16, r:16, b:32, l:44 }
    const W = w - M.l - M.r, H = h - M.t - M.b

    const path = generate2D(steps2D)
    const xs = path.map(p=>p.x), ys = path.map(p=>p.y)
    const xMin=Math.min(...xs), xMax=Math.max(...xs)
    const yMin=Math.min(...ys), yMax=Math.max(...ys)
    const pad = 2

    const xSc = d3.scaleLinear().domain([xMin-pad, xMax+pad]).range([0, W])
    const ySc = d3.scaleLinear().domain([yMin-pad, yMax+pad]).range([H, 0])

    svg.attr('width', w).attr('height', h)
    const g = svg.append('g').attr('transform',`translate(${M.l},${M.t})`)
    g.append('rect').attr('width',W).attr('height',H).attr('fill','#09090b')

    // Axes
    if (xMin < 0 && xMax > 0)
      g.append('line').attr('x1',xSc(0)).attr('x2',xSc(0)).attr('y1',0).attr('y2',H)
        .attr('stroke','rgba(255,255,255,0.08)').attr('stroke-dasharray','3,3')
    if (yMin < 0 && yMax > 0)
      g.append('line').attr('x1',0).attr('x2',W).attr('y1',ySc(0)).attr('y2',ySc(0))
        .attr('stroke','rgba(255,255,255,0.08)').attr('stroke-dasharray','3,3')

    // Path with color gradient by time
    const colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, path.length-1])
    for (let i = 1; i < path.length; i++) {
      g.append('line')
        .attr('x1',xSc(path[i-1].x)).attr('y1',ySc(path[i-1].y))
        .attr('x2',xSc(path[i].x)).attr('y2',ySc(path[i].y))
        .attr('stroke', colorScale(i)).attr('stroke-width', 1.2).attr('opacity', 0.8)
    }

    // Start & End
    g.append('circle').attr('cx',xSc(0)).attr('cy',ySc(0)).attr('r',5)
      .attr('fill','#10b981').attr('stroke','#09090b').attr('stroke-width',2)
    const last = path[path.length-1]
    g.append('circle').attr('cx',xSc(last.x)).attr('cy',ySc(last.y)).attr('r',5)
      .attr('fill','#ef4444').attr('stroke','#09090b').attr('stroke-width',2)

    const dist = Math.sqrt(last.x**2 + last.y**2).toFixed(2)
    g.append('line').attr('x1',xSc(0)).attr('y1',ySc(0)).attr('x2',xSc(last.x)).attr('y2',ySc(last.y))
      .attr('stroke','rgba(255,255,255,0.2)').attr('stroke-dasharray','4,3').attr('stroke-width',1)

    g.append('g').attr('transform',`translate(0,${H})`).call(d3.axisBottom(xSc).ticks(5).tickSize(3))
      .call(a=>{ a.select('.domain').remove(); a.selectAll('.tick text').attr('fill','rgba(255,255,255,0.3)').attr('font-size','9px').attr('font-family','monospace') })

    g.append('text').attr('x', 8).attr('y', 12).attr('fill','rgba(255,255,255,0.3)')
      .attr('font-size','10px').attr('font-family','monospace')
      .text(`2D Random Walk — distance from origin: ${dist}`)
  }, [steps2D, dims, seed])

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
        <svg ref={svg1Ref} className="w-full" />
      </div>

      <div className="grid sm:grid-cols-3 gap-3 items-center">
        <div>
          <p className="text-[10px] text-white/30 mb-1">Steps: {steps1D}</p>
          <input type="range" min={50} max={1000} step={50} value={steps1D}
            onChange={(e)=>setSteps1D(Number(e.target.value))}
            className="w-full accent-violet-500"/>
        </div>
        <div>
          <p className="text-[10px] text-white/30 mb-1">Walks: {walks1D}</p>
          <input type="range" min={1} max={5} step={1} value={walks1D}
            onChange={(e)=>setWalks1D(Number(e.target.value))}
            className="w-full accent-violet-500"/>
        </div>
        <button onClick={()=>setSeed(s=>s+1)}
          className="rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition-all">
          ↺ New Walk
        </button>
      </div>

      <div className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
        <svg ref={svg2Ref} className="w-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 items-center">
        <div>
          <p className="text-[10px] text-white/30 mb-1">2D Steps: {steps2D}</p>
          <input type="range" min={100} max={2000} step={100} value={steps2D}
            onChange={(e)=>setSteps2D(Number(e.target.value))}
            className="w-full accent-cyan-500"/>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-white/35 leading-relaxed">
          Green = start, Red = end. Color gradient shows time progression. Expected displacement ∝ √n.
        </div>
      </div>
    </div>
  )
}
