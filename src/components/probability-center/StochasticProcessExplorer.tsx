'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

interface Preset { label: string; states: string[]; matrix: number[][] }

const PRESETS: Preset[] = [
  { label: 'Weather (2-state)', states: ['Sunny', 'Rainy'], matrix: [[0.9, 0.1], [0.5, 0.5]] },
  {
    label: 'Board game (3-state)',
    states: ['Start', 'Middle', 'End'],
    matrix: [[0.2, 0.7, 0.1], [0.1, 0.3, 0.6], [0.05, 0.05, 0.9]],
  },
]

function fmt(n: number, d = 3): string {
  if (!Number.isFinite(n)) return '—'
  const r = Math.round(n * 10 ** d) / 10 ** d
  return Number.isInteger(r) ? String(r) : r.toString()
}

function normalizeRow(row: number[]): number[] {
  const sum = row.reduce((s, v) => s + Math.max(0, v), 0)
  if (sum <= 0) return row.map(() => 1 / row.length)
  return row.map((v) => Math.max(0, v) / sum)
}

function stationaryDistribution(matrix: number[][], iterations = 500): number[] {
  const nStates = matrix.length
  let v = Array(nStates).fill(1 / nStates)
  for (let iter = 0; iter < iterations; iter++) {
    const nv = Array(nStates).fill(0)
    for (let j = 0; j < nStates; j++) {
      for (let k = 0; k < nStates; k++) nv[j] += v[k] * matrix[k][j]
    }
    v = nv
  }
  return v
}

const STATE_COLORS = ['#818cf8', '#22d3ee', '#f472b6', '#facc15']

export function StochasticProcessExplorer() {
  const [states, setStates] = useState<string[]>(PRESETS[0].states)
  const [matrix, setMatrix] = useState<number[][]>(PRESETS[0].matrix)
  const [current, setCurrent] = useState(0)
  const [visitCounts, setVisitCounts] = useState<number[]>(() => PRESETS[0].states.map((_, i) => (i === 0 ? 1 : 0)))
  const [stepCount, setStepCount] = useState(1)
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState<number[]>([0])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const nStates = states.length

  const stationary = useMemo(() => stationaryDistribution(matrix), [matrix])

  const step = () => {
    setCurrent((prevState) => {
      const row = normalizeRow(matrix[prevState])
      const r = Math.random()
      let acc = 0
      let next = row.length - 1
      for (let i = 0; i < row.length; i++) {
        acc += row[i]
        if (r <= acc) { next = i; break }
      }
      setVisitCounts((vc) => vc.map((c, i) => (i === next ? c + 1 : c)))
      setStepCount((s) => s + 1)
      setHistory((h) => [...h.slice(-40), next])
      return next
    })
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(step, 450)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, matrix])

  const reset = () => {
    setRunning(false)
    setCurrent(0)
    setVisitCounts(states.map((_, i) => (i === 0 ? 1 : 0)))
    setStepCount(1)
    setHistory([0])
  }

  const loadPreset = (p: Preset) => {
    setStates(p.states)
    setMatrix(p.matrix)
    setRunning(false)
    setCurrent(0)
    setVisitCounts(p.states.map((_, i) => (i === 0 ? 1 : 0)))
    setStepCount(1)
    setHistory([0])
  }

  const updateCell = (r: number, c: number, val: string) => {
    const n = parseFloat(val)
    setMatrix((prev) => {
      const next = prev.map((row) => [...row])
      next[r][c] = Number.isFinite(n) ? Math.max(0, n) : 0
      return next
    })
  }

  // Circular layout for state nodes
  const R = 90
  const CX = 130, CY = 130
  const positions = states.map((_, i) => {
    const angle = (i / nStates) * 2 * Math.PI - Math.PI / 2
    return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) }
  })

  const empiricalFreq = visitCounts.map((c) => c / stepCount)

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        A Markov chain moves between states, where the next state depends only on the current one — not on
        history. Run the walk and watch the visited-state frequency converge toward the theoretical stationary
        distribution.
      </p>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => loadPreset(p)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* State diagram */}
        <div className="rounded-xl border border-white/8 bg-[#09090b] p-3 flex justify-center">
          <svg width={260} height={260} viewBox="0 0 260 260">
            <defs>
              <marker id="sp-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill="rgba(255,255,255,0.35)" />
              </marker>
            </defs>
            {states.map((_, i) =>
              states.map((_, j) => {
                if (matrix[i][j] <= 0.001) return null
                const p1 = positions[i], p2 = positions[j]
                if (i === j) {
                  // self-loop: small circle above node
                  return (
                    <circle key={`${i}-${j}`} cx={p1.x} cy={p1.y - 26} r={14} fill="none"
                      stroke="rgba(255,255,255,0.2)" strokeWidth={1.2} strokeDasharray="3,2" />
                  )
                }
                const dx = p2.x - p1.x, dy = p2.y - p1.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                const nx = dx / dist, ny = dy / dist
                const startX = p1.x + nx * 20, startY = p1.y + ny * 20
                const endX = p2.x - nx * 22, endY = p2.y - ny * 22
                return (
                  <line key={`${i}-${j}`} x1={startX} y1={startY} x2={endX} y2={endY}
                    stroke={`rgba(255,255,255,${0.15 + matrix[i][j] * 0.4})`} strokeWidth={1 + matrix[i][j] * 2}
                    markerEnd="url(#sp-arrow)" />
                )
              })
            )}
            {positions.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={20} fill={current === i ? STATE_COLORS[i % 4] : '#18181b'}
                  stroke={STATE_COLORS[i % 4]} strokeWidth={2} className="transition-all duration-300" />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fontFamily="monospace"
                  fill={current === i ? '#000' : STATE_COLORS[i % 4]}>{states[i].slice(0, 3)}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Transition matrix editor */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-3">Transition matrix (rows sum to 1)</p>
          <div className="overflow-x-auto">
            <table className="border-collapse">
              <tbody>
                {matrix.map((row, r) => (
                  <tr key={r}>
                    {row.map((val, c) => (
                      <td key={c} className="p-1">
                        <input
                          type="number" step="0.05" min="0" max="1" value={val}
                          onChange={(e) => updateCell(r, c, e.target.value)}
                          className="w-14 bg-black/30 border border-white/10 rounded px-1 py-1 text-[11px] text-white/80 font-mono text-center"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-white/25 mt-2">Rows auto-normalize during simulation even if they don&apos;t sum to exactly 1.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-sm font-semibold text-white transition-all"
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pause' : 'Run'}
        </button>
        <button onClick={step} disabled={running} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:text-white disabled:opacity-30 transition-all">
          Step
        </button>
        <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-all">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Empirical vs stationary comparison */}
      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4 space-y-2.5">
        <div className="flex justify-between text-[10px] text-white/30 mb-1">
          <span>State</span>
          <span>Visited (n={stepCount})</span>
          <span>Stationary π</span>
        </div>
        {states.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-16 text-[11px] font-mono truncate" style={{ color: STATE_COLORS[i % 4] }}>{s}</span>
            <div className="flex-1 h-2 rounded-full bg-black/30 overflow-hidden relative">
              <div className="h-full rounded-full absolute left-0 top-0" style={{ width: `${empiricalFreq[i] * 100}%`, background: STATE_COLORS[i % 4], opacity: 0.85 }} />
              <div className="h-full w-[2px] bg-white/60 absolute top-0" style={{ left: `${stationary[i] * 100}%` }} />
            </div>
            <span className="text-[11px] font-mono text-white/50 w-12 text-right">{fmt(empiricalFreq[i], 3)}</span>
            <span className="text-[11px] font-mono text-white/30 w-12 text-right">{fmt(stationary[i], 3)}</span>
          </div>
        ))}
        <p className="text-[10px] text-white/25 pt-1">White tick = theoretical stationary probability π. Colored bar = your simulation&apos;s running frequency.</p>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
        <LatexRenderer latex={`\\pi P = \\pi, \\quad \\pi = (${stationary.map((v) => fmt(v, 3)).join(', ')})`} display />
      </div>
    </div>
  )
}
