'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

export function UnitCircle() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const [angle, setAngle] = useState(45)
  const [playing, setPlaying] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [dims, setDims] = useState({ width: 500, height: 420 })

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ width: Math.max(280, w), height: Math.max(280, Math.min(440, w * 0.82)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Animation
  useEffect(() => {
    if (!playing) { cancelAnimationFrame(rafRef.current); return }
    let a = angle
    const tick = () => {
      a = (a + 0.5) % 360
      setAngle(Number(a.toFixed(1)))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const W = dims.width, H = dims.height
    const R = Math.min(W, H) * 0.36
    const cx = W * 0.42, cy = H / 2
    const rad = (angle * Math.PI) / 180
    const cosA = Math.cos(rad), sinA = Math.sin(rad)
    const px = cx + R * cosA, py = cy - R * sinA

    const g = svg.attr('width', W).attr('height', H).append('g')
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    // Grid
    for (let i = -4; i <= 4; i++) {
      const step = R / 2
      g.append('line').attr('x1', cx + i * step).attr('x2', cx + i * step)
        .attr('y1', 0).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.04)')
      g.append('line').attr('x1', 0).attr('x2', W)
        .attr('y1', cy + i * step).attr('y2', cy + i * step).attr('stroke', 'rgba(255,255,255,0.04)')
    }

    // Axes
    g.append('line').attr('x1', 20).attr('x2', W - 20).attr('y1', cy).attr('y2', cy)
      .attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-width', 1.5)
    g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', 20).attr('y2', H - 20)
      .attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-width', 1.5)

    // Axis labels
    ;[['1', cx + R + 14, cy], ['-1', cx - R - 20, cy],
      ['i', cx, cy - R - 14], ['-i', cx, cy + R + 18]].forEach(([t, x, y]) => {
      g.append('text').attr('x', x).attr('y', y).attr('fill', 'rgba(255,255,255,0.25)')
        .attr('font-size', '10px').attr('font-family', 'monospace').attr('text-anchor', 'middle')
        .text(String(t))
    })

    // Special angle markers
    if (showAll) {
      const SPECIAL = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]
      SPECIAL.forEach((deg) => {
        const r = (deg * Math.PI) / 180
        const bx = cx + R * Math.cos(r), by = cy - R * Math.sin(r)
        g.append('circle').attr('cx', bx).attr('cy', by).attr('r', 2.5)
          .attr('fill', 'rgba(255,255,255,0.15)')
        if (deg % 90 === 0) {
          g.append('text').attr('x', bx + (bx > cx ? 8 : -8)).attr('y', by + (by > cy ? 12 : -4))
            .attr('fill', 'rgba(255,255,255,0.2)').attr('font-size', '9px').attr('font-family', 'monospace')
            .attr('text-anchor', bx > cx ? 'start' : 'end').text(`${deg}°`)
        }
      })
    }

    // Unit circle
    g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R)
      .attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.12)').attr('stroke-width', 1.5)

    // Arc for angle
    // Draw arc for angle using path math instead of d3.arc to avoid type issues
    const arcR = R * 0.22
    const arcStartX = arcR, arcStartY = 0
    const arcEndX = arcR * Math.cos(rad), arcEndY = -arcR * Math.sin(rad)
    const largeArc = rad > Math.PI ? 1 : 0
    const arcD = `M ${cx + arcStartX} ${cy + arcStartY} A ${arcR} ${arcR} 0 ${largeArc} 0 ${cx + arcEndX} ${cy + arcEndY}`
    g.append('path').attr('d', arcD)
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 1.5)

    // Angle label
    const arcMid = rad / 2
    const aLabelR = R * 0.28
    g.append('text')
      .attr('x', cx + aLabelR * Math.cos(arcMid))
      .attr('y', cy - aLabelR * Math.sin(arcMid))
      .attr('fill', '#f59e0b').attr('font-size', '10px').attr('font-family', 'monospace')
      .attr('text-anchor', 'middle').text(`${angle.toFixed(0)}°`)

    // Radius line
    g.append('line').attr('x1', cx).attr('y1', cy).attr('x2', px).attr('y2', py)
      .attr('stroke', '#7c3aed').attr('stroke-width', 2)

    // cos line (horizontal)
    g.append('line').attr('x1', cx).attr('y1', cy).attr('x2', px).attr('y2', cy)
      .attr('stroke', '#10b981').attr('stroke-width', 2).attr('stroke-dasharray', '5,3')
    g.append('text').attr('x', (cx + px) / 2).attr('y', cy + 14)
      .attr('fill', '#10b981').attr('font-size', '11px').attr('font-family', 'monospace')
      .attr('text-anchor', 'middle').text(`cos = ${cosA.toFixed(3)}`)

    // sin line (vertical)
    g.append('line').attr('x1', px).attr('y1', cy).attr('x2', px).attr('y2', py)
      .attr('stroke', '#06b6d4').attr('stroke-width', 2).attr('stroke-dasharray', '5,3')
    const sinLabelX = px + (cosA >= 0 ? 40 : -40)
    g.append('text').attr('x', sinLabelX).attr('y', (cy + py) / 2 + 4)
      .attr('fill', '#06b6d4').attr('font-size', '11px').attr('font-family', 'monospace')
      .attr('text-anchor', 'middle').text(`sin = ${sinA.toFixed(3)}`)

    // Point P
    g.append('circle').attr('cx', px).attr('cy', py).attr('r', 6)
      .attr('fill', '#7c3aed').attr('stroke', '#09090b').attr('stroke-width', 2)
    g.append('text').attr('x', px + (cosA >= 0 ? 10 : -10)).attr('y', py - 8)
      .attr('fill', 'rgba(255,255,255,0.8)').attr('font-size', '10px').attr('font-family', 'monospace')
      .attr('text-anchor', cosA >= 0 ? 'start' : 'end')
      .text(`P(${cosA.toFixed(2)}, ${sinA.toFixed(2)})`)

    // Right side info panel
    const infoX = W * 0.78, infoY = H * 0.18
    const infoData = [
      { label: 'sin θ', val: sinA.toFixed(4), color: '#06b6d4' },
      { label: 'cos θ', val: cosA.toFixed(4), color: '#10b981' },
      { label: 'tan θ', val: Math.abs(cosA) > 0.001 ? (sinA / cosA).toFixed(4) : '∞', color: '#f59e0b' },
      { label: 'rad', val: rad.toFixed(4), color: '#a78bfa' },
    ]
    infoData.forEach(({ label, val, color }, i) => {
      g.append('text').attr('x', infoX).attr('y', infoY + i * 22)
        .attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', '10px').attr('font-family', 'monospace')
        .text(label)
      g.append('text').attr('x', infoX + 46).attr('y', infoY + i * 22)
        .attr('fill', color).attr('font-size', '11px').attr('font-family', 'monospace').attr('font-weight', 'bold')
        .text(val)
    })

    // Border
    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-width', 1)

  }, [angle, showAll, dims])

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Angle θ</p>
          <div className="flex items-center gap-3 mb-4">
            <input type="range" min={0} max={359} step={0.5}
              value={angle} onChange={(e) => setAngle(Number(e.target.value))}
              className="flex-1 accent-violet-500" />
            <span className="text-sm font-mono text-white/70 w-14 text-right">{angle.toFixed(1)}°</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270].map((deg) => (
              <button key={deg} onClick={() => setAngle(deg)}
                className={`text-[10px] font-mono rounded px-1 py-1 border transition-all ${
                  angle === deg ? 'bg-violet-600/30 border-violet-500/40 text-violet-300'
                    : 'border-white/8 text-white/30 hover:text-white/60 hover:border-white/15'
                }`}>{deg}°</button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-mono">Controls</p>
          <button onClick={() => setPlaying((p) => !p)}
            className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all ${
              playing ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-700 hover:bg-emerald-600'
            }`}>
            {playing ? '⏸ Pause' : '▶ Animate (360°)'}
          </button>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setShowAll((s) => !s)}
              className={`w-8 h-4 rounded-full relative transition-colors ${showAll ? 'bg-violet-600' : 'bg-white/10'}`}>
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showAll ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-xs text-white/50">Show special angles</span>
          </label>
          {/* Values */}
          <div className="rounded-lg border border-white/6 bg-black/20 p-3 space-y-1.5 font-mono text-xs">
            {[
              { l: 'sin', v: Math.sin((angle*Math.PI)/180), c: '#06b6d4' },
              { l: 'cos', v: Math.cos((angle*Math.PI)/180), c: '#10b981' },
              { l: 'tan', v: Math.tan((angle*Math.PI)/180), c: '#f59e0b' },
            ].map(({ l, v, c }) => (
              <div key={l} className="flex justify-between">
                <span className="text-white/30">{l}({angle.toFixed(0)}°)</span>
                <span style={{ color: c }}>{Math.abs(v) > 1e4 ? '∞' : v.toFixed(5)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
