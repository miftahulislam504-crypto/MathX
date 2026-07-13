'use client'
import { useState } from 'react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type Mode = 'combinatorics' | 'binomial'

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}
function nCr(n: number, r: number): number {
  if (r > n || r < 0) return 0
  return factorial(n) / (factorial(r) * factorial(n - r))
}
function nPr(n: number, r: number): number {
  if (r > n || r < 0) return 0
  return factorial(n) / factorial(n - r)
}
function binomialProb(n: number, k: number, p: number): number {
  return nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)
}

function CombinatoricsCalculator() {
  const [n, setN] = useState(10)
  const [r, setR] = useState(3)

  const combinations = nCr(n, r)
  const permutations = nPr(n, r)

  return (
    <div className="space-y-6">
      <p className="text-xs text-white/40 leading-relaxed">
        Combinations count selections where order doesn&apos;t matter; permutations count arrangements where it
        does.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <label className="text-xs text-white/40 mb-1.5 block">n (total items)</label>
          <input type="number" value={n} onChange={(e) => setN(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-center text-white font-mono focus:outline-none focus:border-fuchsia-500/50" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <label className="text-xs text-white/40 mb-1.5 block">r (chosen)</label>
          <input type="number" value={r} onChange={(e) => setR(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-center text-white font-mono focus:outline-none focus:border-fuchsia-500/50" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-5 text-center">
          <p className="text-[10px] uppercase tracking-wider text-fuchsia-400/70 mb-3">Combinations nCr</p>
          <LatexRenderer latex={`C(${n},${r}) = ${isFinite(combinations) ? combinations : '—'}`} display />
        </div>
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 text-center">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-3">Permutations nPr</p>
          <LatexRenderer latex={`P(${n},${r}) = ${isFinite(permutations) ? permutations : '—'}`} display />
        </div>
      </div>
    </div>
  )
}

function BinomialCalculator() {
  const [n, setN] = useState(10)
  const [k, setK] = useState(3)
  const [p, setP] = useState(0.5)

  const probExact = binomialProb(n, k, p)
  let probAtMost = 0
  for (let i = 0; i <= k; i++) probAtMost += binomialProb(n, i, p)
  const probAtLeast = 1 - (probAtMost - binomialProb(n, k, p))
  const mean = n * p
  const variance = n * p * (1 - p)

  return (
    <div className="space-y-6">
      <p className="text-xs text-white/40 leading-relaxed">
        The binomial distribution models the number of successes in n independent trials, each with success
        probability p.
      </p>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <label className="text-xs text-white/40 mb-1.5 block">n (trials)</label>
          <input type="number" value={n} onChange={(e) => setN(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-2 text-center text-white font-mono focus:outline-none focus:border-fuchsia-500/50" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <label className="text-xs text-white/40 mb-1.5 block">k (successes)</label>
          <input type="number" value={k} onChange={(e) => setK(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-2 text-center text-white font-mono focus:outline-none focus:border-fuchsia-500/50" />
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
          <label className="text-xs text-white/40 mb-1.5 block">p (prob.)</label>
          <input type="number" step="0.01" min="0" max="1" value={p} onChange={(e) => setP(Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)))} className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-2 text-center text-white font-mono focus:outline-none focus:border-fuchsia-500/50" />
        </div>
      </div>

      <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-5 text-center">
        <p className="text-[10px] uppercase tracking-wider text-fuchsia-400/70 mb-3">P(X = {k})</p>
        <LatexRenderer latex={`P(X=${k}) = \\binom{${n}}{${k}} (${p})^{${k}} (1-${p})^{${n - k}} = ${probExact.toFixed(6)}`} display />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">P(X ≤ {k})</p>
          <p className="text-lg font-mono text-cyan-400">{probAtMost.toFixed(4)}</p>
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">P(X ≥ {k})</p>
          <p className="text-lg font-mono text-emerald-400">{probAtLeast.toFixed(4)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Mean (μ = np)</p>
          <p className="text-lg font-mono text-white/70">{mean.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Variance (np(1-p))</p>
          <p className="text-lg font-mono text-white/70">{variance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

export function ProbabilityCalculator() {
  const [mode, setMode] = useState<Mode>('combinatorics')

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('combinatorics')}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-xs transition-all ${mode === 'combinatorics' ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300' : 'border-white/8 text-white/40'}`}
        >
          Combinations & Permutations
        </button>
        <button
          onClick={() => setMode('binomial')}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-xs transition-all ${mode === 'binomial' ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300' : 'border-white/8 text-white/40'}`}
        >
          Binomial Distribution
        </button>
      </div>
      {mode === 'combinatorics' ? <CombinatoricsCalculator /> : <BinomialCalculator />}
    </div>
  )
}
