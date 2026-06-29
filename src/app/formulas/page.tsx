'use client'
import { useState, useMemo } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FormulaCard } from '@/components/math/FormulaCard'
import { SearchBar } from '@/components/shared/SearchBar'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { FORMULAS, getFormulasByBranch, searchFormulas } from '@/lib/data/formulas'

export default function FormulasPage() {
  const [search, setSearch] = useState('')
  const [activeBranch, setActiveBranch] = useState<string | 'ALL'>('ALL')

  const filtered = useMemo(() => {
    if (search.trim()) return searchFormulas(search)
    if (activeBranch === 'ALL') return FORMULAS
    return getFormulasByBranch(activeBranch)
  }, [search, activeBranch])

  // Group by branch for ALL view
  const grouped = useMemo(() => {
    if (search || activeBranch !== 'ALL') return null
    const map: Record<string, typeof FORMULAS> = {}
    FORMULAS.forEach((f) => {
      if (!map[f.branchId]) map[f.branchId] = []
      map[f.branchId].push(f)
    })
    return map
  }, [search, activeBranch])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <p className="text-violet-400 text-sm font-mono mb-2">// Formula Library</p>
            <h1 className="text-4xl font-bold text-white mb-3">Formula Library</h1>
            <p className="text-white/40">
              {FORMULAS.length} formulas across {MATH_BRANCHES.length} branches — click any card to copy LaTeX
            </p>
          </div>

          {/* Search + Branch filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <SearchBar
              placeholder="Search formulas, topics, tags..."
              onSearch={setSearch}
              className="sm:w-80"
            />
          </div>

          {/* Branch tabs */}
          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-white/5">
            <button
              onClick={() => setActiveBranch('ALL')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                activeBranch === 'ALL'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'border-white/8 text-white/40 hover:text-white/70'
              }`}
            >
              All
            </button>
            {MATH_BRANCHES.filter((b) => FORMULAS.some((f) => f.branchId === b.id)).map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBranch(b.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                  activeBranch === b.id
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'border-white/8 text-white/40 hover:text-white/70'
                }`}
              >
                <span>{b.icon}</span>
                <span>{b.name}</span>
              </button>
            ))}
          </div>

          {/* Results */}
          {search || activeBranch !== 'ALL' ? (
            <>
              <p className="text-xs text-white/25 mb-5 font-mono">
                {filtered.length} formula{filtered.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((f) => (
                  <FormulaCard key={f.id} formula={f} />
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-12">
              {MATH_BRANCHES.filter((b) => FORMULAS.some((f) => f.branchId === b.id)).map((branch) => {
                const bFormulas = grouped?.[branch.id] ?? []
                if (!bFormulas.length) return null
                return (
                  <section key={branch.id}>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-2xl">{branch.icon}</span>
                      <h2 className="text-lg font-semibold text-white">{branch.name}</h2>
                      <span className="text-white/20 text-xs font-mono">
                        {bFormulas.length} formulas
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bFormulas.map((f) => (
                        <FormulaCard key={f.id} formula={f} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-white/25">
              <p className="text-4xl mb-3">∅</p>
              <p>No formulas match your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
