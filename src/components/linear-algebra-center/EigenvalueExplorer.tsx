'use client'
import { useMemo, useState } from 'react'
import * as math from 'mathjs'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type Size = 2 | 3

const VB = 320
const CX = VB / 2
const CY = VB / 2
const SCALE = 34

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—'
  const r = Math.round(n * 1000) / 1000
  return Number.isInteger(r) ? String(r) : r.toFixed(3).replace(/\.?0+$/, '')
}

function isComplexObj(v: unknown): v is { re: number; im: number } {
  return typeof v === 'object' && v !== null && 'im' in (v as Record<string, unknown>)
}

function toReal(v: unknown): number | null {
  if (typeof v === 'number') return v
  if (isComplexObj(v)) return Math.abs(v.im) < 1e-9 ? v.re : null
  return null
}

function svgPt(x: number, y: number) {
  return { x: CX + x * SCALE, y: CY - y * SCALE }
}

function Grid() {
  const lines = []
  for (let i = -4; i <= 4; i++) {
    const px = CX + i * SCALE
    const py = CY - i * SCALE
    lines.push(<line key={`v${i}`} x1={px} y1={0} x2={px} y2={VB} stroke={i === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)'} strokeWidth={i === 0 ? 1.5 : 1} />)
    lines.push(<line key={`h${i}`} x1={0} y1={py} x2={VB} y2={py} stroke={i === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)'} strokeWidth={i === 0 ? 1.5 : 1} />)
  }
  return <>{lines}</>
}

const PRESETS_2: { label: string; m: number[][] }[] = [
  { label: 'Symmetric', m: [[2, 1], [1, 2]] },
  { label: 'Shear', m: [[1, 1], [0, 1]] },
  { label: 'Stretch', m: [[3, 0], [0, 0.5]] },
  { label: 'Rotation (complex)', m: [[0, -1], [1, 0]] },
]

const PRESETS_3: { label: string; m: number[][] }[] = [
  { label: 'Diagonal', m: [[2, 0, 0], [0, 3, 0], [0, 0, 4]] },
  { label: 'Symmetric', m: [[2, 1, 0], [1, 2, 1], [0, 1, 2]] },
  { label: 'Shear', m: [[1, 1, 0], [0, 1, 1], [0, 0, 1]] },
]

export function EigenvalueExplorer() {
  const [size, setSize] = useState<Size>(2)
  const [matrix, setMatrix] = useState<number[][]>(PRESETS_2[0].m)

  const updateCell = (r: number, c: number, val: string) => {
    const n = parseFloat(val)
    const next = matrix.map((row) => [...row])
    next[r][c] = Number.isFinite(n) ? n : 0
    setMatrix(next)
  }

  const changeSize = (s: Size) => {
    setSize(s)
    setMatrix(s === 2 ? PRESETS_2[0].m : PRESETS_3[0].m)
  }

  const result = useMemo(() => {
    try {
      return math.eigs(matrix) as unknown as {
        values: unknown[]
        eigenvectors: { value: unknown; vector: unknown[] }[]
      }
    } catch {
      return null
    }
  }, [matrix])

  const realPairs = useMemo(() => {
    if (!result) return []
    return result.eigenvectors
      .map((ev) => {
        const val = toReal(ev.value)
        if (val === null) return null
        const vec = ev.vector.map((v) => toReal(v))
        if (vec.some((v) => v === null)) return null
        return { value: val, vector: vec as number[] }
      })
      .filter((x): x is { value: number; vector: number[] } => x !== null)
  }, [result])

  const hasComplex = result ? result.values.some((v) => toReal(v) === null) : false

  const colors = ['#34d399', '#f59e0b', '#fb7185']

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Enter any 2×2 or 3×3 matrix. Eigenvectors are the special directions that a matrix only stretches or
        shrinks — never rotates off their own line. The stretch factor along each direction is its eigenvalue.
      </p>

      <div className="flex gap-2">
        {[2, 3].map((s) => (
          <button
            key={s}
            onClick={() => changeSize(s as Size)}
            className={`text-xs px-3 py-2 rounded-lg border transition-all ${
              size === s ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            {s}×{s}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(size === 2 ? PRESETS_2 : PRESETS_3).map((p) => (
          <button
            key={p.label}
            onClick={() => setMatrix(p.m)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3 flex justify-center">
        <div className={`grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${size}, minmax(0,1fr))` }}>
          {matrix.map((row, r) =>
            row.map((val, c) => (
              <input
                key={`${r}-${c}`}
                type="number"
                step="0.5"
                value={val}
                onChange={(e) => updateCell(r, c, e.target.value)}
                className="w-14 bg-black/30 border border-white/10 rounded px-1.5 py-1 text-xs text-white/80 font-mono text-center"
              />
            ))
          )}
        </div>
      </div>

      {size === 2 && (
        <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
          <svg viewBox={`0 0 ${VB} ${VB}`} className="w-full aspect-square">
            <rect width={VB} height={VB} fill="#09090b" />
            <Grid />
            {realPairs.map((pair, i) => {
              const [vx, vy] = pair.vector
              const norm = Math.sqrt(vx * vx + vy * vy) || 1
              const ux = vx / norm, uy = vy / norm
              const p1 = svgPt(-ux * 4.2, -uy * 4.2)
              const p2 = svgPt(ux * 4.2, uy * 4.2)
              return (
                <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={colors[i % colors.length]} strokeWidth={2.5} strokeDasharray="6,4" opacity={0.85} />
              )
            })}
          </svg>
        </div>
      )}

      {hasComplex && (
        <p className="text-xs text-sky-400 bg-sky-500/10 border border-sky-500/25 rounded-lg px-3 py-2 text-center leading-relaxed">
          This matrix has complex eigenvalues — geometrically, it rotates every vector (at least partly), so no
          real direction is left unrotated. That&apos;s why {size === 2 ? 'no dashed lines appear above' : 'no real eigenvector shows below'}.
        </p>
      )}

      <div className="space-y-3">
        {result?.values.map((val, i) => {
          const realVal = toReal(val)
          const pair = realPairs.find((p) => Math.abs(p.value - (realVal ?? NaN)) < 1e-6)
          return (
            <div key={i} className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: realVal !== null ? colors[realPairs.indexOf(pair!) % colors.length] ?? '#94a3b8' : '#38bdf8' }} />
                <p className="text-xs text-white/70 font-mono">
                  λ{i + 1} = {isComplexObj(val) ? `${fmt(val.re)} ${val.im >= 0 ? '+' : '−'} ${fmt(Math.abs(val.im))}i` : fmt(val as number)}
                </p>
              </div>
              {pair && (
                <LatexRenderer
                  latex={`v_{${i + 1}} = \\begin{pmatrix} ${pair.vector.map(fmt).join(' \\\\ ')} \\end{pmatrix}`}
                  className="text-xs"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
