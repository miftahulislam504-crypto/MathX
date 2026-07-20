'use client'
import { useMemo, useState } from 'react'
import { Plus, Trash2, Dices } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

interface Outcome { id: string; x: number; weight: number }

function fmt(n: number, d = 4): string {
  if (!Number.isFinite(n)) return '—'
  const r = Math.round(n * 10 ** d) / 10 ** d
  return Number.isInteger(r) ? String(r) : r.toString()
}

let idCounter = 0
function makeId() {
  idCounter += 1
  return `o${idCounter}`
}

const PRESET_DIE: Outcome[] = [1, 2, 3, 4, 5, 6].map((x) => ({ id: makeId(), x, weight: 1 }))
const PRESET_SKEWED: Outcome[] = [
  { id: makeId(), x: 0, weight: 5 },
  { id: makeId(), x: 1, weight: 3 },
  { id: makeId(), x: 5, weight: 1.5 },
  { id: makeId(), x: 10, weight: 0.5 },
]

export function RandomVariablesExplorer() {
  const [outcomes, setOutcomes] = useState<Outcome[]>(PRESET_DIE)

  const totalWeight = outcomes.reduce((s, o) => s + Math.max(0, o.weight), 0)

  const stats = useMemo(() => {
    if (totalWeight <= 0 || outcomes.length === 0) return { mean: NaN, variance: NaN, std: NaN, probs: [] as { x: number; p: number }[] }
    const probs = outcomes
      .map((o) => ({ x: o.x, p: Math.max(0, o.weight) / totalWeight }))
      .sort((a, b) => a.x - b.x)
    const mean = probs.reduce((s, o) => s + o.x * o.p, 0)
    const variance = probs.reduce((s, o) => s + o.p * (o.x - mean) ** 2, 0)
    return { mean, variance, std: Math.sqrt(variance), probs }
  }, [outcomes, totalWeight])

  const updateOutcome = (id: string, field: 'x' | 'weight', val: string) => {
    const n = parseFloat(val)
    setOutcomes((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: Number.isFinite(n) ? n : 0 } : o)))
  }
  const addOutcome = () => setOutcomes((prev) => [...prev, { id: makeId(), x: prev.length, weight: 1 }])
  const removeOutcome = (id: string) => setOutcomes((prev) => (prev.length > 2 ? prev.filter((o) => o.id !== id) : prev))

  const maxP = stats.probs.length ? Math.max(...stats.probs.map((o) => o.p)) : 1
  const CHART_H = 180
  const barWidth = stats.probs.length ? Math.min(64, 400 / stats.probs.length) : 40

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Define a discrete random variable by its possible outcomes and relative weights. The probability mass
        function (PMF) normalizes weights to sum to 1 — expected value E[X] and variance are computed live.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setOutcomes(PRESET_DIE.map((o) => ({ ...o, id: makeId() })))}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
        >
          <Dices className="w-3.5 h-3.5" /> Fair die
        </button>
        <button
          onClick={() => setOutcomes(PRESET_SKEWED.map((o) => ({ ...o, id: makeId() })))}
          className="text-xs px-3 py-1.5 rounded-full border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
        >
          Skewed payout
        </button>
      </div>

      {/* PMF bar chart */}
      <div className="rounded-xl border border-white/8 bg-[#09090b] p-4 overflow-x-auto">
        <div className="flex items-end gap-3 justify-center" style={{ height: CHART_H + 30, minWidth: stats.probs.length * (barWidth + 12) }}>
          {stats.probs.map((o, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5" style={{ width: barWidth }}>
              <span className="text-[10px] font-mono text-teal-300">{fmt(o.p, 3)}</span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-teal-600 to-teal-400"
                style={{ height: Math.max(2, (o.p / (maxP || 1)) * CHART_H) }}
              />
              <span className="text-[10px] font-mono text-white/40">x={fmt(o.x, 2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Outcome editor */}
      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-wider text-white/30">Outcomes &amp; weights</p>
          <button onClick={addOutcome} className="flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add outcome
          </button>
        </div>
        {outcomes.map((o) => (
          <div key={o.id} className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5">
              <span className="text-[10px] text-white/30 shrink-0">x =</span>
              <input
                type="number" step="0.5" value={o.x}
                onChange={(e) => updateOutcome(o.id, 'x', e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 font-mono text-center"
              />
            </div>
            <div className="flex-1 flex items-center gap-1.5">
              <span className="text-[10px] text-white/30 shrink-0">weight =</span>
              <input
                type="number" step="0.1" min="0" value={o.weight}
                onChange={(e) => updateOutcome(o.id, 'weight', e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 font-mono text-center"
              />
            </div>
            <button onClick={() => removeOutcome(o.id)} disabled={outcomes.length <= 2} className="text-white/20 hover:text-rose-400 disabled:opacity-20 disabled:pointer-events-none transition-colors shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-teal-400/70 mb-1">E[X]</p>
          <p className="text-lg font-mono text-teal-300">{fmt(stats.mean, 3)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Var(X)</p>
          <p className="text-lg font-mono text-white/70">{fmt(stats.variance, 3)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">σ (std dev)</p>
          <p className="text-lg font-mono text-white/70">{fmt(stats.std, 3)}</p>
        </div>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
        <LatexRenderer
          latex={`E[X] = \\sum_i x_i P(X=x_i) = ${stats.probs.map((o) => `(${fmt(o.x, 2)})(${fmt(o.p, 3)})`).join(' + ')} = ${fmt(stats.mean, 3)}`}
          display
        />
      </div>
    </div>
  )
}
