'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { TopicCard } from '@/components/math/TopicCard'
import { SearchBar } from '@/components/shared/SearchBar'
import { LevelFilter } from '@/components/shared/LevelFilter'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { TOPICS, getTopicsByBranch } from '@/lib/data/topics'
import { Level } from '@/types'

export default function LearnPage() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<Level | 'ALL'>('ALL')
  const [activeBranch, setActiveBranch] = useState<string | 'ALL'>('ALL')

  const filtered = useMemo(() => {
    return TOPICS.filter((t) => {
      const matchLevel = level === 'ALL' || t.level === level
      const matchBranch = activeBranch === 'ALL' || t.branchId === activeBranch
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.titleBn ?? '').includes(search)
      return matchLevel && matchBranch && matchSearch
    })
  }, [search, level, activeBranch])

  return (
    <>

      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <p className="text-violet-400 text-sm font-mono mb-2">// Learning Center</p>
            <h1 className="text-4xl font-bold text-white mb-3">All Topics</h1>
            <p className="text-white/40 text-base">
              {TOPICS.length} topics across {MATH_BRANCHES.length} branches — School to Research
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <SearchBar
              placeholder="Search topics..."
              onSearch={setSearch}
              className="sm:w-72"
            />
            <LevelFilter active={level} onChange={setLevel} />
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
              All Branches
            </button>
            {MATH_BRANCHES.map((b) => (
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

          {/* Results count */}
          <p className="text-xs text-white/25 mb-5 font-mono">
            {filtered.length} topic{filtered.length !== 1 ? 's' : ''} found
          </p>

          {/* Topics grid — grouped by branch */}
          {activeBranch === 'ALL' ? (
            <div className="space-y-12">
              {MATH_BRANCHES.map((branch) => {
                const branchTopics = filtered.filter((t) => t.branchId === branch.id)
                if (branchTopics.length === 0) return null
                return (
                  <section key={branch.id}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{branch.icon}</span>
                      <div>
                        <Link
                          href={`/learn/${branch.slug}`}
                          className="text-lg font-semibold text-white hover:text-violet-300 transition-colors"
                        >
                          {branch.name}
                        </Link>
                        {branch.nameBn && (
                          <span className="text-white/30 text-sm ml-2">{branch.nameBn}</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {branchTopics.map((topic) => (
                        <TopicCard key={topic.id} topic={topic} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-white/25">
              <p className="text-4xl mb-3">∅</p>
              <p>No topics match your search.</p>
            </div>
          )}
        </div>
      </main>

    </>
  )
}
