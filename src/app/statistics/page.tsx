'use client'
import { useState, lazy, Suspense } from 'react'

const DistributionVisualizer = lazy(() =>
  import('@/components/statistics/DistributionVisualizer').then(m => ({ default: m.DistributionVisualizer })))
const RegressionExplorer = lazy(() =>
  import('@/components/statistics/RegressionExplorer').then(m => ({ default: m.RegressionExplorer })))

const TABS = [
  { id:'distributions', label:'Distributions',    icon:'🔔', color:'text-violet-400', bg:'bg-violet-500/8 border-violet-500/20', desc:'Normal, Binomial, Poisson, Uniform — interactive parameter sliders.' },
  { id:'regression',    label:'Regression',        icon:'📈', color:'text-cyan-400',   bg:'bg-cyan-500/8 border-cyan-500/20',     desc:'Click to add points. Watch the regression line and R² update live.' },
] as const

type TabId = (typeof TABS)[number]['id']

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin"/>
      <span className="text-white/30 text-sm font-mono">Loading...</span>
    </div>
  )
}

export default function StatisticsPage() {
  const [tab, setTab] = useState<TabId>('distributions')
  const current = TABS.find(t => t.id === tab)!

  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">// Statistics Center</p>
            <h1 className="text-4xl font-bold text-white mb-2">Statistics Explorer</h1>
            <p className="text-white/40 text-sm">Interactive visualizations for probability distributions and statistical concepts.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6 max-w-md">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`group rounded-xl border p-4 text-left transition-all ${
                  tab===t.id ? t.bg+' '+t.color : 'border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/70'
                }`}>
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="text-xs font-semibold">{t.label}</div>
              </button>
            ))}
          </div>

          <div className={`rounded-xl border ${current.bg} px-5 py-3 mb-6 flex items-center gap-3`}>
            <span className={`text-2xl ${current.color}`}>{current.icon}</span>
            <div>
              <p className={`text-sm font-semibold ${current.color}`}>{current.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{current.desc}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-6">
            <Suspense fallback={<Spinner />}>
              {tab==='distributions' && <DistributionVisualizer />}
              {tab==='regression'    && <RegressionExplorer />}
            </Suspense>
          </div>
        </div>
      </main>

    </>
  )
}
