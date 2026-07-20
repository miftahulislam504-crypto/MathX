'use client'
import { useMemo, useState } from 'react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

function fmt(n: number, d = 4): string {
  if (!Number.isFinite(n)) return '—'
  return (Math.round(n * 10 ** d) / 10 ** d).toString()
}
function pct(n: number, d = 2): string {
  if (!Number.isFinite(n)) return '—'
  return `${(n * 100).toFixed(d)}%`
}

// ── Natural-frequency grid: shows 1000 people split by disease status, then by test result.
function FrequencyGrid({ prior, sensitivity, specificity }: { prior: number; sensitivity: number; specificity: number }) {
  const total = 1000
  const sick = Math.round(total * prior)
  const healthy = total - sick

  const truePos = Math.round(sick * sensitivity)
  const falseNeg = sick - truePos
  const trueNeg = Math.round(healthy * specificity)
  const falsePos = healthy - trueNeg

  const totalPos = truePos + falsePos
  const ppv = totalPos > 0 ? truePos / totalPos : 0

  const SQ = 260
  const cols = 25
  const rows = Math.ceil(total / cols)
  const cellSize = SQ / cols

  // build an array of 1000 cell classifications, sick people first
  const cells: ('tp' | 'fn' | 'tn' | 'fp')[] = [
    ...Array(truePos).fill('tp'),
    ...Array(falseNeg).fill('fn'),
    ...Array(trueNeg).fill('tn'),
    ...Array(falsePos).fill('fp'),
  ]

  const colorMap: Record<string, string> = {
    tp: '#22d3ee', // true positive — sick, tests positive
    fn: '#0e7490', // false negative — sick, tests negative (darker cyan)
    tn: '#27272a', // true negative — healthy, tests negative (neutral)
    fp: '#fb7185', // false positive — healthy, tests positive
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/8 bg-[#09090b] p-3 flex justify-center">
        <svg width={SQ} height={rows * cellSize} viewBox={`0 0 ${SQ} ${rows * cellSize}`}>
          {cells.map((c, i) => {
            const cx = (i % cols) * cellSize
            const cy = Math.floor(i / cols) * cellSize
            return <rect key={i} x={cx + 0.5} y={cy + 0.5} width={cellSize - 1} height={cellSize - 1} fill={colorMap[c]} rx={1} />
          })}
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: colorMap.tp }} /><span className="text-white/50">True positive: {truePos}</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: colorMap.fp }} /><span className="text-white/50">False positive: {falsePos}</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: colorMap.fn }} /><span className="text-white/50">False negative: {falseNeg}</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: colorMap.tn }} /><span className="text-white/50">True negative: {trueNeg}</span></div>
      </div>
      <p className="text-xs text-white/50 leading-relaxed">
        Out of {total} people, {sick} actually have the condition. Testing everyone gives{' '}
        <span className="text-white/80 font-mono">{totalPos}</span> positive results, but only{' '}
        <span className="text-cyan-300 font-mono">{truePos}</span> of those people are actually sick — so a positive
        result means roughly a <span className="text-cyan-300 font-mono">{pct(ppv)}</span> chance of truly having
        the condition, even though the test itself is quite accurate.
      </p>
    </div>
  )
}

function MedicalTestScenario() {
  const [prior, setPrior] = useState(0.01)
  const [sensitivity, setSensitivity] = useState(0.95)
  const [specificity, setSpecificity] = useState(0.9)

  const pBPos = prior * sensitivity + (1 - prior) * (1 - specificity)
  const posterior = pBPos > 0 ? (prior * sensitivity) / pBPos : 0

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        A disease affects a small fraction of the population. A test correctly flags sick people most of the
        time (sensitivity) and correctly clears healthy people most of the time (specificity) — but even a
        &quot;95% accurate&quot; test can be surprisingly unreliable when the disease itself is rare. This is the
        single most common source of Bayesian confusion.
      </p>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1">
            <span>P(Disease) — how rare is it?</span>
            <span className="font-mono text-fuchsia-300">{pct(prior)}</span>
          </div>
          <input type="range" min={0.001} max={0.3} step={0.001} value={prior} onChange={(e) => setPrior(Number(e.target.value))} className="w-full accent-fuchsia-500" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1">
            <span>Sensitivity — P(Test + | Sick)</span>
            <span className="font-mono text-cyan-300">{pct(sensitivity)}</span>
          </div>
          <input type="range" min={0.5} max={0.999} step={0.001} value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1">
            <span>Specificity — P(Test − | Healthy)</span>
            <span className="font-mono text-emerald-300">{pct(specificity)}</span>
          </div>
          <input type="range" min={0.5} max={0.999} step={0.001} value={specificity} onChange={(e) => setSpecificity(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
      </div>

      <FrequencyGrid prior={prior} sensitivity={sensitivity} specificity={specificity} />

      <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-5 text-center">
        <p className="text-[10px] uppercase tracking-wider text-fuchsia-400/70 mb-2">P(Sick | Test Positive)</p>
        <p className="text-3xl font-mono font-bold text-fuchsia-300">{pct(posterior)}</p>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
        <LatexRenderer
          latex={`P(D|+) = \\dfrac{P(+|D)\\,P(D)}{P(+|D)\\,P(D) + P(+|\\lnot D)\\,P(\\lnot D)} = \\dfrac{(${fmt(sensitivity, 3)})(${fmt(prior, 3)})}{${fmt(pBPos, 4)}} = ${fmt(posterior, 4)}`}
          display
        />
      </div>
    </div>
  )
}

function GeneralCalculator() {
  const [pA, setPA] = useState(0.3)
  const [pBGivenA, setPBGivenA] = useState(0.7)
  const [pBGivenNotA, setPBGivenNotA] = useState(0.2)

  const pB = pA * pBGivenA + (1 - pA) * pBGivenNotA
  const posterior = pB > 0 ? (pA * pBGivenA) / pB : 0

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Enter any prior P(A), and how likely evidence B is under A versus under ¬A. Bayes&apos; theorem updates your
        belief in A after observing B.
      </p>

      <div className="space-y-3">
        {[
          { label: 'P(A) — prior belief', val: pA, set: setPA, color: 'accent-fuchsia-500' },
          { label: 'P(B|A) — likelihood if A is true', val: pBGivenA, set: setPBGivenA, color: 'accent-cyan-500' },
          { label: 'P(B|¬A) — likelihood if A is false', val: pBGivenNotA, set: setPBGivenNotA, color: 'accent-rose-400' },
        ].map(({ label, val, set, color }) => (
          <div key={label}>
            <div className="flex justify-between text-[10px] text-white/30 mb-1">
              <span>{label}</span>
              <span className="font-mono text-white/70">{pct(val)}</span>
            </div>
            <input type="range" min={0.001} max={0.999} step={0.001} value={val} onChange={(e) => set(Number(e.target.value))} className={`w-full ${color}`} />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-5 text-center">
        <p className="text-[10px] uppercase tracking-wider text-fuchsia-400/70 mb-2">P(A | B) — Posterior</p>
        <p className="text-3xl font-mono font-bold text-fuchsia-300">{pct(posterior)}</p>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
        <LatexRenderer
          latex={`P(A|B) = \\dfrac{P(B|A)P(A)}{P(B)} = \\dfrac{(${fmt(pBGivenA, 3)})(${fmt(pA, 3)})}{${fmt(pB, 4)}} = ${fmt(posterior, 4)}`}
          display
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">P(B) — total probability</p>
          <p className="text-sm font-mono text-white/70">{fmt(pB, 4)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Update factor</p>
          <p className="text-sm font-mono text-white/70">{fmt(posterior / pA, 3)}×</p>
        </div>
      </div>
    </div>
  )
}

export function BayesianProbability() {
  const [mode, setMode] = useState<'scenario' | 'general'>('scenario')

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('scenario')}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-xs transition-all ${mode === 'scenario' ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300' : 'border-white/8 text-white/40'}`}
        >
          Medical Test Scenario
        </button>
        <button
          onClick={() => setMode('general')}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-xs transition-all ${mode === 'general' ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300' : 'border-white/8 text-white/40'}`}
        >
          General Calculator
        </button>
      </div>
      {mode === 'scenario' ? <MedicalTestScenario /> : <GeneralCalculator />}
    </div>
  )
}
