'use client'
import { useState } from 'react'
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { buildAdaptiveQuestion, QuizQuestion } from '@/lib/data/quiz-builder'
import { recordAttempt, AssessmentAttempt } from '@/lib/data/assessment-progress'
import { ExamResults } from './ExamResults'

const SESSION_LENGTH = 15
const TIER_LABELS = ['Foundational', 'Intermediate', 'Advanced', 'Research-level']

// Unlike Practice Center's Adaptive mode (casual, per-question feedback),
// this variant collects all answers silently and only reveals correctness
// at the end — a single formal, certified difficulty-adjusted score.
export function AdaptiveExamAssessment() {
  const [running, setRunning] = useState(false)
  const [tier, setTier] = useState(0)
  const [asked, setAsked] = useState(0)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [lastMove, setLastMove] = useState<'up' | 'down' | 'same' | null>(null)
  const [startedAt, setStartedAt] = useState(0)
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null)
  const [finalAnswers, setFinalAnswers] = useState<(number | null)[] | null>(null)
  const [finalQuestions, setFinalQuestions] = useState<QuizQuestion[]>([])

  const start = () => {
    setRunning(true)
    setTier(0)
    setAsked(0)
    setQuestions([])
    setAnswers([])
    setLastMove(null)
    setStartedAt(Date.now())
    setAttempt(null)
    const q = buildAdaptiveQuestion(0)
    setCurrentQuestion(q)
    setSelected(null)
  }

  const selectAnswer = (idx: number) => {
    if (!currentQuestion || selected !== null) return
    setSelected(idx)
    const correct = idx === currentQuestion.correctIndex
    const nextTier = correct ? Math.min(3, tier + 1) : Math.max(0, tier - 1)
    setLastMove(nextTier > tier ? 'up' : nextTier < tier ? 'down' : 'same')

    const updatedQuestions = [...questions, currentQuestion]
    const updatedAnswers = [...answers, idx]

    setTimeout(() => {
      const nextAsked = asked + 1
      if (nextAsked >= SESSION_LENGTH) {
        finish(updatedQuestions, updatedAnswers)
        return
      }
      setQuestions(updatedQuestions)
      setAnswers(updatedAnswers)
      setAsked(nextAsked)
      setTier(nextTier)
      setCurrentQuestion(buildAdaptiveQuestion(nextTier))
      setSelected(null)
    }, 900)
  }

  const finish = (allQuestions: QuizQuestion[], allAnswers: (number | null)[]) => {
    setRunning(false)
    const score = allAnswers.filter((a, i) => a === allQuestions[i].correctIndex).length
    const durationSec = Math.round((Date.now() - startedAt) / 1000)
    const rec = recordAttempt({
      type: 'adaptive-exam',
      title: 'Adaptive Exam',
      score,
      total: allQuestions.length,
      durationSec,
    })
    setFinalQuestions(allQuestions)
    setFinalAnswers(allAnswers)
    setAttempt(rec)
  }

  if (attempt && finalAnswers) {
    return (
      <ExamResults
        questions={finalQuestions}
        answers={finalAnswers}
        attempt={attempt}
        certificateTitle="Adaptive Exam"
        onRetry={start}
      />
    )
  }

  if (running && currentQuestion) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/30 font-mono">Question {asked + 1} / {SESSION_LENGTH}</span>
          <div className="flex items-center gap-2">
            {lastMove === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
            {lastMove === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
            {lastMove === 'same' && <Minus className="w-3.5 h-3.5 text-white/30" />}
            <span className="text-fuchsia-400 font-medium">{TIER_LABELS[tier]}</span>
          </div>
        </div>

        <div className="flex gap-1">
          {TIER_LABELS.map((label, i) => (
            <div key={label} className={`flex-1 h-1.5 rounded-full ${i <= tier ? 'bg-fuchsia-500' : 'bg-white/5'}`} />
          ))}
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
          <p className="text-sm text-white/85 leading-relaxed mb-5">{currentQuestion.prompt}</p>
          <div className="space-y-2.5">
            {currentQuestion.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => selectAnswer(idx)}
                disabled={selected !== null}
                className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all ${
                  selected === idx ? 'border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300' : 'border-white/8 bg-white/[0.02] text-white/70'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/25 text-center">No feedback shown until the exam ends — this is a formal assessment.</p>
      </div>
    )
  }

  return (
    <div className="text-center py-10 space-y-6">
      <Sparkles className="w-10 h-10 mx-auto text-fuchsia-400" />
      <p className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
        {SESSION_LENGTH} questions that adjust to your performance in real time — but unlike Practice Center,
        no feedback is shown until the exam ends, and your result is formally certified.
      </p>
      <button
        onClick={start}
        className="rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white transition-all"
      >
        Begin Adaptive Exam
      </button>
    </div>
  )
}
