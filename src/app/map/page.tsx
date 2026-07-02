'use client'
import { useState } from 'react'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { TOPICS } from '@/lib/data/topics'
import Link from 'next/link'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'

const LEVEL_COLS = ['SCHOOL', 'COLLEGE', 'UNIVERSITY', 'ADVANCED'] as const

export default function MapPage() {
  const [activeBranch, setActiveBranch] = useState<string | null>(null)
  const { tt, lang } = useLanguage()

  const LEVEL_META = {
    SCHOOL:     { label: tt(t.levels.SCHOOL),     color: '#10b981', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    COLLEGE:    { label: tt(t.levels.COLLEGE),    color: '#3b82f6', bg: 'bg-blue-500/10 border-blue-500/20' },
    UNIVERSITY: { label: tt(t.levels.UNIVERSITY), color: '#8b5cf6', bg: 'bg-violet-500/10 border-violet-500/20' },
    ADVANCED:   { label: tt(t.levels.ADVANCED),   color: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/20' },
  }

  const visibleBranches = activeBranch
    ? MATH_BRANCHES.filter((b) => b.id === activeBranch)
    : MATH_BRANCHES.filter((b) => TOPICS.some((t) => t.branchId === b.id))

  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.map.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-3">{tt(t.map.title)}</h1>
            <p className="text-white/40 text-sm">
              {tt(t.map.subtitle)}
            </p>
          </div>

          {/* Level legend */}
          <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-white/5">
            {LEVEL_COLS.map((lvl) => {
              const meta = LEVEL_META[lvl]
              return (
                <div key={lvl} className={`flex items-center gap-2 text-xs rounded-full border px-3 py-1 ${meta.bg}`}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span style={{ color: meta.color }}>{meta.label}</span>
                </div>
              )
            })}
          </div>

          {/* Branch filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveBranch(null)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                !activeBranch ? 'bg-white/10 border-white/20 text-white' : 'border-white/8 text-white/40 hover:text-white/70'
              }`}
            >
              {tt(t.map.allBranches)}
            </button>
            {MATH_BRANCHES.filter((b) => TOPICS.some((t) => t.branchId === b.id)).map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBranch(activeBranch === b.id ? null : b.id)}
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

          {/* Map grid — branches × levels */}
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Column headers */}
              <div className="grid grid-cols-5 gap-3 mb-3">
                <div className="text-xs text-white/20 font-mono uppercase tracking-wider pt-2">
                  {tt(t.map.branchHeader)}
                </div>
                {LEVEL_COLS.map((lvl) => (
                  <div key={lvl} className="text-center">
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: LEVEL_META[lvl].color }}
                    >
                      {LEVEL_META[lvl].label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div className="space-y-3">
                {visibleBranches.map((branch) => {
                  const branchTopics = TOPICS.filter((t) => t.branchId === branch.id)
                  if (!branchTopics.length) return null

                  return (
                    <div key={branch.id} className="grid grid-cols-5 gap-3 items-start">
                      {/* Branch label */}
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-lg">{branch.icon}</span>
                        <div>
                          <Link
                            href={`/learn/${branch.slug}`}
                            className="text-xs font-semibold text-white/70 hover:text-white transition-colors"
                          >
                            {lang === 'bn' && branch.nameBn ? branch.nameBn : branch.name}
                          </Link>
                          {lang === 'en' && branch.nameBn && (
                            <p className="text-[10px] text-white/25">{branch.nameBn}</p>
                          )}
                        </div>
                      </div>

                      {/* Level columns */}
                      {LEVEL_COLS.map((lvl) => {
                        const levelTopics = branchTopics.filter((t) => t.level === lvl)
                        const meta = LEVEL_META[lvl]
                        return (
                          <div key={lvl} className="space-y-1.5">
                            {levelTopics.map((topic) => (
                              <Link
                                key={topic.id}
                                href={`/learn/${branch.slug}/${topic.slug}`}
                                className={`block rounded-lg border px-2.5 py-2 text-[11px] leading-tight hover:opacity-80 transition-opacity ${meta.bg}`}
                                style={{ color: meta.color }}
                              >
                                {lang === 'bn' && topic.titleBn ? topic.titleBn : topic.title}
                                {lang === 'en' && topic.titleBn && (
                                  <span className="block text-[10px] opacity-50 mt-0.5">
                                    {topic.titleBn}
                                  </span>
                                )}
                              </Link>
                            ))}
                            {levelTopics.length === 0 && (
                              <div className="h-8 rounded-lg border border-white/4 border-dashed" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { val: MATH_BRANCHES.length, label: tt(t.map.branches) },
              { val: TOPICS.length, label: tt(t.map.topics) },
              { val: TOPICS.filter((t) => t.level === 'SCHOOL').length, label: tt(t.map.schoolTopics) },
              { val: TOPICS.filter((t) => ['UNIVERSITY', 'ADVANCED'].includes(t.level)).length, label: tt(t.map.advancedTopics) },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-violet-400 font-mono">{s.val}</p>
                <p className="text-xs text-white/30 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

    </>
  )
}
