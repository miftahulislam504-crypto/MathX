'use client'
import { useMemo, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import { create, all } from 'mathjs'
import { AlertCircle } from 'lucide-react'

const math = create(all)

function normalizeInput(expr: string): string {
  return expr.replace(/\bln\s*\(/gi, 'log(')
}

const PRESETS = [
  { label: 'Saddle', expr: 'x^2 - y^2' },
  { label: 'Paraboloid', expr: 'x^2 + y^2' },
  { label: 'Ripple', expr: 'sin(sqrt(x^2 + y^2))' },
  { label: 'Wave', expr: 'sin(x) + cos(y)' },
  { label: 'Gaussian', expr: 'exp(-(x^2+y^2)/4)' },
]

const GRID_SIZE = 40 // points per axis
const RANGE = 5 // -5 to 5 on x and y

interface SurfaceData {
  positions: Float32Array
  colors: Float32Array
  indices: number[]
}

function buildSurface(expr: string): SurfaceData | null {
  try {
    const compiled = math.compile(expr)
    const step = (RANGE * 2) / (GRID_SIZE - 1)
    const positions: number[] = []
    const zValues: number[] = []

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const x = -RANGE + i * step
        const y = -RANGE + j * step
        let z = compiled.evaluate({ x, y })
        if (typeof z !== 'number' || !isFinite(z)) z = 0
        z = Math.max(-8, Math.min(8, z)) // clamp extreme values for display
        positions.push(x, z, y) // note: three.js Y is "up", so we map math-z to three-y
        zValues.push(z)
      }
    }

    const minZ = Math.min(...zValues)
    const maxZ = Math.max(...zValues)
    const range = maxZ - minZ || 1

    const colors: number[] = []
    zValues.forEach((z) => {
      const t = (z - minZ) / range // 0..1
      // violet (low) -> cyan (mid) -> amber (high) gradient
      const color = new THREE.Color()
      color.setHSL(0.75 - t * 0.6, 0.7, 0.5)
      colors.push(color.r, color.g, color.b)
    })

    const indices: number[] = []
    for (let i = 0; i < GRID_SIZE - 1; i++) {
      for (let j = 0; j < GRID_SIZE - 1; j++) {
        const a = i * GRID_SIZE + j
        const b = a + 1
        const c = a + GRID_SIZE
        const d = c + 1
        indices.push(a, c, b, b, c, d)
      }
    }

    return { positions: new Float32Array(positions), colors: new Float32Array(colors), indices }
  } catch {
    return null
  }
}

function Surface({ data }: { data: SurfaceData }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(data.colors, 3))
    geo.setIndex(data.indices)
    geo.computeVertexNormals()
    return geo
  }, [data])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.6} metalness={0.1} />
    </mesh>
  )
}

function Axes() {
  const axisLen = RANGE + 1
  return (
    <group>
      <Line points={[[-axisLen, 0, 0], [axisLen, 0, 0]]} color="#f43f5e" lineWidth={1.5} />
      <Line points={[[0, -axisLen, 0], [0, axisLen, 0]]} color="#34d399" lineWidth={1.5} />
      <Line points={[[0, 0, -axisLen], [0, 0, axisLen]]} color="#60a5fa" lineWidth={1.5} />
    </group>
  )
}

export function MultivariableFunctionExplorer() {
  const [input, setInput] = useState('x^2 - y^2')
  const [error, setError] = useState('')

  const surfaceData = useMemo(() => {
    setError('')
    const normalized = normalizeInput(input)
    const data = buildSurface(normalized)
    if (!data) setError('Could not evaluate this expression as a function of x and y.')
    return data
  }, [input])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Enter a function of two variables z=f(x,y) to see its 3D surface. Drag to rotate, scroll to zoom.
        <span className="text-rose-400"> Red</span>=x-axis,
        <span className="text-emerald-400"> green</span>=z-value axis,
        <span className="text-blue-400"> blue</span>=y-axis.
      </p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. x^2 - y^2"
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-violet-500/50"
      />

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setInput(p.expr)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              input === p.expr ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
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
        <Canvas camera={{ position: [10, 8, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            {surfaceData && <Surface data={surfaceData} />}
          </Suspense>
          <Axes />
          <OrbitControls enableDamping dampingFactor={0.08} />
        </Canvas>
      </div>

      <p className="text-[11px] text-white/25 text-center">
        Domain shown: x, y ∈ [-{RANGE}, {RANGE}] · values clamped to [-8, 8] for display
      </p>
    </div>
  )
}
