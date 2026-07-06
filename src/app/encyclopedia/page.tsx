'use client'
import { useState, useMemo } from 'react'
import { SearchBar } from '@/components/shared/SearchBar'
import { LevelFilter } from '@/components/shared/LevelFilter'
import { TheoremCard } from '@/components/math/TheoremCard'
import { TOPICS } from '@/lib/data/topics'
import { FORMULAS } from '@/lib/data/formulas'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { THEOREMS, searchTheorems } from '@/lib/data/theorems'
import { GLOSSARY, searchGlossary } from '@/lib/data/glossary'
import { Level } from '@/types'
import Link from 'next/link'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'

type TabType = 'topics' | 'formulas' | 'theorems' | 'terms' | 'branches'

export default function EncyclopediaPage() {
  const [tab, setTab] = useState<TabType>('topics')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<Level | 'ALL'>('ALL')
  const { tt, lang } = useLanguage()

  const filteredTopics = useMemo(() => {
    const q = search.toLowerCase()
    return TOPICS.filter((t) => {
      const matchLevel = level === 'ALL' || t.level === level
      const matchSearch =
        !q || t.title.toLowerCase().includes(q) || (t.titleBn ?? '').includes(search)
      return matchLevel && matchSearch
    })
  }, [search, level])

  const filteredFormulas = useMemo(() => {
    if (!search) return FORMULAS
    const q = search.toLowerCase()
    return FORMULAS.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [search])

  const filteredTheorems = useMemo(() => {
    return search ? searchTheorems(search) : THEOREMS
  }, [search])

  const filteredTerms = useMemo(() => {
    return search ? searchGlossary(search) : GLOSSARY
  }, [search])

  const TABS: { key: TabType; label: string; count: number }[] = [
    { key: 'topics',   label: tt(t.encyclopedia.topicsTab),   count: TOPICS.length },
    { key: 'formulas', label: tt(t.encyclopedia.formulasTab), count: FORMULAS.length },
    { key: 'theorems', label: tt(t.encyclopedia.theoremsTab), count: THEOREMS.length },
    { key: 'terms',    label: tt(t.encyclopedia.termsTab),    count: GLOSSARY.length },
    { key: 'branches', label: tt(t.encyclopedia.branchesTab), count: MATH_BRANCHES.length },
  ]

  const LEVEL_COLOR: Record<string, string> = {
    SCHOOL:     'text-emerald-400 border-emerald-500/20 bg-emerald-500/8',
    COLLEGE:    'text-blue-400 border-blue-500/20 bg-blue-500/8',
    UNIVERSITY: 'text-violet-400 border-violet-500/20 bg-violet-500/8',
    ADVANCED:   'text-amber-400 border-amber-500/20 bg-amber-500/8',
    RESEARCH:   'text-rose-400 border-rose-500/20 bg-rose-500/8',
  }

  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.encyclopedia.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-3">{tt(t.encyclopedia.title)}</h1>
            <p className="text-white/40">
              {tt(t.encyclopedia.subtitle)}
            </p>
          </div>

          {/* Search */}
          <SearchBar
            placeholder={tt(t.encyclopedia.searchAll)}
            onSearch={setSearch}
            className="max-w-xl mb-8"
          />

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/8 mb-8">
            {TABS.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                  tab === tb.key
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                {tb.label}
                <span className="ml-2 text-[10px] font-mono text-white/25">{tb.count}</span>
              </button>
            ))}
          </div>

          {/* Topics tab */}
          {tab === 'topics' && (
            <div>
              <div className="mb-5">
                <LevelFilter active={level} onChange={setLevel} />
              </div>
              <p className="text-xs text-white/25 mb-5 font-mono">
                {filteredTopics.length} {tt(t.common.topics)}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredTopics.map((topic) => {
                  const branch = MATH_BRANCHES.find((b) => b.id === topic.branchId)
                  return (
                    <Link
                      key={topic.id}
                      href={`/learn/${branch?.slug}/${topic.slug}`}
                      className="flex items-center justify-between rounded-lg border border-white/6 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/12 px-4 py-3 group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-base shrink-0">{branch?.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm text-white/80 group-hover:text-white truncate transition-colors">
                            {lang === 'bn' && topic.titleBn ? topic.titleBn : topic.title}
                          </p>
                          {lang === 'en' && topic.titleBn && (
                            <p className="text-[11px] text-white/25 truncate">{topic.titleBn}</p>
                          )}
                        </div>
                      </div>
                      <span className={`shrink-0 text-[10px] border rounded-full px-2 py-0.5 ml-2 ${LEVEL_COLOR[topic.level]}`}>
                        {tt(t.levels[topic.level as keyof typeof t.levels])}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Formulas tab */}
          {tab === 'formulas' && (
            <div>
              <p className="text-xs text-white/25 mb-5 font-mono">{filteredFormulas.length} {tt(t.encyclopedia.formulasTab).toLowerCase()}</p>
              <div className="space-y-2">
                {filteredFormulas.map((f) => {
                  const branch = MATH_BRANCHES.find((b) => b.id === f.branchId)
                  return (
                    <div
                      key={f.id}
                      className="flex items-center gap-4 rounded-lg border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] px-4 py-3 transition-all group"
                    >
                      <span className="text-base shrink-0">{branch?.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white/80 font-medium">{f.title}</p>
                        <p className="text-xs text-white/30 truncate">{f.description}</p>
                      </div>
                      <code className="text-xs text-violet-400/60 font-mono hidden sm:block max-w-48 truncate">
                        {f.latex.slice(0, 40)}{f.latex.length > 40 ? '...' : ''}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(f.latex)}
                        className="shrink-0 text-[10px] text-white/25 hover:text-white/60 border border-white/8 rounded px-2 py-0.5 transition-all opacity-0 group-hover:opacity-100"
                      >
                        {lang === 'bn' ? 'কপি' : 'Copy'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Theorems tab */}
          {tab === 'theorems' && (
            <div>
              <p className="text-xs text-white/25 mb-5 font-mono">
                {filteredTheorems.length} {tt(t.encyclopedia.theoremsTab).toLowerCase()}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTheorems.map((th) => (
                  <TheoremCard key={th.id} theorem={th} />
                ))}
              </div>
            </div>
          )}

          {/* Terms tab */}
          {tab === 'terms' && (
            <div>
              <p className="text-xs text-white/25 mb-5 font-mono">
                {filteredTerms.length} {tt(t.encyclopedia.termsTab).toLowerCase()}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredTerms.map((g) => (
                  <div
                    key={g.id}
                    className="rounded-lg border border-white/6 bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.04] p-4 transition-all"
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-white/85">{g.term}</h3>
                      {lang === 'bn' && g.termBn && <span className="text-xs text-white/30">{g.termBn}</span>}
                    </div>
                    <p className="text-xs text-white/45 leading-relaxed">{g.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Branches tab */}
          {tab === 'branches' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MATH_BRANCHES.map((branch) => {
                const topicCount = TOPICS.filter((t) => t.branchId === branch.id).length
                const formulaCount = FORMULAS.filter((f) => f.branchId === branch.id).length
                return (
                  <Link
                    key={branch.id}
                    href={`/learn/${branch.slug}`}
                    className="group rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05] p-5 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${branch.color}15` }}
                      >
                        {branch.icon}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                          {lang === 'bn' && branch.nameBn ? branch.nameBn : branch.name}
                        </h3>
                        {lang === 'en' && branch.nameBn && (
                          <p className="text-[11px] text-white/30">{branch.nameBn}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 text-[11px] text-white/30 font-mono">
                      <span>{topicCount} {tt(t.common.topics)}</span>
                      <span>{formulaCount} {tt(t.encyclopedia.formulasTab).toLowerCase()}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>

    </>
  )
}
