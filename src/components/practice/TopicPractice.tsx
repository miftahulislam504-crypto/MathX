'use client'
import { useState } from 'react'
import { TOPICS } from '@/lib/data/topics'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { addXP, updateStats, getStats, updateStreak, checkAchievements, recordSession } from '@/lib/data/user-progress'

interface Problem {
  id: number
  question: string
  hint: string
  solution: string
  difficulty: string
}

const DIFFICULTY_COLOR: Record<string, string> = {
  BEGINNER:     'text-emerald-400 bg-emerald-500/8 border-emerald-500/20',
  INTERMEDIATE: 'text-blue-400 bg-blue-500/8 border-blue-500/20',
  ADVANCED:     'text-amber-400 bg-amber-500/8 border-amber-500/20',
}

export function TopicPractice() {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('COLLEGE')
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [hints, setHints] = useState<Record<number, boolean>>({})
  const { tt } = useLanguage()

  const generateProblems = async () => {
    if (!selectedTopic) return
    setLoading(true)
    setError('')
    setProblems([])
    setRevealed({})
    setHints({})

    try {
      const res = await fetch('/api/problems/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          level: selectedLevel,
          count: 5,
        }),
      })
      const data = await res.json()
      const list: Problem[] = data.problems ?? data
      setProblems(Array.isArray(list) ? list : [])
    } catch {
      setError(tt(t.practice.failedGenerate))
    } finally {
      setLoading(false)
    }
  }

  const toggleReveal = (id: number) =>
    setRevealed((prev) => {
      const wasRevealed = prev[id]
      // Only record progress the first time this problem's solution is shown
      if (!wasRevealed) {
        updateStreak()
        updateStats({ problemsSolved: getStats().problemsSolved + 1 })
        addXP(10)
        recordSession(selectedTopic || 'practice', 1)
        checkAchievements()
      }
      return { ...prev, [id]: !wasRevealed }
    })
  const toggleHint = (id: number) =>
    setHints((prev) => ({ ...prev, [id]: !prev[id] }))

  const branchesWithTopics = MATH_BRANCHES.filter((b) =>
    TOPICS.some((tp) => tp.branchId === b.id)
  )

  return (
    <div>
      {/* Generator card */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 mb-8">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-5">
          {tt(t.practice.configureSession)}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          {/* Topic select */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">{tt(t.practice.topicLabel)}</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all appearance-none"
            >
              <option value="" className="bg-zinc-900">{tt(t.practice.selectTopic)}</option>
              {branchesWithTopics.map((branch) => (
                <optgroup key={branch.id} label={`${branch.icon} ${branch.name}`} className="bg-zinc-900">
                  {TOPICS.filter((tp) => tp.branchId === branch.id).map((tp) => (
                    <option key={tp.id} value={tp.title} className="bg-zinc-900">
                      {tp.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Level select */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">{tt(t.practice.difficultyLevel)}</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all appearance-none"
            >
              <option value="SCHOOL" className="bg-zinc-900">{tt(t.levels.SCHOOL)}</option>
              <option value="COLLEGE" className="bg-zinc-900">{tt(t.levels.COLLEGE)}</option>
              <option value="UNIVERSITY" className="bg-zinc-900">{tt(t.levels.UNIVERSITY)}</option>
              <option value="ADVANCED" className="bg-zinc-900">{tt(t.levels.ADVANCED)}</option>
              <option value="RESEARCH" className="bg-zinc-900">{tt(t.levels.RESEARCH)}</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateProblems}
          disabled={!selectedTopic || loading}
          className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed px-6 py-3 text-sm font-semibold text-white transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {tt(t.practice.generating)}
            </span>
          ) : (
            tt(t.practice.generate)
          )}
        </button>

        {error && (
          <p className="mt-3 text-xs text-rose-400 bg-rose-500/8 border border-rose-500/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
      </div>

      {/* Problems list */}
      {problems.length > 0 && (
        <div className="space-y-5">
          <p className="text-sm text-white/40 font-mono">
            {problems.length} {tt(t.practice.problemsCount)} — {selectedTopic} ({selectedLevel})
          </p>

          {problems.map((p, idx) => (
            <div
              key={p.id ?? idx}
              className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden"
            >
              {/* Problem header */}
              <div className="flex items-start justify-between gap-4 p-5 pb-4">
                <div className="flex items-start gap-3">
                  <span className="text-violet-400 font-mono text-sm font-bold shrink-0 mt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-white/85 text-sm leading-relaxed">{p.question}</p>
                  </div>
                </div>
                <span className={`shrink-0 text-[10px] border rounded-full px-2 py-0.5 ${DIFFICULTY_COLOR[p.difficulty] ?? 'text-white/40'}`}>
                  {p.difficulty}
                </span>
              </div>

              {/* Hint row */}
              <div className="px-5 pb-3 flex gap-3">
                <button
                  onClick={() => toggleHint(p.id ?? idx)}
                  className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                >
                  {hints[p.id ?? idx] ? tt(t.practice.hideHintFull) : tt(t.practice.showHintFull)}
                </button>
                <button
                  onClick={() => toggleReveal(p.id ?? idx)}
                  className="text-xs text-violet-400/70 hover:text-violet-400 transition-colors"
                >
                  {revealed[p.id ?? idx] ? tt(t.practice.hideSol) : tt(t.practice.revealSol)}
                </button>
              </div>

              {/* Hint */}
              {hints[p.id ?? idx] && (
                <div className="mx-5 mb-3 rounded-lg border border-amber-500/15 bg-amber-500/5 px-4 py-3">
                  <p className="text-xs text-amber-400/60 uppercase tracking-wider mb-1">{tt(t.common.hint)}</p>
                  <p className="text-sm text-amber-100/70">{p.hint}</p>
                </div>
              )}

              {/* Solution */}
              {revealed[p.id ?? idx] && (
                <div className="mx-5 mb-5 rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3">
                  <p className="text-xs text-violet-400/60 uppercase tracking-wider mb-1">{tt(t.common.solution)}</p>
                  <p className="text-sm text-violet-100/80 leading-relaxed">{p.solution}</p>
                </div>
              )}
            </div>
          ))}

          {/* Regenerate button */}
          <button
            onClick={generateProblems}
            className="w-full rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] py-3 text-sm text-white/50 hover:text-white/80 transition-all"
          >
            {tt(t.practice.regenerate)}
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && problems.length === 0 && !error && (
        <div className="text-center py-20 text-white/20">
          <p className="text-5xl mb-4 font-mono">∑</p>
          <p className="text-sm">{tt(t.practice.emptyState)}</p>
        </div>
      )}
    </div>
  )
}
