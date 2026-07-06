'use client'
import { useState } from 'react'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { buildChapterQuestions, QuizQuestion } from '@/lib/data/quiz-builder'
import { QuizRunner } from './QuizRunner'
import { QuizResults } from './QuizResults'
import { getModeStats } from '@/lib/data/practice-progress'

export function ChapterPractice() {
  const [branchId, setBranchId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)

  const start = (id: string) => {
    setBranchId(id)
    setQuestions(buildChapterQuestions(id, 8))
    setResult(null)
  }

  if (result) {
    return (
      <QuizResults
        score={result.score}
        total={result.total}
        stats={getModeStats('chapter')}
        onRetry={() => branchId && start(branchId)}
      />
    )
  }

  if (questions.length > 0) {
    return (
      <QuizRunner
        mode="chapter"
        questions={questions}
        onComplete={(score, total) => setResult({ score, total })}
      />
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Pick a branch of mathematics — you&apos;ll get a mixed set of questions covering its formulas, theorems,
        and topics as one themed practice session.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {MATH_BRANCHES.map((b) => (
          <button
            key={b.id}
            onClick={() => start(b.id)}
            className="text-left rounded-lg border border-white/8 bg-white/[0.02] hover:border-violet-500/30 hover:bg-white/[0.05] px-4 py-3 transition-all flex items-center gap-3"
          >
            <span className="text-lg">{b.icon}</span>
            <span className="text-sm text-white/70">{b.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
