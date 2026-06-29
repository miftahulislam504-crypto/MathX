'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface Matrix2x2 { a: number; b: number; c: number; d: number }

const PRESETS: { label: string; m: Matrix2x2 }[] = [
  { label: 'Identity',   m: { a: 1, b: 0, c: 0, d: 1 } },
  { label: 'Scale 2×',  m: { a: 2, b: 0, c: 0, d: 2 } },
  { label: 'Rotate 45°',m: { a: 0.707, b: -0.707, c: 0.707, d: 0.707 } },
  { label: 'Shear X',   m: { a: 1, b: 1, c: 0, d: 1 } },
  { label: 'Reflect Y', m: { a: -1, b: 0, c: 0, d: 1 } },
  { label: 'Compress',  m: { a: 0.5, b: 0, c: 0, d: 2 } },
]

const SHAPES = {
  square: [[-1,-1],[1,-1],[1,1],[-1,1],[-1,-1]],
  arrow:  [[0,0],[1.5,0],[1.5,-0.4],[2.5,0.8],[1.5,2],[1.5,1.6],[0,1.6],[0,0]],
}

export function MatrixTransform() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mat, setMat] = useState<Matrix2x2>({ a: 1, b: 0, c: 0, d: 1 })
  const [shape, setShape] = useState<keyof typeof SHAPES>('square')
  const [showOrig, setShowOrig] = useState(true)
  const [dims, setDims] = useState({ width: 580, height: 380 })

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ width: Math.max(280, w), height: Math.max(260, Math.min(400, w * 0.62)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const W = dims.width, H = dims.height
    const SCALE = Math.min(W, H) * 0.14
    const cx = W / 2, cy = H / 2

    const tx = (x: number) => cx + x * SCALE
    const ty = (y: number) => cy - y * SCALE

    const applyMat = (pt: number[]): [number, number] => [
      mat.a * pt[0] + mat.b * pt[1],
      mat.c * pt[0] + mat.d * pt[1],
    ]

    const g = svg.attr('width', W).attr('height', H).append('g')
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    // Grid
    for (let i = -6; i <= 6; i++) {
      g.append('line').attr('x1', tx(i)).attr('x2', tx(i)).attr('y1', 0).attr('y2', H)
        .attr('stroke', 'rgba(255,255,255,0.04)')
      g.append('line').attr('x1', 0).attr('x2', W).attr('y1', ty(i)).attr('y2', ty(i))
        .attr('stroke', 'rgba(255,255,255,0.04)')
    }

    // Transformed grid lines (faint)
    const TGRID_COLOR = 'rgba(124,58,237,0.1)'
    for (let i = -5; i <= 5; i++) {
      // columns: x=i, y varies
      const p1 = applyMat([i, -5]), p2 = applyMat([i, 5])
      g.append('line').attr('x1', tx(p1[0])).attr('y1', ty(p1[1]))
        .attr('x2', tx(p2[0])).attr('y2', ty(p2[1]))
        .attr('stroke', TGRID_COLOR)
      // rows: y=i, x varies
      const p3 = applyMat([-5, i]), p4 = applyMat([5, i])
      g.append('line').attr('x1', tx(p3[0])).attr('y1', ty(p3[1]))
        .attr('x2', tx(p4[0])).attr('y2', ty(p4[1]))
        .attr('stroke', TGRID_COLOR)
    }

    // Axes
    g.append('line').attr('x1', 20).attr('x2', W - 20).attr('y1', cy).attr('y2', cy)
      .attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-width', 1.5)
    g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', 20).attr('y2', H - 20)
      .attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-width', 1.5)

    // Tick labels
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue
      g.append('text').attr('x', tx(i)).attr('y', cy + 14)
        .attr('fill', 'rgba(255,255,255,0.2)').attr('font-size', '9px').attr('font-family', 'monospace').attr('text-anchor', 'middle').text(i)
      g.append('text').attr('x', cx - 12).attr('y', ty(i) + 4)
        .attr('fill', 'rgba(255,255,255,0.2)').attr('font-size', '9px').attr('font-family', 'monospace').attr('text-anchor', 'middle').text(i)
    }

    // Basis vectors (original)
    const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, dashed = false) => {
      const id = `arr-${Math.random().toString(36).slice(2)}`
      svg.select('defs').empty() && svg.append('defs')
      d3.select(svgRef.current).select('defs').append('marker')
        .attr('id', id).attr('viewBox', '0 -4 8 8').attr('refX', 7).attr('refY', 0)
        .attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
        .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', color)
      g.append('line').attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
        .attr('stroke', color).attr('stroke-width', 2)
        .attr('stroke-dasharray', dashed ? '5,3' : '0')
        .attr('marker-end', `url(#${id})`)
    }

    // Original shape
    const pts = SHAPES[shape]
    if (showOrig) {
      const origPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${tx(p[0])},${ty(p[1])}`).join(' ') + ' Z'
      g.append('path').attr('d', origPath)
        .attr('fill', 'rgba(255,255,255,0.04)')
        .attr('stroke', 'rgba(255,255,255,0.2)').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3')
    }

    // Transformed shape
    const tpts = pts.map(applyMat)
    const transPath = tpts.map((p, i) => `${i === 0 ? 'M' : 'L'}${tx(p[0])},${ty(p[1])}`).join(' ') + ' Z'
    g.append('path').attr('d', transPath)
      .attr('fill', 'rgba(124,58,237,0.12)')
      .attr('stroke', '#7c3aed').attr('stroke-width', 2)

    // Original basis vectors
    if (showOrig) {
      drawArrow(cx, cy, tx(1), ty(0), '#10b981', true)
      drawArrow(cx, cy, tx(0), ty(1), '#f59e0b', true)
    }

    // Transformed basis vectors
    const e1t = applyMat([1, 0]), e2t = applyMat([0, 1])
    drawArrow(cx, cy, tx(e1t[0]), ty(e1t[1]), '#10b981')
    drawArrow(cx, cy, tx(e2t[0]), ty(e2t[1]), '#f59e0b')

    // Labels
    g.append('text').attr('x', tx(e1t[0]) + 8).attr('y', ty(e1t[1]))
      .attr('fill', '#10b981').attr('font-size', '11px').attr('font-family', 'monospace')
      .text(`Ae₁=(${e1t[0].toFixed(2)},${e1t[1].toFixed(2)})`)
    g.append('text').attr('x', tx(e2t[0]) + 8).attr('y', ty(e2t[1]) - 6)
      .attr('fill', '#f59e0b').attr('font-size', '11px').attr('font-family', 'monospace')
      .text(`Ae₂=(${e2t[0].toFixed(2)},${e2t[1].toFixed(2)})`)

    // Border
    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-width', 1)

  }, [mat, shape, showOrig, dims])

  const det = mat.a * mat.d - mat.b * mat.c
  const trace = mat.a + mat.d

  const setEntry = (key: keyof Matrix2x2, val: number) =>
    setMat((m) => ({ ...m, [key]: val }))

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {/* Matrix input */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Matrix A</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {(['a','b','c','d'] as (keyof Matrix2x2)[]).map((k) => (
              <div key={k}>
                <p className="text-[10px] text-white/30 font-mono mb-1">{k === 'a' ? 'a₁₁' : k === 'b' ? 'a₁₂' : k === 'c' ? 'a₂₁' : 'a₂₂'}</p>
                <input type="number" step={0.1} value={mat[k]}
                  onChange={(e) => setEntry(k, Number(e.target.value))}
                  className="w-full bg-black/30 border border-white/10 focus:border-violet-500/50 rounded-md px-2 py-1.5 text-sm font-mono text-white focus:outline-none transition-colors text-center" />
              </div>
            ))}
          </div>
          {/* Matrix display */}
          <div className="flex items-center justify-center gap-2 rounded-lg bg-black/30 p-3 font-mono text-sm">
            <span className="text-white/30 text-lg">[</span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-center">
              <span className="text-violet-300">{mat.a.toFixed(2)}</span>
              <span className="text-violet-300">{mat.b.toFixed(2)}</span>
              <span className="text-violet-300">{mat.c.toFixed(2)}</span>
              <span className="text-violet-300">{mat.d.toFixed(2)}</span>
            </div>
            <span className="text-white/30 text-lg">]</span>
          </div>
        </div>

        {/* Presets + shape */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Presets</p>
          <div className="space-y-1.5 mb-4">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => setMat(p.m)}
                className="w-full text-left text-xs rounded-lg px-3 py-2 border border-white/8 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/5 transition-all font-mono">
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-mono">Shape</p>
          <div className="flex gap-2">
            {(Object.keys(SHAPES) as (keyof typeof SHAPES)[]).map((s) => (
              <button key={s} onClick={() => setShape(s)}
                className={`flex-1 text-xs rounded-lg px-3 py-2 border transition-all capitalize ${
                  shape === s ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                    : 'border-white/8 text-white/40 hover:text-white/70'
                }`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Properties */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">Properties</p>
          <div className="space-y-2.5 text-sm font-mono">
            {[
              { label: 'det(A)', val: det.toFixed(4), color: Math.abs(det) < 0.01 ? '#ef4444' : '#10b981', note: det < 0 ? 'flipped' : det === 0 ? 'singular!' : '' },
              { label: 'trace', val: trace.toFixed(4), color: '#06b6d4', note: '' },
              { label: 'area scale', val: Math.abs(det).toFixed(4), color: '#f59e0b', note: '' },
            ].map(({ label, val, color, note }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-white/40">{label}</span>
                <div className="text-right">
                  <span style={{ color }}>{val}</span>
                  {note && <span className="ml-2 text-[10px] text-rose-400">{note}</span>}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-white/5">
              <p className="text-[10px] text-white/20 leading-relaxed">
                det = 0 → singular (collapses space)<br />
                det &lt; 0 → orientation flipped<br />
                |det| = area scaling factor
              </p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-4">
            <div onClick={() => setShowOrig((s) => !s)}
              className={`w-8 h-4 rounded-full relative transition-colors ${showOrig ? 'bg-violet-600' : 'bg-white/10'}`}>
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showOrig ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-xs text-white/50">Show original shape</span>
          </label>
        </div>
      </div>
    </div>
  )
}
