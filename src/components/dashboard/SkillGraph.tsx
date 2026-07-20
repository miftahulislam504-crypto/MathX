'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Branch } from '@/types'

interface BranchData {
  branch: Branch
  mastery: number
  studied: number
  total: number
}

interface Props { data: BranchData[] }

const MARGIN = 56

export function SkillGraph({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(360)

  // Only show branches the learner has actually engaged with — otherwise
  // a 21-axis radar chart is unreadable noise for a brand-new account.
  const engaged = data.filter((d) => d.studied > 0)
  const axes = engaged.length >= 3 ? engaged : data.slice(0, Math.max(3, engaged.length))

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setSize(Math.max(260, Math.min(400, w)))
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    if (axes.length < 3) return

    const R = (size - MARGIN * 2) / 2
    const cx = size / 2
    const cy = size / 2
    const n = axes.length

    svg.attr('width', size).attr('height', size)
    const g = svg.append('g')

    const angleFor = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2
    const pointFor = (i: number, value: number) => {
      const a = angleFor(i)
      const r = (value / 100) * R
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
    }

    // Concentric grid rings at 25/50/75/100%
    ;[25, 50, 75, 100].forEach((pct) => {
      const ringPoints = Array.from({ length: n }, (_, i) => pointFor(i, pct))
      const path = d3.line<{ x: number; y: number }>().x((p) => p.x).y((p) => p.y).curve(d3.curveLinearClosed)
      g.append('path')
        .attr('d', path(ringPoints))
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,0.06)')
        .attr('stroke-width', 1)
      if (pct === 100) {
        g.append('path').attr('d', path(ringPoints)).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.12)').attr('stroke-width', 1)
      }
    })

    // Spokes
    axes.forEach((_, i) => {
      const p = pointFor(i, 100)
      g.append('line').attr('x1', cx).attr('y1', cy).attr('x2', p.x).attr('y2', p.y).attr('stroke', 'rgba(255,255,255,0.06)')
    })

    // Data polygon
    const dataPoints = axes.map((d, i) => pointFor(i, d.mastery))
    const dataPath = d3.line<{ x: number; y: number }>().x((p) => p.x).y((p) => p.y).curve(d3.curveLinearClosed)
    g.append('path')
      .attr('d', dataPath(dataPoints))
      .attr('fill', '#7c3aed')
      .attr('fill-opacity', 0.18)
      .attr('stroke', '#a78bfa')
      .attr('stroke-width', 2)

    dataPoints.forEach((p, i) => {
      g.append('circle').attr('cx', p.x).attr('cy', p.y).attr('r', 3.5)
        .attr('fill', axes[i].mastery > 0 ? '#a78bfa' : 'rgba(255,255,255,0.15)')
        .attr('stroke', '#09090b').attr('stroke-width', 1.5)
    })

    // Axis labels
    axes.forEach((d, i) => {
      const a = angleFor(i)
      const labelR = R + 28
      const lx = cx + labelR * Math.cos(a)
      const ly = cy + labelR * Math.sin(a)
      const anchor = Math.cos(a) > 0.15 ? 'start' : Math.cos(a) < -0.15 ? 'end' : 'middle'

      g.append('text')
        .attr('x', lx).attr('y', ly)
        .attr('text-anchor', anchor)
        .attr('dominant-baseline', 'middle')
        .attr('fill', d.mastery > 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)')
        .attr('font-size', '10px')
        .attr('font-family', 'system-ui')
        .text(d.branch.name.length > 14 ? `${d.branch.name.slice(0, 13)}…` : d.branch.name)

      g.append('text')
        .attr('x', lx).attr('y', ly + 13)
        .attr('text-anchor', anchor)
        .attr('fill', 'rgba(255,255,255,0.25)')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text(`${d.mastery}%`)
    })
  }, [axes, size])

  if (axes.length < 3) {
    return (
      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-2">Skill Graph</h3>
        <p className="text-xs text-white/25 py-8 text-center">
          Study at least 3 branches to unlock your skill graph — right now there&apos;s not enough data for a useful shape.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-1">Skill Graph</h3>
      <p className="text-[11px] text-white/25 mb-3">
        {engaged.length >= 3 ? 'Your mastery across every branch you\u2019ve studied' : 'Your mastery across your top branches'}
      </p>
      <div ref={containerRef} className="w-full flex justify-center">
        <svg ref={svgRef} />
      </div>
    </div>
  )
}
