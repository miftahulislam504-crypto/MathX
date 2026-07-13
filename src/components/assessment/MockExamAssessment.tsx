'use client'
import { useEffect, useState } from 'react'
import { GraduationCap, Clock } from 'lucide-react'
import { buildMixedQuestions, QuizQuestion } from '@/lib/data/quiz-builder'
import { ExamRunner } from './ExamRunner'
import { ExamResults } from './ExamResults'
import { recordAttempt, AssessmentAttempt } from '@/lib/data/assessment-progress'

const EXAM_LENGTH = 20
const TIME_LIMIT_SEC = 20 * 60 // 20 minutes for 20 questions, 1 min/question — realistic exam pacing

export function MockExamAssessment() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<(number | null)[] | null>(null)
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null)
  const [startedAt, setStartedAt] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SEC)
  const [running, setRunning] = useState(false)
  const [pendingAnswers, setPendingAnswers] = useState<(number | null)[]>([])

  const start = () => {
    setQuestions(buildMixedQuestions(EXAM_LENGTH))
    setAnswers(null)
    setAttempt(null)
    setStartedAt(Date.now())
    setTimeLeft(TIME_LIMIT_SEC)
    setPendingAnswers(new Array(EXAM_LENGTH).fill(null))
    setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) {
      handleComplete(pendingAnswers)
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, timeLeft])

  const handleComplete = (finalAnswers: (number | null)[]) => {
    setRunning(false)
    const score = finalAnswers.filter((a, i) => questions[i] && a === questions[i].correctIndex).length
    const durationSec = Math.round((Date.now() - startedAt) / 1000)
    const rec = recordAttempt({
      type: 'mock-exam',
      title: 'Full Mock Exam',
      score,
      total: questions.length,
      durationSec,
    })
    setAnswers(finalAnswers)
    setAttempt(rec)
  }

  if (attempt && answers) {
    return (
      <ExamResults
        questions={questions}
        answers={answers}
        attempt={attempt}
        certificateTitle="Full Mock Exam"
        onRetry={start}
      />
    )
  }

  if (running && questions.length > 0) {
    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60
    return (
      <div className="space-y-4">
        <div className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 ${timeLeft <= 60 ? 'border-rose-500/30 bg-rose-500/10' : 'border-white/8 bg-white/[0.02]'}`}>
          <Clock className={`w-4 h-4 ${timeLeft <= 60 ? 'text-rose-400' : 'text-white/40'}`} />
          <span className={`text-lg font-mono font-bold ${timeLeft <= 60 ? 'text-rose-400' : 'text-white/70'}`}>
            {mins}:{String(secs).padStart(2, '0')}
          </span>
        </div>
        <ExamRunner
          questions={questions}
          onComplete={handleComplete}
          onAnswersChange={setPendingAnswers}
        />
      </div>
    )
  }

  return (
    <div className="text-center py-10 space-y-6">
      <GraduationCap className="w-10 h-10 mx-auto text-emerald-400" />
      <div>
        <p className="text-sm text-white/60 max-w-sm mx-auto leading-relaxed mb-2">
          A full-length, {EXAM_LENGTH}-question exam spanning every branch of mathematics — timed at{' '}
          {TIME_LIMIT_SEC / 60} minutes, just like a real exam hall.
        </p>
        <p className="text-xs text-white/30">No feedback until you submit or time runs out.</p>
      </div>
      <button
        onClick={start}
        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-all"
      >
        Begin Mock Exam
      </button>
    </div>
  )
}
