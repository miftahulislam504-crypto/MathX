'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw, Play } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

interface Point { x: number; y: number }

const VB = 320
const CENTROID_COLORS = ['#f472b6', '#22d3ee', '#fbbf24', '#a78bfa']

function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function seedPoints(): Point[] {
  const pts: Point[] = []
  const clusters = [{ cx: 80, cy: 90 }, { cx: 230, cy: 100 }, { cx: 150, cy: 240 }]
  clusters.forEach((c) => {
    for (let i = 0; i < 12; i++) {
      pts.push({ x: c.cx + (Math.random() - 0.5) * 60, y: c.cy + (Math.random() - 0.5) * 60 })
    }
  })
  return pts
}

export function DataScienceMathematics() {
  const [points, setPoints] = useState<Point[]>(() => seedPoints())
  const [k, setK] = useState(3)
  const [centroids, setCentroids] = useState<Point[]>([])
  const [assignments, setAssignments] = useState<number[]>([])
  const [iteration, setIteration] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const initCentroids = (nK: number, pts: Point[]) => {
    const shuffled = [...pts].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, nK).map((p) => ({ x: p.x, y: p.y }))
  }

  useEffect(() => {
    setCentroids(initCentroids(k, points))
    setAssignments(points.map(() => -1))
    setIteration(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k])

  const step = () => {
    setCentroids((prevCentroids) => {
      const newAssignments = points.map((p) => {
        let best = 0, bestDist = Infinity
        prevCentroids.forEach((c, i) => { const d = dist(p, c); if (d < bestDist) { bestDist = d; best = i } })
        return best
      })
      setAssignments(newAssignments)

      const newCentroids = prevCentroids.map((c, i) => {
        const cluster = points.filter((_, pi) => newAssignments[pi] === i)
        if (cluster.length === 0) return c
        return {
          x: cluster.reduce((s, p) => s + p.x, 0) / cluster.length,
          y: cluster.reduce((s, p) => s + p.y, 0) / cluster.length,
        }
      })
      return newCentroids
    })
    setIteration((i) => i + 1)
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(step, 700)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, points])

  const reset = () => {
    setRunning(false)
    setCentroids(initCentroids(k, points))
    setAssignments(points.map(() => -1))
    setIteration(0)
  }

  const regenerate = () => {
    const newPts = seedPoints()
    setPoints(newPts)
    setRunning(false)
    setCentroids(initCentroids(k, newPts))
    setAssignments(newPts.map(() => -1))
    setIteration(0)
  }

  const addPointAt = (clientX: number, clientY: number, svgEl: SVGSVGElement) => {
    const rect = svgEl.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * VB
    const y = ((clientY - rect.top) / rect.height) * VB
    setPoints((prev) => [...prev, { x, y }])
    setAssignments((prev) => [...prev, -1])
  }

  // total within-cluster variance — the objective k-means minimizes
  const inertia = useMemo(() => {
    if (assignments.every((a) => a === -1)) return null
    return points.reduce((sum, p, i) => {
      const c = centroids[assignments[i]]
      return c ? sum + dist(p, c) ** 2 : sum
    }, 0)
  }, [points, centroids, assignments])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        K-means groups data into k clusters by repeating two steps: assign each point to its nearest centroid,
        then move each centroid to the average of its assigned points. Click the canvas to add your own data
        points, then run the algorithm and watch it converge.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-white/30 mr-1">k =</span>
        {[2, 3, 4].map((n) => (
          <button
            key={n}
            onClick={() => setK(n)}
            className={`w-8 h-8 rounded-lg border text-xs font-mono transition-all ${k === n ? 'bg-teal-500/15 border-teal-500/40 text-teal-300' : 'border-white/8 text-white/40'}`}
          >
            {n}
          </button>
        ))}
        <button onClick={regenerate} className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/8 text-white/40 hover:text-white/70 transition-all">
          New random data
        </button>
      </div>

      <div
        className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b] cursor-crosshair"
        onClick={(e) => addPointAt(e.clientX, e.clientY, e.currentTarget.querySelector('svg') as SVGSVGElement)}
      >
        <svg viewBox={`0 0 ${VB} ${VB}`} className="w-full aspect-square">
          <rect width={VB} height={VB} fill="#09090b" />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y} r={4}
              fill={assignments[i] >= 0 ? CENTROID_COLORS[assignments[i] % CENTROID_COLORS.length] : '#52525b'}
              opacity={0.75}
            />
          ))}
          {centroids.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r={9} fill="none" stroke={CENTROID_COLORS[i % CENTROID_COLORS.length]} strokeWidth={2.5} />
              <line x1={c.x - 6} y1={c.y} x2={c.x + 6} y2={c.y} stroke={CENTROID_COLORS[i % CENTROID_COLORS.length]} strokeWidth={2} />
              <line x1={c.x} y1={c.y - 6} x2={c.x} y2={c.y + 6} stroke={CENTROID_COLORS[i % CENTROID_COLORS.length]} strokeWidth={2} />
            </g>
          ))}
        </svg>
      </div>
      <p className="text-[11px] text-white/25 text-center">Click anywhere on the canvas to add a data point</p>

      <div className="flex gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-500 py-2.5 text-sm font-semibold text-white transition-all"
        >
          <Play className="w-4 h-4" /> {running ? 'Running…' : 'Run K-Means'}
        </button>
        <button onClick={step} disabled={running} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:text-white disabled:opacity-30 transition-all">
          Step
        </button>
        <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-all">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Iteration</p>
          <p className="text-lg font-mono text-teal-300">{iteration}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Inertia (WCSS)</p>
          <p className="text-lg font-mono text-white/70">{inertia !== null ? inertia.toFixed(0) : '—'}</p>
        </div>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
        <LatexRenderer latex={`J = \\sum_{i=1}^{k} \\sum_{x \\in C_i} \\|x - \\mu_i\\|^2`} display />
        <p className="text-[10px] text-white/25 text-center mt-2">
          K-means minimizes J — the total squared distance from each point to its cluster&apos;s centroid.
        </p>
      </div>
    </div>
  )
}
