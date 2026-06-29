'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

import { Branch } from '@/types'
interface BranchData {
  branch: Branch
  mastery: number
  studied: number
  total: number
}

interface Props { data: BranchData[] }

export function BranchMasteryChart({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const W = containerRef.current?.clientWidth ?? 500
    const barH = 28, gap = 8, padL = 130, padR = 80
    const H = data.length * (barH + gap) + 20

    svg.attr('width', W).attr('height', H)

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, W - padL - padR])

    data.forEach((d, i) => {
      const y = i * (barH + gap) + 4
      const g = svg.append('g').attr('transform', `translate(0,${y})`)

      // Branch icon + name
      g.append('text').attr('x', padL - 10).attr('y', barH / 2 + 4)
        .attr('fill', 'rgba(255,255,255,0.55)').attr('font-size', '11px')
        .attr('text-anchor', 'end').attr('font-family', 'system-ui')
        .text(`${d.branch.icon} ${d.branch.name}`)

      // Track
      g.append('rect').attr('x', padL).attr('y', 0)
        .attr('width', xScale(100)).attr('height', barH)
        .attr('rx', 6).attr('fill', 'rgba(255,255,255,0.03)')

      // Fill bar
      if (d.mastery > 0) {
        g.append('rect').attr('x', padL).attr('y', 0)
          .attr('width', 0).attr('height', barH).attr('rx', 6)
          .attr('fill', d.branch.color || '#7c3aed')
          .attr('opacity', 0.7)
          .transition().duration(600).delay(i * 60)
          .attr('width', xScale(d.mastery))
      }

      // Mastery % label
      g.append('text').attr('x', padL + xScale(100) + 8).attr('y', barH / 2 + 4)
        .attr('fill', d.mastery > 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)')
        .attr('font-size', '11px').attr('font-family', 'monospace')
        .text(d.mastery > 0 ? `${d.mastery}%` : '—')

      // Topics count
      g.append('text').attr('x', padL + 6).attr('y', barH / 2 + 4)
        .attr('fill', 'rgba(255,255,255,0.25)').attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text(d.studied > 0 ? `${d.studied}/${d.total} topics` : '')
    })
  }, [data])

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Branch Mastery</h3>
      <div ref={containerRef} className="w-full">
        <svg ref={svgRef} className="w-full" />
      </div>
    </div>
  )
}
