'use client'
import { useState } from 'react'
import { FileCheck2 } from 'lucide-react'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { buildChapterQuestions, QuizQuestion } from '@/lib/data/quiz-builder'
import { ExamRunner } from './ExamRunner'
import { ExamResults } from './ExamResults'
import { recordAttempt, AssessmentAttempt } from '@/lib/data/assessment-progress'

export function QuizAssessment() {
  const [branchId, setBranchId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<(number | null)[] | null>(null)
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null)
  const [startedAt, setStartedAt] = useState(0)

  const start = (id: string) => {
    setBranchId(id)
    setQuestions(buildChapterQuestions(id, 5))
    setAnswers(null)
    setAttempt(null)
    setStartedAt(Date.now())
  }

  const handleComplete = (finalAnswers: (number | null)[]) => {
    const score = finalAnswers.filter((a, i) => a === questions[i].correctIndex).length
    const branch = MATH_BRANCHES.find((b) => b.id === branchId)
    const durationSec = Math.round((Date.now() - startedAt) / 1000)
    const rec = recordAttempt({
      type: 'quiz',
      title: `${branch?.name ?? 'Mixed'} Quiz`,
      score,
      total: questions.length,
      durationSec,
      branchId: branchId ?? undefined,
    })
    setAnswers(finalAnswers)
    setAttempt(rec)
  }

  if (attempt && answers) {
    const branch = MATH_BRANCHES.find((b) => b.id === branchId)
    return (
      <ExamResults
        questions={questions}
        answers={answers}
        attempt={attempt}
        certificateTitle={`${branch?.name ?? 'Mathematics'} Quiz`}
        onRetry={() => branchId && start(branchId)}
      />
    )
  }

  if (questions.length > 0) {
    return <ExamRunner questions={questions} onComplete={handleComplete} showFeedbackImmediately />
  }

  return (
    <div className="space-y-5">
      <div className="text-center py-4">
        <FileCheck2 className="w-8 h-8 mx-auto text-violet-400 mb-3" />
        <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
          A short 5-question quiz with instant feedback after every question. Pick a branch to begin.
        </p>
      </div>
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
