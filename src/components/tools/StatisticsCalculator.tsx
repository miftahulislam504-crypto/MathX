'use client'
import { useState } from 'react'
import { BarChart3 } from 'lucide-react'

interface Stats {
  n: number
  mean: number
  median: number
  mode: number[]
  min: number
  max: number
  range: number
  populationVariance: number
  populationStdDev: number
  sampleVariance: number
  sampleStdDev: number
}

function computeStats(data: number[]): Stats {
  const n = data.length
  const mean = data.reduce((a, b) => a + b, 0) / n
  const sorted = [...data].sort((a, b) => a - b)
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[(n - 1) / 2]

  const freq: Record<number, number> = {}
  data.forEach((v) => { freq[v] = (freq[v] || 0) + 1 })
  const maxFreq = Math.max(...Object.values(freq))
  const mode = maxFreq > 1 ? Object.entries(freq).filter(([, c]) => c === maxFreq).map(([v]) => Number(v)) : []

  const min = sorted[0]
  const max = sorted[n - 1]
  const populationVariance = data.reduce((a, b) => a + (b - mean) ** 2, 0) / n
  const sampleVariance = n > 1 ? data.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1) : 0

  return {
    n, mean, median, mode, min, max, range: max - min,
    populationVariance, populationStdDev: Math.sqrt(populationVariance),
    sampleVariance, sampleStdDev: Math.sqrt(sampleVariance),
  }
}

export function StatisticsCalculator() {
  const [input, setInput] = useState('2, 4, 4, 4, 5, 5, 7, 9')
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  const compute = () => {
    setError('')
    const parsed = input
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number)

    if (parsed.some((v) => isNaN(v))) {
      setError('Please enter only numbers, separated by commas or spaces.')
      setStats(null)
      return
    }
    if (parsed.length === 0) {
      setError('Enter at least one number.')
      setStats(null)
      return
    }
    setStats(computeStats(parsed))
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-white/40 leading-relaxed">
        Enter a list of numbers (comma or space separated) to compute descriptive statistics.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={2}
        placeholder="e.g. 2, 4, 4, 4, 5, 5, 7, 9"
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-sky-500/50 resize-none"
      />

      <button
        onClick={compute}
        className="w-full rounded-lg bg-sky-600 hover:bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
      >
        <BarChart3 className="w-4 h-4" /> Compute Statistics
      </button>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-500/8 border border-rose-500/20 rounded-lg px-4 py-2">{error}</p>
      )}

      {stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Count (n)', val: stats.n },
              { label: 'Mean', val: stats.mean.toFixed(4) },
              { label: 'Median', val: stats.median.toFixed(4) },
              { label: 'Mode', val: stats.mode.length > 0 ? stats.mode.join(', ') : 'None' },
              { label: 'Min', val: stats.min },
              { label: 'Max', val: stats.max },
              { label: 'Range', val: stats.range },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-black/20 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{s.label}</p>
                <p className="text-sm font-mono text-white/80">{s.val}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-sky-400/70 mb-3 text-center">Population (÷n)</p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-[10px] text-white/30">Variance</p>
                  <p className="text-sm font-mono text-white/70">{stats.populationVariance.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30">Std Dev</p>
                  <p className="text-sm font-mono text-white/70">{stats.populationStdDev.toFixed(4)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-3 text-center">Sample (÷n-1)</p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-[10px] text-white/30">Variance</p>
                  <p className="text-sm font-mono text-white/70">{stats.sampleVariance.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30">Std Dev</p>
                  <p className="text-sm font-mono text-white/70">{stats.sampleStdDev.toFixed(4)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
