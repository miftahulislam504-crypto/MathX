'use client'
import { useState } from 'react'
import { Landmark } from 'lucide-react'
import { buildUniversityQuestions, QuizQuestion } from '@/lib/data/quiz-builder'
import { ExamRunner } from './ExamRunner'
import { ExamResults } from './ExamResults'
import { recordAttempt, AssessmentAttempt } from '@/lib/data/assessment-progress'

export function UniversityTestAssessment() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<(number | null)[] | null>(null)
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null)
  const [startedAt, setStartedAt] = useState(0)

  const start = () => {
    setQuestions(buildUniversityQuestions(15))
    setAnswers(null)
    setAttempt(null)
    setStartedAt(Date.now())
  }

  const handleComplete = (finalAnswers: (number | null)[]) => {
    const score = finalAnswers.filter((a, i) => a === questions[i].correctIndex).length
    const durationSec = Math.round((Date.now() - startedAt) / 1000)
    const rec = recordAttempt({
      type: 'university-test',
      title: 'University-Level Test',
      score,
      total: questions.length,
      durationSec,
    }, 65) // advanced/research content — slightly lower passing bar than standard exams
    setAnswers(finalAnswers)
    setAttempt(rec)
  }

  if (attempt && answers) {
    return (
      <ExamResults
        questions={questions}
        answers={answers}
        attempt={attempt}
        certificateTitle="University-Level Mathematics Test"
        onRetry={start}
      />
    )
  }

  if (questions.length > 0) {
    return <ExamRunner questions={questions} onComplete={handleComplete} />
  }

  return (
    <div className="text-center py-10 space-y-6">
      <Landmark className="w-10 h-10 mx-auto text-cyan-400" />
      <p className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
        15 questions drawn exclusively from university, advanced, and research-tier branches — Real Analysis,
        Abstract Algebra, Topology, Complex Analysis, Numerical Methods, and beyond.
      </p>
      <button
        onClick={start}
        className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all"
      >
        Begin University-Level Test
      </button>
    </div>
  )
}
