'use client'
import Link from 'next/link'
import { Award } from 'lucide-react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { ASSESSMENTS } from '@/lib/data/assessments'
import { getCertificates } from '@/lib/data/assessment-progress'
import { useEffect, useState } from 'react'

export default function AssessmentIndexPage() {
  const { tt } = useLanguage()
  const [certCount, setCertCount] = useState(0)

  useEffect(() => {
    setCertCount(getCertificates().length)
  }, [])

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-emerald-400 text-sm font-mono mb-2">{tt(t.assessment.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-3">{tt(t.assessment.title)}</h1>
            <p className="text-white/40 max-w-xl">{tt(t.assessment.subtitle)}</p>
          </div>
          {certCount > 0 && (
            <Link
              href="/assessment/certificates"
              className="flex items-center gap-2 rounded-lg border border-amber-500/25 bg-amber-500/8 hover:bg-amber-500/15 px-4 py-2.5 transition-all shrink-0"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300">{certCount} {tt(t.assessment.certificatesEarned)}</span>
            </Link>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {ASSESSMENTS.map((a) => (
            <Link
              key={a.slug}
              href={`/assessment/${a.slug}`}
              className="group rounded-xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-white/15 hover:bg-white/[0.05]"
            >
              <a.icon className={`w-7 h-7 mb-3 ${a.color}`} />
              <h3 className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors mb-1.5">
                {tt(t.assessment[a.labelKey])}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">{tt(t.assessment[a.descKey])}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
