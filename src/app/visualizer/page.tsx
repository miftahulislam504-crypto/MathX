'use client'
import { useState, lazy, Suspense } from 'react'

// Lazy load each visualizer — they're heavy (D3)
const FunctionPlotter    = lazy(() => import('@/components/visualizer/FunctionPlotter').then(m => ({ default: m.FunctionPlotter })))
const DerivativeAnimator = lazy(() => import('@/components/visualizer/DerivativeAnimator').then(m => ({ default: m.DerivativeAnimator })))
const IntegralVisualizer = lazy(() => import('@/components/visualizer/IntegralVisualizer').then(m => ({ default: m.IntegralVisualizer })))
const VectorVisualizer   = lazy(() => import('@/components/visualizer/VectorVisualizer').then(m => ({ default: m.VectorVisualizer })))
const UnitCircle         = lazy(() => import('@/components/visualizer/UnitCircle').then(m => ({ default: m.UnitCircle })))
const MatrixTransform    = lazy(() => import('@/components/visualizer/MatrixTransform').then(m => ({ default: m.MatrixTransform })))

const TABS = [
  {
    id: 'plotter',
    label: 'Function Plotter',
    icon: '∫',
    desc: 'Plot multiple functions. Toggle derivative f′(x), tangent lines, integral shading.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/8 border-violet-500/20',
  },
  {
    id: 'derivative',
    label: 'Derivative Animator',
    icon: '∂',
    desc: 'Animate the tangent line across f(x) and watch f′(x) trace out in real time.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/8 border-cyan-500/20',
  },
  {
    id: 'integral',
    label: 'Integral Visualizer',
    icon: '⌠',
    desc: 'Visualize area under the curve. Compare exact vs Riemann sum approximations.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/8 border-amber-500/20',
  },
  {
    id: 'vector',
    label: 'Vector Explorer',
    icon: '→',
    desc: 'Interactive 2D vector playground. See dot product, angle, and vector sum live.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
  },
  {
    id: 'unitcircle',
    label: 'Unit Circle',
    icon: '○',
    desc: 'Animate sin/cos/tan on the unit circle. See how trig values change with angle.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/8 border-rose-500/20',
  },
  {
    id: 'matrix',
    label: 'Matrix Transform',
    icon: '⊞',
    desc: 'Apply 2×2 matrices and watch shapes transform. Visualize det, trace, basis vectors.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/8 border-sky-500/20',
  },
] as const

type TabId = (typeof TABS)[number]['id']

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-8 h-8 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
      <p className="text-white/30 text-sm font-mono">Loading visualizer...</p>
    </div>
  )
}

export default function VisualizePage() {
  const [active, setActive] = useState<TabId>('plotter')
  const current = TABS.find((t) => t.id === active)!

  return (
    <>

      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">// Visualization Center</p>
            <h1 className="text-4xl font-bold text-white mb-2">Interactive Visualizer</h1>
            <p className="text-white/40 text-sm">
              See mathematics — not just equations. All visualizers are interactive.
            </p>
          </div>

          {/* Tab grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`group rounded-xl border p-3 text-left transition-all ${
                  active === tab.id
                    ? tab.bg + ' ' + tab.color
                    : 'border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15 hover:bg-white/[0.05] hover:text-white/70'
                }`}
              >
                <div className="text-xl mb-1.5">{tab.icon}</div>
                <div className="text-[11px] font-semibold leading-tight">{tab.label}</div>
              </button>
            ))}
          </div>

          {/* Active tab description */}
          <div className={`rounded-xl border ${current.bg} px-5 py-3 mb-6 flex items-center gap-3`}>
            <span className={`text-2xl ${current.color}`}>{current.icon}</span>
            <div>
              <p className={`text-sm font-semibold ${current.color}`}>{current.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{current.desc}</p>
            </div>
          </div>

          {/* Visualizer panel */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-6">
            <Suspense fallback={<LoadingSpinner />}>
              {active === 'plotter'    && <FunctionPlotter />}
              {active === 'derivative' && <DerivativeAnimator />}
              {active === 'integral'   && <IntegralVisualizer />}
              {active === 'vector'     && <VectorVisualizer />}
              {active === 'unitcircle' && <UnitCircle />}
              {active === 'matrix'     && <MatrixTransform />}
            </Suspense>
          </div>

          {/* Help tips */}
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { icon: '⌨', tip: 'Press Enter in any expression box to update the plot instantly.' },
              { icon: '🎛', tip: 'Drag sliders to animate values. Use range inputs for precise control.' },
              { icon: '📋', tip: 'Hover formula cards in the Library to copy LaTeX with one click.' },
            ].map(({ icon, tip }) => (
              <div key={tip} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <span className="text-lg shrink-0">{icon}</span>
                <p className="text-xs text-white/30 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

    </>
  )
}
