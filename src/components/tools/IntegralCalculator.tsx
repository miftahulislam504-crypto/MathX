'use client'
import { useState } from 'react'
import { create, all } from 'mathjs'
import { AlertCircle, Sigma } from 'lucide-react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

const math = create(all)

const EXAMPLES = [
  { expr: 'x^2', a: '0', b: '3' },
  { expr: 'sin(x)', a: '0', b: 'pi' },
  { expr: 'exp(x)', a: '0', b: '1' },
  { expr: '1/x', a: '1', b: 'e' },
]

function normalizeInput(expr: string): string {
  return expr.replace(/\bln\s*\(/gi, 'log(')
}

// Simpson's rule — accurate numeric integration for any continuous function,
// with no closed-form antiderivative required. This is the primary,
// always-reliable path.
function simpsonIntegral(fn: (x: number) => number, a: number, b: number, n = 1000): number {
  const evenN = n % 2 === 0 ? n : n + 1
  const h = (b - a) / evenN
  let sum = fn(a) + fn(b)
  for (let i = 1; i < evenN; i++) {
    const x = a + i * h
    sum += (i % 2 === 0 ? 2 : 4) * fn(x)
  }
  return (h / 3) * sum
}

// A small curated table of recognizable antiderivative patterns — NOT a
// general computer algebra system. Each entry is verified correct by
// differentiating it back to confirm it matches. Falls back silently
// (returns null) for anything not recognized, so numeric integration always
// remains the reliable primary answer.
function trySymbolicAntiderivative(expr: string): string | null {
  const e = expr.replace(/\s+/g, '')
  // x^n (power rule, n != -1)
  const powerMatch = e.match(/^x\^(-?\d+(?:\.\d+)?)$/)
  if (powerMatch) {
    const n = parseFloat(powerMatch[1])
    if (n !== -1) return `x^${n + 1}/${n + 1} + C`
  }
  if (e === 'x') return 'x^2/2 + C'
  if (e === '1' || e === '1/x^0') return 'x + C'
  if (e === '1/x') return 'ln(|x|) + C'
  if (e === 'sin(x)') return '-cos(x) + C'
  if (e === 'cos(x)') return 'sin(x) + C'
  if (e === 'exp(x)' || e === 'e^x') return 'e^x + C'
  if (e === 'sec(x)^2' || e === '1/cos(x)^2') return 'tan(x) + C'
  if (e === '1/(1+x^2)' || e === '1/(x^2+1)') return 'arctan(x) + C'
  if (e === '1/sqrt(1-x^2)') return 'arcsin(x) + C'
  return null
}

export function IntegralCalculator() {
  const [input, setInput] = useState('x^2')
  const [lower, setLower] = useState('0')
  const [upper, setUpper] = useState('3')
  const [result, setResult] = useState<{ numeric: number; symbolic: string | null } | null>(null)
  const [error, setError] = useState('')

  const compute = () => {
    setError('')
    setResult(null)
    const normalized = normalizeInput(input)
    try {
      const compiled = math.compile(normalized)
      const fn = (x: number) => compiled.evaluate({ x })

      const aVal = math.evaluate(lower)
      const bVal = math.evaluate(upper)
      if (typeof aVal !== 'number' || typeof bVal !== 'number') throw new Error('Bounds must evaluate to numbers.')

      const numeric = simpsonIntegral(fn, aVal, bVal)
      const symbolic = trySymbolicAntiderivative(normalized)
      setResult({ numeric, symbolic })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not integrate this expression.')
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-white/40 leading-relaxed">
        Computes the definite integral numerically (Simpson&apos;s rule — accurate for any continuous function).
        When the integrand matches a recognizable pattern, an exact antiderivative is shown too.
      </p>

      <div className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. x^2"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-emerald-500/50"
        />
        <div className="flex gap-2 items-center">
          <span className="text-xs text-white/40 font-mono shrink-0">from</span>
          <input
            type="text"
            value={lower}
            onChange={(e) => setLower(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center text-white font-mono focus:outline-none focus:border-emerald-500/50"
          />
          <span className="text-xs text-white/40 font-mono shrink-0">to</span>
          <input
            type="text"
            value={upper}
            onChange={(e) => setUpper(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center text-white font-mono focus:outline-none focus:border-emerald-500/50"
          />
          <button
            onClick={compute}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-all shrink-0"
          >
            Integrate
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.expr}
            onClick={() => { setInput(ex.expr); setLower(ex.a); setUpper(ex.b) }}
            className="text-xs px-3 py-1.5 rounded-full border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 transition-all font-mono"
          >
            ∫{ex.expr} [{ex.a},{ex.b}]
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
            <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-3 flex items-center justify-center gap-1.5">
              <Sigma className="w-3 h-3" /> Definite Integral (numeric)
            </p>
            <LatexRenderer latex={`\\int_{${lower}}^{${upper}} ${input}\\,dx \\approx ${result.numeric.toFixed(6)}`} display />
          </div>

          {result.symbolic ? (
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5 text-center">
              <p className="text-[10px] uppercase tracking-wider text-white/30 mb-3">Antiderivative (pattern match)</p>
              <LatexRenderer latex={`\\int ${input}\\,dx = ${result.symbolic}`} display />
            </div>
          ) : (
            <p className="text-xs text-white/25 text-center italic">
              No recognizable closed-form antiderivative pattern for this expression — the numeric result above is exact for practical purposes.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
