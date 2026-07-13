'use client'
import { useEffect, useRef, useState } from 'react'
import { Zap, Brain as BrainIcon, Timer, Eye } from 'lucide-react'

type Mode = 'sprint' | 'memory'

// ── Mental Math Sprint ────────────────────────────────────────────────────
// Rapid-fire typed arithmetic, not multiple choice — trains genuine mental
// calculation speed rather than pattern-matching against options.
function generateSprintProblem() {
  const ops = ['+', '-', '×'] as const
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a: number, b: number, answer: number
  if (op === '+') {
    a = Math.floor(Math.random() * 90) + 10
    b = Math.floor(Math.random() * 90) + 10
    answer = a + b
  } else if (op === '-') {
    a = Math.floor(Math.random() * 90) + 10
    b = Math.floor(Math.random() * a)
    answer = a - b
  } else {
    a = Math.floor(Math.random() * 12) + 2
    b = Math.floor(Math.random() * 12) + 2
    answer = a * b
  }
  return { question: `${a} ${op} ${b}`, answer }
}

function MentalMathSprint() {
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [problem, setProblem] = useState(generateSprintProblem())
  const [input, setInput] = useState('')
  const [solved, setSolved] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) {
      setRunning(false)
      setBestScore((b) => Math.max(b, solved))
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, timeLeft])

  const start = () => {
    setRunning(true)
    setTimeLeft(60)
    setSolved(0)
    setWrong(0)
    setProblem(generateSprintProblem())
    setInput('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const submit = () => {
    const parsed = parseInt(input, 10)
    if (isNaN(parsed)) return
    if (parsed === problem.answer) setSolved((s) => s + 1)
    else setWrong((w) => w + 1)
    setProblem(generateSprintProblem())
    setInput('')
  }

  if (!running && timeLeft === 0) {
    return (
      <div className="text-center py-8 space-y-5">
        <Zap className="w-10 h-10 mx-auto text-amber-400" />
        <p className="text-3xl font-bold text-white">{solved} solved</p>
        <p className="text-xs text-white/40">{wrong} incorrect · Best: {bestScore}</p>
        <button onClick={start} className="rounded-lg bg-amber-600 hover:bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition-all">
          Try Again
        </button>
      </div>
    )
  }

  if (!running) {
    return (
      <div className="text-center py-8 space-y-5">
        <Timer className="w-10 h-10 mx-auto text-amber-400" />
        <p className="text-sm text-white/50 max-w-xs mx-auto leading-relaxed">
          Solve as many arithmetic problems as you can in 60 seconds. Type the answer, no multiple choice.
        </p>
        <button onClick={start} className="rounded-lg bg-amber-600 hover:bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition-all">
          Start Sprint
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-mono font-bold text-lg ${timeLeft <= 10 ? 'text-rose-400' : 'text-white/60'}`}>{timeLeft}s</span>
        <span className="text-emerald-400">Solved: {solved}</span>
      </div>
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
        <p className="text-4xl font-mono text-white/90">{problem.question}</p>
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-center text-xl text-white focus:outline-none focus:border-amber-500/50"
          autoFocus
        />
        <button onClick={submit} className="rounded-lg bg-amber-600 hover:bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition-all">
          Enter
        </button>
      </div>
    </div>
  )
}

// ── Memory Sequence ────────────────────────────────────────────────────────
// Simon-says style: numbers flash in sequence, then the player must recall
// and enter them in the same order — trains working memory, not calculation.
function MemorySequence() {
  const [sequence, setSequence] = useState<number[]>([])
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input' | 'result'>('idle')
  const [showIndex, setShowIndex] = useState(-1)
  const [userInput, setUserInput] = useState<number[]>([])
  const [level, setLevel] = useState(1)
  const [bestLevel, setBestLevel] = useState(1)
  const [success, setSuccess] = useState<boolean | null>(null)

  const start = (lvl: number) => {
    const seq = Array.from({ length: lvl + 2 }, () => Math.floor(Math.random() * 9) + 1)
    setSequence(seq)
    setLevel(lvl)
    setUserInput([])
    setSuccess(null)
    setPhase('showing')
    setShowIndex(0)
  }

  useEffect(() => {
    if (phase !== 'showing') return
    if (showIndex >= sequence.length) {
      setPhase('input')
      return
    }
    const timer = setTimeout(() => setShowIndex((i) => i + 1), 800)
    return () => clearTimeout(timer)
  }, [phase, showIndex, sequence.length])

  const pressDigit = (d: number) => {
    if (phase !== 'input') return
    const next = [...userInput, d]
    setUserInput(next)
    if (next.length === sequence.length) {
      const correct = next.every((v, i) => v === sequence[i])
      setSuccess(correct)
      setPhase('result')
      if (correct) setBestLevel((b) => Math.max(b, level))
    }
  }

  return (
    <div className="space-y-6">
      {phase === 'idle' && (
        <div className="text-center py-8 space-y-5">
          <BrainIcon className="w-10 h-10 mx-auto text-fuchsia-400" />
          <p className="text-sm text-white/50 max-w-xs mx-auto leading-relaxed">
            Watch the number sequence, then repeat it back in the same order. Each level adds one more digit.
          </p>
          <button onClick={() => start(1)} className="rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white transition-all">
            Start Level 1
          </button>
        </div>
      )}

      {phase === 'showing' && (
        <div className="text-center py-8">
          <p className="text-xs text-white/30 mb-4">Memorize the sequence...</p>
          <div className="w-24 h-24 mx-auto rounded-2xl bg-fuchsia-500/15 border-2 border-fuchsia-500/40 flex items-center justify-center">
            <span className="text-5xl font-mono text-fuchsia-300">{sequence[showIndex] ?? ''}</span>
          </div>
        </div>
      )}

      {phase === 'input' && (
        <div className="space-y-5">
          <p className="text-xs text-white/40 text-center">Enter the sequence ({userInput.length}/{sequence.length})</p>
          <div className="flex justify-center gap-1.5">
            {sequence.map((_, i) => (
              <div key={i} className={`w-6 h-6 rounded ${i < userInput.length ? 'bg-fuchsia-500' : 'bg-white/10'}`} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                onClick={() => pressDigit(d)}
                className="aspect-square rounded-lg bg-white/5 border border-white/10 hover:border-fuchsia-500/40 text-xl font-mono text-white/80 transition-all"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="text-center py-6 space-y-4">
          <p className={`text-lg font-semibold ${success ? 'text-emerald-400' : 'text-rose-400'}`}>
            {success ? `Correct! Level ${level} complete.` : 'Sequence mismatch.'}
          </p>
          <p className="text-xs text-white/30 font-mono">
            You entered: {userInput.join(' ')} · Correct: {sequence.join(' ')}
          </p>
          <button
            onClick={() => start(success ? level + 1 : level)}
            className="rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white transition-all"
          >
            {success ? `Try Level ${level + 1}` : 'Retry This Level'}
          </button>
        </div>
      )}

      {phase !== 'idle' && (
        <p className="text-center text-xs text-white/25">Best level reached: {bestLevel}</p>
      )}
    </div>
  )
}

export function BrainTrainingGames() {
  const [mode, setMode] = useState<Mode>('sprint')

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('sprint')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs transition-all ${
            mode === 'sprint' ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'border-white/8 text-white/40'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Mental Math Sprint
        </button>
        <button
          onClick={() => setMode('memory')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs transition-all ${
            mode === 'memory' ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300' : 'border-white/8 text-white/40'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Memory Sequence
        </button>
      </div>

      {mode === 'sprint' && <MentalMathSprint />}
      {mode === 'memory' && <MemorySequence />}
    </div>
  )
}
