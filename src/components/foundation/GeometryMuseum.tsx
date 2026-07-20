'use client'
import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type ExhibitId = 'tetrahedron' | 'cube' | 'octahedron' | 'dodecahedron' | 'icosahedron' | 'torus'

interface Exhibit {
  id: ExhibitId
  name: string
  color: string
  vertices: number
  edges: number
  faces: number
  faceShape: string
  fact: string
}

const EXHIBITS: Exhibit[] = [
  {
    id: 'tetrahedron', name: 'Tetrahedron', color: '#f87171',
    vertices: 4, edges: 6, faces: 4, faceShape: 'equilateral triangles',
    fact: 'The simplest possible 3D shape with flat faces — every vertex connects directly to every other vertex.',
  },
  {
    id: 'cube', name: 'Cube (Hexahedron)', color: '#fb923c',
    vertices: 8, edges: 12, faces: 6, faceShape: 'squares',
    fact: 'The only Platonic solid that tiles 3D space perfectly on its own, with no gaps — which is why boxes and buildings are cube-shaped.',
  },
  {
    id: 'octahedron', name: 'Octahedron', color: '#facc15',
    vertices: 6, edges: 12, faces: 8, faceShape: 'equilateral triangles',
    fact: "The dual of the cube — put a vertex at the center of each cube face and you get an octahedron's vertices.",
  },
  {
    id: 'dodecahedron', name: 'Dodecahedron', color: '#34d399',
    vertices: 20, edges: 30, faces: 12, faceShape: 'regular pentagons',
    fact: 'Plato associated this shape with the cosmos itself — it\u2019s also the shape behind most modern soccer ball patterns\u2019 dual.',
  },
  {
    id: 'icosahedron', name: 'Icosahedron', color: '#22d3ee',
    vertices: 12, edges: 30, faces: 20, faceShape: 'equilateral triangles',
    fact: 'The dual of the dodecahedron, and the roundest-looking Platonic solid — many virus capsids and geodesic domes approximate this shape.',
  },
  {
    id: 'torus', name: 'Torus', color: '#a78bfa',
    vertices: Infinity, edges: Infinity, faces: 0, faceShape: 'no flat faces — a smooth donut surface',
    fact: 'Not a Platonic solid at all — a torus has a hole through it, giving it genus 1 (versus genus 0 for a sphere), which is why Euler\u2019s V\u2212E+F=2 formula doesn\u2019t apply to it.',
  },
]

function ExhibitMesh({ exhibit }: { exhibit: Exhibit }) {
  const material = <meshStandardMaterial color={exhibit.color} roughness={0.35} metalness={0.15} />
  switch (exhibit.id) {
    case 'tetrahedron':
      return <mesh rotation={[0.3, 0.4, 0]}><tetrahedronGeometry args={[2.2]} />{material}</mesh>
    case 'cube':
      return <mesh rotation={[0.4, 0.5, 0]}><boxGeometry args={[2.6, 2.6, 2.6]} />{material}</mesh>
    case 'octahedron':
      return <mesh rotation={[0.3, 0.4, 0]}><octahedronGeometry args={[2.2]} />{material}</mesh>
    case 'dodecahedron':
      return <mesh rotation={[0.3, 0.4, 0]}><dodecahedronGeometry args={[2]} />{material}</mesh>
    case 'icosahedron':
      return <mesh rotation={[0.3, 0.4, 0]}><icosahedronGeometry args={[2.2]} />{material}</mesh>
    case 'torus':
      return <mesh rotation={[0.5, 0, 0]}><torusGeometry args={[1.7, 0.7, 24, 64]} />{material}</mesh>
  }
}

export function GeometryMuseum() {
  const [index, setIndex] = useState(0)
  const exhibit = EXHIBITS[index]

  const go = (delta: number) => setIndex((i) => (i + delta + EXHIBITS.length) % EXHIBITS.length)

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Walk through a gallery of the 5 Platonic solids — the only convex shapes where every face, edge, and
        vertex angle is identical — plus one shape that breaks the mold. Drag to rotate, scroll to zoom.
      </p>

      <div className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden relative">
        <Canvas camera={{ position: [6, 4.5, 6], fov: 45 }} style={{ height: 320 }}>
          <ambientLight intensity={0.65} />
          <directionalLight position={[8, 8, 5]} intensity={1} />
          <directionalLight position={[-6, -3, -4]} intensity={0.3} />
          <Suspense fallback={null}>
            <ExhibitMesh exhibit={exhibit} />
          </Suspense>
          <OrbitControls enablePan={false} minDistance={4} maxDistance={14} autoRotate autoRotateSpeed={1.2} />
        </Canvas>

        <button
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          aria-label="Previous exhibit"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          aria-label="Next exhibit"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center gap-1.5">
        {EXHIBITS.map((e, i) => (
          <button
            key={e.id}
            onClick={() => setIndex(i)}
            className="w-2 h-2 rounded-full transition-all"
            style={{ background: i === index ? e.color : 'rgba(255,255,255,0.15)' }}
            aria-label={`Go to ${e.name}`}
          />
        ))}
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
        <h3 className="text-base font-bold mb-1" style={{ color: exhibit.color }}>{exhibit.name}</h3>
        <p className="text-xs text-white/50 leading-relaxed mb-4">{exhibit.fact}</p>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-black/20 p-2.5">
            <p className="text-[9px] uppercase tracking-wider text-white/25 mb-0.5">Vertices</p>
            <p className="text-sm font-mono text-white/70">{Number.isFinite(exhibit.vertices) ? exhibit.vertices : '\u221e'}</p>
          </div>
          <div className="rounded-lg bg-black/20 p-2.5">
            <p className="text-[9px] uppercase tracking-wider text-white/25 mb-0.5">Edges</p>
            <p className="text-sm font-mono text-white/70">{Number.isFinite(exhibit.edges) ? exhibit.edges : '\u221e'}</p>
          </div>
          <div className="rounded-lg bg-black/20 p-2.5">
            <p className="text-[9px] uppercase tracking-wider text-white/25 mb-0.5">Faces</p>
            <p className="text-sm font-mono text-white/70">{exhibit.faces || '\u2014'}</p>
          </div>
        </div>
        <p className="text-[11px] text-white/25 mt-3 text-center">Faces: {exhibit.faceShape}</p>
      </div>

      <p className="text-[11px] text-white/20 text-center">
        Looking for a shape with adjustable dimensions instead? Try the 3D Geometry Viewer in Geometry Center.
      </p>
    </div>
  )
}
