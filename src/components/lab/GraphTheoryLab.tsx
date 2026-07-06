'use client'
import { useCallback, useRef, useState } from 'react'
import { Network, Route, Palette, type LucideIcon } from 'lucide-react'

type ExpType = 'builder' | 'shortestpath' | 'coloring'

interface Node { id: number; x: number; y: number }
interface Edge { from: number; to: number; weight?: number }

const VB = 320

function useViewBoxPointer(svgRef: React.RefObject<SVGSVGElement | null>) {
  return useCallback(
    (clientX: number, clientY: number) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      const x = ((clientX - rect.left) / rect.width) * VB
      const y = ((clientY - rect.top) / rect.height) * VB
      return { x: Math.max(16, Math.min(VB - 16, x)), y: Math.max(16, Math.min(VB - 16, y)) }
    },
    [svgRef]
  )
}

// ── Graph Builder & Degree Explorer ───────────────────────────────────────
// Click empty space to add a node. Click one node then another to connect
// them. Degree of each node updates live — ties directly to the Eulerian
// path rule referenced elsewhere in the app (Königsberg Bridges).
function GraphBuilder() {
  const svgRef = useRef<SVGSVGElement>(null)
  const toVB = useViewBoxPointer(svgRef)
  const [nodes, setNodes] = useState<Node[]>([
    { id: 0, x: 90, y: 90 }, { id: 1, x: 230, y: 90 },
    { id: 2, x: 90, y: 230 }, { id: 3, x: 230, y: 230 },
  ])
  const [edges, setEdges] = useState<Edge[]>([{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }])
  const [pendingFrom, setPendingFrom] = useState<number | null>(null)
  const [nextId, setNextId] = useState(4)
  const [draggingNode, setDraggingNode] = useState<number | null>(null)
  const movedRef = useRef(false)

  const degree = (nodeId: number) => edges.filter((e) => e.from === nodeId || e.to === nodeId).length
  const oddDegreeCount = nodes.filter((n) => degree(n.id) % 2 === 1).length

  let eulerStatus: { label: string; color: string } = { label: 'No edges yet', color: 'text-white/30' }
  if (edges.length > 0) {
    if (oddDegreeCount === 0) eulerStatus = { label: 'Eulerian Circuit exists (start = end)', color: 'text-emerald-400' }
    else if (oddDegreeCount === 2) eulerStatus = { label: 'Eulerian Path exists (not a circuit)', color: 'text-amber-400' }
    else eulerStatus = { label: `No Eulerian path (${oddDegreeCount} odd-degree vertices)`, color: 'text-rose-400' }
  }

  const handleBgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (movedRef.current) { movedRef.current = false; return }
    const p = toVB(e.clientX, e.clientY)
    setNodes((prev) => [...prev, { id: nextId, x: p.x, y: p.y }])
    setNextId((n) => n + 1)
    setPendingFrom(null)
  }

  const handleNodeClick = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    if (movedRef.current) { movedRef.current = false; return }
    if (pendingFrom === null) {
      setPendingFrom(id)
    } else if (pendingFrom === id) {
      setPendingFrom(null)
    } else {
      const exists = edges.some((ed) => (ed.from === pendingFrom && ed.to === id) || (ed.from === id && ed.to === pendingFrom))
      if (!exists) setEdges((prev) => [...prev, { from: pendingFrom, to: id }])
      setPendingFrom(null)
    }
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (draggingNode === null) return
    movedRef.current = true
    const p = toVB(clientX, clientY)
    setNodes((prev) => prev.map((n) => (n.id === draggingNode ? { ...n, x: p.x, y: p.y } : n)))
  }

  const reset = () => {
    setNodes([{ id: 0, x: 90, y: 90 }, { id: 1, x: 230, y: 90 }, { id: 2, x: 90, y: 230 }, { id: 3, x: 230, y: 230 }])
    setEdges([{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }])
    setPendingFrom(null)
    setNextId(4)
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Tap empty space to add a node. Tap two nodes in sequence to connect them. A node&apos;s{' '}
        <span className="text-cyan-400">degree</span> is its edge count — this determines whether an{' '}
        <span className="text-amber-400">Eulerian path</span> (a route crossing every edge exactly once) exists,
        the question that founded graph theory in 1736 (the Bridges of Königsberg).
      </p>

      <div
        className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b] touch-none select-none"
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={() => setDraggingNode(null)}
        onMouseLeave={() => setDraggingNode(null)}
        onTouchMove={(e) => { const t = e.touches[0]; handleMove(t.clientX, t.clientY) }}
        onTouchEnd={() => setDraggingNode(null)}
      >
        <svg ref={svgRef} viewBox={`0 0 ${VB} ${VB}`} className="w-full aspect-square" onClick={handleBgClick}>
          <rect width={VB} height={VB} fill="#09090b" />
          {edges.map((ed, i) => {
            const from = nodes.find((n) => n.id === ed.from)!
            const to = nodes.find((n) => n.id === ed.to)!
            return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#a78bfa" strokeWidth="2" />
          })}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle
                cx={n.x} cy={n.y} r={pendingFrom === n.id ? 16 : 14}
                fill={pendingFrom === n.id ? '#f59e0b' : degree(n.id) % 2 === 1 ? '#f43f5e33' : '#22d3ee33'}
                stroke={pendingFrom === n.id ? '#fbbf24' : degree(n.id) % 2 === 1 ? '#f43f5e' : '#22d3ee'}
                strokeWidth="2"
                className="cursor-pointer"
                onMouseDown={() => setDraggingNode(n.id)}
                onTouchStart={() => setDraggingNode(n.id)}
                onClick={(e) => handleNodeClick(n.id, e)}
              />
              <text x={n.x} y={n.y + 4} fontSize="10" fill="#fff" fontFamily="monospace" textAnchor="middle" className="pointer-events-none">
                {degree(n.id)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <button onClick={reset} className="text-xs text-white/40 hover:text-white/70 transition-colors">Reset graph</button>

      <div className={`rounded-lg px-3 py-2.5 text-center text-xs font-medium ${eulerStatus.color} bg-white/[0.02] border border-white/8`}>
        {eulerStatus.label}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Nodes</p>
          <p className="text-lg font-mono text-violet-400">{nodes.length}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Edges</p>
          <p className="text-lg font-mono text-cyan-400">{edges.length}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Odd-degree</p>
          <p className="text-lg font-mono text-amber-400">{oddDegreeCount}</p>
        </div>
      </div>
    </div>
  )
}

// ── Shortest Path (Dijkstra) ──────────────────────────────────────────────
const SP_NODES: Node[] = [
  { id: 0, x: 40, y: 160 }, { id: 1, x: 130, y: 60 }, { id: 2, x: 130, y: 260 },
  { id: 3, x: 220, y: 100 }, { id: 4, x: 220, y: 220 }, { id: 5, x: 290, y: 160 },
]
const SP_EDGES: Edge[] = [
  { from: 0, to: 1, weight: 4 }, { from: 0, to: 2, weight: 2 },
  { from: 1, to: 3, weight: 3 }, { from: 2, to: 1, weight: 1 },
  { from: 2, to: 4, weight: 5 }, { from: 3, to: 5, weight: 2 },
  { from: 4, to: 5, weight: 3 }, { from: 3, to: 4, weight: 1 },
]

function dijkstra(nodes: Node[], edges: Edge[], start: number, end: number) {
  const dist: Record<number, number> = {}
  const prev: Record<number, number | null> = {}
  const visited = new Set<number>()
  nodes.forEach((n) => { dist[n.id] = Infinity; prev[n.id] = null })
  dist[start] = 0

  const adj = (id: number) =>
    edges.filter((e) => e.from === id || e.to === id).map((e) => ({ to: e.from === id ? e.to : e.from, weight: e.weight ?? 1 }))

  while (visited.size < nodes.length) {
    let u = -1, best = Infinity
    for (const n of nodes) {
      if (!visited.has(n.id) && dist[n.id] < best) { best = dist[n.id]; u = n.id }
    }
    if (u === -1) break
    visited.add(u)
    if (u === end) break
    for (const { to, weight } of adj(u)) {
      const alt = dist[u] + weight
      if (alt < dist[to]) { dist[to] = alt; prev[to] = u }
    }
  }

  const path: number[] = []
  let cur: number | null = end
  while (cur !== null) { path.unshift(cur); cur = prev[cur] }
  if (path[0] !== start) return { path: [], distance: Infinity }
  return { path, distance: dist[end] }
}

function ShortestPathExplorer() {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(5)

  const result = dijkstra(SP_NODES, SP_EDGES, start, end)
  const pathEdgeSet = new Set(result.path.slice(0, -1).map((n, i) => `${n}-${result.path[i + 1]}`))
  const isPathEdge = (e: Edge) => pathEdgeSet.has(`${e.from}-${e.to}`) || pathEdgeSet.has(`${e.to}-${e.from}`)

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Tap a node to set the start, then another for the destination. Dijkstra&apos;s algorithm finds the
        shortest-weight path — the highlighted route isn&apos;t always the one with the fewest hops.
      </p>

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg viewBox={`0 0 ${VB} ${VB}`} className="w-full aspect-square">
          <rect width={VB} height={VB} fill="#09090b" />
          {SP_EDGES.map((ed, i) => {
            const from = SP_NODES.find((n) => n.id === ed.from)!
            const to = SP_NODES.find((n) => n.id === ed.to)!
            const onPath = isPathEdge(ed)
            const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2
            return (
              <g key={i}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={onPath ? '#fbbf24' : 'rgba(167,139,250,0.35)'} strokeWidth={onPath ? 3.5 : 2} />
                <circle cx={mx} cy={my} r="9" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <text x={mx} y={my + 3} fontSize="9" fill={onPath ? '#fbbf24' : 'rgba(255,255,255,0.4)'} fontFamily="monospace" textAnchor="middle">{ed.weight}</text>
              </g>
            )
          })}
          {SP_NODES.map((n) => (
            <g key={n.id} onClick={() => { if (n.id === start) return; if (n.id !== end) setEnd(n.id) }}>
              <circle
                cx={n.x} cy={n.y} r="15"
                fill={n.id === start ? '#22d3ee' : n.id === end ? '#f59e0b' : result.path.includes(n.id) ? '#fbbf2433' : '#7c3aed33'}
                stroke={n.id === start ? '#22d3ee' : n.id === end ? '#fbbf24' : '#a78bfa'}
                strokeWidth="2"
                className="cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setStart(n.id) }}
              />
              <text x={n.x} y={n.y + 4} fontSize="11" fill="#fff" fontFamily="monospace" textAnchor="middle" className="pointer-events-none">{n.id}</text>
            </g>
          ))}
        </svg>
      </div>

      <p className="text-[11px] text-white/30 text-center">
        <span className="text-cyan-400">Click a node</span> to set start · <span className="text-amber-400">click again</span> to set destination
      </p>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        {result.path.length > 0 ? (
          <>
            <p className="text-xs text-white/40 mb-2">Shortest path from {start} to {end}</p>
            <p className="text-lg font-mono text-amber-400 mb-1">{result.path.join(' → ')}</p>
            <p className="text-sm text-white/50">Total distance: <span className="text-cyan-400 font-mono">{result.distance}</span></p>
          </>
        ) : (
          <p className="text-sm text-rose-400">No path exists between these nodes.</p>
        )}
      </div>
    </div>
  )
}

// ── Graph Coloring ─────────────────────────────────────────────────────────
const COLOR_PALETTE = ['#22d3ee', '#f43f5e', '#fbbf24', '#34d399', '#a78bfa']

function GraphColoring() {
  const [nodes] = useState<Node[]>([
    { id: 0, x: 160, y: 50 }, { id: 1, x: 70, y: 120 }, { id: 2, x: 250, y: 120 },
    { id: 3, x: 70, y: 230 }, { id: 4, x: 250, y: 230 }, { id: 5, x: 160, y: 280 },
  ])
  const [edges] = useState<Edge[]>([
    { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 2 },
    { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 3, to: 4 },
    { from: 3, to: 5 }, { from: 4, to: 5 },
  ])
  const [colors, setColors] = useState<Record<number, number>>({})

  const conflicts = edges.filter((e) => colors[e.from] !== undefined && colors[e.from] === colors[e.to])
  const conflictNodeIds = new Set(conflicts.flatMap((e) => [e.from, e.to]))
  const usedColors = new Set(Object.values(colors)).size
  const allColored = nodes.every((n) => colors[n.id] !== undefined)

  const cycleColor = (id: number) => {
    setColors((prev) => {
      const current = prev[id]
      const next = current === undefined ? 0 : (current + 1) % (COLOR_PALETTE.length + 1)
      if (next === COLOR_PALETTE.length) { const { [id]: _, ...rest } = prev; return rest }
      return { ...prev, [id]: next }
    })
  }

  const reset = () => setColors({})

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Tap a node to cycle through colors. No two <span className="text-white/60">connected</span> nodes may
        share a color — try to color the whole graph using as{' '}
        <span className="text-emerald-400">few colors as possible</span>.
      </p>

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg viewBox={`0 0 ${VB} ${VB}`} className="w-full aspect-square">
          <rect width={VB} height={VB} fill="#09090b" />
          {edges.map((ed, i) => {
            const from = nodes.find((n) => n.id === ed.from)!
            const to = nodes.find((n) => n.id === ed.to)!
            const isConflict = colors[ed.from] !== undefined && colors[ed.from] === colors[ed.to]
            return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={isConflict ? '#f43f5e' : 'rgba(255,255,255,0.15)'} strokeWidth={isConflict ? 3 : 1.5} />
          })}
          {nodes.map((n) => {
            const colorIdx = colors[n.id]
            const fill = colorIdx !== undefined ? COLOR_PALETTE[colorIdx] : '#3f3f46'
            return (
              <circle
                key={n.id}
                cx={n.x} cy={n.y} r={conflictNodeIds.has(n.id) ? 17 : 15}
                fill={fill} fillOpacity={colorIdx !== undefined ? 0.85 : 0.3}
                stroke={conflictNodeIds.has(n.id) ? '#f43f5e' : 'rgba(255,255,255,0.25)'}
                strokeWidth={conflictNodeIds.has(n.id) ? 2.5 : 1.5}
                className="cursor-pointer"
                onClick={() => cycleColor(n.id)}
              />
            )
          })}
        </svg>
      </div>

      <button onClick={reset} className="text-xs text-white/40 hover:text-white/70 transition-colors">Reset colors</button>

      {conflicts.length > 0 ? (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2 text-center">
          {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''} — two connected nodes share the same color.
        </p>
      ) : allColored ? (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-center">
          Valid coloring using {usedColors} color{usedColors > 1 ? 's' : ''}! This graph&apos;s chromatic number is 3 — try beating it.
        </p>
      ) : (
        <p className="text-xs text-white/30 text-center">Tap nodes to start coloring.</p>
      )}

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Colors Used</p>
          <p className="text-lg font-mono text-cyan-400">{usedColors || '—'}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Conflicts</p>
          <p className="text-lg font-mono text-rose-400">{conflicts.length}</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Lab Component ────────────────────────────────────────────────────
export function GraphTheoryLab() {
  const [exp, setExp] = useState<ExpType>('builder')

  const EXPS: { id: ExpType; label: string; icon: LucideIcon }[] = [
    { id: 'builder', label: 'Graph Builder', icon: Network },
    { id: 'shortestpath', label: 'Shortest Path', icon: Route },
    { id: 'coloring', label: 'Graph Coloring', icon: Palette },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {EXPS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setExp(id)}
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all ${
              exp === id
                ? 'bg-lime-500/15 border-lime-500/40 text-lime-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {exp === 'builder' && <GraphBuilder />}
      {exp === 'shortestpath' && <ShortestPathExplorer />}
      {exp === 'coloring' && <GraphColoring />}
    </div>
  )
}
