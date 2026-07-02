'use client'
import { useState, lazy, Suspense } from 'react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { Zap, Target, Crown, Puzzle, type LucideIcon } from 'lucide-react'

const NumberGame  = lazy(() => import('@/components/games/NumberGame').then(m => ({ default: (props: any) => <m.NumberGame {...props}/> })))
const LogicPuzzles= lazy(() => import('@/components/games/LogicPuzzles').then(m => ({ default: m.LogicPuzzles })))
const MathQuiz    = lazy(() => import('@/components/games/MathQuiz').then(m => ({ default: m.MathQuiz })))

type GameId = 'quiz' | 'guess' | 'nim' | 'logic'

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-16 gap-3">
      <div className="w-6 h-6 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin"/>
      <span className="text-white/30 text-sm font-mono">{label}</span>
    </div>
  )
}

export default function GamesPage() {
  const [active, setActive] = useState<GameId>('quiz')
  const { tt } = useLanguage()

  const GAMES: {
    id: GameId; label: string; icon: LucideIcon; desc: string
    color: string; bg: string; tag: string
  }[] = [
    { id:'quiz',  label:tt(t.games.mathQuiz),     icon:Zap, desc:tt(t.games.mathQuizDesc),     color:'text-violet-400', bg:'bg-violet-500/8 border-violet-500/20', tag:tt(t.games.speed) },
    { id:'guess', label:tt(t.games.numberGuesser),icon:Target, desc:tt(t.games.numberGuesserDesc),color:'text-cyan-400',   bg:'bg-cyan-500/8 border-cyan-500/20',     tag:tt(t.games.strategy) },
    { id:'nim',   label:tt(t.games.nimGame),      icon:Crown, desc:tt(t.games.nimDesc),          color:'text-amber-400',  bg:'bg-amber-500/8 border-amber-500/20',   tag:tt(t.games.gameTheory) },
    { id:'logic', label:tt(t.games.logicPuzzles), icon:Puzzle, desc:tt(t.games.logicDesc),        color:'text-emerald-400',bg:'bg-emerald-500/8 border-emerald-500/20',tag:tt(t.games.puzzles) },
  ]

  const MATH_CONNECTIONS = [
    { game: tt(t.games.mathQuiz),       math: tt(t.games.quizMath) },
    { game: tt(t.games.numberGuesser),  math: tt(t.games.guesserMath) },
    { game: tt(t.games.nimGame),        math: tt(t.games.nimMath) },
    { game: tt(t.games.logicPuzzles),   math: tt(t.games.logicMath) },
  ]

  const game = GAMES.find(g => g.id === active)!

  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.games.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-2">{tt(t.games.title)}</h1>
            <p className="text-white/40 text-sm">
              {tt(t.games.subtitle)}
            </p>
          </div>

          {/* Game selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {GAMES.map(g => (
              <button key={g.id} onClick={() => setActive(g.id)}
                className={`group rounded-xl border p-4 text-left transition-all ${
                  active===g.id ? g.bg+' '+g.color
                    : 'border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15 hover:bg-white/[0.05] hover:text-white/70'
                }`}>
                <g.icon className="w-6 h-6 mb-2" />
                <div className="text-xs font-semibold leading-tight mb-1">{g.label}</div>
                <span className={`text-[10px] rounded-full border px-1.5 py-0.5 ${active===g.id ? 'border-current opacity-50' : 'border-white/10 text-white/20'}`}>
                  {g.tag}
                </span>
              </button>
            ))}
          </div>

          {/* Active game info */}
          <div className={`rounded-xl border ${game.bg} px-5 py-3 mb-6 flex items-center gap-3`}>
            <game.icon className={`w-6 h-6 ${game.color}`} />
            <div>
              <p className={`text-sm font-semibold ${game.color}`}>{game.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{game.desc}</p>
            </div>
          </div>

          {/* Game panel */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-8">
            <Suspense fallback={<Spinner label={tt(t.games.loadingGame)} />}>
              {active==='quiz'  && <MathQuiz />}
              {active==='guess' && <NumberGame game="guess" />}
              {active==='nim'   && <NumberGame game="nim" />}
              {active==='logic' && <LogicPuzzles />}
            </Suspense>
          </div>

          {/* Math connection */}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MATH_CONNECTIONS.map(m => (
              <div key={m.game} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs font-semibold text-white/50 mb-1">{m.game}</p>
                <p className="text-xs text-white/25 leading-relaxed">{m.math}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

    </>
  )
}
