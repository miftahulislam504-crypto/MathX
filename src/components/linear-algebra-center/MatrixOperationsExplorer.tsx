'use client'
import { useState } from 'react'
import { Plus, X as XIcon, Layers } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type Mode = 'add' | 'multiply' | 'compose'

type Mat2 = [[number, number], [number, number]]

const VB = 320
const CX = VB / 2
const CY = VB / 2
const SCALE = 28

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '')
}

function svgPt(x: number, y: number) {
  return { x: CX + x * SCALE, y: CY - y * SCALE }
}

function matAdd(A: Mat2, B: Mat2): Mat2 {
  return [
    [A[0][0] + B[0][0], A[0][1] + B[0][1]],
    [A[1][0] + B[1][0], A[1][1] + B[1][1]],
  ]
}

function matMul(A: Mat2, B: Mat2): Mat2 {
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
  ]
}

function applyMat(M: Mat2, x: number, y: number) {
  return { x: M[0][0] * x + M[0][1] * y, y: M[1][0] * x + M[1][1] * y }
}

function Grid() {
  const lines = []
  for (let i = -5; i <= 5; i++) {
    const px = CX + i * SCALE
    const py = CY - i * SCALE
    lines.push(<line key={`v${i}`} x1={px} y1={0} x2={px} y2={VB} stroke={i === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)'} strokeWidth={i === 0 ? 1.5 : 1} />)
    lines.push(<line key={`h${i}`} x1={0} y1={py} x2={VB} y2={py} stroke={i === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)'} strokeWidth={i === 0 ? 1.5 : 1} />)
  }
  return <>{lines}</>
}

function TransformedGrid({ M, color }: { M: Mat2; color: string }) {
  const lines = []
  for (let i = -5; i <= 5; i++) {
    // vertical grid line x=i, y from -5..5, transformed
    const p1 = applyMat(M, i, -5)
    const p2 = applyMat(M, i, 5)
    const s1 = svgPt(p1.x, p1.y)
    const s2 = svgPt(p2.x, p2.y)
    lines.push(<line key={`tv${i}`} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke={color} strokeWidth={i === 0 ? 2 : 1} opacity={i === 0 ? 0.9 : 0.35} />)
    const q1 = applyMat(M, -5, i)
    const q2 = applyMat(M, 5, i)
    const t1 = svgPt(q1.x, q1.y)
    const t2 = svgPt(q2.x, q2.y)
    lines.push(<line key={`th${i}`} x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} stroke={color} strokeWidth={i === 0 ? 2 : 1} opacity={i === 0 ? 0.9 : 0.35} />)
  }
  return <>{lines}</>
}

function MatrixInput({ label, M, onChange, color }: { label: string; M: Mat2; onChange: (m: Mat2) => void; color: string }) {
  const update = (r: number, c: number, val: string) => {
    const n = parseFloat(val)
    const next: Mat2 = [[...M[0]] as [number, number], [...M[1]] as [number, number]]
    next[r][c] = Number.isFinite(n) ? n : 0
    onChange(next)
  }
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
      <p className={`text-[10px] uppercase tracking-wider mb-2 ${color}`}>{label}</p>
      <div className="grid grid-cols-2 gap-1.5 w-24">
        {[0, 1].map((r) =>
          [0, 1].map((c) => (
            <input
              key={`${r}-${c}`}
              type="number"
              step="0.5"
              value={M[r][c]}
              onChange={(e) => update(r, c, e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded px-1.5 py-1 text-xs text-white/80 font-mono text-center"
            />
          ))
        )}
      </div>
    </div>
  )
}

export function MatrixOperationsExplorer() {
  const [mode, setMode] = useState<Mode>('add')
  const [A, setA] = useState<Mat2>([[1, 0.5], [0, 1]])
  const [B, setB] = useState<Mat2>([[0.5, 0], [0.5, 1]])

  const MODES: { id: Mode; label: string; icon: typeof Plus }[] = [
    { id: 'add', label: 'Addition', icon: Plus },
    { id: 'multiply', label: 'Multiplication', icon: XIcon },
    { id: 'compose', label: 'Composition', icon: Layers },
  ]

  const result = mode === 'add' ? matAdd(A, B) : matMul(A, B)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all ${
              mode === id ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-white/40 leading-relaxed">
        {mode === 'add' && 'A + B adds entry-by-entry — geometrically, the transformed grids overlay independently; the sum matrix is shown numerically below.'}
        {mode === 'multiply' && 'A × B combines the two linear maps into one — the cyan grid shows A applied first, then B applied to that result.'}
        {mode === 'compose' && 'Composition (B∘A) means "apply A, then apply B" — the violet grid is the plane after A alone; the emerald grid is after both, in sequence.'}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <MatrixInput label="A" M={A} onChange={setA} color="text-cyan-400/80" />
        <MatrixInput label="B" M={B} onChange={setB} color="text-amber-400/80" />
      </div>

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg viewBox={`0 0 ${VB} ${VB}`} className="w-full aspect-square">
          <rect width={VB} height={VB} fill="#09090b" />
          <Grid />
          {mode !== 'add' && <TransformedGrid M={A} color="#22d3ee" />}
          <TransformedGrid M={mode === 'multiply' ? matMul(A, B) : mode === 'compose' ? matMul(B, A) : A} color="#34d399" />
        </svg>
      </div>

      {mode === 'add' ? (
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
          <LatexRenderer
            latex={`A + B = \\begin{pmatrix} ${fmt(result[0][0])} & ${fmt(result[0][1])} \\\\ ${fmt(result[1][0])} & ${fmt(result[1][1])} \\end{pmatrix}`}
            display
          />
        </div>
      ) : (
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
          <LatexRenderer
            latex={`${mode === 'compose' ? 'B \\cdot A' : 'A \\cdot B'} = \\begin{pmatrix} ${fmt(result[0][0])} & ${fmt(result[0][1])} \\\\ ${fmt(result[1][0])} & ${fmt(result[1][1])} \\end{pmatrix}`}
            display
          />
        </div>
      )}

      <p className="text-[11px] text-white/30 leading-relaxed">
        Looking for numeric determinant, inverse, or transpose? Try the Matrix Calculator in Tools — this explorer
        focuses on what matrices <em>do</em> to the plane, geometrically.
      </p>
    </div>
  )
}
