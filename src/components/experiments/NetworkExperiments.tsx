'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Shuffle, Waypoints, Zap, type LucideIcon } from 'lucide-react'

type ExpType = 'randomgraph' | 'smallworld' | 'cascade'

interface Node { id: number; x: number; y: number }
interface Edge { from: number; to: number }

// ── Random Graph Growth (Erdős–Rényi) ─────────────────────────────────────
function RandomGraphGrowth() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 400, h: 400 })
  const [n, setN] = useState(20)
  const [p, setP] = useState(0.1)
  const [seed, setSeed] = useState(1)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(280, Math.min(420, w)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const { nodes, edges } = useMemo(() => {
    // simple seeded PRNG so "regenerate" is reproducible per seed
    let s = seed * 9301 + 49297
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }

    const nds: Node[] = Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * Math.PI * 2
      return { id: i, x: 160 + 130 * Math.cos(angle), y: 160 + 130 * Math.sin(angle) }
    })
    const eds: Edge[] = []
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (rand() < p) eds.push({ from: i, to: j })
      }
    }
    return { nodes: nds, edges: eds }
  }, [n, p, seed])

  const avgDegree = (2 * edges.length) / n
  // connectivity threshold: Erdős–Rényi graphs tend to become connected around p ~ ln(n)/n
  const threshold = Math.log(n) / n

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const scale = Math.min(W, H) / 320

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `scale(${scale})`)
    g.append('rect').attr('width', 320).attr('height', 320).attr('fill', '#09090b')

    edges.forEach((e) => {
      const from = nodes[e.from], to = nodes[e.to]
      g.append('line').attr('x1', from.x).attr('y1', from.y).attr('x2', to.x).attr('y2', to.y).attr('stroke', 'rgba(34,211,238,0.3)').attr('stroke-width', 1)
    })
    nodes.forEach((nd) => {
      g.append('circle').attr('cx', nd.x).attr('cy', nd.y).attr('r', 5).attr('fill', '#22d3ee')
    })
  }, [dims, nodes, edges])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Each possible pair of nodes gets an edge independently with probability p. As p crosses a critical
        threshold, the graph suddenly transitions from many disconnected pieces to one connected whole.
      </p>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b] aspect-square">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Nodes (n)</span><span className="text-white/70 font-mono">{n}</span></div>
          <input type="range" min={8} max={40} step={2} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Edge probability (p)</span><span className="text-white/70 font-mono">{p.toFixed(2)}</span></div>
          <input type="range" min={0.01} max={0.4} step={0.01} value={p} onChange={(e) => setP(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
      </div>

      <button onClick={() => setSeed((s) => s + 1)} className="text-xs text-white/40 hover:text-white/70 transition-colors">Regenerate (new random graph)</button>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Avg Degree</p>
          <p className="text-lg font-mono text-cyan-400">{avgDegree.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Connectivity Threshold p*</p>
          <p className="text-lg font-mono text-amber-400">{threshold.toFixed(3)}</p>
        </div>
      </div>
    </div>
  )
}

// ── Small-World Networks (Watts-Strogatz) ─────────────────────────────────
function SmallWorldNetworks() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 400, h: 400 })
  const n = 20
  const k = 4 // each node connects to k nearest neighbors initially
  const [rewireProb, setRewireProb] = useState(0)
  const [seed, setSeed] = useState(1)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(280, Math.min(420, w)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const { nodes, edges, avgPathLength, clustering } = useMemo(() => {
    let s = seed * 7919 + 104729
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }

    const nds: Node[] = Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * Math.PI * 2
      return { id: i, x: 160 + 130 * Math.cos(angle), y: 160 + 130 * Math.sin(angle) }
    })

    // start as ring lattice: each node connects to k/2 neighbors on each side
    const edgeSet = new Set<string>()
    const eds: Edge[] = []
    for (let i = 0; i < n; i++) {
      for (let j = 1; j <= k / 2; j++) {
        const to = (i + j) % n
        const key = [i, to].sort().join('-')
        if (!edgeSet.has(key)) { edgeSet.add(key); eds.push({ from: i, to }) }
      }
    }
    // rewire each edge with probability rewireProb
    const rewired = eds.map((e) => {
      if (rand() < rewireProb) {
        let newTo = Math.floor(rand() * n)
        let attempts = 0
        while ((newTo === e.from || edgeSet.has([e.from, newTo].sort().join('-'))) && attempts < 10) {
          newTo = Math.floor(rand() * n)
          attempts++
        }
        return { from: e.from, to: newTo }
      }
      return e
    })

    // Rough clustering coefficient estimate: fraction of connected neighbor-pairs
    const adj: Record<number, Set<number>> = {}
    nds.forEach((nd) => (adj[nd.id] = new Set()))
    rewired.forEach((e) => { adj[e.from].add(e.to); adj[e.to].add(e.from) })
    let triangleSum = 0, tripletSum = 0
    nds.forEach((nd) => {
      const neighbors = [...adj[nd.id]]
      for (let i = 0; i < neighbors.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          tripletSum++
          if (adj[neighbors[i]].has(neighbors[j])) triangleSum++
        }
      }
    })
    const clusteringCoef = tripletSum > 0 ? triangleSum / tripletSum : 0

    // Rough average path length via BFS from a few sample nodes
    const bfsAvg = (() => {
      let totalDist = 0, pairs = 0
      const sampleNodes = [0, Math.floor(n / 3), Math.floor((2 * n) / 3)]
      sampleNodes.forEach((start) => {
        const dist: Record<number, number> = { [start]: 0 }
        const queue = [start]
        while (queue.length) {
          const cur = queue.shift()!
          adj[cur].forEach((nb) => {
            if (!(nb in dist)) { dist[nb] = dist[cur] + 1; queue.push(nb) }
          })
        }
        Object.values(dist).forEach((d) => { totalDist += d; pairs++ })
      })
      return pairs > 0 ? totalDist / pairs : 0
    })()

    return { nodes: nds, edges: rewired, avgPathLength: bfsAvg, clustering: clusteringCoef }
  }, [rewireProb, seed])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const scale = Math.min(W, H) / 320

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `scale(${scale})`)
    g.append('rect').attr('width', 320).attr('height', 320).attr('fill', '#09090b')

    edges.forEach((e) => {
      const from = nodes[e.from], to = nodes[e.to]
      g.append('line').attr('x1', from.x).attr('y1', from.y).attr('x2', to.x).attr('y2', to.y).attr('stroke', 'rgba(167,139,250,0.4)').attr('stroke-width', 1)
    })
    nodes.forEach((nd) => {
      g.append('circle').attr('cx', nd.x).attr('cy', nd.y).attr('r', 5).attr('fill', '#a78bfa')
    })
  }, [dims, nodes, edges])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Start with a ring where each node only connects to its neighbors, then randomly{' '}
        <span className="text-violet-400">rewire</span> a few edges. Even a small amount of rewiring
        dramatically shrinks the average path length while keeping most of the local clustering — the
        &ldquo;small-world&rdquo; effect behind &ldquo;six degrees of separation.&rdquo;
      </p>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b] aspect-square">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
        <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Rewiring probability</span><span className="text-white/70 font-mono">{rewireProb.toFixed(2)}</span></div>
        <input type="range" min={0} max={1} step={0.05} value={rewireProb} onChange={(e) => setRewireProb(Number(e.target.value))} className="w-full accent-violet-500" />
      </div>

      <button onClick={() => setSeed((s) => s + 1)} className="text-xs text-white/40 hover:text-white/70 transition-colors">Regenerate</button>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Avg Path Length</p>
          <p className="text-lg font-mono text-cyan-400">{avgPathLength.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Clustering Coefficient</p>
          <p className="text-lg font-mono text-emerald-400">{clustering.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

// ── Cascading Failure ──────────────────────────────────────────────────────
function CascadingFailure() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 400, h: 400 })
  const n = 24
  const [failed, setFailed] = useState<Set<number>>(new Set())
  const [capacity, setCapacity] = useState(1.5) // how much extra load a node tolerates before failing
  const [running, setRunning] = useState(false)

  const { nodes, edges } = useMemo(() => {
    const nds: Node[] = Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * Math.PI * 2
      const r = 100 + (i % 3) * 15
      return { id: i, x: 160 + r * Math.cos(angle), y: 160 + r * Math.sin(angle) }
    })
    const eds: Edge[] = []
    for (let i = 0; i < n; i++) {
      eds.push({ from: i, to: (i + 1) % n })
      if (i % 3 === 0) eds.push({ from: i, to: (i + 5) % n })
    }
    return { nodes: nds, edges: eds }
  }, [])

  const adj = useMemo(() => {
    const a: Record<number, number[]> = {}
    nodes.forEach((nd) => (a[nd.id] = []))
    edges.forEach((e) => { a[e.from].push(e.to); a[e.to].push(e.from) })
    return a
  }, [nodes, edges])

  const triggerFailure = (startId: number) => {
    setFailed(new Set([startId]))
    setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => {
      setFailed((prev) => {
        const next = new Set(prev)
        let changed = false
        nodes.forEach((nd) => {
          if (next.has(nd.id)) return
          const neighbors = adj[nd.id]
          const failedNeighbors = neighbors.filter((nb) => next.has(nb)).length
          const loadFraction = neighbors.length > 0 ? failedNeighbors / neighbors.length : 0
          // node fails if the fraction of failed neighbors exceeds what its capacity can absorb
          if (loadFraction > 1 / capacity && neighbors.length > 0) {
            next.add(nd.id)
            changed = true
          }
        })
        if (!changed) setRunning(false)
        return next
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [running, failed, adj, capacity, nodes])

  const reset = () => { setFailed(new Set()); setRunning(false) }

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const scale = Math.min(W, H) / 320

    const g = svg.attr('width', W).attr('height', H).append('g').attr('transform', `scale(${scale})`)
    g.append('rect').attr('width', 320).attr('height', 320).attr('fill', '#09090b')

    edges.forEach((e) => {
      const from = nodes[e.from], to = nodes[e.to]
      const bothOk = !failed.has(e.from) && !failed.has(e.to)
      g.append('line').attr('x1', from.x).attr('y1', from.y).attr('x2', to.x).attr('y2', to.y)
        .attr('stroke', bothOk ? 'rgba(52,211,153,0.35)' : 'rgba(244,63,94,0.2)').attr('stroke-width', 1)
    })
    nodes.forEach((nd) => {
      const isFailed = failed.has(nd.id)
      g.append('circle')
        .attr('cx', nd.x).attr('cy', nd.y).attr('r', 6)
        .attr('fill', isFailed ? '#f43f5e' : '#34d399')
        .attr('class', 'cursor-pointer')
        .on('click', () => { if (!running) triggerFailure(nd.id) })
    })
  }, [dims, nodes, edges, failed, running])

  const failedCount = failed.size

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Tap a node to make it fail. If a node&apos;s failed neighbors exceed what its{' '}
        <span className="text-amber-400">capacity</span> can absorb, it fails too — a small local failure can
        cascade into a network-wide collapse, the same mechanism behind power-grid blackouts.
      </p>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b] aspect-square">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
        <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Node capacity (higher = more robust)</span><span className="text-white/70 font-mono">{capacity.toFixed(1)}</span></div>
        <input type="range" min={1.1} max={4} step={0.1} value={capacity} onChange={(e) => { setCapacity(Number(e.target.value)); reset() }} className="w-full accent-amber-500" />
      </div>

      <button onClick={reset} className="text-xs text-white/40 hover:text-white/70 transition-colors">Reset (all nodes healthy)</button>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Failed Nodes</p>
          <p className="text-lg font-mono text-rose-400">{failedCount} / {n}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Network Health</p>
          <p className="text-lg font-mono text-emerald-400">{Math.round(((n - failedCount) / n) * 100)}%</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Experiment Component ─────────────────────────────────────────────
export function NetworkExperiments() {
  const [exp, setExp] = useState<ExpType>('randomgraph')

  const EXPS: { id: ExpType; label: string; icon: LucideIcon }[] = [
    { id: 'randomgraph', label: 'Random Graph Growth', icon: Shuffle },
    { id: 'smallworld', label: 'Small-World Networks', icon: Waypoints },
    { id: 'cascade', label: 'Cascading Failure', icon: Zap },
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
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {exp === 'randomgraph' && <RandomGraphGrowth />}
      {exp === 'smallworld' && <SmallWorldNetworks />}
      {exp === 'cascade' && <CascadingFailure />}
    </div>
  )
}
