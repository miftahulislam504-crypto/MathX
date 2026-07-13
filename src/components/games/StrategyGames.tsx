'use client'
import { useState } from 'react'
import { Trophy, RotateCcw, Brain } from 'lucide-react'

type Cell = 'X' | 'O' | null
type Difficulty = 'unbeatable' | 'hard' | 'random'

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function checkWinner(board: Cell[]): 'X' | 'O' | 'draw' | null {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  return board.every((c) => c) ? 'draw' : null
}

// Minimax: guarantees optimal play — this AI mathematically cannot lose.
function minimax(board: Cell[], isMaximizing: boolean): number {
  const winner = checkWinner(board)
  if (winner === 'X') return -10
  if (winner === 'O') return 10
  if (winner === 'draw') return 0

  const scores: number[] = []
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = isMaximizing ? 'O' : 'X'
      scores.push(minimax(board, !isMaximizing))
      board[i] = null
    }
  }
  return isMaximizing ? Math.max(...scores) : Math.min(...scores)
}

function bestMove(board: Cell[]): number {
  let best = -Infinity
  let move = -1
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O'
      const score = minimax(board, false)
      board[i] = null
      if (score > best) { best = score; move = i }
    }
  }
  return move
}

function randomMove(board: Cell[]): number {
  const empty = board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0)
  return empty[Math.floor(Math.random() * empty.length)]
}

// "Hard" mode: 70% optimal, 30% random — beatable occasionally, still tough.
function hardMove(board: Cell[]): number {
  return Math.random() < 0.7 ? bestMove(board) : randomMove(board)
}

export function StrategyGames() {
  const [board, setBoard] = useState<Cell[]>(new Array(9).fill(null))
  const [difficulty, setDifficulty] = useState<Difficulty>('unbeatable')
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null)
  const [wins, setWins] = useState({ player: 0, ai: 0, draws: 0 })
  const [thinking, setThinking] = useState(false)

  const playerMove = (idx: number) => {
    if (board[idx] || winner || thinking) return
    const next = [...board]
    next[idx] = 'X'
    setBoard(next)

    const result = checkWinner(next)
    if (result) {
      finishGame(result)
      return
    }

    setThinking(true)
    setTimeout(() => {
      const aiIdx = difficulty === 'unbeatable' ? bestMove(next) : difficulty === 'hard' ? hardMove(next) : randomMove(next)
      if (aiIdx >= 0) next[aiIdx] = 'O'
      setBoard([...next])
      const aiResult = checkWinner(next)
      if (aiResult) finishGame(aiResult)
      setThinking(false)
    }, 400)
  }

  const finishGame = (result: 'X' | 'O' | 'draw') => {
    setWinner(result)
    setWins((w) => ({
      player: w.player + (result === 'X' ? 1 : 0),
      ai: w.ai + (result === 'O' ? 1 : 0),
      draws: w.draws + (result === 'draw' ? 1 : 0),
    }))
  }

  const reset = () => {
    setBoard(new Array(9).fill(null))
    setWinner(null)
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-white/40 leading-relaxed text-center max-w-sm mx-auto">
        Tic-tac-toe on &ldquo;unbeatable&rdquo; uses the minimax algorithm — a mathematical guarantee the AI
        never loses, only wins or draws. Can you force a draw against perfect play?
      </p>

      <div className="flex justify-center gap-2">
        {(['unbeatable', 'hard', 'random'] as const).map((d) => (
          <button
            key={d}
            onClick={() => { setDifficulty(d); reset() }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
              difficulty === d ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => playerMove(i)}
            disabled={!!cell || !!winner || thinking}
            className="aspect-square rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 flex items-center justify-center text-3xl font-bold transition-all disabled:cursor-default"
          >
            {cell === 'X' && <span className="text-cyan-400">X</span>}
            {cell === 'O' && <span className="text-rose-400">O</span>}
          </button>
        ))}
      </div>

      {thinking && (
        <p className="text-center text-xs text-white/30 flex items-center justify-center gap-2">
          <Brain className="w-3.5 h-3.5 animate-pulse" /> AI is thinking...
        </p>
      )}

      {winner && (
        <div className="text-center space-y-3">
          <p className={`text-sm font-semibold ${winner === 'X' ? 'text-emerald-400' : winner === 'O' ? 'text-rose-400' : 'text-white/50'}`}>
            {winner === 'X' ? 'You win!' : winner === 'O' ? 'AI wins.' : "It's a draw!"}
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 px-5 py-2 text-sm font-semibold text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
        </div>
      )}

      <div className="flex justify-center gap-6 text-center pt-2 border-t border-white/5">
        <div>
          <p className="text-lg font-mono text-cyan-400">{wins.player}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-wider">You</p>
        </div>
        <div>
          <p className="text-lg font-mono text-white/40">{wins.draws}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Draws</p>
        </div>
        <div>
          <p className="text-lg font-mono text-rose-400">{wins.ai}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-wider">AI</p>
        </div>
      </div>

      {wins.player > 0 && difficulty === 'unbeatable' && (
        <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2 text-center flex items-center justify-center gap-2">
          <Trophy className="w-3.5 h-3.5" /> That shouldn&apos;t be possible on unbeatable mode — good catch if it happened!
        </p>
      )}
    </div>
  )
}
