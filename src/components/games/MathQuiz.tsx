'use client'
import { useState, useEffect, useCallback } from 'react'
import { Trophy, ThumbsUp, Dumbbell, Flame } from 'lucide-react'

type Level = 'easy' | 'medium' | 'hard'
type OpType = '+' | '-' | '×' | '÷' | '^' | '%'

interface Question {
  question: string
  answer: number
  options: number[]
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function generateQuestion(level: Level, op: OpType): Question {
  let a: number, b: number, answer: number, question: string

  if (level === 'easy') {
    a = randInt(1, 20); b = randInt(1, 20)
    switch(op) {
      case '+': answer = a+b; question = `${a} + ${b} = ?`; break
      case '-': answer = Math.abs(a-b); question = `${Math.max(a,b)} − ${Math.min(a,b)} = ?`; break
      case '×': a=randInt(1,12); b=randInt(1,12); answer=a*b; question=`${a} × ${b} = ?`; break
      default:  answer = a+b; question = `${a} + ${b} = ?`
    }
  } else if (level === 'medium') {
    a = randInt(10, 99); b = randInt(2, 20)
    switch(op) {
      case '+': answer=a+b; question=`${a} + ${b} = ?`; break
      case '-': answer=a-b; question=`${a} − ${b} = ?`; break
      case '×': a=randInt(11,25); b=randInt(2,9); answer=a*b; question=`${a} × ${b} = ?`; break
      case '÷': b=randInt(2,12); answer=randInt(2,15); a=answer*b; question=`${a} ÷ ${b} = ?`; break
      default:  answer=a+b; question=`${a} + ${b} = ?`
    }
  } else {
    a = randInt(50,999); b = randInt(10,99)
    switch(op) {
      case '+': answer=a+b; question=`${a} + ${b} = ?`; break
      case '-': answer=a-b>0?a-b:a+b; question=answer===a-b?`${a} − ${b} = ?`:`${a} + ${b} = ?`; break
      case '×': a=randInt(11,50); b=randInt(11,25); answer=a*b; question=`${a} × ${b} = ?`; break
      case '^': a=randInt(2,9); b=randInt(2,4); answer=Math.pow(a,b); question=`${a}^${b} = ?`; break
      case '%': b=randInt(2,50); a=answer=randInt(b,999); const pct=randInt(5,50); answer=Math.round(a*pct/100); question=`${pct}% of ${a} = ?`; break
      default: answer=a+b; question=`${a} + ${b} = ?`
    }
  }

  // Generate wrong options close to answer
  const wrongs = new Set<number>()
  while (wrongs.size < 3) {
    const delta = randInt(1, Math.max(5, Math.round(Math.abs(answer)*0.2)))
    const w = answer + (Math.random()<0.5 ? delta : -delta)
    if (w !== answer && w >= 0) wrongs.add(Math.round(w))
  }
  return { question, answer, options: shuffle([answer, ...Array.from(wrongs).slice(0,3)]) }
}

const TOTAL = 10

export function MathQuiz() {
  const [level, setLevel] = useState<Level>('easy')
  const [ops, setOps] = useState<OpType[]>(['+','-','×'])
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number|null>(null)
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [phase, setPhase] = useState<'setup'|'playing'|'done'>('setup')
  const [timeLeft, setTimeLeft] = useState(15)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const startGame = useCallback(() => {
    const qs = Array.from({length: TOTAL}, () =>
      generateQuestion(level, ops[randInt(0, ops.length-1)])
    )
    setQuestions(qs); setCurrent(0); setSelected(null)
    setScore(0); setWrong(0); setPhase('playing'); setTimeLeft(15)
    setStreak(0); setBestStreak(0)
  }, [level, ops])

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return
    if (timeLeft <= 0) {
      if (selected === null) {
        setWrong(w => w+1); setStreak(0)
        const isLast = current >= TOTAL-1
        if (isLast) { setPhase('done') }
        else { setCurrent(c => c+1); setSelected(null); setTimeLeft(15) }
      }
      return
    }
    const t = setTimeout(() => setTimeLeft(tl => tl-1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft, current, selected])

  const answer = (opt: number) => {
    if (selected !== null) return
    setSelected(opt)
    const correct = opt === questions[current].answer
    if (correct) {
      setScore(s => s+1)
      setStreak(s => { const ns=s+1; setBestStreak(bs=>Math.max(bs,ns)); return ns })
    } else {
      setWrong(w => w+1); setStreak(0)
    }
    setTimeout(() => {
      if (current >= TOTAL-1) { setPhase('done') }
      else { setCurrent(c => c+1); setSelected(null); setTimeLeft(15) }
    }, 800)
  }

  const toggleOp = (op: OpType) => {
    setOps(prev => prev.includes(op)
      ? prev.length > 1 ? prev.filter(o => o!==op) : prev
      : [...prev, op])
  }

  const LEVEL_LEVELS: Level[] = ['easy','medium','hard']
  const ALL_OPS: OpType[] = ['+','-','×','÷','^','%']

  if (phase === 'setup') return (
    <div className="max-w-sm mx-auto space-y-5">
      <div>
        <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-2">Difficulty</p>
        <div className="flex gap-2">
          {LEVEL_LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`flex-1 capitalize text-sm rounded-lg py-2 border transition-all ${
                level===l ? 'bg-violet-600 border-violet-500 text-white'
                  : 'border-white/10 text-white/50 hover:text-white'
              }`}>{l}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-2">Operations</p>
        <div className="flex flex-wrap gap-2">
          {ALL_OPS.map(op => (
            <button key={op} onClick={() => toggleOp(op)}
              className={`w-12 h-10 rounded-lg font-mono font-bold text-sm border transition-all ${
                ops.includes(op) ? 'bg-violet-600/30 border-violet-500/40 text-violet-300'
                  : 'border-white/8 text-white/40 hover:text-white/70'
              }`}>{op}</button>
          ))}
        </div>
      </div>
      <button onClick={startGame}
        className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 py-3 text-base font-bold text-white transition-all">
        Start Quiz ({TOTAL} questions)
      </button>
    </div>
  )

  if (phase === 'done') return (
    <div className="max-w-sm mx-auto text-center space-y-4">
      <div className={`rounded-2xl border p-8 ${score >= 8 ? 'border-emerald-500/30 bg-emerald-500/8' : score >= 5 ? 'border-amber-500/30 bg-amber-500/8' : 'border-rose-500/30 bg-rose-500/8'}`}>
        {score>=8 ? <Trophy className="w-14 h-14 mb-4 mx-auto text-amber-400" /> : score>=5 ? <ThumbsUp className="w-14 h-14 mb-4 mx-auto text-cyan-400" /> : <Dumbbell className="w-14 h-14 mb-4 mx-auto text-violet-400" />}
        <p className="text-4xl font-bold font-mono text-white mb-1">{score}/{TOTAL}</p>
        <p className={`text-lg font-semibold ${score>=8?'text-emerald-400':score>=5?'text-amber-400':'text-rose-400'}`}>
          {score>=8?'Excellent!':score>=5?'Good job!':'Keep practicing!'}
        </p>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[{l:'Correct',v:score,c:'text-emerald-400'},{l:'Wrong',v:wrong,c:'text-rose-400'},{l:'Best Streak',v:bestStreak,c:'text-amber-400'}].map(s=>(
            <div key={s.l} className="rounded-lg border border-white/6 bg-white/5 p-2">
              <p className={`text-lg font-bold font-mono ${s.c}`}>{s.v}</p>
              <p className="text-[10px] text-white/30">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => setPhase('setup')}
        className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 py-3 font-semibold text-white transition-all">
        Play Again
      </button>
    </div>
  )

  const q = questions[current]
  const timerPct = (timeLeft/15)*100

  return (
    <div className="max-w-sm mx-auto space-y-4">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-white/30 font-mono mb-1">
          <span>Question {current+1}/{TOTAL}</span>
          <span className="flex items-center gap-1">Score: {score} | Streak: {streak} <Flame className="w-3.5 h-3.5" /></span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5">
          <div className="h-full rounded-full bg-violet-500 transition-all"
            style={{width:`${((current)/TOTAL)*100}%`}}/>
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-white/5">
          <div className={`h-full rounded-full transition-all ${timeLeft<=5?'bg-rose-500':timeLeft<=10?'bg-amber-500':'bg-emerald-500'}`}
            style={{width:`${timerPct}%`}}/>
        </div>
        <span className={`text-sm font-mono w-6 ${timeLeft<=5?'text-rose-400':timeLeft<=10?'text-amber-400':'text-white/50'}`}>
          {timeLeft}
        </span>
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-3xl font-bold font-mono text-white">{q.question}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => answer(opt)} disabled={selected!==null}
            className={`rounded-xl py-4 text-xl font-bold font-mono transition-all ${
              selected===null
                ? 'border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20'
                : opt===q.answer
                  ? 'border border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                  : opt===selected
                    ? 'border border-rose-500/50 bg-rose-500/15 text-rose-300'
                    : 'border border-white/5 bg-transparent text-white/20'
            }`}>{opt}</button>
        ))}
      </div>
    </div>
  )
}
