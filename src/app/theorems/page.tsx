'use client'
import { useState, useMemo } from 'react'
import { TheoremCard } from '@/components/math/TheoremCard'
import { SearchBar } from '@/components/shared/SearchBar'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { THEOREMS, getTheoremsByBranch, searchTheorems } from '@/lib/data/theorems'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'

export default function TheoremsPage() {
  const [search, setSearch] = useState('')
  const [activeBranch, setActiveBranch] = useState<string | 'ALL'>('ALL')
  const { tt, lang } = useLanguage()

  const filtered = useMemo(() => {
    if (search.trim()) return searchTheorems(search)
    if (activeBranch === 'ALL') return THEOREMS
    return getTheoremsByBranch(activeBranch)
  }, [search, activeBranch])

  const branchesWithTheorems = MATH_BRANCHES.filter((b) => THEOREMS.some((th) => th.branchId === b.id))

  return (
    <>
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <p className="text-cyan-400 text-sm font-mono mb-2">{tt(t.theorems.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-3">{tt(t.theorems.title)}</h1>
            <p className="text-white/40">
              {THEOREMS.length} {tt(t.theorems.subtitle)} {branchesWithTheorems.length} {tt(t.theorems.subtitleEnd)}
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <SearchBar
              placeholder={tt(t.theorems.searchPlaceholder)}
              onSearch={setSearch}
              className="sm:w-80"
            />
          </div>

          {/* Branch filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-white/5">
            <button
              onClick={() => setActiveBranch('ALL')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                activeBranch === 'ALL'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'border-white/8 text-white/40 hover:text-white/70'
              }`}
            >
              {tt(t.problems.all)}
            </button>
            {branchesWithTheorems.map((b) => (
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
                <span>{lang === 'bn' && b.nameBn ? b.nameBn : b.name}</span>
              </button>
            ))}
          </div>

          {/* Results */}
          <p className="text-xs text-white/25 mb-5 font-mono">
            {filtered.length} {tt(t.theorems.title).toLowerCase()}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((th) => (
              <TheoremCard key={th.id} theorem={th} />
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
    </>
  )
}
