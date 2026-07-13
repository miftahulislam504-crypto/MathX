'use client'
import { useState, useCallback } from 'react'
import { Sparkles, PartyPopper, XCircle, ArrowRight } from 'lucide-react'

type PatternType = 'arithmetic' | 'geometric' | 'fibonacci' | 'squares' | 'alternating'

interface PatternChallenge {
  sequence: number[]
  answer: number
  type: PatternType
  explanation: string
}

function generateChallenge(difficulty: number): PatternChallenge {
  const types: PatternType[] = difficulty < 2
    ? ['arithmetic', 'geometric']
    : difficulty < 4
    ? ['arithmetic', 'geometric', 'squares', 'alternating']
    : ['arithmetic', 'geometric', 'fibonacci', 'squares', 'alternating']

  const type = types[Math.floor(Math.random() * types.length)]

  switch (type) {
    case 'arithmetic': {
      const start = Math.floor(Math.random() * 10) + 1
      const step = Math.floor(Math.random() * 8) + 2
      const seq = Array.from({ length: 5 }, (_, i) => start + i * step)
      return {
        sequence: seq.slice(0, 4),
        answer: seq[4],
        type,
        explanation: `Each term increases by ${step} (arithmetic sequence).`,
      }
    }
    case 'geometric': {
      const start = Math.floor(Math.random() * 5) + 1
      const ratio = Math.floor(Math.random() * 2) + 2
      const seq = Array.from({ length: 5 }, (_, i) => start * ratio ** i)
      return {
        sequence: seq.slice(0, 4),
        answer: seq[4],
        type,
        explanation: `Each term is multiplied by ${ratio} (geometric sequence).`,
      }
    }
    case 'fibonacci': {
      const a0 = Math.floor(Math.random() * 3) + 1
      const a1 = Math.floor(Math.random() * 3) + 1
      const seq = [a0, a1]
      for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2])
      return {
        sequence: seq.slice(0, 5),
        answer: seq[5],
        type,
        explanation: `Each term is the sum of the two before it (like Fibonacci).`,
      }
    }
    case 'squares': {
      const start = Math.floor(Math.random() * 4) + 1
      const seq = Array.from({ length: 5 }, (_, i) => (start + i) ** 2)
      return {
        sequence: seq.slice(0, 4),
        answer: seq[4],
        type,
        explanation: `These are consecutive perfect squares (${start}² , ${start + 1}² , ...).`,
      }
    }
    case 'alternating': {
      const start = Math.floor(Math.random() * 10) + 5
      const stepA = Math.floor(Math.random() * 5) + 2
      const stepB = Math.floor(Math.random() * 3) + 1
      const seq = [start]
      for (let i = 1; i < 6; i++) {
        seq.push(seq[i - 1] + (i % 2 === 1 ? stepA : -stepB))
      }
      return {
        sequence: seq.slice(0, 5),
        answer: seq[5],
        type,
        explanation: `The sequence alternates between adding ${stepA} and subtracting ${stepB}.`,
      }
    }
  }
}

export function PatternGames() {
  const [challenge, setChallenge] = useState<PatternChallenge>(() => generateChallenge(0))
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [round, setRound] = useState(1)

  const checkAnswer = useCallback(() => {
    const parsed = parseInt(userAnswer, 10)
    if (isNaN(parsed)) return
    if (parsed === challenge.answer) {
      setFeedback('correct')
      const newStreak = streak + 1
      setStreak(newStreak)
      setBestStreak((b) => Math.max(b, newStreak))
    } else {
      setFeedback('wrong')
      setStreak(0)
    }
  }, [userAnswer, challenge, streak])

  const next = () => {
    setChallenge(generateChallenge(Math.min(5, Math.floor(round / 2))))
    setUserAnswer('')
    setFeedback(null)
    setRound((r) => r + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/30 font-mono">Round {round}</span>
        <div className="flex items-center gap-3">
          <span className="text-violet-400">Streak: {streak}</span>
          <span className="text-amber-400">Best: {bestStreak}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 text-center">
        <p className="text-xs text-violet-400/70 uppercase tracking-wider mb-4">What comes next?</p>
        <div className="flex items-center justify-center gap-3 flex-wrap mb-2">
          {challenge.sequence.map((n, i) => (
            <div key={i} className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-lg font-mono text-white/80">{n}</span>
            </div>
          ))}
          <ArrowRight className="w-5 h-5 text-white/20" />
          <div className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center ${
            feedback === 'correct' ? 'border-emerald-500 bg-emerald-500/10' : feedback === 'wrong' ? 'border-rose-500 bg-rose-500/10' : 'border-dashed border-violet-500/40'
          }`}>
            <span className="text-lg font-mono text-white/50">?</span>
          </div>
        </div>
      </div>

      {feedback === null ? (
        <div className="flex gap-2">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            placeholder="Your answer"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-center text-white focus:outline-none focus:border-violet-500/50"
            autoFocus
          />
          <button
            onClick={checkAnswer}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-all"
          >
            Check
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`rounded-lg border p-4 text-center ${feedback === 'correct' ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-rose-500/25 bg-rose-500/5'}`}>
            {feedback === 'correct' ? (
              <p className="flex items-center justify-center gap-2 text-emerald-400 font-semibold mb-2">
                <PartyPopper className="w-4 h-4" /> Correct! The answer was {challenge.answer}.
              </p>
            ) : (
              <p className="flex items-center justify-center gap-2 text-rose-400 font-semibold mb-2">
                <XCircle className="w-4 h-4" /> Not quite — the answer was {challenge.answer}.
              </p>
            )}
            <p className="text-xs text-white/45">{challenge.explanation}</p>
          </div>
          <button
            onClick={next}
            className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 py-3 text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Next Pattern
          </button>
        </div>
      )}
    </div>
  )
}
