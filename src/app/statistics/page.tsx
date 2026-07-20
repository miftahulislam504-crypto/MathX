'use client'
import { useState, lazy, Suspense } from 'react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { Bell, TrendingUp, Scale, type LucideIcon } from 'lucide-react'

const DistributionVisualizer = lazy(() =>
  import('@/components/statistics/DistributionVisualizer').then(m => ({ default: m.DistributionVisualizer })))
const RegressionExplorer = lazy(() =>
  import('@/components/statistics/RegressionExplorer').then(m => ({ default: m.RegressionExplorer })))
const HypothesisTestExplorer = lazy(() =>
  import('@/components/statistics/HypothesisTestExplorer').then(m => ({ default: m.HypothesisTestExplorer })))

type TabId = 'distributions' | 'regression' | 'hypothesisTesting'

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin"/>
      <span className="text-white/30 text-sm font-mono">{label}</span>
    </div>
  )
}

export default function StatisticsPage() {
  const [tab, setTab] = useState<TabId>('distributions')
  const { tt } = useLanguage()

  const TABS: {
    id: TabId; label: string; icon: LucideIcon; color: string; bg: string; desc: string
  }[] = [
    {
      id:'distributions',
      label:tt(t.statistics.distribution),
      icon:Bell,
      color:'text-violet-400',
      bg:'bg-violet-500/8 border-violet-500/20',
      desc: tt({ en:'Normal, Binomial, Poisson, Uniform — interactive parameter sliders.', bn:'স্বাভাবিক, দ্বিপদী, পোয়াসোঁ, সুষম — ইন্টারেক্টিভ প্যারামিটার স্লাইডার।' }),
    },
    {
      id:'regression',
      label:tt(t.statistics.regression),
      icon:TrendingUp,
      color:'text-cyan-400',
      bg:'bg-cyan-500/8 border-cyan-500/20',
      desc: tt({ en:'Click to add points. Watch the regression line and R² update live.', bn:'বিন্দু যোগ করতে ক্লিক করুন। রিগ্রেশন লাইন এবং R² লাইভ আপডেট দেখুন।' }),
    },
    {
      id:'hypothesisTesting',
      label:tt(t.statistics.hypothesisTesting),
      icon:Scale,
      color:'text-rose-400',
      bg:'bg-rose-500/8 border-rose-500/20',
      desc: tt({ en:'One-sample z-test and t-test — see the rejection region and p-value live.', bn:'এক-নমুনা z-পরীক্ষা এবং t-পরীক্ষা — প্রত্যাখ্যান অঞ্চল এবং p-মান লাইভ দেখুন।' }),
    },
  ]

  const current = TABS.find(t => t.id === tab)!

  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.statistics.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-2">{tt(t.statistics.title)}</h1>
            <p className="text-white/40 text-sm">{tt(t.statistics.subtitle)}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 max-w-lg">
            {TABS.map(tb => (
              <button key={tb.id} onClick={() => setTab(tb.id)}
                className={`group rounded-xl border p-4 text-left transition-all ${
                  tab===tb.id ? tb.bg+' '+tb.color : 'border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/70'
                }`}>
                <tb.icon className="w-6 h-6 mb-2" />
                <div className="text-xs font-semibold">{tb.label}</div>
              </button>
            ))}
          </div>

          <div className={`rounded-xl border ${current.bg} px-5 py-3 mb-6 flex items-center gap-3`}>
            <current.icon className={`w-6 h-6 ${current.color}`} />
            <div>
              <p className={`text-sm font-semibold ${current.color}`}>{current.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{current.desc}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-6">
            <Suspense fallback={<Spinner label={tt(t.common.loading)} />}>
              {tab==='distributions' && <DistributionVisualizer />}
              {tab==='regression'    && <RegressionExplorer />}
              {tab==='hypothesisTesting' && <HypothesisTestExplorer />}
            </Suspense>
          </div>
        </div>
      </main>

    </>
  )
}
