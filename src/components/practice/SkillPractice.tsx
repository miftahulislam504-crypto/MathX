'use client'
import { useState } from 'react'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { TOPICS } from '@/lib/data/topics'
import { buildSkillQuestions, QuizQuestion } from '@/lib/data/quiz-builder'
import { QuizRunner } from './QuizRunner'
import { QuizResults } from './QuizResults'
import { getModeStats } from '@/lib/data/practice-progress'

export function SkillPractice() {
  const [activeBranch, setActiveBranch] = useState<string | null>(null)
  const [topicSlug, setTopicSlug] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)

  const start = (slug: string) => {
    setTopicSlug(slug)
    setQuestions(buildSkillQuestions(slug, 6))
    setResult(null)
  }

  if (result) {
    return (
      <QuizResults
        score={result.score}
        total={result.total}
        stats={getModeStats('skill')}
        onRetry={() => topicSlug && start(topicSlug)}
      />
    )
  }

  if (questions.length > 0) {
    return (
      <QuizRunner
        mode="skill"
        questions={questions}
        onComplete={(score, total) => setResult({ score, total })}
      />
    )
  }

  const branchesWithTopics = MATH_BRANCHES.filter((b) => TOPICS.some((tp) => tp.branchId === b.id))

  if (!activeBranch) {
    return (
      <div className="space-y-5">
        <p className="text-xs text-white/40 leading-relaxed">
          Drill on one narrow skill at a time. First pick a branch, then a specific topic to focus on.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {branchesWithTopics.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBranch(b.id)}
              className="text-left rounded-lg border border-white/8 bg-white/[0.02] hover:border-emerald-500/30 hover:bg-white/[0.05] px-4 py-3 transition-all flex items-center gap-3"
            >
              <span className="text-lg">{b.icon}</span>
              <span className="text-sm text-white/70">{b.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const branch = MATH_BRANCHES.find((b) => b.id === activeBranch)
  const topicsHere = TOPICS.filter((tp) => tp.branchId === activeBranch)

  return (
    <div className="space-y-5">
      <button onClick={() => setActiveBranch(null)} className="text-xs text-white/40 hover:text-white/70 transition-colors">
        ← Back to branches
      </button>
      <p className="text-sm text-white/60">{branch?.icon} {branch?.name} — pick a topic to drill</p>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {topicsHere.map((tp) => (
          <button
            key={tp.id}
            onClick={() => start(tp.slug)}
            className="text-left rounded-lg border border-white/8 bg-white/[0.02] hover:border-emerald-500/30 hover:bg-white/[0.05] px-4 py-2.5 transition-all text-sm text-white/65"
          >
            {tp.title}
          </button>
        ))}
      </div>
    </div>
  )
}
