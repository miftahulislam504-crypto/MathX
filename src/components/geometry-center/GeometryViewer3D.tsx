'use client'
import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Box, Cylinder, Cone, Circle } from 'lucide-react'

type SolidType = 'cuboid' | 'cylinder' | 'cone' | 'pyramid' | 'sphere'

interface SolidStats {
  volume: number
  surfaceArea: number
}

function computeStats(type: SolidType, params: Record<string, number>): SolidStats {
  switch (type) {
    case 'cuboid': {
      const { l, w, h } = params
      return { volume: l * w * h, surfaceArea: 2 * (l * w + w * h + h * l) }
    }
    case 'cylinder': {
      const { r, h } = params
      return { volume: Math.PI * r * r * h, surfaceArea: 2 * Math.PI * r * h + 2 * Math.PI * r * r }
    }
    case 'cone': {
      const { r, h } = params
      const slant = Math.sqrt(r * r + h * h)
      return { volume: (1 / 3) * Math.PI * r * r * h, surfaceArea: Math.PI * r * slant + Math.PI * r * r }
    }
    case 'pyramid': {
      const { base, h } = params
      const slantHeight = Math.sqrt((base / 2) ** 2 + h ** 2)
      return { volume: (1 / 3) * base * base * h, surfaceArea: base * base + 2 * base * slantHeight }
    }
    case 'sphere': {
      const { r } = params
      return { volume: (4 / 3) * Math.PI * r ** 3, surfaceArea: 4 * Math.PI * r * r }
    }
  }
}

function SolidMesh({ type, params }: { type: SolidType; params: Record<string, number> }) {
  const material = <meshStandardMaterial color="#a78bfa" roughness={0.4} metalness={0.15} />

  switch (type) {
    case 'cuboid':
      return (
        <mesh>
          <boxGeometry args={[params.l, params.h, params.w]} />
          {material}
        </mesh>
      )
    case 'cylinder':
      return (
        <mesh>
          <cylinderGeometry args={[params.r, params.r, params.h, 32]} />
          {material}
        </mesh>
      )
    case 'cone':
      return (
        <mesh>
          <coneGeometry args={[params.r, params.h, 32]} />
          {material}
        </mesh>
      )
    case 'pyramid':
      return (
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[params.base * 0.707, params.h, 4]} />
          {material}
        </mesh>
      )
    case 'sphere':
      return (
        <mesh>
          <sphereGeometry args={[params.r, 32, 32]} />
          {material}
        </mesh>
      )
  }
}

const SOLID_CONFIGS: Record<SolidType, { label: string; icon: typeof Box; params: { key: string; label: string; min: number; max: number; default: number }[] }> = {
  cuboid: { label: 'Cuboid', icon: Box, params: [
    { key: 'l', label: 'Length', min: 1, max: 8, default: 3 },
    { key: 'w', label: 'Width', min: 1, max: 8, default: 4 },
    { key: 'h', label: 'Height', min: 1, max: 8, default: 5 },
  ] },
  cylinder: { label: 'Cylinder', icon: Cylinder, params: [
    { key: 'r', label: 'Radius', min: 0.5, max: 5, default: 3 },
    { key: 'h', label: 'Height', min: 1, max: 8, default: 5 },
  ] },
  cone: { label: 'Cone', icon: Cone, params: [
    { key: 'r', label: 'Radius', min: 0.5, max: 5, default: 3 },
    { key: 'h', label: 'Height', min: 1, max: 8, default: 4 },
  ] },
  pyramid: { label: 'Square Pyramid', icon: Box, params: [
    { key: 'base', label: 'Base Side', min: 1, max: 8, default: 6 },
    { key: 'h', label: 'Height', min: 1, max: 8, default: 4 },
  ] },
  sphere: { label: 'Sphere', icon: Circle, params: [
    { key: 'r', label: 'Radius', min: 0.5, max: 5, default: 3 },
  ] },
}

export function GeometryViewer3D() {
  const [type, setType] = useState<SolidType>('cuboid')
  const [params, setParams] = useState<Record<string, number>>({ l: 3, w: 4, h: 5 })

  const changeType = (t: SolidType) => {
    setType(t)
    const defaults: Record<string, number> = {}
    SOLID_CONFIGS[t].params.forEach((p) => { defaults[p.key] = p.default })
    setParams(defaults)
  }

  const stats = computeStats(type, params)
  const config = SOLID_CONFIGS[type]

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Pick a solid and adjust its parameters — surface area and volume update live. Drag to rotate, scroll to
        zoom.
      </p>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(SOLID_CONFIGS) as SolidType[]).map((t) => (
          <button
            key={t}
            onClick={() => changeType(t)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              type === t ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            {SOLID_CONFIGS[t].label}
          </button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]" style={{ height: 360 }}>
        <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <SolidMesh type={type} params={params} />
          </Suspense>
          <OrbitControls enableDamping dampingFactor={0.08} />
        </Canvas>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {config.params.map((p) => (
          <div key={p.key} className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/40">{p.label}</span>
              <span className="text-white/70 font-mono">{params[p.key]?.toFixed(1)}</span>
            </div>
            <input
              type="range" min={p.min} max={p.max} step={0.5}
              value={params[p.key] ?? p.default}
              onChange={(e) => setParams((prev) => ({ ...prev, [p.key]: Number(e.target.value) }))}
              className="w-full accent-amber-500"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Volume</p>
          <p className="text-lg font-mono text-emerald-400">{stats.volume.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Surface Area</p>
          <p className="text-lg font-mono text-cyan-400">{stats.surfaceArea.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
