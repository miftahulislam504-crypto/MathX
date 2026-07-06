'use client'
import { useState } from 'react'
import { buildTheoremPracticeQuestions, QuizQuestion } from '@/lib/data/quiz-builder'
import { QuizRunner } from './QuizRunner'
import { QuizResults } from './QuizResults'
import { getModeStats } from '@/lib/data/practice-progress'
import { BookOpenCheck } from 'lucide-react'

export function TheoremPractice() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)

  const start = () => {
    setQuestions(buildTheoremPracticeQuestions(8))
    setResult(null)
  }

  if (result) {
    return (
      <QuizResults
        score={result.score}
        total={result.total}
        stats={getModeStats('theorem')}
        onRetry={start}
      />
    )
  }

  if (questions.length > 0) {
    return (
      <QuizRunner
        mode="theorem"
        questions={questions}
        onComplete={(score, total) => setResult({ score, total })}
      />
    )
  }

  return (
    <div className="text-center py-10 space-y-5">
      <BookOpenCheck className="w-10 h-10 mx-auto text-cyan-400" />
      <p className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
        Test your recall of who proved what, and which proof method each major theorem uses — drawing from the
        full Theorem Library.
      </p>
      <button
        onClick={start}
        className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all"
      >
        Start Theorem Practice
      </button>
    </div>
  )
}
