'use client'
import Link from 'next/link'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { PROBABILITY_CENTER_TOOLS } from '@/lib/data/probabilityCenter'

export default function ProbabilityCenterIndexPage() {
  const { tt } = useLanguage()

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-fuchsia-400 text-sm font-mono mb-2">{tt(t.probabilityCenter.tag)}</p>
          <h1 className="text-4xl font-bold text-white mb-3">{tt(t.probabilityCenter.title)}</h1>
          <p className="text-white/40">{tt(t.probabilityCenter.subtitle)}</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PROBABILITY_CENTER_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/probability-center/${tool.slug}`}
              className="group rounded-xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-white/15 hover:bg-white/[0.05]"
            >
              <tool.icon className={`w-7 h-7 mb-3 ${tool.color}`} />
              <h3 className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors mb-1.5">
                {tt(t.probabilityCenter[tool.labelKey])}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">{tt(t.probabilityCenter[tool.descKey])}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
