'use client'
import { useState, lazy, Suspense, useEffect, useRef } from 'react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { Target, Footprints, Orbit, Dices, Wind, type LucideIcon } from 'lucide-react'
import { addXP, updateStats, getStats, updateStreak, checkAchievements, recordSession } from '@/lib/data/user-progress'

const MonteCarlo      = lazy(() => import('@/components/lab/MonteCarlo').then(m => ({ default: m.MonteCarlo })))
const RandomWalk      = lazy(() => import('@/components/lab/RandomWalk').then(m => ({ default: m.RandomWalk })))
const FractalGenerator= lazy(() => import('@/components/lab/FractalGenerator').then(m => ({ default: m.FractalGenerator })))
const ProbabilityLab  = lazy(() => import('@/components/lab/ProbabilityLab').then(m => ({ default: m.ProbabilityLab })))
const ChaosLab        = lazy(() => import('@/components/lab/ChaosLab').then(m => ({ default: m.ChaosLab })))

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
      <span className="text-white/30 text-sm font-mono">{label}</span>
    </div>
  )
}

export default function LabPage() {
  const { tt } = useLanguage()

  const LABS: { id: string; label: string; icon: LucideIcon; color: string; bg: string; desc: string }[] = [
    { id: 'montecarlo',  label: tt(t.lab.monteCarlo),     icon: Target, color: 'text-violet-400', bg: 'bg-violet-500/8 border-violet-500/20', desc: tt(t.lab.monteCarloDesc) },
    { id: 'randomwalk',  label: tt(t.lab.randomWalk),     icon: Footprints, color: 'text-cyan-400',   bg: 'bg-cyan-500/8 border-cyan-500/20',     desc: tt(t.lab.randomWalkDesc) },
    { id: 'fractal',     label: tt(t.lab.fractals),       icon: Orbit, color: 'text-amber-400',  bg: 'bg-amber-500/8 border-amber-500/20',   desc: tt(t.lab.fractalsDesc) },
    { id: 'probability', label: tt(t.lab.probabilityLab), icon: Dices, color: 'text-emerald-400',bg: 'bg-emerald-500/8 border-emerald-500/20',desc: tt(t.lab.probabilityDesc) },
    { id: 'chaos',       label: tt(t.lab.chaosTheory),    icon: Wind, color: 'text-rose-400',   bg: 'bg-rose-500/8 border-rose-500/20',     desc: tt(t.lab.chaosDesc) },
  ] as const

  type LabId = (typeof LABS)[number]['id']

  const [active, setActive] = useState<LabId>('montecarlo')
  const lab = LABS.find(l => l.id === active)!
  const visitedLabsRef = useRef<Set<LabId>>(new Set())

  useEffect(() => {
    if (visitedLabsRef.current.has(active)) return
    visitedLabsRef.current.add(active)
    updateStreak()
    updateStats({ labExperiments: getStats().labExperiments + 1 })
    addXP(15)
    recordSession(active, 2)
    checkAchievements()
  }, [active])

  return (
    <>

      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.lab.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-2">{tt(t.lab.title)}</h1>
            <p className="text-white/40 text-sm">
              {tt(t.lab.subtitle)}
            </p>
          </div>

          {/* Lab selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
            {LABS.map(l => (
              <button key={l.id} onClick={() => setActive(l.id)}
                className={`group rounded-xl border p-3 text-left transition-all ${
                  active === l.id ? l.bg + ' ' + l.color
                    : 'border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15 hover:bg-white/[0.05] hover:text-white/70'
                }`}>
                <l.icon className="w-5 h-5 mb-1.5" />
                <div className="text-[11px] font-semibold leading-tight">{l.label}</div>
              </button>
            ))}
          </div>

          {/* Active lab info */}
          <div className={`rounded-xl border ${lab.bg} px-5 py-3 mb-6 flex items-center gap-3`}>
            <lab.icon className={`w-6 h-6 ${lab.color}`} />
            <div>
              <p className={`text-sm font-semibold ${lab.color}`}>{lab.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{lab.desc}</p>
            </div>
          </div>

          {/* Experiment panel */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-6">
            <Suspense fallback={<Spinner label={tt(t.lab.loading)} />}>
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
