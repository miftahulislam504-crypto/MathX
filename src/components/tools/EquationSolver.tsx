'use client'
import { useState } from 'react'
import { create, all } from 'mathjs'

const math = create(all)

type SolverType = 'linear' | 'quadratic' | 'system' | 'expression'

interface SolveResult { steps: string[]; answers: string[] }

function solveLinear(a: number, b: number): SolveResult {
  // ax + b = 0
  const steps = [
    `ax + b = 0`,
    `${a}x + ${b} = 0`,
    `${a}x = ${-b}`,
    `x = ${-b} / ${a}`,
  ]
  const x = -b / a
  return { steps, answers: [`x = ${Number.isFinite(x) ? x.toFixed(6).replace(/\.?0+$/,'') : 'No solution (a=0)' }`] }
}

function solveQuadratic(a: number, b: number, c: number): SolveResult {
  const disc = b * b - 4 * a * c
  const steps = [
    `ax² + bx + c = 0`,
    `${a}x² + ${b}x + ${c} = 0`,
    `Discriminant Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${disc}`,
    disc >= 0
      ? `x = (-b ± √Δ) / 2a = (${-b} ± √${disc}) / ${2 * a}`
      : `Δ < 0 → Complex roots: x = (${-b} ± i√${Math.abs(disc)}) / ${2 * a}`,
  ]
  let answers: string[]
  if (disc > 0) {
    const x1 = (-b + Math.sqrt(disc)) / (2 * a)
    const x2 = (-b - Math.sqrt(disc)) / (2 * a)
    answers = [`x₁ = ${x1.toFixed(8).replace(/\.?0+$/,'')}`, `x₂ = ${x2.toFixed(8).replace(/\.?0+$/,'')}`]
  } else if (disc === 0) {
    const x = -b / (2 * a)
    answers = [`x = ${x.toFixed(8).replace(/\.?0+$/,'')} (double root)`]
  } else {
    const re = -b / (2 * a)
    const im = Math.sqrt(-disc) / (2 * a)
    answers = [`x₁ = ${re.toFixed(4)} + ${im.toFixed(4)}i`, `x₂ = ${re.toFixed(4)} - ${im.toFixed(4)}i`]
  }
  return { steps, answers }
}

function solveSystem(a1:number,b1:number,c1:number, a2:number,b2:number,c2:number): SolveResult {
  // a1x + b1y = c1; a2x + b2y = c2
  const det = a1 * b2 - a2 * b1
  const steps = [
    `System: ${a1}x + ${b1}y = ${c1}`,
    `        ${a2}x + ${b2}y = ${c2}`,
    `Determinant D = ${a1}×${b2} - ${a2}×${b1} = ${det}`,
  ]
  if (Math.abs(det) < 1e-10) {
    return { steps: [...steps, 'D = 0 → No unique solution'], answers: ['No unique solution'] }
  }
  const x = (c1 * b2 - c2 * b1) / det
  const y = (a1 * c2 - a2 * c1) / det
  steps.push(`Dx = ${c1}×${b2} - ${c2}×${b1} = ${c1*b2-c2*b1}`)
  steps.push(`Dy = ${a1}×${c2} - ${a2}×${c1} = ${a1*c2-a2*c1}`)
  steps.push(`x = Dx/D = ${(c1*b2-c2*b1).toFixed(4)} / ${det.toFixed(4)}`)
  steps.push(`y = Dy/D = ${(a1*c2-a2*c1).toFixed(4)} / ${det.toFixed(4)}`)
  return { steps, answers: [`x = ${x.toFixed(8).replace(/\.?0+$/,'')}`, `y = ${y.toFixed(8).replace(/\.?0+$/,'')}`] }
}

function evaluateExpr(expr: string): SolveResult {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (math as any).evaluate(expr.replace(/π/g,'pi').replace(/×/g,'*').replace(/÷/g,'/'))
    // Try symbolic simplification
    const steps = [`Expression: ${expr}`, `Evaluated numerically:`]
    return { steps, answers: [String(result)] }
  } catch (e) {
    return { steps: ['Parse error'], answers: [String(e)] }
  }
}

export function EquationSolver() {
  const [type, setType] = useState<SolverType>('quadratic')
  const [result, setResult] = useState<SolveResult | null>(null)

  // Quadratic coefficients
  const [qa, setQa] = useState('1')
  const [qb, setQb] = useState('-5')
  const [qc, setQc] = useState('6')

  // Linear
  const [la, setLa] = useState('3')
  const [lb, setLb] = useState('-12')

  // System
  const [s1, setS1] = useState({ a:'2', b:'3', c:'8' })
  const [s2, setS2] = useState({ a:'1', b:'-1', c:'1' })

  // Expression
  const [exprInput, setExprInput] = useState('sin(pi/6) + cos(pi/3)')

  const solve = () => {
    if (type === 'quadratic') {
      setResult(solveQuadratic(Number(qa), Number(qb), Number(qc)))
    } else if (type === 'linear') {
      setResult(solveLinear(Number(la), Number(lb)))
    } else if (type === 'system') {
      setResult(solveSystem(Number(s1.a),Number(s1.b),Number(s1.c), Number(s2.a),Number(s2.b),Number(s2.c)))
    } else {
      setResult(evaluateExpr(exprInput))
    }
  }

  const TYPES: {key: SolverType; label: string}[] = [
    {key:'quadratic', label:'Quadratic ax²+bx+c=0'},
    {key:'linear',    label:'Linear ax+b=0'},
    {key:'system',    label:'2×2 System'},
    {key:'expression',label:'Evaluate Expression'},
  ]

  return (
    <div className="space-y-5">
      {/* Type tabs */}
      <div className="flex flex-wrap gap-2">
        {TYPES.map(t => (
          <button key={t.key} onClick={() => { setType(t.key); setResult(null) }}
            className={`text-xs rounded-lg px-3 py-1.5 border transition-all ${
              type===t.key ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}>{t.label}</button>
        ))}
      </div>

      {/* Inputs */}
      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        {type === 'quadratic' && (
          <>
            <p className="text-sm text-white/50 font-mono">ax² + bx + c = 0</p>
            <div className="grid grid-cols-3 gap-3">
              {[['a',qa,setQa],['b',qb,setQb],['c',qc,setQc]].map(([l,v,s]) => (
                <div key={String(l)}>
                  <label className="text-[10px] text-white/30 mb-1 block font-mono">{String(l)}</label>
                  <input type="number" value={String(v)} onChange={e=>(s as (v:string)=>void)(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 focus:border-violet-500/50 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none text-center" />
                </div>
              ))}
            </div>
            <p className="text-xs text-white/25 font-mono">
              = {qa}x² {Number(qb)>=0?'+':'−'} {Math.abs(Number(qb))}x {Number(qc)>=0?'+':'−'} {Math.abs(Number(qc))} = 0
            </p>
          </>
        )}
        {type === 'linear' && (
          <>
            <p className="text-sm text-white/50 font-mono">ax + b = 0</p>
            <div className="grid grid-cols-2 gap-3">
              {[['a',la,setLa],['b',lb,setLb]].map(([l,v,s]) => (
                <div key={String(l)}>
                  <label className="text-[10px] text-white/30 mb-1 block font-mono">{String(l)}</label>
                  <input type="number" value={String(v)} onChange={e=>(s as (v:string)=>void)(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 focus:border-violet-500/50 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none text-center" />
                </div>
              ))}
            </div>
          </>
        )}
        {type === 'system' && (
          <>
            <p className="text-sm text-white/50 font-mono">a₁x + b₁y = c₁  ;  a₂x + b₂y = c₂</p>
            <div className="space-y-3">
              {([{st:s1, set:setS1, label:'Eq 1'},{st:s2, set:setS2, label:'Eq 2'}] as const).map(({st,set,label}) => (
                <div key={label}>
                  <p className="text-[10px] text-white/30 mb-1.5 font-mono">{label}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['a','b','c'] as const).map(k => (
                      <input key={k} type="number" value={st[k]}
                        onChange={e=>set(prev=>({...prev,[k]:e.target.value}))}
                        placeholder={k}
                        className="bg-black/30 border border-white/10 focus:border-violet-500/50 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none text-center" />
                    ))}
                  </div>
                  <p className="text-[10px] text-white/25 font-mono mt-1">
                    {st.a}x {Number(st.b)>=0?'+':''}{st.b}y = {st.c}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
        {type === 'expression' && (
          <>
            <p className="text-sm text-white/50 font-mono">Evaluate any expression</p>
            <input value={exprInput} onChange={e=>setExprInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&solve()}
              className="w-full bg-black/30 border border-white/10 focus:border-violet-500/50 rounded-lg px-4 py-2.5 text-sm font-mono text-white focus:outline-none"
              placeholder="sin(pi/6) + cos(pi/3)" />
            <p className="text-[10px] text-white/20">Use: sin, cos, tan, ln, log, sqrt, pi, e, ^</p>
          </>
        )}

        <button onClick={solve}
          className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 py-2.5 text-sm font-semibold text-white transition-all">
          Solve →
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Step-by-step</p>
            <div className="space-y-2">
              {result.steps.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-violet-400/50 font-mono text-xs w-4 shrink-0 mt-0.5">{i+1}</span>
                  <p className="text-sm font-mono text-white/65">{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/5 pt-4">
            <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Answer</p>
            {result.answers.map((a, i) => (
              <div key={i} className="rounded-lg border border-violet-500/20 bg-violet-500/8 px-4 py-3 mb-2">
                <p className="text-base font-mono font-semibold text-violet-300">{a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
