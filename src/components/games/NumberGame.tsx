'use client'
import { useState, useEffect, useCallback } from 'react'

type GameType = '2048' | 'nim' | 'guess'

// ── Number Guessing Game ────────────────────────────────────────────
function GuessGame() {
  const [target] = useState(() => Math.floor(Math.random() * 100) + 1)
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState<{val:number;hint:string}[]>([])
  const [won, setWon] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const MAX = 7

  const submit = () => {
    const n = parseInt(guess)
    if (isNaN(n) || n < 1 || n > 100) return
    const remaining = MAX - attempts.length - 1
    let hint = ''
    if (n === target) { hint = '🎉 Correct!'; setWon(true) }
    else if (n < target) hint = `📈 Too low ${remaining > 0 ? `(${remaining} left)` : '— Game Over'}`
    else hint = `📉 Too high ${remaining > 0 ? `(${remaining} left)` : '— Game Over'}`
    const newAttempts = [...attempts, { val: n, hint }]
    setAttempts(newAttempts)
    setGuess('')
    if (n !== target && newAttempts.length >= MAX) setGameOver(true)
  }

  const reset = () => window.location.reload()

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div className="text-center rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
        <p className="text-sm text-white/50 mb-1">Guess a number between</p>
        <p className="text-3xl font-bold text-violet-300 font-mono">1 — 100</p>
        <p className="text-xs text-white/30 mt-1">{MAX - attempts.length} attempts remaining</p>
      </div>

      {!won && !gameOver && (
        <div className="flex gap-2">
          <input type="number" min={1} max={100} value={guess}
            onChange={e => setGuess(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Your guess..."
            className="flex-1 bg-white/5 border border-white/10 focus:border-violet-500/50 rounded-lg px-4 py-2.5 text-sm font-mono text-white placeholder:text-white/25 focus:outline-none" />
          <button onClick={submit}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-all">
            Guess
          </button>
        </div>
      )}

      <div className="space-y-2">
        {attempts.map((a, i) => (
          <div key={i} className={`flex items-center justify-between rounded-lg px-4 py-2.5 border text-sm font-mono ${
            a.hint.includes('Correct') ? 'border-emerald-500/30 bg-emerald-500/8 text-emerald-300'
              : 'border-white/8 bg-white/[0.02] text-white/60'
          }`}>
            <span>{a.val}</span>
            <span className="text-xs">{a.hint}</span>
          </div>
        ))}
      </div>

      {(won || gameOver) && (
        <div className={`rounded-xl border p-5 text-center ${won ? 'border-emerald-500/30 bg-emerald-500/8' : 'border-rose-500/30 bg-rose-500/8'}`}>
          <p className="text-2xl mb-2">{won ? '🎉' : '💀'}</p>
          <p className={`font-bold ${won ? 'text-emerald-300' : 'text-rose-300'}`}>
            {won ? `Found in ${attempts.length} attempts!` : `The answer was ${target}`}
          </p>
          <p className="text-xs text-white/30 mt-1 mb-3">
            {won ? `Binary search would find it in at most ${Math.ceil(Math.log2(100))} steps` : 'Better luck next time!'}
          </p>
          <button onClick={reset}
            className="rounded-lg bg-white/10 hover:bg-white/15 px-5 py-2 text-sm text-white transition-all">
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

// ── Nim Game ───────────────────────────────────────────────────────
function NimGame() {
  const [piles, setPiles] = useState([3, 5, 7])
  const [selected, setSelected] = useState<{pile:number;count:number}|null>(null)
  const [turn, setTurn] = useState<'player'|'computer'>('player')
  const [status, setStatus] = useState<'playing'|'player_wins'|'computer_wins'>('playing')
  const [log, setLog] = useState<string[]>([])

  const totalLeft = piles.reduce((s,p) => s+p, 0)

  // Nim optimal strategy: XOR of all piles
  const computerMove = useCallback((currentPiles: number[]) => {
    const xorSum = currentPiles.reduce((x, p) => x ^ p, 0)
    let bestPile = -1, bestRemove = 0

    if (xorSum === 0) {
      // Losing position — take 1 from largest non-zero pile
      const maxIdx = currentPiles.indexOf(Math.max(...currentPiles))
      bestPile = maxIdx; bestRemove = 1
    } else {
      for (let i = 0; i < currentPiles.length; i++) {
        const target = currentPiles[i] ^ xorSum
        if (target < currentPiles[i]) { bestPile = i; bestRemove = currentPiles[i] - target; break }
      }
    }

    if (bestPile === -1) { bestPile = currentPiles.findIndex(p => p > 0); bestRemove = 1 }

    return { pile: bestPile, remove: bestRemove }
  }, [])

  useEffect(() => {
    if (turn !== 'computer' || status !== 'playing') return
    if (totalLeft === 0) { setStatus('player_wins'); return }

    const timer = setTimeout(() => {
      const { pile, remove } = computerMove(piles)
      const newPiles = piles.map((p, i) => i === pile ? p - remove : p)
      setPiles(newPiles)
      setLog(l => [`Computer takes ${remove} from pile ${pile+1}`, ...l])

      if (newPiles.reduce((s,p) => s+p, 0) === 0) {
        setStatus('computer_wins')
      } else {
        setTurn('player')
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [turn, piles, status, computerMove, totalLeft])

  const takeFromPile = (pileIdx: number, count: number) => {
    if (turn !== 'player' || status !== 'playing') return
    const newPiles = piles.map((p, i) => i === pileIdx ? p - count : p)
    setPiles(newPiles)
    setLog(l => [`You take ${count} from pile ${pileIdx+1}`, ...l])

    if (newPiles.reduce((s,p) => s+p, 0) === 0) {
      setStatus('player_wins')
    } else {
      setTurn('computer')
    }
  }

  const reset = () => { setPiles([3,5,7]); setTurn('player'); setStatus('playing'); setLog([]) }

  const PILE_COLORS = ['#7c3aed','#06b6d4','#10b981']

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-sm text-white/50 leading-relaxed">
        <span className="font-semibold text-white/70">Nim Rules:</span> Take any number of objects from one pile.
        The player who takes the <em>last</em> object <span className="text-rose-400">loses</span>.
        Hint: XOR of pile sizes = 0 is a losing position for the player to move.
      </div>

      {/* Piles */}
      <div className="grid grid-cols-3 gap-4">
        {piles.map((count, pi) => (
          <div key={pi} className="text-center">
            <p className="text-xs text-white/30 font-mono mb-2">Pile {pi+1}</p>
            <div className="flex flex-col items-center gap-1 mb-3 min-h-[160px] justify-end">
              {Array.from({length: count}).map((_, i) => (
                <div key={i} className="w-10 h-5 rounded-md"
                  style={{ backgroundColor: PILE_COLORS[pi], opacity: 0.7 + (i/count)*0.3 }} />
              ))}
              {count === 0 && <p className="text-white/20 text-xs">Empty</p>}
            </div>
            <p className="text-lg font-bold font-mono mb-2" style={{ color: PILE_COLORS[pi] }}>{count}</p>
            {turn === 'player' && status === 'playing' && count > 0 && (
              <div className="flex flex-col gap-1">
                {Array.from({length: count}, (_, i) => i+1).slice(0, 5).map(n => (
                  <button key={n} onClick={() => takeFromPile(pi, n)}
                    className="text-xs rounded px-2 py-1 border border-white/10 text-white/50 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all">
                    Take {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
        {status === 'playing' && (
          <p className={`text-sm font-semibold ${turn==='player' ? 'text-violet-400' : 'text-amber-400'}`}>
            {turn === 'player' ? '👤 Your turn — pick a pile and how many to take' : '🤖 Computer thinking...'}
          </p>
        )}
        {status === 'player_wins' && <p className="text-emerald-400 font-semibold">🎉 You win! The computer took the last object.</p>}
        {status === 'computer_wins' && <p className="text-rose-400 font-semibold">💀 Computer wins — it used the XOR strategy.</p>}
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="space-y-1 max-h-28 overflow-y-auto">
          {log.slice(0,5).map((l,i) => (
            <p key={i} className={`text-xs font-mono ${i===0?'text-white/60':'text-white/25'}`}>{l}</p>
          ))}
        </div>
      )}

      {status !== 'playing' && (
        <button onClick={reset}
          className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 py-2.5 text-sm font-semibold text-white transition-all">
          Play Again
        </button>
      )}
    </div>
  )
}

interface Props { game: GameType }

export function NumberGame({ game }: Props) {
  if (game === 'guess') return <GuessGame />
  if (game === 'nim')   return <NimGame />
  return <div className="text-center py-12 text-white/30">Select a game</div>
}
