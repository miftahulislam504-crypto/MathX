'use client'
import Link from 'next/link'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { MODELING_CENTER_TOOLS } from '@/lib/data/modelingCenter'

export default function ModelingCenterIndexPage() {
  const { tt } = useLanguage()

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-amber-400 text-sm font-mono mb-2">{tt(t.modelingCenter.tag)}</p>
          <h1 className="text-4xl font-bold text-white mb-3">{tt(t.modelingCenter.title)}</h1>
          <p className="text-white/40">{tt(t.modelingCenter.subtitle)}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {MODELING_CENTER_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/modeling-center/${tool.slug}`}
              className="group rounded-xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-white/15 hover:bg-white/[0.05]"
            >
              <tool.icon className={`w-7 h-7 mb-3 ${tool.color}`} />
              <h3 className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors mb-1.5">
                {tt(t.modelingCenter[tool.labelKey])}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">{tt(t.modelingCenter[tool.descKey])}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
