'use client'
import { useState, lazy, Suspense } from 'react'

const MonteCarlo      = lazy(() => import('@/components/lab/MonteCarlo').then(m => ({ default: m.MonteCarlo })))
const RandomWalk      = lazy(() => import('@/components/lab/RandomWalk').then(m => ({ default: m.RandomWalk })))
const FractalGenerator= lazy(() => import('@/components/lab/FractalGenerator').then(m => ({ default: m.FractalGenerator })))
const ProbabilityLab  = lazy(() => import('@/components/lab/ProbabilityLab').then(m => ({ default: m.ProbabilityLab })))
const ChaosLab        = lazy(() => import('@/components/lab/ChaosLab').then(m => ({ default: m.ChaosLab })))

const LABS = [
  { id: 'montecarlo',  label: 'Monte Carlo',      icon: '🎯', color: 'text-violet-400', bg: 'bg-violet-500/8 border-violet-500/20', desc: 'Estimate π by dropping random points. See convergence in action.' },
  { id: 'randomwalk',  label: 'Random Walk',       icon: '🚶', color: 'text-cyan-400',   bg: 'bg-cyan-500/8 border-cyan-500/20',     desc: '1D and 2D random walks. Explore Brownian motion and diffusion.' },
  { id: 'fractal',     label: 'Fractals',          icon: '🌀', color: 'text-amber-400',  bg: 'bg-amber-500/8 border-amber-500/20',   desc: 'Mandelbrot, Julia sets, Sierpinski triangle — infinite complexity.' },
  { id: 'probability', label: 'Probability Lab',   icon: '🎲', color: 'text-emerald-400',bg: 'bg-emerald-500/8 border-emerald-500/20',desc: 'Coin flips, Birthday problem, Monty Hall — counterintuitive math.' },
  { id: 'chaos',       label: 'Chaos Theory',      icon: '🦋', color: 'text-rose-400',   bg: 'bg-rose-500/8 border-rose-500/20',     desc: 'Logistic map, bifurcation, Lorenz attractor — butterfly effect.' },
] as const

type LabId = (typeof LABS)[number]['id']

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
      <span className="text-white/30 text-sm font-mono">Loading experiment...</span>
    </div>
  )
}

export default function LabPage() {
  const [active, setActive] = useState<LabId>('montecarlo')
  const lab = LABS.find(l => l.id === active)!

  return (
    <>

      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">// Mathematics Laboratory</p>
            <h1 className="text-4xl font-bold text-white mb-2">Math Lab</h1>
            <p className="text-white/40 text-sm">
              Run real mathematical experiments — no formulas to memorize, just explore.
            </p>
          </div>

          {/* Lab selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
            {LABS.map(lab => (
              <button key={lab.id} onClick={() => setActive(lab.id)}
                className={`group rounded-xl border p-3 text-left transition-all ${
                  active === lab.id ? lab.bg + ' ' + lab.color
                    : 'border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15 hover:bg-white/[0.05] hover:text-white/70'
                }`}>
                <div className="text-xl mb-1.5">{lab.icon}</div>
                <div className="text-[11px] font-semibold leading-tight">{lab.label}</div>
              </button>
            ))}
          </div>

          {/* Active lab info */}
          <div className={`rounded-xl border ${lab.bg} px-5 py-3 mb-6 flex items-center gap-3`}>
            <span className={`text-2xl ${lab.color}`}>{lab.icon}</span>
            <div>
              <p className={`text-sm font-semibold ${lab.color}`}>{lab.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{lab.desc}</p>
            </div>
          </div>

          {/* Experiment panel */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-6">
            <Suspense fallback={<Spinner />}>
              {active === 'montecarlo'  && <MonteCarlo />}
              {active === 'randomwalk'  && <RandomWalk />}
              {active === 'fractal'     && <FractalGenerator />}
              {active === 'probability' && <ProbabilityLab />}
              {active === 'chaos'       && <ChaosLab />}
            </Suspense>
          </div>
        </div>
      </main>

    </>
  )
}
