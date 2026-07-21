'use client'
import { useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { LABS, getLabBySlug } from '@/lib/data/labs'
import { addXP, updateStats, getStats, updateStreak, checkAchievements, recordSession } from '@/lib/data/user-progress'

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
      <span className="text-white/30 text-sm font-mono">{label}</span>
    </div>
  )
}

export function LabRunner({ slug }: { slug: string }) {
  const { tt } = useLanguage()
  const lab = getLabBySlug(slug)
  const trackedRef = useRef(false)

  useEffect(() => {
    if (trackedRef.current) return
    trackedRef.current = true
    updateStreak()
    updateStats({ labExperiments: getStats().labExperiments + 1 })
    addXP(15)
    recordSession(slug, 2)
    checkAchievements()
  }, [slug])

  if (!lab) return null

  const LabComponent = lab.component
  const otherLabs = LABS.filter((l) => l.slug !== lab.slug)

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-6 font-mono"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> {tt(t.lab.title)}
        </Link>

        {/* Active lab header */}
        <div className={`rounded-xl border ${lab.bg} px-5 py-4 mb-6 flex items-center gap-3`}>
          <lab.icon className={`w-7 h-7 shrink-0 ${lab.color}`} />
          <div>
            <p className={`text-base font-semibold ${lab.color}`}>{tt(t.lab[lab.labelKey])}</p>
            <p className="text-white/40 text-xs mt-0.5">{tt(t.lab[lab.descKey])}</p>
          </div>
        </div>

        {/* Experiment panel */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-6 mb-8">
          <Suspense fallback={<Spinner label={tt(t.lab.loading)} />}>
            <LabComponent />
          </Suspense>
        </div>

        {/* Other labs — quick switch */}
        <div>
          <p className="text-xs text-white/25 uppercase tracking-wider mb-3 font-mono">Other Labs</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {otherLabs.map((l) => (
              <Link
                key={l.slug}
                href={`/lab/${l.slug}`}
                className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5 text-center hover:border-white/15 hover:bg-white/[0.05] transition-all"
              >
                <l.icon className={`w-4 h-4 mx-auto mb-1 ${l.color}`} />
                <p className="text-[10px] text-white/40 leading-tight">{tt(t.lab[l.labelKey])}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
