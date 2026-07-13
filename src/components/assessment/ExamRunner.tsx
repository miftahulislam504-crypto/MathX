'use client'
import { useState } from 'react'
import { CheckCircle2, XCircle, Flag } from 'lucide-react'
import { QuizQuestion } from '@/lib/data/quiz-builder'

interface Props {
  questions: QuizQuestion[]
  onComplete: (answers: (number | null)[]) => void
  showFeedbackImmediately?: boolean // false = exam mode (no feedback until the end), true = quiz mode (instant feedback)
  onAnswersChange?: (answers: (number | null)[]) => void // optional: lets a parent track live answers (e.g. for a timeout)
}

// ExamRunner differs from Practice Center's QuizRunner in one key way:
// by default it does NOT reveal correct/incorrect per-question (exam mode) —
// all answers are collected and graded at the end, like a real exam paper.
// Pass showFeedbackImmediately for quiz-style instant feedback instead.
export function ExamRunner({ questions, onComplete, showFeedbackImmediately = false, onAnswersChange }: Props) {
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [revealedThisQ, setRevealedThisQ] = useState(false)

  const question = questions[qIndex]
  const isLast = qIndex === questions.length - 1
  const answeredCount = answers.filter((a) => a !== null).length

  const selectAnswer = (idx: number) => {
    const next = [...answers]
    next[qIndex] = idx
    setAnswers(next)
    onAnswersChange?.(next)
    if (showFeedbackImmediately) setRevealedThisQ(true)
  }

  const goTo = (idx: number) => {
    setQIndex(idx)
    setRevealedThisQ(false)
  }

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev)
      if (next.has(qIndex)) next.delete(qIndex)
      else next.add(qIndex)
      return next
    })
  }

  const handleSubmit = () => onComplete(answers)

  return (
    <div className="space-y-5">
      {/* Question navigator */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((_, i) => {
          const isCurrent = i === qIndex
          const isAnswered = answers[i] !== null
          const isFlagged = flagged.has(i)
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`relative w-8 h-8 rounded-lg text-xs font-mono flex items-center justify-center transition-all ${
                isCurrent ? 'bg-violet-600 text-white' : isAnswered ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' : 'bg-white/5 text-white/30 border border-white/8'
              }`}
            >
              {i + 1}
              {isFlagged && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-white/30 font-mono">{answeredCount} / {questions.length} answered</p>

      {/* Question */}
      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
        <div className="flex items-start justify-between gap-3 mb-5">
          <p className="text-sm text-white/85 leading-relaxed">{question.prompt}</p>
          <button onClick={toggleFlag} className="shrink-0 mt-0.5">
            <Flag className={`w-4 h-4 ${flagged.has(qIndex) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
          </button>
        </div>

        <div className="space-y-2.5">
          {question.choices.map((choice, idx) => {
            const isSelected = answers[qIndex] === idx
            const isCorrect = idx === question.correctIndex
            let style = 'border-white/8 bg-white/[0.02] text-white/70 hover:border-white/20'
            if (showFeedbackImmediately && revealedThisQ) {
              if (isCorrect) style = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              else if (isSelected) style = 'border-rose-500/40 bg-rose-500/10 text-rose-300'
            } else if (isSelected) {
              style = 'border-violet-500/40 bg-violet-500/10 text-violet-300'
            }

            return (
              <button
                key={idx}
                onClick={() => selectAnswer(idx)}
                disabled={showFeedbackImmediately && revealedThisQ}
                className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all flex items-center justify-between gap-2 ${style}`}
              >
                <span>{choice}</span>
                {showFeedbackImmediately && revealedThisQ && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
                {showFeedbackImmediately && revealedThisQ && isSelected && !isCorrect && <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
              </button>
            )
          })}
        </div>

        {showFeedbackImmediately && revealedThisQ && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-white/45 leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => goTo(Math.max(0, qIndex - 1))}
          disabled={qIndex === 0}
          className="flex-1 rounded-lg border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2.5 text-sm text-white/60 hover:text-white transition-all"
        >
          ← Previous
        </button>
        {isLast ? (
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-all"
          >
            Submit Exam
          </button>
        ) : (
          <button
            onClick={() => goTo(qIndex + 1)}
            className="flex-1 rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-all"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
