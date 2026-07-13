'use client'
import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Puzzle } from '@/lib/data/puzzles'

const DIFF_COLOR: Record<string, string> = {
  Easy:   'text-emerald-400 border-emerald-500/20 bg-emerald-500/8',
  Medium: 'text-amber-400 border-amber-500/20 bg-amber-500/8',
  Hard:   'text-rose-400 border-rose-500/20 bg-rose-500/8',
}

export function PuzzleCard({ puzzle, index }: { puzzle: Puzzle; index: number }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setReveal] = useState(false)
  const isCorrect = selected === puzzle.answer

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-violet-400/60 font-mono text-xs">#{index + 1}</span>
          <h3 className="text-sm font-bold text-white mt-0.5">{puzzle.title}</h3>
          <span className="text-[10px] text-white/25">{puzzle.category}</span>
        </div>
        <span className={`text-[10px] font-medium border rounded-full px-2.5 py-0.5 shrink-0 ${DIFF_COLOR[puzzle.difficulty]}`}>
          {puzzle.difficulty}
        </span>
      </div>

      <p className="text-sm text-white/70 leading-relaxed mb-4">{puzzle.question}</p>

      <div className="space-y-2 mb-4">
        {puzzle.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setReveal(false) }}
            disabled={selected !== null}
            className={`w-full text-left text-sm rounded-lg px-4 py-2.5 border transition-all ${
              selected === null
                ? 'border-white/8 text-white/60 hover:border-white/20 hover:bg-white/5'
                : i === puzzle.answer
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : i === selected
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                : 'border-white/5 text-white/25'
            }`}
          >
            <span className="font-mono text-xs mr-3 opacity-60">{['A', 'B', 'C', 'D'][i]}</span>
            {opt}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className={`rounded-lg p-3 text-sm mb-3 ${isCorrect ? 'bg-emerald-500/8 border border-emerald-500/20' : 'bg-rose-500/8 border border-rose-500/20'}`}>
          <p className={`font-semibold mb-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isCorrect ? (
              <span className="inline-flex items-center gap-1"><Check className="w-4 h-4" /> Correct!</span>
            ) : (
              <span className="inline-flex items-center gap-1"><X className="w-4 h-4" /> Not quite</span>
            )}
          </p>
        </div>
      )}

      {selected !== null && (
        <button onClick={() => setReveal((r) => !r)} className="text-xs text-violet-400/70 hover:text-violet-400 transition-colors">
          {revealed ? '▾ Hide explanation' : '▸ Show explanation'}
        </button>
      )}

      {revealed && (
        <div className="mt-3 rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3">
          <p className="text-xs text-violet-400/70 uppercase tracking-wider mb-1">Explanation</p>
          <p className="text-sm text-white/60 leading-relaxed">{puzzle.explanation}</p>
        </div>
      )}
    </div>
  )
}
