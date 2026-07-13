'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { GeometryCenterMeta } from '@/lib/data/geometryCenter'

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
      <span className="text-white/30 text-sm font-mono">{label}</span>
    </div>
  )
}

export function GeometryCenterRunner({ tool }: { tool: GeometryCenterMeta }) {
  const { tt } = useLanguage()
  const ToolComponent = tool.component

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/geometry-center"
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-6 font-mono"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> {tt(t.geometryCenter.title)}
        </Link>

        <div className={`rounded-xl border ${tool.bg} px-5 py-4 mb-6 flex items-center gap-3`}>
          <tool.icon className={`w-7 h-7 shrink-0 ${tool.color}`} />
          <div>
            <p className={`text-base font-semibold ${tool.color}`}>{tt(t.geometryCenter[tool.labelKey])}</p>
            <p className="text-white/40 text-xs mt-0.5">{tt(t.geometryCenter[tool.descKey])}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-6">
          <Suspense fallback={<Spinner label={tt(t.lab.loading)} />}>
            <ToolComponent />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
