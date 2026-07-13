'use client'
import { useMemo, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import { create, all } from 'mathjs'
import { AlertCircle } from 'lucide-react'

const math = create(all)

function normalizeInput(expr: string): string {
  return expr.replace(/\bln\s*\(/gi, 'log(')
}

const PRESETS = [
  { label: 'Helix', x: 'cos(t)', y: 'sin(t)', z: 't/3', tMax: '6*pi' },
  { label: 'Lissajous', x: 'sin(3*t)', y: 'sin(4*t)', z: '0', tMax: '2*pi' },
  { label: 'Conical Spiral', x: 't*0.3*cos(t)', y: 't*0.3*sin(t)', z: 't*0.5', tMax: '10' },
  { label: 'Trefoil-ish', x: 'sin(t) + 2*sin(2*t)', y: 'cos(t) - 2*cos(2*t)', z: '-sin(3*t)', tMax: '2*pi' },
  { label: 'Circle (flat)', x: 'cos(t)', y: 'sin(t)', z: '0', tMax: '2*pi' },
]

const SAMPLE_COUNT = 300

function buildCurve(xExpr: string, yExpr: string, zExpr: string, tMax: number): [number, number, number][] | null {
  try {
    const xFn = math.compile(xExpr)
    const yFn = math.compile(yExpr)
    const zFn = math.compile(zExpr)
    const points: [number, number, number][] = []

    for (let i = 0; i <= SAMPLE_COUNT; i++) {
      const t = (i / SAMPLE_COUNT) * tMax
      const x = xFn.evaluate({ t })
      const y = yFn.evaluate({ t })
      const z = zFn.evaluate({ t })
      if ([x, y, z].some((v) => typeof v !== 'number' || !isFinite(v))) continue
      // three.js: map math (x,y,z) -> three (x, z-as-up, y) for consistency with the surface explorer
      points.push([x, z, y])
    }
    return points.length > 1 ? points : null
  } catch {
    return null
  }
}

function Axes({ size }: { size: number }) {
  return (
    <group>
      <Line points={[[-size, 0, 0], [size, 0, 0]]} color="#f43f5e" lineWidth={1.5} />
      <Line points={[[0, -size, 0], [0, size, 0]]} color="#34d399" lineWidth={1.5} />
      <Line points={[[0, 0, -size], [0, 0, size]]} color="#60a5fa" lineWidth={1.5} />
    </group>
  )
}

export function ParametricFunctionExplorer() {
  const [xExpr, setXExpr] = useState('cos(t)')
  const [yExpr, setYExpr] = useState('sin(t)')
  const [zExpr, setZExpr] = useState('t/3')
  const [tMaxExpr, setTMaxExpr] = useState('6*pi')
  const [error, setError] = useState('')

  const curveData = useMemo(() => {
    setError('')
    try {
      const tMax = math.evaluate(tMaxExpr)
      if (typeof tMax !== 'number') throw new Error('t-range must evaluate to a number.')
      const points = buildCurve(normalizeInput(xExpr), normalizeInput(yExpr), normalizeInput(zExpr), tMax)
      if (!points) throw new Error('Could not evaluate one or more of x(t), y(t), z(t).')
      return points
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not build this curve.')
      return null
    }
  }, [xExpr, yExpr, zExpr, tMaxExpr])

  const applyPreset = (p: typeof PRESETS[number]) => {
    setXExpr(p.x); setYExpr(p.y); setZExpr(p.z); setTMaxExpr(p.tMax)
  }

  // rough bounding size for axes, based on max coordinate magnitude in the curve
  const axisSize = useMemo(() => {
    if (!curveData) return 5
    let max = 1
    curveData.forEach(([x, y, z]) => { max = Math.max(max, Math.abs(x), Math.abs(y), Math.abs(z)) })
    return Math.min(15, max + 1)
  }, [curveData])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Define a curve as three functions of a parameter t — x(t), y(t), z(t). Drag to rotate, scroll to zoom.
      </p>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-white/30 mb-1 block">x(t)</label>
          <input type="text" value={xExpr} onChange={(e) => setXExpr(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500/50" />
        </div>
        <div>
          <label className="text-[10px] text-white/30 mb-1 block">y(t)</label>
          <input type="text" value={yExpr} onChange={(e) => setYExpr(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500/50" />
        </div>
        <div>
          <label className="text-[10px] text-white/30 mb-1 block">z(t)</label>
          <input type="text" value={zExpr} onChange={(e) => setZExpr(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500/50" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-white/40 shrink-0">t ranges from 0 to</label>
        <input type="text" value={tMaxExpr} onChange={(e) => setTMaxExpr(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500/50" />
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/25 bg-rose-500/5 px-4 py-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-300">{error}</p>
        </div>
      )}

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]" style={{ height: 420 }}>
        <Canvas camera={{ position: [axisSize * 1.5, axisSize * 1.2, axisSize * 1.5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <Suspense fallback={null}>
            {curveData && <Line points={curveData} color="#a78bfa" lineWidth={2.5} />}
          </Suspense>
          <Axes size={axisSize} />
          <OrbitControls enableDamping dampingFactor={0.08} />
        </Canvas>
      </div>

      <p className="text-[11px] text-white/25 text-center">
        <span className="text-rose-400">Red</span>=x-axis ·
        <span className="text-emerald-400"> green</span>=z-axis ·
        <span className="text-blue-400"> blue</span>=y-axis · {SAMPLE_COUNT} sample points
      </p>
    </div>
  )
}
