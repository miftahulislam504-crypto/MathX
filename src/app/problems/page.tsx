'use client'
import { useState, useMemo } from 'react'
import { SearchBar } from '@/components/shared/SearchBar'
import { PROBLEMS, searchProblems, Difficulty, ProblemCategory, Problem } from '@/lib/data/problems'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { Trophy } from 'lucide-react'

function ProblemCard({ problem }: { problem: Problem }) {
  const [showHint, setShowHint]   = useState(false)
  const [showSol, setShowSol]     = useState(false)
  const { tt } = useLanguage()

  const DIFF_META: Record<Difficulty, { label:string; color:string; bg:string }> = {
    BEGINNER:     { label:tt(t.problems.beginner),     color:'text-emerald-400', bg:'bg-emerald-500/8 border-emerald-500/20' },
    INTERMEDIATE: { label:tt(t.problems.intermediate), color:'text-blue-400',    bg:'bg-blue-500/8 border-blue-500/20' },
    ADVANCED:     { label:tt(t.problems.advanced),     color:'text-amber-400',   bg:'bg-amber-500/8 border-amber-500/20' },
    OLYMPIAD:     { label:tt(t.problems.olympiad),     color:'text-rose-400',    bg:'bg-rose-500/8 border-rose-500/20' },
  }
  const meta = DIFF_META[problem.difficulty]

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden hover:border-white/12 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white/90 mb-1">{problem.title}</h3>
          {problem.source && (
            <span className="text-[10px] text-white/25 font-mono">{problem.source}</span>
          )}
        </div>
        <span className={`shrink-0 text-[10px] font-medium border rounded-full px-2.5 py-0.5 ${meta.bg} ${meta.color}`}>
          {meta.label}
        </span>
      </div>

      {/* Statement */}
      <div className="px-5 pb-3">
        <p className="text-sm text-white/65 leading-relaxed">{problem.statement}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 px-5 pb-3">
        {problem.tags.map(t => (
          <span key={t} className="text-[10px] text-violet-400/60 bg-violet-500/8 border border-violet-500/15 rounded-full px-2 py-0.5">
            {t}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 pb-4">
        <button onClick={() => setShowHint(h => !h)}
          className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors">
          {showHint ? tt(t.common.hideHint) : tt(t.common.showHint)}
        </button>
        <button onClick={() => setShowSol(s => !s)}
          className="text-xs text-violet-400/70 hover:text-violet-400 transition-colors">
          {showSol ? tt(t.common.hideSolution) : tt(t.common.showSolution)}
        </button>
      </div>

      {showHint && (
        <div className="mx-5 mb-3 rounded-lg border border-amber-500/15 bg-amber-500/5 px-4 py-3">
          <p className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">{tt(t.common.hint)}</p>
          <p className="text-sm text-amber-100/70 leading-relaxed">{problem.hint}</p>
        </div>
      )}
      {showSol && (
        <div className="mx-5 mb-4 rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3">
          <p className="text-[10px] text-violet-400/60 uppercase tracking-wider mb-1">{tt(t.common.solution)}</p>
          <p className="text-sm text-violet-100/80 leading-relaxed">{problem.solution}</p>
        </div>
      )}
    </div>
  )
}

export default function ProblemsPage() {
  const [search, setSearch]   = useState('')
  const [diff, setDiff]       = useState<Difficulty | 'ALL'>('ALL')
  const [cat, setCat]         = useState<ProblemCategory | 'all'>('all')
  const [sortBy, setSortBy]   = useState<'default'|'difficulty'>('default')
  const { tt } = useLanguage()

  const DIFF_META: Record<Difficulty, { label:string; color:string; bg:string }> = {
    BEGINNER:     { label:tt(t.problems.beginner),     color:'text-emerald-400', bg:'bg-emerald-500/8 border-emerald-500/20' },
    INTERMEDIATE: { label:tt(t.problems.intermediate), color:'text-blue-400',    bg:'bg-blue-500/8 border-blue-500/20' },
    ADVANCED:     { label:tt(t.problems.advanced),     color:'text-amber-400',   bg:'bg-amber-500/8 border-amber-500/20' },
    OLYMPIAD:     { label:tt(t.problems.olympiad),     color:'text-rose-400',    bg:'bg-rose-500/8 border-rose-500/20' },
  }

  const CATS: { key: ProblemCategory | 'all'; label: string; icon: string }[] = [
    { key:'all',          label:tt(t.problems.all),           icon:'∑' },
    { key:'algebra',      label:tt(t.problems.algebra),       icon:'x' },
    { key:'geometry',     label:tt(t.problems.geometry),      icon:'△' },
    { key:'calculus',     label:tt(t.problems.calculus),      icon:'∫' },
    { key:'number-theory',label:tt(t.problems.numberTheory),  icon:'#' },
    { key:'combinatorics',label:tt(t.problems.combinatorics), icon:'∏' },
    { key:'probability',  label:tt(t.problems.probability),   icon:'Ω' },
    { key:'olympiad',     label:tt(t.problems.olympiadCat),   icon:'★' },
    { key:'proof',        label:tt(t.problems.proofCat),      icon:'∴' },
    { key:'research',     label:tt(t.problems.researchCat),   icon:'?' },
  ]

  const UNSOLVED = [
    { en: 'Riemann Hypothesis', bn: 'রিম্যান অনুকল্প' },
    { en: 'P vs NP', bn: 'P বনাম NP' },
    { en: "Goldbach's Conjecture", bn: 'গোল্ডবাখের অনুকল্প' },
    { en: 'Collatz Conjecture', bn: 'কোলাৎজ অনুকল্প' },
    { en: 'Twin Prime Conjecture', bn: 'যমজ মৌলিক অনুকল্প' },
  ]

  const filtered = useMemo(() => {
    let list = search ? searchProblems(search) : PROBLEMS
    if (diff !== 'ALL') list = list.filter(p => p.difficulty === diff)
    if (cat !== 'all')  list = list.filter(p => p.category === cat)
    if (sortBy === 'difficulty') {
      const order: Record<Difficulty,number> = { BEGINNER:0, INTERMEDIATE:1, ADVANCED:2, OLYMPIAD:3 }
      list = [...list].sort((a,b) => order[a.difficulty]-order[b.difficulty])
    }
    return list
  }, [search, diff, cat, sortBy])

  const DIFFS: (Difficulty|'ALL')[] = ['ALL','BEGINNER','INTERMEDIATE','ADVANCED','OLYMPIAD']

  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.problems.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-2">{tt(t.problems.title)}</h1>
            <p className="text-white/40 text-sm">
              {PROBLEMS.length} {tt(t.problems.subtitle)}
            </p>
          </div>

          {/* Search */}
          <SearchBar placeholder={tt(t.problems.searchPlaceholder)} onSearch={setSearch} className="max-w-lg mb-6" />

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {CATS.map(c => (
              <button key={c.key} onClick={() => setCat(c.key)}
                className={`flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 border transition-all ${
                  cat===c.key ? 'bg-white/10 border-white/20 text-white'
                    : 'border-white/8 text-white/40 hover:text-white/70'
                }`}>
                <span>{c.icon}</span><span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex flex-wrap gap-2 mb-6 pb-5 border-b border-white/5">
            {DIFFS.map(d => (
              <button key={d} onClick={() => setDiff(d)}
                className={`text-xs rounded-full px-3 py-1 border transition-all ${
                  diff===d ? 'bg-violet-600 border-violet-500 text-white'
                    : 'border-white/8 text-white/40 hover:text-white/70'
                }`}>
                {d==='ALL' ? tt(t.problems.allLevels) : DIFF_META[d].label}
              </button>
            ))}
            <select value={sortBy} onChange={e=>setSortBy(e.target.value as typeof sortBy)}
              className="ml-auto text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/40 focus:outline-none appearance-none">
              <option value="default" className="bg-zinc-900">{tt(t.problems.defaultOrder)}</option>
              <option value="difficulty" className="bg-zinc-900">{tt(t.problems.sortByDifficulty)}</option>
            </select>
          </div>

          {/* Stats */}
          <p className="text-xs text-white/25 font-mono mb-5">
            {filtered.length} {tt(t.problems.found)}
          </p>

          {/* Problems grid */}
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map(p => <ProblemCard key={p.id} problem={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-white/20">
              <p className="text-4xl mb-3">∅</p>
              <p>{tt(t.problems.noFound)}</p>
            </div>
          )}

          {/* Unsolved problems teaser */}
          <div className="mt-16 rounded-2xl border border-white/5 bg-white/[0.01] p-8 text-center">
            <Trophy className="w-8 h-8 mb-3 mx-auto text-white/30" />
            <h2 className="text-xl font-bold text-white mb-2">{tt(t.problems.famousUnsolved)}</h2>
            <p className="text-white/40 text-sm mb-6 max-w-lg mx-auto">
              {tt(t.problems.unsolvedDesc)}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {UNSOLVED.map(p=>(
                <span key={p.en} className="text-xs border border-white/10 rounded-full px-4 py-1.5 text-white/40">{tt(p)}</span>
              ))}
            </div>
            <p className="text-xs text-white/20 mt-4">{tt(t.problems.fullResearchSoon)}</p>
          </div>
        </div>
      </main>

    </>
  )
}
