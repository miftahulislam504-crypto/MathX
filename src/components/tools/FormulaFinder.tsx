'use client'
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { FORMULAS, searchFormulas } from '@/lib/data/formulas'
import { FormulaCard } from '@/components/math/FormulaCard'

const SUGGESTED_SEARCHES = ['quadratic', 'area of circle', 'derivative', 'Pythagorean', 'compound interest', 'law of cosines']

export function FormulaFinder() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchFormulas(query)
  }, [query])

  return (
    <div className="space-y-6">
      <p className="text-xs text-white/40 leading-relaxed">
        Type what you&apos;re looking for — a topic, keyword, or concept — to instantly find matching formulas
        from the {FORMULAS.length}-formula library.
      </p>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search formulas..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-lime-500/50"
          autoFocus
        />
      </div>

      {!query.trim() && (
        <div>
          <p className="text-xs text-white/25 mb-3">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SEARCHES.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {query.trim() && (
        <>
          <p className="text-xs text-white/25 font-mono">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          {results.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map((f) => <FormulaCard key={f.id} formula={f} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-white/25">
              <p className="text-4xl mb-3">∅</p>
              <p className="text-sm">No formulas match &ldquo;{query}&rdquo; — try a different keyword.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
