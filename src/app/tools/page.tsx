'use client'
import { useState, lazy, Suspense } from 'react'

const ScientificCalculator = lazy(() => import('@/components/tools/ScientificCalculator').then(m=>({default:m.ScientificCalculator})))
const EquationSolver        = lazy(() => import('@/components/tools/EquationSolver').then(m=>({default:m.EquationSolver})))
const MatrixCalculator      = lazy(() => import('@/components/tools/MatrixCalculator').then(m=>({default:m.MatrixCalculator})))

const TOOLS = [
  { id:'calculator', label:'Scientific Calculator', icon:'🔢', color:'text-violet-400', bg:'bg-violet-500/8 border-violet-500/20', desc:'Full scientific calculator with history, trig, logarithms, DEG/RAD mode.' },
  { id:'equation',   label:'Equation Solver',       icon:'⚖️',  color:'text-cyan-400',   bg:'bg-cyan-500/8 border-cyan-500/20',     desc:'Solve linear, quadratic equations and 2×2 systems step-by-step.' },
  { id:'matrix',     label:'Matrix Calculator',     icon:'⊞',   color:'text-amber-400',  bg:'bg-amber-500/8 border-amber-500/20',   desc:'Matrix operations: multiply, determinant, inverse, eigenvalues.' },
] as const

type ToolId = (typeof TOOLS)[number]['id']

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin"/>
      <span className="text-white/30 text-sm font-mono">Loading tool...</span>
    </div>
  )
}

export default function ToolsPage() {
  const [active, setActive] = useState<ToolId>('calculator')
  const tool = TOOLS.find(t=>t.id===active)!

  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">// Mathematics Tools</p>
            <h1 className="text-4xl font-bold text-white mb-2">Math Tools</h1>
            <p className="text-white/40 text-sm">Calculators and solvers — all in your browser, no installs needed.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
            {TOOLS.map(t=>(
              <button key={t.id} onClick={()=>setActive(t.id)}
                className={`group rounded-xl border p-4 text-left transition-all ${
                  active===t.id ? t.bg+' '+t.color
                    : 'border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15 hover:bg-white/[0.05] hover:text-white/70'
                }`}>
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="text-xs font-semibold leading-tight">{t.label}</div>
              </button>
            ))}
          </div>

          <div className={`rounded-xl border ${tool.bg} px-5 py-3 mb-6 flex items-center gap-3`}>
            <span className={`text-2xl ${tool.color}`}>{tool.icon}</span>
            <div>
              <p className={`text-sm font-semibold ${tool.color}`}>{tool.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{tool.desc}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-6">
            <Suspense fallback={<Spinner />}>
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
