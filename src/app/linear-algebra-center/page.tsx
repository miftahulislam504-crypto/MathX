'use client'
import Link from 'next/link'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { LINEAR_ALGEBRA_CENTER_TOOLS } from '@/lib/data/linearAlgebraCenter'

export default function LinearAlgebraCenterIndexPage() {
  const { tt } = useLanguage()

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-cyan-400 text-sm font-mono mb-2">{tt(t.linearAlgebraCenter.tag)}</p>
          <h1 className="text-4xl font-bold text-white mb-3">{tt(t.linearAlgebraCenter.title)}</h1>
          <p className="text-white/40">{tt(t.linearAlgebraCenter.subtitle)}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {LINEAR_ALGEBRA_CENTER_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/linear-algebra-center/${tool.slug}`}
              className="group rounded-xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-white/15 hover:bg-white/[0.05]"
            >
              <tool.icon className={`w-7 h-7 mb-3 ${tool.color}`} />
              <h3 className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors mb-1.5">
                {tt(t.linearAlgebraCenter[tool.labelKey])}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">{tt(t.linearAlgebraCenter[tool.descKey])}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
