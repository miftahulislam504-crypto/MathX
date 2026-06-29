'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'

export function MonteCarlo() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const pointsRef = useRef<{ x: number; y: number; inside: boolean }[]>([])

  const [running, setRunning] = useState(false)
  const [total, setTotal] = useState(0)
  const [inside, setInside] = useState(0)
  const [dims, setDims] = useState({ w: 400, h: 400 })
  const [speed, setSpeed] = useState(20)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = Math.min(e[0].contentRect.width, 480)
      setDims({ w, h: w })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const { w, h } = dims
    const pad = 20
    const size = Math.min(w, h) - pad * 2

    svg.attr('width', w).attr('height', h)
    const g = svg.append('g').attr('transform', `translate(${pad},${pad})`)

    g.append('rect').attr('width', size).attr('height', size)
      .attr('fill', '#09090b').attr('stroke', 'rgba(255,255,255,0.12)').attr('stroke-width', 1.5)

    g.append('circle')
      .attr('cx', size / 2).attr('cy', size / 2).attr('r', size / 2)
      .attr('fill', 'none').attr('stroke', '#7c3aed').attr('stroke-width', 1.5)

    pointsRef.current.forEach((p) => {
      g.append('circle')
        .attr('cx', p.x * size).attr('cy', p.y * size).attr('r', 1.5)
        .attr('fill', p.inside ? '#06b6d4' : '#f43f5e')
        .attr('opacity', 0.7)
    })
  }, [dims])

  useEffect(() => { draw() }, [draw, total])

  useEffect(() => {
    if (!running) { cancelAnimationFrame(rafRef.current); return }
    const batch = speed

    const tick = () => {
      const newPts: typeof pointsRef.current = []
      for (let i = 0; i < batch; i++) {
        const x = Math.random(), y = Math.random()
        const dx = x - 0.5, dy = y - 0.5
        newPts.push({ x, y, inside: dx * dx + dy * dy <= 0.25 })
      }
      pointsRef.current = [...pointsRef.current, ...newPts].slice(-4000)
      const ins = pointsRef.current.filter((p) => p.inside).length
      setTotal(pointsRef.current.length)
      setInside(ins)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, speed])

  const reset = () => {
    setRunning(false)
    pointsRef.current = []
    setTotal(0)
    setInside(0)
  }

  const piEst = total > 0 ? (4 * inside) / total : 0
  const error = total > 0 ? Math.abs(piEst - Math.PI) : 0

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4 items-start">
        <div ref={containerRef} className="flex justify-center">
          <svg ref={svgRef} className="rounded-xl border border-white/8" />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
            <p className="text-xs text-violet-400/60 uppercase tracking-wider mb-1">π Estimate</p>
            <p className="text-4xl font-bold font-mono text-violet-300">
              {piEst > 0 ? piEst.toFixed(6) : '—'}
            </p>
            <p className="text-xs text-white/30 mt-1 font-mono">True π = 3.141593</p>
            {total > 0 && (
              <p className={`text-sm mt-2 font-mono ${error < 0.01 ? 'text-emerald-400' : 'text-amber-400'}`}>
                error = {error.toFixed(6)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Total', val: total.toLocaleString(), color: 'text-white' },
              { label: 'Inside', val: inside.toLocaleString(), color: 'text-cyan-400' },
              { label: 'Outside', val: (total - inside).toLocaleString(), color: 'text-rose-400' },
            ].map(({ label, val, color }) => (
              <div key={label} className="rounded-lg border border-white/6 bg-white/[0.02] p-2">
                <p className={`text-lg font-mono font-semibold ${color}`}>{val}</p>
                <p className="text-[10px] text-white/30">{label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs text-white/30 mb-1">Speed: {speed} pts/frame</p>
            <input type="range" min={5} max={100} step={5} value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-violet-500" />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setRunning((r) => !r)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all ${
                running ? 'bg-amber-600 hover:bg-amber-500' : 'bg-violet-600 hover:bg-violet-500'
              }`}>
              {running ? '⏸ Pause' : '▶ Run'}
            </button>
            <button onClick={reset}
              className="rounded-lg px-4 py-2.5 text-sm border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all">
              Reset
            </button>
          </div>

          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-white/35 leading-relaxed">
            <p className="font-semibold text-white/50 mb-1">How it works:</p>
            Random points are dropped in a 1×1 square. Points inside the quarter-circle
            (radius ½) satisfy x² + y² ≤ ¼. Since circle area / square area = π/4,
            we estimate <span className="text-violet-300 font-mono">π ≈ 4 × (inside/total)</span>.
          </div>
        </div>
      </div>
    </div>
  )
}
