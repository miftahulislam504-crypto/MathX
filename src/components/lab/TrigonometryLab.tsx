'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { RectangleHorizontal, Waves, Ruler, type LucideIcon } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type ExpType = 'righttriangle' | 'wave' | 'lawofsines'

const deg2rad = (d: number) => (d * Math.PI) / 180
const rad2deg = (r: number) => (r * 180) / Math.PI

// ── Right Triangle Solver (SOH-CAH-TOA) ──────────────────────────────────
function RightTriangleSolver() {
  const [angleDeg, setAngleDeg] = useState(40)
  const [hypotenuse, setHypotenuse] = useState(150)

  const rad = deg2rad(angleDeg)
  const opposite = hypotenuse * Math.sin(rad)
  const adjacent = hypotenuse * Math.cos(rad)
  const otherAngle = 90 - angleDeg

  const sinV = opposite / hypotenuse
  const cosV = adjacent / hypotenuse
  const tanV = opposite / adjacent

  // SVG layout: right angle at bottom-left, angle θ at bottom-right
  const scale = 1.0
  const Ax = 40, Ay = 260 // right-angle vertex (bottom-left)
  const Bx = Ax + adjacent * scale, By = Ay // bottom-right (angle θ here)
  const Cx = Ax, Cy = Ay - opposite * scale // top (vertex, 90-θ)

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Drag the angle or hypotenuse. <span className="text-amber-400">SOH-CAH-TOA</span> connects the angle θ to
        the ratio of any two sides — the same ratios always hold for a given angle, no matter the triangle&apos;s size.
      </p>

      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg viewBox="0 0 340 300" className="w-full aspect-[340/300]">
          <rect width="340" height="300" fill="#09090b" />
          <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="#7c3aed1a" stroke="#a78bfa" strokeWidth="2.5" />
          {/* right angle marker */}
          <rect x={Ax + 2} y={Ay - 14} width="12" height="12" fill="none" stroke="#67e8f9" strokeWidth="1.5" />
          {/* angle theta arc marker */}
          <path
            d={`M ${Bx - 22} ${By} A 22 22 0 0 0 ${Bx - 22 * Math.cos(rad)} ${By - 22 * Math.sin(rad)}`}
            fill="none" stroke="#f59e0b" strokeWidth="1.5"
          />
          <text x={Bx - 34} y={By - 10} fontSize="12" fill="#fbbf24" fontFamily="monospace">θ</text>
          {/* side labels */}
          <text x={(Ax + Bx) / 2} y={Ay + 16} fontSize="11" fill="#67e8f9" fontFamily="monospace" textAnchor="middle">adj {adjacent.toFixed(0)}</text>
          <text x={Ax - 8} y={(Ay + Cy) / 2} fontSize="11" fill="#34d399" fontFamily="monospace" textAnchor="end">opp {opposite.toFixed(0)}</text>
          <text x={(Bx + Cx) / 2 + 14} y={(By + Cy) / 2 - 6} fontSize="11" fill="#c4b5fd" fontFamily="monospace" textAnchor="start">hyp {hypotenuse.toFixed(0)}</text>
          <text x={Ax + 8} y={Ay - 6} fontSize="10" fill="#67e8f9" fontFamily="monospace">90°</text>
          <text x={Cx + 10} y={Cy + 12} fontSize="10" fill="#67e8f9" fontFamily="monospace">{otherAngle.toFixed(0)}°</text>
        </svg>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/40">Angle θ</span>
            <span className="text-white/70 font-mono">{angleDeg}°</span>
          </div>
          <input type="range" min={5} max={85} step={1} value={angleDeg} onChange={(e) => setAngleDeg(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/40">Hypotenuse</span>
            <span className="text-white/70 font-mono">{hypotenuse}</span>
          </div>
          <input type="range" min={60} max={220} step={5} value={hypotenuse} onChange={(e) => setHypotenuse(Number(e.target.value))} className="w-full accent-violet-500" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { name: 'sin θ', mnemonic: 'SOH', formula: 'opp/hyp', val: sinV, color: 'text-emerald-400', bg: 'border-emerald-500/25 bg-emerald-500/5' },
          { name: 'cos θ', mnemonic: 'CAH', formula: 'adj/hyp', val: cosV, color: 'text-cyan-400', bg: 'border-cyan-500/25 bg-cyan-500/5' },
          { name: 'tan θ', mnemonic: 'TOA', formula: 'opp/adj', val: tanV, color: 'text-amber-400', bg: 'border-amber-500/25 bg-amber-500/5' },
        ].map((r) => (
          <div key={r.name} className={`rounded-lg border p-3 text-center ${r.bg}`}>
            <p className={`text-[10px] uppercase tracking-wider mb-1 ${r.color}`}>{r.mnemonic}</p>
            <p className="text-sm font-mono text-white/70 mb-1">{r.name} = {r.formula}</p>
            <p className={`text-lg font-mono ${r.color}`}>{r.val.toFixed(3)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Circle-to-Wave: rotating point traces out sin(θ) live ────────────────
function CircleToWave() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 560, h: 220 })
  const [angle, setAngle] = useState(0) // radians, accumulates
  const [playing, setPlaying] = useState(true)
  const [waveType, setWaveType] = useState<'sin' | 'cos'>('sin')
  const rafRef = useRef<number>(0)
  const historyRef = useRef<{ theta: number; val: number }[]>([])

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(300, w), h: Math.max(180, Math.min(260, w * 0.4)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!playing) { cancelAnimationFrame(rafRef.current); return }
    const tick = () => {
      setAngle((a) => (a + 0.02) % (Math.PI * 8)) // let it run for 4 full revolutions before wrapping
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing])

  useEffect(() => {
    const val = waveType === 'sin' ? Math.sin(angle) : Math.cos(angle)
    historyRef.current.push({ theta: angle, val })
    if (historyRef.current.length > 400) historyRef.current.shift()
  }, [angle, waveType])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const W = dims.w, H = dims.h
    const circleR = H * 0.38
    const circleCx = circleR + 30, circleCy = H / 2
    const waveX0 = circleCx + circleR + 30
    const waveW = W - waveX0 - 20

    const g = svg.attr('width', W).attr('height', H).append('g')
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#09090b')

    // unit circle
    g.append('circle').attr('cx', circleCx).attr('cy', circleCy).attr('r', circleR).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.15)')
    g.append('line').attr('x1', circleCx - circleR).attr('x2', circleCx + circleR).attr('y1', circleCy).attr('y2', circleCy).attr('stroke', 'rgba(255,255,255,0.1)')
    g.append('line').attr('x1', circleCx).attr('x2', circleCx).attr('y1', circleCy - circleR).attr('y2', circleCy + circleR).attr('stroke', 'rgba(255,255,255,0.1)')

    const px = circleCx + circleR * Math.cos(angle)
    const py = circleCy - circleR * Math.sin(angle)

    // radius line + point
    g.append('line').attr('x1', circleCx).attr('y1', circleCy).attr('x2', px).attr('y2', py).attr('stroke', '#a78bfa').attr('stroke-width', 2)
    g.append('circle').attr('cx', px).attr('cy', py).attr('r', 5).attr('fill', '#f59e0b')

    // projection line from point to wave start (dashed), showing the height being "carried over"
    const currentVal = waveType === 'sin' ? Math.sin(angle) : Math.cos(angle)
    const waveY0 = circleCy - currentVal * circleR
    g.append('line').attr('x1', px).attr('y1', py).attr('x2', waveX0).attr('y2', waveY0).attr('stroke', '#f59e0b').attr('stroke-width', 1).attr('stroke-dasharray', '3,3').attr('opacity', 0.5)

    // wave axes
    g.append('line').attr('x1', waveX0).attr('x2', waveX0 + waveW).attr('y1', circleCy).attr('y2', circleCy).attr('stroke', 'rgba(255,255,255,0.1)')

    // wave path (history)
    const hist = historyRef.current
    if (hist.length > 1) {
      const thetaNow = angle
      const line = d3.line<{ theta: number; val: number }>()
        .x((d) => waveX0 + waveW - ((thetaNow - d.theta) / (Math.PI * 4)) * waveW)
        .y((d) => circleCy - d.val * circleR)
        .curve(d3.curveBasis)
      g.append('path')
        .attr('d', line(hist.filter((d) => thetaNow - d.theta <= Math.PI * 4 && thetaNow - d.theta >= 0)))
        .attr('fill', 'none').attr('stroke', '#22d3ee').attr('stroke-width', 2)
    }
    g.append('circle').attr('cx', waveX0).attr('cy', waveY0).attr('r', 4).attr('fill', '#22d3ee')

    g.append('rect').attr('width', W).attr('height', H).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.06)')
  }, [dims, angle, waveType])

  const currentDeg = (rad2deg(angle) % 360).toFixed(1)
  const currentVal = waveType === 'sin' ? Math.sin(angle) : Math.cos(angle)

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        As the point spins around the circle, its height (or horizontal position for cosine) is exactly what
        gets traced out as the wave on the right — <span className="text-cyan-300">the wave IS the circle, unrolled over time</span>.
      </p>

      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-semibold text-white transition-all"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <div className="flex gap-1.5">
          {(['sin', 'cos'] as const).map((w) => (
            <button
              key={w}
              onClick={() => { setWaveType(w); historyRef.current = [] }}
              className={`text-xs px-3 py-2 rounded-lg border transition-all ${
                waveType === w ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'border-white/8 text-white/40 hover:text-white/70'
              }`}
            >
              {w}(θ)
            </button>
          ))}
        </div>
        <span className="text-xs text-white/30 font-mono ml-auto">
          θ = {currentDeg}° · {waveType}(θ) = {currentVal.toFixed(3)}
        </span>
      </div>
    </div>
  )
}

// ── Law of Sines / Cosines Explorer ──────────────────────────────────────
function LawOfSinesCosines() {
  const [angleA, setAngleA] = useState(60)
  const [angleB, setAngleB] = useState(70)
  const [sideC, setSideC] = useState(120) // reference side, opposite angle C

  const angleC = 180 - angleA - angleB
  const valid = angleC > 2

  // Law of sines: a/sin(A) = b/sin(B) = c/sin(C)
  const k = valid ? sideC / Math.sin(deg2rad(angleC)) : 0
  const sideA = k * Math.sin(deg2rad(angleA))
  const sideB = k * Math.sin(deg2rad(angleB))

  // vertex layout for drawing (place C at origin, B along baseline)
  const scale = 0.7
  const Cx = 170, Cy = 240
  const Bx = Cx + sideA * scale, By = Cy
  const Ax = Cx + sideB * scale * Math.cos(deg2rad(angleC)), Ay = Cy - sideB * scale * Math.sin(deg2rad(angleC))

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        For <span className="text-white/60">any</span> triangle — not just right triangles — the{' '}
        <span className="text-violet-300">Law of Sines</span> relates each side to the sine of its opposite angle.
      </p>

      {valid ? (
        <div className="rounded-xl overflow-hidden border border-white/8 bg-[#09090b]">
          <svg viewBox="0 0 340 280" className="w-full aspect-[340/280]">
            <rect width="340" height="280" fill="#09090b" />
            <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="#7c3aed1a" stroke="#a78bfa" strokeWidth="2.5" />
            <circle cx={Ax} cy={Ay} r="4" fill="#f59e0b" />
            <circle cx={Bx} cy={By} r="4" fill="#22d3ee" />
            <circle cx={Cx} cy={Cy} r="4" fill="#34d399" />
            <text x={Ax} y={Ay - 10} fontSize="12" fill="#fbbf24" fontFamily="monospace" textAnchor="middle">A ({angleA}°)</text>
            <text x={Bx + 8} y={By + 4} fontSize="12" fill="#67e8f9" fontFamily="monospace">B ({angleB}°)</text>
            <text x={Cx - 8} y={Cy + 16} fontSize="12" fill="#6ee7b7" fontFamily="monospace" textAnchor="end">C ({angleC.toFixed(0)}°)</text>
            <text x={(Bx + Cx) / 2} y={Cy + 16} fontSize="10" fill="#fbbf24" fontFamily="monospace" textAnchor="middle">a={sideA.toFixed(0)}</text>
            <text x={(Ax + Cx) / 2 - 10} y={(Ay + Cy) / 2} fontSize="10" fill="#67e8f9" fontFamily="monospace" textAnchor="end">b={sideB.toFixed(0)}</text>
            <text x={(Ax + Bx) / 2 + 10} y={(Ay + By) / 2} fontSize="10" fill="#6ee7b7" fontFamily="monospace">c={sideC.toFixed(0)}</text>
          </svg>
        </div>
      ) : (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-3 text-center">
          Angle A + Angle B must be less than 180° to form a valid triangle.
        </p>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Angle A</span><span className="text-white/70 font-mono">{angleA}°</span></div>
          <input type="range" min={5} max={150} step={1} value={angleA} onChange={(e) => setAngleA(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Angle B</span><span className="text-white/70 font-mono">{angleB}°</span></div>
          <input type="range" min={5} max={150} step={1} value={angleB} onChange={(e) => setAngleB(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <div className="flex justify-between text-xs mb-1.5"><span className="text-white/40">Side c</span><span className="text-white/70 font-mono">{sideC}</span></div>
          <input type="range" min={40} max={200} step={5} value={sideC} onChange={(e) => setSideC(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
        <LatexRenderer latex={`\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = ${k.toFixed(2)}`} display />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Side a</p>
          <p className="text-lg font-mono text-amber-400">{sideA.toFixed(1)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Side b</p>
          <p className="text-lg font-mono text-cyan-400">{sideB.toFixed(1)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Angle C</p>
          <p className="text-lg font-mono text-emerald-400">{angleC.toFixed(1)}°</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Lab Component ────────────────────────────────────────────────────
export function TrigonometryLab() {
  const [exp, setExp] = useState<ExpType>('righttriangle')

  const EXPS: { id: ExpType; label: string; icon: LucideIcon }[] = [
    { id: 'righttriangle', label: 'SOH-CAH-TOA', icon: RectangleHorizontal },
    { id: 'wave', label: 'Circle → Wave', icon: Waves },
    { id: 'lawofsines', label: 'Law of Sines', icon: Ruler },
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
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {exp === 'righttriangle' && <RightTriangleSolver />}
      {exp === 'wave' && <CircleToWave />}
      {exp === 'lawofsines' && <LawOfSinesCosines />}
    </div>
  )
}
