'use client'
import { useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { EXPERIMENTS, getExperimentBySlug } from '@/lib/data/experiments'
import { addXP, updateStats, getStats, updateStreak, checkAchievements, recordSession } from '@/lib/data/user-progress'

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
      <span className="text-white/30 text-sm font-mono">{label}</span>
    </div>
  )
}

export function ExperimentRunner({ slug }: { slug: string }) {
  const { tt } = useLanguage()
  const experiment = getExperimentBySlug(slug)
  const trackedRef = useRef(false)

  useEffect(() => {
    if (trackedRef.current) return
    trackedRef.current = true
    updateStreak()
    updateStats({ labExperiments: getStats().labExperiments + 1 })
    addXP(15)
    recordSession(`experiment-${slug}`, 2)
    checkAchievements()
  }, [slug])

  if (!experiment) return null

  const ExperimentComponent = experiment.component
  const otherExperiments = EXPERIMENTS.filter((e) => e.slug !== experiment.slug)

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        <Link
          href="/experiments"
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-6 font-mono"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> {tt(t.experiments.title)}
        </Link>

        <div className={`rounded-xl border ${experiment.bg} px-5 py-4 mb-6 flex items-center gap-3`}>
          <experiment.icon className={`w-7 h-7 shrink-0 ${experiment.color}`} />
          <div>
            <p className={`text-base font-semibold ${experiment.color}`}>{tt(t.experiments[experiment.labelKey])}</p>
            <p className="text-white/40 text-xs mt-0.5">{tt(t.experiments[experiment.descKey])}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-6 mb-8">
          <Suspense fallback={<Spinner label={tt(t.lab.loading)} />}>
            <ExperimentComponent />
          </Suspense>
        </div>

        <div>
          <p className="text-xs text-white/25 uppercase tracking-wider mb-3 font-mono">Other Experiments</p>
          <div className="grid grid-cols-3 gap-2">
            {otherExperiments.map((e) => (
              <Link
                key={e.slug}
                href={`/experiments/${e.slug}`}
                className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5 text-center hover:border-white/15 hover:bg-white/[0.05] transition-all"
              >
                <e.icon className={`w-4 h-4 mx-auto mb-1 ${e.color}`} />
                <p className="text-[10px] text-white/40 leading-tight">{tt(t.experiments[e.labelKey])}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
