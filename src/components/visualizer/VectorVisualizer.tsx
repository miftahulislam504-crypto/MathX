'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface Vec2 { x: number; y: number; color: string; label: string }

const ARROW_SIZE = 8

function drawArrow(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
  label: string,
  dashed = false
) {
  const markerId = `arrow-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 6)}`
  const defs = g.append('defs')
  defs.append('marker').attr('id', markerId)
    .attr('viewBox', '0 -5 10 10').attr('refX', 8).attr('refY', 0)
    .attr('markerWidth', ARROW_SIZE).attr('markerHeight', ARROW_SIZE)
    .attr('orient', 'auto')
    .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', color)

  g.append('line')
    .attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
    .attr('stroke', color).attr('stroke-width', 2)
    .attr('stroke-dasharray', dashed ? '5,3' : '0')
    .attr('marker-end', `url(#${markerId})`)

  // Label near midpoint
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const ox = (-dy / len) * 14, oy = (dx / len) * 14

  g.append('text').attr('x', mx + ox).attr('y', my + oy)
    .attr('fill', color).attr('font-size', '11px').attr('font-family', 'monospace')
    .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
    .text(label)
}

export function VectorVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ width: 500, height: 420 })
  const [vecs, setVecs] = useState<Vec2[]>([
    { x: 3, y: 2, color: '#7c3aed', label: 'a' },
    { x: 1, y: 4, color: '#06b6d4', label: 'b' },
  ])
  const [showSum, setShowSum] = useState(true)
  const [showComponents, setShowComponents] = useState(true)
  const [showDot, setShowDot] = useState(true)
  const SCALE = 40
  const MARGIN = 60

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      setDims({ width: Math.max(280, w), height: Math.max(280, Math.min(440, w * 0.82)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const W = dims.width, H = dims.height
    const cx = W / 2, cy = H / 2

    const g = svg.attr('width', W).attr('height', H).append('g')
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    // Grid
    const gridStep = SCALE
    for (let x = cx % gridStep; x < W; x += gridStep) {
      g.append('line').attr('x1', x).attr('x2', x).attr('y1', 0).attr('y2', H)
        .attr('stroke', 'rgba(255,255,255,0.04)')
    }
    for (let y = cy % gridStep; y < H; y += gridStep) {
      g.append('line').attr('x1', 0).attr('x2', W).attr('y1', y).attr('y2', y)
        .attr('stroke', 'rgba(255,255,255,0.04)')
    }

    // Axes
    g.append('line').attr('x1', 0).attr('x2', W).attr('y1', cy).attr('y2', cy)
      .attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-width', 1.5)
    g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', 0).attr('y2', H)
      .attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-width', 1.5)

    // Axis numbers
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue
      g.append('text').attr('x', cx + i * SCALE).attr('y', cy + 16)
        .attr('fill', 'rgba(255,255,255,0.2)').attr('font-size', '9px').attr('font-family', 'monospace').attr('text-anchor', 'middle')
        .text(i)
      g.append('text').attr('x', cx - 14).attr('y', cy - i * SCALE + 4)
        .attr('fill', 'rgba(255,255,255,0.2)').attr('font-size', '9px').attr('font-family', 'monospace').attr('text-anchor', 'middle')
        .text(i)
    }

    // World coords → SVG
    const tx = (x: number) => cx + x * SCALE
    const ty = (y: number) => cy - y * SCALE

    // Components dashed lines
    if (showComponents) {
      vecs.forEach((v) => {
        // x-component
        g.append('line').attr('x1', tx(0)).attr('y1', ty(0)).attr('x2', tx(v.x)).attr('y2', ty(0))
          .attr('stroke', v.color).attr('stroke-width', 1).attr('stroke-dasharray', '3,3').attr('opacity', 0.4)
        // y-component
        g.append('line').attr('x1', tx(v.x)).attr('y1', ty(0)).attr('x2', tx(v.x)).attr('y2', ty(v.y))
          .attr('stroke', v.color).attr('stroke-width', 1).attr('stroke-dasharray', '3,3').attr('opacity', 0.4)
      })
    }

    // Sum vector
    if (showSum && vecs.length >= 2) {
      const sx = vecs.reduce((s, v) => s + v.x, 0)
      const sy = vecs.reduce((s, v) => s + v.y, 0)
      drawArrow(g, tx(0), ty(0), tx(sx), ty(sy), '#f59e0b', 'a+b', true)
    }

    // Main vectors
    vecs.forEach((v) => {
      drawArrow(g, tx(0), ty(0), tx(v.x), ty(v.y), v.color, v.label)
    })

    // Border
    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-width', 1)

  }, [vecs, showSum, showComponents, dims])

  const dot = vecs.length >= 2 ? vecs[0].x * vecs[1].x + vecs[0].y * vecs[1].y : 0
  const magA = vecs[0] ? Math.sqrt(vecs[0].x ** 2 + vecs[0].y ** 2) : 0
  const magB = vecs[1] ? Math.sqrt(vecs[1].x ** 2 + vecs[1].y ** 2) : 0
  const angle = magA && magB ? (Math.acos(Math.min(1, Math.max(-1, dot / (magA * magB)))) * 180 / Math.PI) : 0

  const updateVec = (i: number, key: 'x' | 'y', val: number) =>
    setVecs((prev) => prev.map((v, idx) => idx === i ? { ...v, [key]: val } : v))

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Vector inputs */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Vectors</p>
          {vecs.map((v, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
                <span className="text-sm font-mono text-white/70">Vector {v.label}</span>
                <span className="text-xs text-white/30 font-mono ml-auto">
                  |{v.label}| = {Math.sqrt(v.x**2+v.y**2).toFixed(2)}
                </span>
              </div>
              {['x', 'y'].map((k) => (
                <div key={k} className="flex items-center gap-3 mb-1.5">
                  <span className="text-[10px] text-white/30 font-mono w-3">{k}</span>
                  <input type="range" min={-6} max={6} step={0.1}
                    value={(v as any)[k]}
                    onChange={(e) => updateVec(i, k as 'x'|'y', Number(e.target.value))}
                    className="flex-1" style={{ accentColor: v.color }} />
                  <span className="text-xs font-mono text-white/60 w-8 text-right">
                    {((v as any)[k] as number).toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Metrics + toggles */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Properties</p>
            {showDot && vecs.length >= 2 && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">a · b</span>
                  <span className="font-mono text-amber-400">{dot.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">|a|</span>
                  <span className="font-mono text-violet-400">{magA.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">|b|</span>
                  <span className="font-mono text-cyan-400">{magB.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">angle θ</span>
                  <span className="font-mono text-emerald-400">{angle.toFixed(2)}°</span>
                </div>
                {vecs.length >= 2 && (
                  <div className="flex justify-between">
                    <span className="text-white/40">a + b</span>
                    <span className="font-mono text-amber-400">
                      ({(vecs[0].x+vecs[1].x).toFixed(1)}, {(vecs[0].y+vecs[1].y).toFixed(1)})
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Display</p>
            {[
              { key: 'showSum', state: showSum, set: setShowSum, label: 'Sum vector (a+b)' },
              { key: 'showComponents', state: showComponents, set: setShowComponents, label: 'Component lines' },
              { key: 'showDot', state: showDot, set: setShowDot, label: 'Dot product info' },
            ].map(({ key, state, set, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer mb-2 group">
                <div onClick={() => set(!state)}
                  className={`w-8 h-4 rounded-full relative transition-colors ${state ? 'bg-violet-600' : 'bg-white/10'}`}>
                  <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${state ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
