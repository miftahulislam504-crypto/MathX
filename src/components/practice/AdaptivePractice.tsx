'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { buildAdaptiveQuestion, QuizQuestion } from '@/lib/data/quiz-builder'
import { recordAnswer, recordSessionComplete, getModeStats } from '@/lib/data/practice-progress'
import { addXP, updateStats, getStats, checkAchievements } from '@/lib/data/user-progress'
import { QuizResults } from './QuizResults'

const TIER_LABELS = ['Foundational', 'Intermediate', 'Advanced', 'Research-level']
const SESSION_LENGTH = 10

export function AdaptivePractice() {
  const [tier, setTier] = useState(0)
  const [question, setQuestion] = useState<QuizQuestion | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [asked, setAsked] = useState(0)
  const [lastMove, setLastMove] = useState<'up' | 'down' | 'same' | null>(null)
  const [running, setRunning] = useState(false)
  const [startedAt, setStartedAt] = useState(0)
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)

  const start = () => {
    setTier(0)
    setScore(0)
    setAsked(0)
    setLastMove(null)
    setStartedAt(Date.now())
    setQuestion(buildAdaptiveQuestion(0))
    setSelected(null)
    setRunning(true)
    setResult(null)
  }

  const handleSelect = (idx: number) => {
    if (!question || selected !== null) return
    setSelected(idx)
    const correct = idx === question.correctIndex
    if (correct) setScore((s) => s + 1)
    recordAnswer('adaptive', correct)

    const nextTier = correct ? Math.min(3, tier + 1) : Math.max(0, tier - 1)
    setLastMove(nextTier > tier ? 'up' : nextTier < tier ? 'down' : 'same')

    setTimeout(() => {
      const nextAsked = asked + 1
      setAsked(nextAsked)
      if (nextAsked >= SESSION_LENGTH) {
        finish(nextAsked, correct)
        return
      }
      setTier(nextTier)
      setQuestion(buildAdaptiveQuestion(nextTier))
      setSelected(null)
    }, 1400)
  }

  const finish = (totalAsked: number, lastCorrect: boolean) => {
    setRunning(false)
    const finalScore = score + (lastCorrect ? 1 : 0)
    const durationSec = Math.round((Date.now() - startedAt) / 1000)
    recordSessionComplete('adaptive', finalScore, totalAsked, durationSec)
    updateStats({ problemsSolved: getStats().problemsSolved + totalAsked })
    addXP(totalAsked * 6)
    checkAchievements()
    setResult({ score: finalScore, total: totalAsked })
  }

  if (result) {
    return (
      <QuizResults
        score={result.score}
        total={result.total}
        stats={getModeStats('adaptive')}
        onRetry={start}
      />
    )
  }

  if (!running || !question) {
    return (
      <div className="text-center py-10 space-y-6">
        <TrendingUp className="w-10 h-10 mx-auto text-fuchsia-400" />
        <p className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
          Difficulty adjusts to you in real time — answer correctly and questions get harder; miss one and they
          ease back. {SESSION_LENGTH} questions per round.
        </p>
        <button
          onClick={start}
          className="rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white transition-all"
        >
          Start Adaptive Round
        </button>
      </div>
    )
  }

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
        {selected !== null && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-white/45 leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}
