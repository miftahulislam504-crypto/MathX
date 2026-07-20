'use client'
import { lazy, Suspense } from 'react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { Sparkles } from 'lucide-react'

const GeometryMuseum = lazy(() =>
  import('@/components/foundation/GeometryMuseum').then((m) => ({ default: m.GeometryMuseum })))

export default function ExperienceZonePage() {
  const { tt } = useLanguage()

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.experienceZone.tag)}</p>
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-violet-400" /> {tt(t.experienceZone.title)}
          </h1>
          <p className="text-white/40">{tt(t.experienceZone.subtitle)}</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-wider text-violet-400/70 font-mono mb-4">{tt(t.experienceZone.museumTitle)}</p>
          <Suspense fallback={<div className="text-center text-white/30 text-sm py-20 font-mono">{tt(t.common.loading)}</div>}>
            <GeometryMuseum />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
