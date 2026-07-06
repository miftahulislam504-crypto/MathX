'use client'
import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'
import { buildMixedQuestions, QuizQuestion } from '@/lib/data/quiz-builder'
import { recordAnswer, recordSessionComplete, getModeStats } from '@/lib/data/practice-progress'
import { addXP, updateStats, getStats, checkAchievements } from '@/lib/data/user-progress'
import { QuizResults } from './QuizResults'

const DURATION_OPTIONS = [60, 120, 180]

export function TimedPractice() {
  const [duration, setDuration] = useState(120)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)
  const [startedAt, setStartedAt] = useState(0)

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) {
      finish()
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, timeLeft])

  const start = () => {
    setQuestions(buildMixedQuestions(60)) // generous pool, only as many as time allows get used
    setQIndex(0)
    setSelected(null)
    setScore(0)
    setAnsweredCount(0)
    setTimeLeft(duration)
    setStartedAt(Date.now())
    setRunning(true)
    setResult(null)
  }

  const finish = () => {
    setRunning(false)
    const durationSec = Math.round((Date.now() - startedAt) / 1000)
    recordSessionComplete('timed', score, Math.max(1, answeredCount), durationSec)
    updateStats({ problemsSolved: getStats().problemsSolved + answeredCount })
    addXP(answeredCount * 4)
    checkAchievements()
    setResult({ score, total: Math.max(1, answeredCount) })
  }

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    const question = questions[qIndex]
    const correct = idx === question.correctIndex
    if (correct) setScore((s) => s + 1)
    setAnsweredCount((c) => c + 1)
    recordAnswer('timed', correct)
    setTimeout(() => {
      setSelected(null)
      setQIndex((i) => (i + 1) % questions.length) // loop pool if time remains
    }, 600)
  }

  if (result) {
    return (
      <QuizResults
        score={result.score}
        total={result.total}
        stats={getModeStats('timed')}
        onRetry={start}
      />
    )
  }

  if (!running) {
    return (
      <div className="text-center py-10 space-y-6">
        <Timer className="w-10 h-10 mx-auto text-rose-400" />
        <p className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
          Answer as many questions as you can before time runs out. Wrong answers don&apos;t stop the clock —
          just keep going.
        </p>
        <div className="flex justify-center gap-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`text-xs px-4 py-2 rounded-lg border transition-all ${
                duration === d ? 'bg-rose-500/15 border-rose-500/40 text-rose-300' : 'border-white/8 text-white/40 hover:text-white/70'
              }`}
            >
              {d / 60} min
            </button>
          ))}
        </div>
        <button
          onClick={start}
          className="rounded-lg bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white transition-all"
        >
          Start Timed Round
        </button>
      </div>
    )
  }

  const question = questions[qIndex]
  if (!question) return null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className={`text-2xl font-mono font-bold ${timeLeft <= 10 ? 'text-rose-400' : 'text-white/70'}`}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </span>
        <span className="text-xs text-white/30 font-mono">Score: {score} / {answeredCount}</span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full bg-rose-500 transition-all duration-1000 linear" style={{ width: `${(timeLeft / duration) * 100}%` }} />
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
        <p className="text-sm text-white/85 leading-relaxed mb-5">{question.prompt}</p>
        <div className="space-y-2.5">
          {question.choices.map((choice, idx) => {
            const isCorrect = idx === question.correctIndex
            const isSelected = idx === selected
            let style = 'border-white/8 bg-white/[0.02] text-white/70'
            if (selected !== null && isCorrect) style = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
            else if (selected !== null && isSelected && !isCorrect) style = 'border-rose-500/40 bg-rose-500/10 text-rose-300'

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all ${style}`}
              >
                {choice}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
