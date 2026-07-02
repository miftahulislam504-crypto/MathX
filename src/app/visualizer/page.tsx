'use client'
import { useState, lazy, Suspense } from 'react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { Keyboard, Sliders, Clipboard, type LucideIcon } from 'lucide-react'

const FunctionPlotter    = lazy(() => import('@/components/visualizer/FunctionPlotter').then(m => ({ default: m.FunctionPlotter })))
const DerivativeAnimator = lazy(() => import('@/components/visualizer/DerivativeAnimator').then(m => ({ default: m.DerivativeAnimator })))
const IntegralVisualizer = lazy(() => import('@/components/visualizer/IntegralVisualizer').then(m => ({ default: m.IntegralVisualizer })))
const VectorVisualizer   = lazy(() => import('@/components/visualizer/VectorVisualizer').then(m => ({ default: m.VectorVisualizer })))
const UnitCircle         = lazy(() => import('@/components/visualizer/UnitCircle').then(m => ({ default: m.UnitCircle })))
const MatrixTransform    = lazy(() => import('@/components/visualizer/MatrixTransform').then(m => ({ default: m.MatrixTransform })))

function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-8 h-8 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
      <p className="text-white/30 text-sm font-mono">{label}</p>
    </div>
  )
}

export default function VisualizePage() {
  const [active, setActive] = useState<TabId>('plotter')
  const { tt } = useLanguage()

  const TABS = [
    { id:'plotter',    icon:'∫', label:tt(t.visualizer.functionPlotter),    color:'text-violet-400', bg:'bg-violet-500/8 border-violet-500/20',  desc:tt({ en:'Plot multiple functions. Toggle derivative f′(x), tangent lines, integral shading.',    bn:'একাধিক ফাংশন প্লট করুন। ডেরিভেটিভ f′(x), স্পর্শক রেখা, ইন্টিগ্রেল শেডিং টগল করুন।' }) },
    { id:'derivative', icon:'∂', label:tt(t.visualizer.derivativeAnimator), color:'text-cyan-400',   bg:'bg-cyan-500/8 border-cyan-500/20',      desc:tt({ en:'Animate the tangent line across f(x) and watch f′(x) trace out in real time.',       bn:'f(x) জুড়ে স্পর্শক রেখা অ্যানিমেট করুন এবং রিয়েল টাইমে f′(x) ট্রেস করতে দেখুন।' }) },
    { id:'integral',   icon:'⌠', label:tt(t.visualizer.integralVisualizer), color:'text-amber-400',  bg:'bg-amber-500/8 border-amber-500/20',    desc:tt({ en:'Visualize area under the curve. Compare exact vs Riemann sum approximations.',         bn:'বক্ররেখার নিচের ক্ষেত্রফল ভিজ্যুয়ালাইজ করুন। সঠিক বনাম রিম্যান যোগফলের তুলনা করুন।' }) },
    { id:'vector',     icon:'→', label:tt(t.visualizer.vectorVisualizer),   color:'text-emerald-400',bg:'bg-emerald-500/8 border-emerald-500/20', desc:tt({ en:'Interactive 2D vector playground. See dot product, angle, and vector sum live.',       bn:'ইন্টারেক্টিভ 2D ভেক্টর প্লেগ্রাউন্ড। ডট প্রোডাক্ট, কোণ এবং ভেক্টর যোগফল লাইভ দেখুন।' }) },
    { id:'unitcircle', icon:'○', label:tt(t.visualizer.unitCircle),         color:'text-rose-400',   bg:'bg-rose-500/8 border-rose-500/20',      desc:tt({ en:'Animate sin/cos/tan on the unit circle. See how trig values change with angle.',       bn:'একক বৃত্তে sin/cos/tan অ্যানিমেট করুন। কোণের সাথে ত্রিকোণমিতিক মান কিভাবে পরিবর্তন হয় দেখুন।' }) },
    { id:'matrix',     icon:'⊞', label:tt(t.visualizer.matrixTransform),    color:'text-sky-400',    bg:'bg-sky-500/8 border-sky-500/20',        desc:tt({ en:'Apply 2×2 matrices and watch shapes transform. Visualize det, trace, basis vectors.',  bn:'2×2 ম্যাট্রিক্স প্রয়োগ করুন এবং আকৃতি রূপান্তর দেখুন। det, trace, ভিত্তি ভেক্টর ভিজ্যুয়ালাইজ করুন।' }) },
  ] as const

  const HELP_TIPS: { icon: LucideIcon; tip: string }[] = [
    { icon:Keyboard, tip:tt({ en:'Press Enter in any expression box to update the plot instantly.', bn:'যেকোনো এক্সপ্রেশন বক্সে Enter চাপলে তাৎক্ষণিকভাবে প্লট আপডেট হবে।' }) },
    { icon:Sliders, tip:tt({ en:'Drag sliders to animate values. Use range inputs for precise control.', bn:'মান অ্যানিমেট করতে স্লাইডার টানুন। সঠিক নিয়ন্ত্রণের জন্য রেঞ্জ ইনপুট ব্যবহার করুন।' }) },
    { icon:Clipboard, tip:tt({ en:'Hover formula cards in the Library to copy LaTeX with one click.', bn:'লাইব্রেরিতে ফর্মুলা কার্ডে হোভার করুন এক ক্লিকে LaTeX কপি করতে।' }) },
  ]

  const current = TABS.find(tab => tab.id === active)!

  return (
    <>
      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.visualizer.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-2">{tt(t.visualizer.title)}</h1>
            <p className="text-white/40 text-sm">
              {tt(t.visualizer.subtitle)}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActive(tab.id)}
                className={`group rounded-xl border p-3 text-left transition-all ${
                  active===tab.id ? tab.bg+' '+tab.color
                    : 'border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15 hover:bg-white/[0.05] hover:text-white/70'
                }`}>
                <div className="text-xl mb-1.5">{tab.icon}</div>
                <div className="text-[11px] font-semibold leading-tight">{tab.label}</div>
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
            <Suspense fallback={<LoadingSpinner label={tt(t.common.loading)} />}>
              {active==='plotter'    && <FunctionPlotter />}
              {active==='derivative' && <DerivativeAnimator />}
              {active==='integral'   && <IntegralVisualizer />}
              {active==='vector'     && <VectorVisualizer />}
              {active==='unitcircle' && <UnitCircle />}
              {active==='matrix'     && <MatrixTransform />}
            </Suspense>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {HELP_TIPS.map(({ icon: Icon, tip }) => (
              <div key={tip} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs text-white/30 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

type TabId = 'plotter' | 'derivative' | 'integral' | 'vector' | 'unitcircle' | 'matrix'
