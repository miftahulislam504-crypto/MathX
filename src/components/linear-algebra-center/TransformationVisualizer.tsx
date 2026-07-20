'use client'
import { useState } from 'react'
import { RotateCw, Maximize2, MoveDiagonal as ShearIcon, FlipHorizontal } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type TransformType = 'rotate' | 'scale' | 'shear' | 'reflect'
type Mat2 = [[number, number], [number, number]]

const VB = 320
const CX = VB / 2
const CY = VB / 2
const SCALE = 26

function fmt(n: number): string {
  const r = Math.round(n * 1000) / 1000
  return Number.isInteger(r) ? String(r) : r.toFixed(3).replace(/\.?0+$/, '')
}

function svgPt(x: number, y: number) {
  return { x: CX + x * SCALE, y: CY - y * SCALE }
}

function applyMat(M: Mat2, x: number, y: number) {
  return { x: M[0][0] * x + M[0][1] * y, y: M[1][0] * x + M[1][1] * y }
}

function rotationMatrix(deg: number): Mat2 {
  const r = (deg * Math.PI) / 180
  return [[Math.cos(r), -Math.sin(r)], [Math.sin(r), Math.cos(r)]]
}
function scaleMatrix(kx: number, ky: number): Mat2 {
  return [[kx, 0], [0, ky]]
}
function shearMatrix(k: number, axis: 'x' | 'y'): Mat2 {
  return axis === 'x' ? [[1, k], [0, 1]] : [[1, 0], [k, 1]]
}
function reflectMatrix(axis: 'x' | 'y' | 'origin' | 'y=x'): Mat2 {
  switch (axis) {
    case 'x': return [[1, 0], [0, -1]]
    case 'y': return [[-1, 0], [0, 1]]
    case 'origin': return [[-1, 0], [0, -1]]
    case 'y=x': return [[0, 1], [1, 0]]
  }
}

function Grid() {
  const lines = []
  for (let i = -5; i <= 5; i++) {
    const px = CX + i * SCALE
    const py = CY - i * SCALE
    lines.push(<line key={`v${i}`} x1={px} y1={0} x2={px} y2={VB} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />)
    lines.push(<line key={`h${i}`} x1={0} y1={py} x2={VB} y2={py} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />)
  }
  return <>{lines}</>
}

function TransformedGrid({ M }: { M: Mat2 }) {
  const lines = []
  for (let i = -5; i <= 5; i++) {
    const p1 = applyMat(M, i, -5)
    const p2 = applyMat(M, i, 5)
    const s1 = svgPt(p1.x, p1.y)
    const s2 = svgPt(p2.x, p2.y)
    lines.push(<line key={`tv${i}`} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke="#38bdf8" strokeWidth={i === 0 ? 2.5 : 1} opacity={i === 0 ? 1 : 0.4} />)
    const q1 = applyMat(M, -5, i)
    const q2 = applyMat(M, 5, i)
    const t1 = svgPt(q1.x, q1.y)
    const t2 = svgPt(q2.x, q2.y)
    lines.push(<line key={`th${i}`} x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} stroke="#38bdf8" strokeWidth={i === 0 ? 2.5 : 1} opacity={i === 0 ? 1 : 0.4} />)
  }
  // unit square, filled, to show area scaling
  const corners = [applyMat(M, 0, 0), applyMat(M, 1, 0), applyMat(M, 1, 1), applyMat(M, 0, 1)]
  const pts = corners.map((c) => svgPt(c.x, c.y))
  return (
    <>
      <polygon points={pts.map((p) => `${p.x},${p.y}`).join(' ')} fill="#38bdf822" stroke="#38bdf8" strokeWidth={1.5} />
      {lines}
    </>
  )
}

export function TransformationVisualizer() {
  const [type, setType] = useState<TransformType>('rotate')
  const [angle, setAngle] = useState(45)
  const [kx, setKx] = useState(2)
  const [ky, setKy] = useState(1)
  const [shearK, setShearK] = useState(1)
  const [shearAxis, setShearAxis] = useState<'x' | 'y'>('x')
  const [reflectAxis, setReflectAxis] = useState<'x' | 'y' | 'origin' | 'y=x'>('x')

  const TYPES: { id: TransformType; label: string; icon: typeof RotateCw }[] = [
    { id: 'rotate', label: 'Rotate', icon: RotateCw },
    { id: 'scale', label: 'Scale', icon: Maximize2 },
    { id: 'shear', label: 'Shear', icon: ShearIcon },
    { id: 'reflect', label: 'Reflect', icon: FlipHorizontal },
  ]

  const M: Mat2 =
    type === 'rotate' ? rotationMatrix(angle)
    : type === 'scale' ? scaleMatrix(kx, ky)
    : type === 'shear' ? shearMatrix(shearK, shearAxis)
    : reflectMatrix(reflectAxis)

  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {TYPES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setType(id)}
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all ${
              type === id ? 'bg-sky-500/15 border-sky-500/40 text-sky-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-white/40 leading-relaxed">
        {type === 'rotate' && 'Rotation turns every point around the origin by the same angle — lengths and areas are preserved.'}
        {type === 'scale' && 'Scaling stretches or shrinks along each axis independently — the shaded unit square shows how area changes.'}
        {type === 'shear' && 'Shear slides each row (or column) sideways by an amount proportional to its distance from the axis — area stays the same.'}
        {type === 'reflect' && 'Reflection flips the plane across a line — the shaded square flips orientation, but its area is unchanged.'}
      </p>

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg viewBox={`0 0 ${VB} ${VB}`} className="w-full aspect-square">
          <rect width={VB} height={VB} fill="#09090b" />
          <Grid />
          <TransformedGrid M={M} />
        </svg>
      </div>

      {type === 'rotate' && (
        <div>
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Angle</span><span className="text-sky-300 font-mono">{angle}°</span></div>
          <input type="range" min={-180} max={180} step={5} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-sky-500" />
        </div>
      )}

      {type === 'scale' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">kx</span><span className="text-sky-300 font-mono">{fmt(kx)}</span></div>
            <input type="range" min={-3} max={3} step={0.1} value={kx} onChange={(e) => setKx(Number(e.target.value))} className="w-full accent-sky-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">ky</span><span className="text-sky-300 font-mono">{fmt(ky)}</span></div>
            <input type="range" min={-3} max={3} step={0.1} value={ky} onChange={(e) => setKy(Number(e.target.value))} className="w-full accent-sky-500" />
          </div>
        </div>
      )}

      {type === 'shear' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {(['x', 'y'] as const).map((ax) => (
              <button key={ax} onClick={() => setShearAxis(ax)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${shearAxis === ax ? 'bg-sky-500/15 border-sky-500/40 text-sky-300' : 'border-white/8 text-white/40'}`}>
                {ax.toUpperCase()}-shear
              </button>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">k</span><span className="text-sky-300 font-mono">{fmt(shearK)}</span></div>
            <input type="range" min={-3} max={3} step={0.1} value={shearK} onChange={(e) => setShearK(Number(e.target.value))} className="w-full accent-sky-500" />
          </div>
        </div>
      )}

      {type === 'reflect' && (
        <div className="flex flex-wrap gap-2">
          {([
            { id: 'x', label: 'Across x-axis' },
            { id: 'y', label: 'Across y-axis' },
            { id: 'y=x', label: 'Across y = x' },
            { id: 'origin', label: 'Through origin' },
          ] as const).map((opt) => (
            <button key={opt.id} onClick={() => setReflectAxis(opt.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${reflectAxis === opt.id ? 'bg-sky-500/15 border-sky-500/40 text-sky-300' : 'border-white/8 text-white/40'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer
          latex={`M = \\begin{pmatrix} ${fmt(M[0][0])} & ${fmt(M[0][1])} \\\\ ${fmt(M[1][0])} & ${fmt(M[1][1])} \\end{pmatrix}, \\quad \\det(M) = ${fmt(det)}`}
          display
        />
      </div>

      <p className="text-[11px] text-white/30 text-center">
        |det(M)| is the factor by which area scales — the shaded square&apos;s area is |det(M)| times the original.
      </p>
    </div>
  )
}
