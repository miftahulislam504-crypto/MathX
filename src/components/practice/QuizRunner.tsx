'use client'
import { useState } from 'react'
import { CheckCircle2, XCircle, Flame } from 'lucide-react'
import { QuizQuestion } from '@/lib/data/quiz-builder'
import { recordAnswer, recordSessionComplete, PracticeMode } from '@/lib/data/practice-progress'
import { addXP, updateStats, getStats, checkAchievements } from '@/lib/data/user-progress'

interface Props {
  mode: PracticeMode
  questions: QuizQuestion[]
  onComplete: (score: number, total: number) => void
  timeLimit?: number // seconds, if set shows a countdown and auto-submits on expiry
}

export function QuizRunner({ mode, questions, onComplete, timeLimit }: Props) {
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [startTime] = useState(() => Date.now())

  const question = questions[qIndex]
  const isLast = qIndex === questions.length - 1

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const correct = idx === question.correctIndex
    if (correct) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }
    recordAnswer(mode, correct)
  }

  const handleNext = () => {
    if (isLast) {
      const durationSec = Math.round((Date.now() - startTime) / 1000)
      recordSessionComplete(mode, score, questions.length, durationSec, question.topicSlug)
      updateStats({ problemsSolved: getStats().problemsSolved + questions.length })
      addXP(questions.length * 5)
      checkAchievements()
      onComplete(score, questions.length)
      return
    }
    setQIndex((i) => i + 1)
    setSelected(null)
    setAnswered(false)
  }

  if (!question) return null

  return (
    <div className="space-y-5">
      {/* Progress + streak */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/30 font-mono">Question {qIndex + 1} / {questions.length}</span>
        {streak >= 2 && (
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <Flame className="w-3.5 h-3.5" /> {streak} streak
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-violet-500 transition-all duration-300"
          style={{ width: `${((qIndex + (answered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
        <p className="text-sm text-white/85 leading-relaxed mb-5">{question.prompt}</p>

        <div className="space-y-2.5">
          {question.choices.map((choice, idx) => {
            const isCorrect = idx === question.correctIndex
            const isSelected = idx === selected
            let style = 'border-white/8 bg-white/[0.02] text-white/70 hover:border-white/20'
            if (answered && isCorrect) style = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
            else if (answered && isSelected && !isCorrect) style = 'border-rose-500/40 bg-rose-500/10 text-rose-300'

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all flex items-center justify-between gap-2 ${style} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span>{choice}</span>
                {answered && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
                {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-white/45 leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>

      {answered && (
        <button
          onClick={handleNext}
          className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-all"
        >
          {isLast ? 'Finish' : 'Next Question →'}
        </button>
      )}
    </div>
  )
}
