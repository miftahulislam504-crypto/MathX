'use client'
import { useState, lazy, Suspense } from 'react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { Calculator, Scale, Grid3x3, type LucideIcon } from 'lucide-react'

const ScientificCalculator = lazy(() => import('@/components/tools/ScientificCalculator').then(m=>({default:m.ScientificCalculator})))
const EquationSolver        = lazy(() => import('@/components/tools/EquationSolver').then(m=>({default:m.EquationSolver})))
const MatrixCalculator      = lazy(() => import('@/components/tools/MatrixCalculator').then(m=>({default:m.MatrixCalculator})))

type ToolId = 'calculator' | 'equation' | 'matrix'

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin"/>
      <span className="text-white/30 text-sm font-mono">{label}</span>
    </div>
  )
}

export default function ToolsPage() {
  const [active, setActive] = useState<ToolId>('calculator')
  const { tt } = useLanguage()

  const TOOLS: {
    id: ToolId; label: string; icon: LucideIcon; color: string; bg: string; desc: string
  }[] = [
    {
      id:'calculator',
      label:tt(t.tools.calculator),
      icon:Calculator, color:'text-violet-400', bg:'bg-violet-500/8 border-violet-500/20',
      desc: tt({ en:'Full scientific calculator with history, trig, logarithms, DEG/RAD mode.', bn:'ইতিহাস, ত্রিকোণমিতি, লগারিদম, DEG/RAD মোড সহ পূর্ণ বৈজ্ঞানিক ক্যালকুলেটর।' }),
    },
    {
      id:'equation',
      label:tt(t.tools.solver),
      icon:Scale, color:'text-cyan-400', bg:'bg-cyan-500/8 border-cyan-500/20',
      desc: tt({ en:'Solve linear, quadratic equations and 2×2 systems step-by-step.', bn:'রৈখিক, দ্বিঘাত সমীকরণ এবং 2×2 সিস্টেম ধাপে ধাপে সমাধান করুন।' }),
    },
    {
      id:'matrix',
      label:tt(t.tools.matrix),
      icon:Grid3x3, color:'text-amber-400', bg:'bg-amber-500/8 border-amber-500/20',
      desc: tt({ en:'Matrix operations: multiply, determinant, inverse, eigenvalues.', bn:'ম্যাট্রিক্স অপারেশন: গুণন, নির্ণায়ক, বিপরীত, আইগেনভ্যালু।' }),
    },
  ]

  const tool = TOOLS.find(tb => tb.id === active)!

  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.tools.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-2">{tt(t.tools.title)}</h1>
            <p className="text-white/40 text-sm">{tt(t.tools.subtitle)}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
            {TOOLS.map(tb => (
              <button key={tb.id} onClick={() => setActive(tb.id)}
                className={`group rounded-xl border p-4 text-left transition-all ${
                  active===tb.id ? tb.bg+' '+tb.color
                    : 'border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15 hover:bg-white/[0.05] hover:text-white/70'
                }`}>
                <tb.icon className="w-6 h-6 mb-2" />
                <div className="text-xs font-semibold leading-tight">{tb.label}</div>
              </button>
            ))}
          </div>

          <div className={`rounded-xl border ${tool.bg} px-5 py-3 mb-6 flex items-center gap-3`}>
            <tool.icon className={`w-6 h-6 ${tool.color}`} />
            <div>
              <p className={`text-sm font-semibold ${tool.color}`}>{tool.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{tool.desc}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-6">
            <Suspense fallback={<Spinner label={tt(t.common.loading)} />}>
              {active==='calculator' && <ScientificCalculator />}
              {active==='equation'   && <EquationSolver />}
              {active==='matrix'     && <MatrixCalculator />}
            </Suspense>
          </div>
        </div>
      </main>

    </>
  )
}
