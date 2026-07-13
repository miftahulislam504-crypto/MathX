'use client'
import { useState } from 'react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { PUZZLES, getPuzzleCategories } from '@/lib/data/puzzles'
import { PuzzleCard } from '@/components/puzzles/PuzzleCard'

export default function PuzzlesPage() {
  const { tt } = useLanguage()
  const [filter, setFilter] = useState<string>('All')
  const [cat, setCat] = useState<string>('All')

  const categories = ['All', ...getPuzzleCategories()]
  const diffs = ['All', 'Easy', 'Medium', 'Hard']

  const filtered = PUZZLES.filter((p) => {
    const matchDiff = filter === 'All' || p.difficulty === filter
    const matchCat = cat === 'All' || p.category === cat
    return matchDiff && matchCat
  })

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.puzzles.tag)}</p>
          <h1 className="text-4xl font-bold text-white mb-3">{tt(t.puzzles.title)}</h1>
          <p className="text-white/40">
            {PUZZLES.length} {tt(t.puzzles.subtitle)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-white/5">
          <div className="flex gap-1">
            {diffs.map((d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  filter === d ? 'bg-violet-600 border-violet-500 text-white' : 'border-white/8 text-white/40 hover:text-white/70'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  cat === c ? 'bg-white/10 border-white/20 text-white' : 'border-white/8 text-white/40 hover:text-white/70'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/25 font-mono mb-5">{filtered.length} puzzles</p>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <PuzzleCard key={p.id} puzzle={p} index={PUZZLES.indexOf(p)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/25">
            <p className="text-4xl mb-3">∅</p>
            <p>{tt(t.common.noResults)}</p>
          </div>
        )}
      </div>
    </main>
  )
}
