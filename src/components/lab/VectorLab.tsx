'use client'
import { useState } from 'react'
import { Box, SplitSquareVertical, Zap, type LucideIcon } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type ExpType = 'cross' | 'projection' | 'work'

// ── Shared: isometric projection for plain-SVG 3D ─────────────────────────
// True isometric transform (not a cosmetic fake): rotate 45° around Y,
// then ~35.264° around X, then project to 2D. Keeps proportions exact.
function iso(x: number, y: number, z: number, scale: number, originX: number, originY: number) {
  const px = (x - z) * Math.cos(Math.PI / 6) * scale
  const py = (x + z) * Math.sin(Math.PI / 6) * scale - y * scale
  return { x: originX + px, y: originY + py }
}

function cross(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}
function mag3(v: [number, number, number]) {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2)
}

// ── Cross Product (3D) ────────────────────────────────────────────────────
function CrossProductExplorer() {
  const [ax, setAx] = useState(3)
  const [ay, setAy] = useState(0)
  const [az, setAz] = useState(1)
  const [bx, setBx] = useState(0)
  const [by, setBy] = useState(0)
  const [bz, setBz] = useState(3)

  const A: [number, number, number] = [ax, ay, az]
  const B: [number, number, number] = [bx, by, bz]
  const C = cross(A, B)
  const parallelogramArea = mag3(C)

  const scale = 26
  const originX = 170, originY = 210
  const O = iso(0, 0, 0, scale, originX, originY)
  const pA = iso(ax, ay, az, scale, originX, originY)
  const pB = iso(bx, by, bz, scale, originX, originY)
  const pC = iso(C[0] * 0.4, C[1] * 0.4, C[2] * 0.4, scale, originX, originY) // scaled down for display
  // parallelogram corner: A + B
  const pAB = iso(ax + bx, ay + by, az + bz, scale, originX, originY)

  // axis tips for reference frame
  const axisX = iso(4, 0, 0, scale, originX, originY)
  const axisY = iso(0, 4, 0, scale, originX, originY)
  const axisZ = iso(0, 0, 4, scale, originX, originY)

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        The cross product <span className="text-amber-400 font-mono">A × B</span> gives a vector{' '}
        <span className="text-amber-400">perpendicular to both</span> A and B, whose length equals the area of
        the parallelogram they span.
      </p>

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg viewBox="0 0 340 280" className="w-full aspect-[340/280]">
          <rect width="340" height="280" fill="#09090b" />
          {/* axes */}
          <line x1={O.x} y1={O.y} x2={axisX.x} y2={axisX.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1={O.x} y1={O.y} x2={axisY.x} y2={axisY.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1={O.x} y1={O.y} x2={axisZ.x} y2={axisZ.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <text x={axisX.x + 4} y={axisX.y} fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="monospace">x</text>
          <text x={axisY.x + 4} y={axisY.y} fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="monospace">y</text>
          <text x={axisZ.x + 4} y={axisZ.y} fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="monospace">z</text>

          {/* parallelogram spanned by A and B */}
          <polygon
            points={`${O.x},${O.y} ${pA.x},${pA.y} ${pAB.x},${pAB.y} ${pB.x},${pB.y}`}
            fill="#a78bfa22" stroke="rgba(167,139,250,0.4)" strokeWidth="1"
          />

          {/* vector A */}
          <line x1={O.x} y1={O.y} x2={pA.x} y2={pA.y} stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#arrowCyan)" />
          {/* vector B */}
          <line x1={O.x} y1={O.y} x2={pB.x} y2={pB.y} stroke="#f43f5e" strokeWidth="2.5" markerEnd="url(#arrowRose)" />
          {/* vector C = A x B */}
          <line x1={O.x} y1={O.y} x2={pC.x} y2={pC.y} stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#arrowAmber)" />

          <defs>
            <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#22d3ee" /></marker>
            <marker id="arrowRose" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#f43f5e" /></marker>
            <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#fbbf24" /></marker>
          </defs>

          <text x={pA.x + 6} y={pA.y} fontSize="11" fill="#22d3ee" fontFamily="monospace">A</text>
          <text x={pB.x + 6} y={pB.y} fontSize="11" fill="#f43f5e" fontFamily="monospace">B</text>
          <text x={pC.x + 6} y={pC.y} fontSize="11" fill="#fbbf24" fontFamily="monospace">A×B</text>
        </svg>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-2">Vector A</p>
          {(['x', 'y', 'z'] as const).map((axis, i) => (
            <div key={axis} className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] text-white/30 w-3">{axis}</span>
              <input
                type="range" min={-4} max={4} step={0.5}
                value={[ax, ay, az][i]}
                onChange={(e) => [setAx, setAy, setAz][i](Number(e.target.value))}
                className="flex-1 accent-cyan-500"
              />
              <span className="text-[10px] text-white/50 font-mono w-8">{[ax, ay, az][i]}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
          <p className="text-[10px] uppercase tracking-wider text-rose-400/70 mb-2">Vector B</p>
          {(['x', 'y', 'z'] as const).map((axis, i) => (
            <div key={axis} className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] text-white/30 w-3">{axis}</span>
              <input
                type="range" min={-4} max={4} step={0.5}
                value={[bx, by, bz][i]}
                onChange={(e) => [setBx, setBy, setBz][i](Number(e.target.value))}
                className="flex-1 accent-rose-500"
              />
              <span className="text-[10px] text-white/50 font-mono w-8">{[bx, by, bz][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer
          latex={`A \\times B = (${C[0].toFixed(1)}, ${C[1].toFixed(1)}, ${C[2].toFixed(1)})`}
          display
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">|A×B|</p>
          <p className="text-lg font-mono text-amber-400">{parallelogramArea.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">= Parallelogram Area</p>
          <p className="text-lg font-mono text-violet-400">{parallelogramArea.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

// ── Vector Projection ─────────────────────────────────────────────────────
function VectorProjection() {
  const [vx, setVx] = useState(4)
  const [vy, setVy] = useState(3)
  const [ux, setUx] = useState(5)
  const [uy, setUy] = useState(0.5)

  const V = { x: vx, y: vy }
  const U = { x: ux, y: uy }
  const dot = V.x * U.x + V.y * U.y
  const uMagSq = U.x ** 2 + U.y ** 2
  const scalarProj = uMagSq > 0 ? dot / Math.sqrt(uMagSq) : 0
  const projFactor = uMagSq > 0 ? dot / uMagSq : 0
  const projVec = { x: projFactor * U.x, y: projFactor * U.y } // parallel component
  const perpVec = { x: V.x - projVec.x, y: V.y - projVec.y } // perpendicular component

  const scale = 24
  const originX = 60, originY = 220

  const toSvg = (p: { x: number; y: number }) => ({ x: originX + p.x * scale, y: originY - p.y * scale })
  const O = toSvg({ x: 0, y: 0 })
  const pV = toSvg(V)
  const pU = toSvg(U)
  const pProj = toSvg(projVec)

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Any vector <span className="text-cyan-400">V</span> can be split into a part{' '}
        <span className="text-emerald-400">parallel</span> to U and a part{' '}
        <span className="text-fuchsia-400">perpendicular</span> to U — this decomposition is the basis of work,
        collisions, and reflections in physics.
      </p>

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg viewBox="0 0 300 240" className="w-full aspect-[300/240]">
          <rect width="300" height="240" fill="#09090b" />
          {/* direction U extended as a reference line */}
          <line
            x1={originX - ux * scale * 0.6} y1={originY + uy * scale * 0.6}
            x2={originX + ux * scale * 1.3} y2={originY - uy * scale * 1.3}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3"
          />
          {/* perpendicular dashed connector from V down to projection */}
          <line x1={pV.x} y1={pV.y} x2={pProj.x} y2={pProj.y} stroke="rgba(217,70,239,0.4)" strokeWidth="1.5" strokeDasharray="3,2" />

          {/* U vector */}
          <line x1={O.x} y1={O.y} x2={pU.x} y2={pU.y} stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#arrowU)" />
          {/* V vector */}
          <line x1={O.x} y1={O.y} x2={pV.x} y2={pV.y} stroke="#67e8f9" strokeWidth="2.5" markerEnd="url(#arrowV)" />
          {/* projection (parallel component) */}
          <line x1={O.x} y1={O.y} x2={pProj.x} y2={pProj.y} stroke="#34d399" strokeWidth="3.5" markerEnd="url(#arrowProj)" />
          {/* perpendicular component, drawn from projection tip to V tip (already shown as dashed above, now solid) */}
          <line x1={pProj.x} y1={pProj.y} x2={pV.x} y2={pV.y} stroke="#e879f9" strokeWidth="2.5" markerEnd="url(#arrowPerp)" />

          <defs>
            <marker id="arrowU" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#22d3ee" /></marker>
            <marker id="arrowV" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#67e8f9" /></marker>
            <marker id="arrowProj" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#34d399" /></marker>
            <marker id="arrowPerp" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#e879f9" /></marker>
          </defs>

          <text x={pU.x + 6} y={pU.y} fontSize="11" fill="#22d3ee" fontFamily="monospace">U</text>
          <text x={pV.x + 6} y={pV.y - 4} fontSize="11" fill="#67e8f9" fontFamily="monospace">V</text>
          <text x={pProj.x + 4} y={pProj.y + 14} fontSize="10" fill="#34d399" fontFamily="monospace">proj</text>
        </svg>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-2">Vector V (to project)</p>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] text-white/30 w-3">x</span>
            <input type="range" min={-6} max={6} step={0.5} value={vx} onChange={(e) => setVx(Number(e.target.value))} className="flex-1 accent-cyan-400" />
            <span className="text-[10px] text-white/50 font-mono w-8">{vx}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 w-3">y</span>
            <input type="range" min={-6} max={6} step={0.5} value={vy} onChange={(e) => setVy(Number(e.target.value))} className="flex-1 accent-cyan-400" />
            <span className="text-[10px] text-white/50 font-mono w-8">{vy}</span>
          </div>
        </div>
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-2">Vector U (direction)</p>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] text-white/30 w-3">x</span>
            <input type="range" min={-6} max={6} step={0.5} value={ux} onChange={(e) => setUx(Number(e.target.value))} className="flex-1 accent-cyan-400" />
            <span className="text-[10px] text-white/50 font-mono w-8">{ux}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 w-3">y</span>
            <input type="range" min={-6} max={6} step={0.5} value={uy} onChange={(e) => setUy(Number(e.target.value))} className="flex-1 accent-cyan-400" />
            <span className="text-[10px] text-white/50 font-mono w-8">{uy}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer latex={`\\text{proj}_U V = \\dfrac{V \\cdot U}{|U|^2}\\,U = (${projVec.x.toFixed(2)}, ${projVec.y.toFixed(2)})`} display />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-1">Parallel Component</p>
          <p className="text-sm font-mono text-emerald-400">({projVec.x.toFixed(2)}, {projVec.y.toFixed(2)})</p>
        </div>
        <div className="rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-fuchsia-400/70 mb-1">Perpendicular Component</p>
          <p className="text-sm font-mono text-fuchsia-400">({perpVec.x.toFixed(2)}, {perpVec.y.toFixed(2)})</p>
        </div>
      </div>
      <p className="text-xs text-white/30 text-center font-mono">Scalar projection (signed length): {scalarProj.toFixed(2)}</p>
    </div>
  )
}

// ── Work & Physics ────────────────────────────────────────────────────────
function WorkPhysics() {
  const [forceAngle, setForceAngle] = useState(30)
  const [forceMag, setForceMag] = useState(50)
  const [displacement, setDisplacement] = useState(4)

  const rad = (forceAngle * Math.PI) / 180
  const work = forceMag * displacement * Math.cos(rad)
  const parallelForce = forceMag * Math.cos(rad)
  const perpForce = forceMag * Math.sin(rad)

  const scale = 22
  const originX = 40, originY = 180
  const dispEndX = originX + displacement * scale

  const forceEndX = originX + forceMag * 0.5 * Math.cos(rad)
  const forceEndY = originY - forceMag * 0.5 * Math.sin(rad)
  const parallelEndX = originX + parallelForce * 0.5

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Work depends only on the force component <span className="text-emerald-400">parallel</span> to
        displacement — a force pulling straight up on a box sliding sideways does{' '}
        <span className="text-rose-400">zero</span> work, no matter how strong it is.
      </p>

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg viewBox="0 0 320 220" className="w-full aspect-[320/220]">
          <rect width="320" height="220" fill="#09090b" />
          {/* ground */}
          <line x1="20" y1={originY} x2="300" y2={originY} stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          {/* box */}
          <rect x={originX - 12} y={originY - 24} width="24" height="24" fill="#a78bfa33" stroke="#a78bfa" strokeWidth="1.5" />
          {/* displacement vector */}
          <line x1={originX} y1={originY + 20} x2={dispEndX} y2={originY + 20} stroke="#67e8f9" strokeWidth="2.5" markerEnd="url(#arrowD)" />
          <text x={(originX + dispEndX) / 2} y={originY + 36} fontSize="10" fill="#67e8f9" fontFamily="monospace" textAnchor="middle">displacement d</text>

          {/* force vector (from box center) */}
          <line x1={originX} y1={originY - 12} x2={forceEndX} y2={forceEndY - 12} stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#arrowF)" />
          {/* parallel component (dashed, along ground level) */}
          <line x1={originX} y1={originY - 12} x2={parallelEndX} y2={originY - 12} stroke="#34d399" strokeWidth="2" strokeDasharray="4,2" />

          <defs>
            <marker id="arrowD" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#67e8f9" /></marker>
            <marker id="arrowF" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#fbbf24" /></marker>
          </defs>
          <text x={forceEndX + 6} y={forceEndY - 12} fontSize="10" fill="#fbbf24" fontFamily="monospace">F</text>
          <text x={parallelEndX + 4} y={originY - 20} fontSize="9" fill="#34d399" fontFamily="monospace">F cos θ</text>
        </svg>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Angle θ</span><span className="text-white/70 font-mono">{forceAngle}°</span></div>
          <input type="range" min={0} max={180} step={5} value={forceAngle} onChange={(e) => setForceAngle(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Force |F|</span><span className="text-white/70 font-mono">{forceMag}N</span></div>
          <input type="range" min={10} max={100} step={5} value={forceMag} onChange={(e) => setForceMag(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Displacement d</span><span className="text-white/70 font-mono">{displacement}m</span></div>
          <input type="range" min={1} max={8} step={0.5} value={displacement} onChange={(e) => setDisplacement(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer latex={`W = F \\cdot d \\cdot \\cos\\theta = ${forceMag} \\times ${displacement} \\times \\cos(${forceAngle}°) = ${work.toFixed(1)}\\text{ J}`} display />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-1">Parallel Force</p>
          <p className="text-sm font-mono text-emerald-400">{parallelForce.toFixed(1)}N</p>
        </div>
        <div className="rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-fuchsia-400/70 mb-1">Perpendicular Force</p>
          <p className="text-sm font-mono text-fuchsia-400">{perpForce.toFixed(1)}N</p>
        </div>
        <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-amber-400/70 mb-1">Work Done</p>
          <p className="text-sm font-mono text-amber-400">{work.toFixed(1)}J</p>
        </div>
      </div>

      {forceAngle === 90 && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2 text-center">
          At exactly 90°, the force is entirely perpendicular to motion — work done is zero.
        </p>
      )}
    </div>
  )
}

// ── Main Lab Component ────────────────────────────────────────────────────
export function VectorLab() {
  const [exp, setExp] = useState<ExpType>('cross')

  const EXPS: { id: ExpType; label: string; icon: LucideIcon }[] = [
    { id: 'cross', label: 'Cross Product (3D)', icon: Box },
    { id: 'projection', label: 'Vector Projection', icon: SplitSquareVertical },
    { id: 'work', label: 'Work & Physics', icon: Zap },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {EXPS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setExp(id)}
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all ${
              exp === id
                ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {exp === 'cross' && <CrossProductExplorer />}
      {exp === 'projection' && <VectorProjection />}
      {exp === 'work' && <WorkPhysics />}
    </div>
  )
}
