'use client'
import { useState, useMemo } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SearchBar } from '@/components/shared/SearchBar'
import { LevelFilter } from '@/components/shared/LevelFilter'
import { TOPICS } from '@/lib/data/topics'
import { FORMULAS } from '@/lib/data/formulas'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { Level } from '@/types'
import Link from 'next/link'

type TabType = 'topics' | 'formulas' | 'branches'

export default function EncyclopediaPage() {
  const [tab, setTab] = useState<TabType>('topics')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<Level | 'ALL'>('ALL')

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

  const TABS: { key: TabType; label: string; count: number }[] = [
    { key: 'topics',   label: 'Topics',   count: TOPICS.length },
    { key: 'formulas', label: 'Formulas', count: FORMULAS.length },
    { key: 'branches', label: 'Branches', count: MATH_BRANCHES.length },
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
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <p className="text-violet-400 text-sm font-mono mb-2">// Encyclopedia</p>
            <h1 className="text-4xl font-bold text-white mb-3">Mathematics Encyclopedia</h1>
            <p className="text-white/40">
              Complete reference — topics, formulas, branches, all in one place
            </p>
          </div>

          {/* Search */}
          <SearchBar
            placeholder="Search everything..."
            onSearch={setSearch}
            className="max-w-xl mb-8"
          />

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/8 mb-8">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                  tab === t.key
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                {t.label}
                <span className="ml-2 text-[10px] font-mono text-white/25">{t.count}</span>
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
                {filteredTopics.length} topics
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
                            {topic.title}
                          </p>
                          {topic.titleBn && (
                            <p className="text-[11px] text-white/25 truncate">{topic.titleBn}</p>
                          )}
                        </div>
                      </div>
                      <span className={`shrink-0 text-[10px] border rounded-full px-2 py-0.5 ml-2 ${LEVEL_COLOR[topic.level]}`}>
                        {topic.level.charAt(0) + topic.level.slice(1).toLowerCase()}
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
              <p className="text-xs text-white/25 mb-5 font-mono">{filteredFormulas.length} formulas</p>
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
                        Copy
                      </button>
                    </div>
                  )
                })}
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
                          {branch.name}
                        </h3>
                        {branch.nameBn && (
                          <p className="text-[11px] text-white/30">{branch.nameBn}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 text-[11px] text-white/30 font-mono">
                      <span>{topicCount} topics</span>
                      <span>{formulaCount} formulas</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
