'use client'
import Link from 'next/link'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { LABS } from '@/lib/data/labs'

export default function LabIndexPage() {
  const { tt } = useLanguage()

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.lab.tag)}</p>
          <h1 className="text-4xl font-bold text-white mb-3">{tt(t.lab.title)}</h1>
          <p className="text-white/40">{tt(t.lab.subtitle)}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LABS.map((lab) => (
            <Link
              key={lab.slug}
              href={`/lab/${lab.slug}`}
              className={`group rounded-xl border p-5 transition-all border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]`}
            >
              <lab.icon className={`w-7 h-7 mb-3 ${lab.color}`} />
              <h3 className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors mb-1.5">
                {tt(t.lab[lab.labelKey])}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">{tt(t.lab[lab.descKey])}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
