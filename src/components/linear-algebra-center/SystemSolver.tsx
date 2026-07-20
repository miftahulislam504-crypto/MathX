'use client'
import { useMemo, useState } from 'react'
import { ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type Size = 2 | 3

interface StepRecord {
  matrix: number[][]
  description: string
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—'
  const r = Math.round(n * 1000) / 1000
  return Number.isInteger(r) ? String(r) : r.toFixed(3).replace(/\.?0+$/, '')
}

function cloneMat(m: number[][]): number[][] {
  return m.map((row) => [...row])
}

function rowToLatex(row: number[], size: number): string {
  const coeffs = row.slice(0, size)
  const rhs = row[size]
  const terms = coeffs.map((c, i) => {
    const v = fmt(c)
    const varName = String.fromCharCode(120 + i) // x, y, z
    return `${v}${varName}`
  })
  return `${terms.join(' + ')} = ${fmt(rhs)}`
}

// Perform Gaussian elimination with partial pivoting, recording every step.
function gaussianEliminate(initial: number[][], size: number): StepRecord[] {
  const steps: StepRecord[] = [{ matrix: cloneMat(initial), description: 'Starting augmented matrix.' }]
  const m = cloneMat(initial)

  for (let col = 0; col < size; col++) {
    // partial pivot: find row with largest abs value in this column, at or below `col`
    let pivotRow = col
    for (let r = col + 1; r < size; r++) {
      if (Math.abs(m[r][col]) > Math.abs(m[pivotRow][col])) pivotRow = r
    }
    if (Math.abs(m[pivotRow][col]) < 1e-10) continue // singular in this column, skip

    if (pivotRow !== col) {
      ;[m[col], m[pivotRow]] = [m[pivotRow], m[col]]
      steps.push({ matrix: cloneMat(m), description: `Swap R${col + 1} ↔ R${pivotRow + 1} to bring the largest pivot to the top.` })
    }

    const pivotVal = m[col][col]
    if (Math.abs(pivotVal - 1) > 1e-10) {
      m[col] = m[col].map((v) => v / pivotVal)
      steps.push({ matrix: cloneMat(m), description: `Scale R${col + 1} by 1/${fmt(pivotVal)} to make the pivot 1.` })
    }

    for (let r = 0; r < size; r++) {
      if (r === col) continue
      const factor = m[r][col]
      if (Math.abs(factor) < 1e-10) continue
      m[r] = m[r].map((v, i) => v - factor * m[col][i])
      steps.push({ matrix: cloneMat(m), description: `R${r + 1} → R${r + 1} − (${fmt(factor)})·R${col + 1} to clear this column.` })
    }
  }

  return steps
}

const PRESETS: Record<Size, number[][]> = {
  2: [
    [2, 1, 5],
    [1, 3, 10],
  ],
  3: [
    [2, 1, -1, 8],
    [-3, -1, 2, -11],
    [-2, 1, 2, -3],
  ],
}

export function SystemSolver() {
  const [size, setSize] = useState<Size>(2)
  const [matrix, setMatrix] = useState<number[][]>(PRESETS[2])
  const [stepIndex, setStepIndex] = useState(0)

  const steps = useMemo(() => gaussianEliminate(matrix, size), [matrix, size])
  const current = steps[Math.min(stepIndex, steps.length - 1)]
  const isDone = stepIndex >= steps.length - 1

  const varNames = size === 2 ? ['x', 'y'] : ['x', 'y', 'z']

  const solution = isDone
    ? current.matrix.map((row, i) => {
        // check the row is essentially e_i on the left side
        const isIdentityRow = row.slice(0, size).every((v, j) => Math.abs(v - (i === j ? 1 : 0)) < 1e-6)
        return isIdentityRow ? row[size] : null
      })
    : null

  const changeSize = (s: Size) => {
    setSize(s)
    setMatrix(PRESETS[s])
    setStepIndex(0)
  }

  const updateCell = (r: number, c: number, val: string) => {
    const n = parseFloat(val)
    const next = matrix.map((row) => [...row])
    next[r][c] = Number.isFinite(n) ? n : 0
    setMatrix(next)
    setStepIndex(0)
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Enter a system of linear equations as an augmented matrix, then step through Gaussian elimination —
        row swaps, scaling, and elimination — one operation at a time, until the solution appears on the right.
      </p>

      <div className="flex gap-2">
        {[2, 3].map((s) => (
          <button
            key={s}
            onClick={() => changeSize(s as Size)}
            className={`text-xs px-3 py-2 rounded-lg border transition-all ${
              size === s ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            {s}×{s} System
          </button>
        ))}
        <button
          onClick={() => { setMatrix(PRESETS[size]); setStepIndex(0) }}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-white/8 text-white/40 hover:text-white/70 transition-all ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Edit the system (augmented matrix)</p>
        <div className="space-y-1.5">
          {matrix.map((row, r) => (
            <div key={r} className="flex gap-1.5 items-center">
              {row.map((val, c) => (
                <input
                  key={c}
                  type="number"
                  step="1"
                  value={val}
                  onChange={(e) => updateCell(r, c, e.target.value)}
                  className={`w-14 bg-black/30 border rounded px-1.5 py-1 text-xs font-mono text-center ${
                    c === size ? 'border-emerald-500/30 text-emerald-300' : 'border-white/10 text-white/80'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-[#09090b] p-4 sm:p-5">
        <div className="overflow-x-auto">
          <table className="mx-auto border-collapse">
            <tbody>
              {current.matrix.map((row, r) => (
                <tr key={r}>
                  {row.map((val, c) => (
                    <td
                      key={c}
                      className={`px-3 py-2 text-sm font-mono text-center border ${
                        c === size ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/5' : 'border-white/8 text-white/80'
                      }`}
                    >
                      {fmt(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-cyan-300/90 text-center mt-4 leading-relaxed">{current.description}</p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-white/8 text-white/50 hover:text-white/80 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Previous
        </button>
        <span className="text-[11px] font-mono text-white/30">
          Step {stepIndex + 1} / {steps.length}
        </span>
        <button
          onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
          disabled={stepIndex >= steps.length - 1}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-white/8 text-white/50 hover:text-white/80 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3 space-y-1">
        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5">Original system</p>
        {matrix.length > 0 &&
          steps[0].matrix.map((row, i) => (
            <LatexRenderer key={i} latex={rowToLatex(row, size)} className="block text-xs" />
          ))}
      </div>

      {isDone && solution && solution.every((s) => s !== null) && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-4 py-3 text-center">
          <p className="text-xs text-emerald-400 font-mono">
            {varNames.map((v, i) => `${v} = ${fmt(solution[i]!)}`).join(',  ')}
          </p>
        </div>
      )}
      {isDone && solution && solution.some((s) => s === null) && (
        <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2 text-center">
          This system doesn&apos;t reduce to a unique solution — it may be inconsistent (no solution) or dependent
          (infinitely many solutions). Check for an all-zero row with a nonzero right-hand side, or an all-zero row.
        </p>
      )}
    </div>
  )
}
