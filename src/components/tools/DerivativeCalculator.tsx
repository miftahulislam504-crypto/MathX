'use client'
import { useState } from 'react'
import { create, all } from 'mathjs'
import { AlertCircle } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

const math = create(all)

const EXAMPLES = ['x^3 + 2x', 'sin(x) * cos(x)', 'ln(x)', 'e^x / x', 'sqrt(x^2 + 1)', 'tan(x)']

// mathjs's derivative() recognizes log(x) as natural log, not ln(x) — but ln
// is the notation most students actually type, so normalize before passing
// to the engine.
function normalizeInput(expr: string): string {
  return expr.replace(/\bln\s*\(/gi, 'log(')
}

function computeSecondDerivative(expr: string, variable: string): string | null {
  try {
    const first = math.derivative(expr, variable).toString()
    const second = math.derivative(first, variable).toString()
    return second
  } catch {
    return null
  }
}

export function DerivativeCalculator() {
  const [input, setInput] = useState('x^3 + 2x')
  const [variable, setVariable] = useState('x')
  const [result, setResult] = useState<{ first: string; second: string | null } | null>(null)
  const [error, setError] = useState('')
  const [evalPoint, setEvalPoint] = useState('2')
  const [evalResult, setEvalResult] = useState<number | null>(null)

  const compute = () => {
    setError('')
    setResult(null)
    setEvalResult(null)
    const normalized = normalizeInput(input)
    try {
      const first = math.derivative(normalized, variable).toString()
      const second = computeSecondDerivative(normalized, variable)
      setResult({ first, second })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not differentiate this expression.')
    }
  }

  const evaluateAtPoint = () => {
    if (!result) return
    try {
      const point = parseFloat(evalPoint)
      if (isNaN(point)) return
      const compiled = math.compile(result.first)
      const val = compiled.evaluate({ [variable]: point })
      setEvalResult(val)
    } catch {
      setEvalResult(null)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-white/40 leading-relaxed">
        Enter a function to compute its exact symbolic derivative. Supports polynomials, trig, exponential,
        logarithmic, and root functions.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && compute()}
          placeholder="e.g. x^3 + 2x"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-violet-500/50"
        />
        <input
          type="text"
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
          className="w-16 bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-center text-white font-mono focus:outline-none focus:border-violet-500/50"
        />
        <button
          onClick={compute}
          className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-all"
        >
          Differentiate
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setInput(ex)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 transition-all font-mono"
          >
            {ex}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/25 bg-rose-500/5 px-4 py-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-300">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
            <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-3">
              First Derivative — d/d{variable}
            </p>
            <LatexRenderer latex={`\\frac{d}{d${variable}}\\left(${input}\\right) = ${result.first}`} display />
          </div>

          {result.second && (
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5 text-center">
              <p className="text-[10px] uppercase tracking-wider text-white/30 mb-3">Second Derivative</p>
              <LatexRenderer latex={`\\frac{d^2}{d${variable}^2} = ${result.second}`} display />
            </div>
          )}

          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
            <p className="text-xs text-white/40 mb-3">Evaluate the derivative at a point</p>
            <div className="flex gap-2">
              <span className="flex items-center px-3 text-sm text-white/40 font-mono">{variable} =</span>
              <input
                type="number"
                value={evalPoint}
                onChange={(e) => setEvalPoint(e.target.value)}
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-violet-500/50"
              />
              <button
                onClick={evaluateAtPoint}
                className="rounded-lg bg-white/10 hover:bg-white/15 px-4 py-2 text-sm text-white/80 transition-all"
              >
                Evaluate
              </button>
            </div>
            {evalResult !== null && (
              <p className="text-center mt-3 text-lg font-mono text-cyan-400">
                f&apos;({evalPoint}) = {evalResult.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
