'use client'
import { useState } from 'react'
import { Wand2, RotateCcw } from 'lucide-react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { addXP, updateStats, getStats, updateStreak, checkAchievements } from '@/lib/data/user-progress'

const SOLVER_PREFIX =
  'You are solving one specific problem the student pasted below. Respond with: ' +
  '(1) a one-line restatement of what is being asked, ' +
  '(2) numbered step-by-step solution with brief reasoning for each step, using LaTeX for all math, ' +
  '(3) a clearly marked Final Answer line. Do not ask follow-up questions — just solve it.'

export default function AIProblemSolverPage() {
  const { tt } = useLanguage()
  const [problem, setProblem] = useState('')
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [solvedOnce, setSolvedOnce] = useState(false)

  const solve = async () => {
    const text = problem.trim()
    if (!text || loading) return
    setLoading(true)
    setError('')
    setSolution('')

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text, timestamp: new Date() }],
          topicContext: SOLVER_PREFIX,
        }),
      })
      const data = await res.json()
      setSolution(data.reply ?? tt(t.aiTutor.errorReply))

      if (!solvedOnce) {
        setSolvedOnce(true)
        updateStreak()
        updateStats({ tutorSessions: getStats().tutorSessions + 1 })
        addXP(5)
        checkAchievements()
      }
    } catch {
      setError(tt(t.aiTutor.connectionError))
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setProblem('')
    setSolution('')
    setError('')
  }

  const EXAMPLES = [
    tt(t.aiProblemSolver.example1),
    tt(t.aiProblemSolver.example2),
    tt(t.aiProblemSolver.example3),
  ]

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.aiProblemSolver.tag)}</p>
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-violet-400" /> {tt(t.aiProblemSolver.title)}
          </h1>
          <p className="text-white/40">{tt(t.aiProblemSolver.subtitle)}</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder={tt(t.aiProblemSolver.placeholder)}
            rows={4}
            className="w-full bg-white/[0.06] border border-white/10 focus:border-violet-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none transition-all resize-none"
          />

          <div className="flex flex-wrap gap-2 mt-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setProblem(ex)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-white/8 text-white/35 hover:text-white/70 hover:border-white/20 transition-all"
              >
                {ex}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={solve}
              disabled={!problem.trim() || loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed py-2.5 text-sm font-semibold text-white transition-all"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              {loading ? tt(t.aiProblemSolver.solving) : tt(t.aiProblemSolver.solveButton)}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-xs text-rose-400 text-center bg-rose-500/8 border border-rose-500/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {solution && (
          <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-wider text-violet-400/70 font-mono mb-3">{tt(t.aiProblemSolver.solutionLabel)}</p>
            <div className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">{solution}</div>
          </div>
        )}

        <p className="text-[10px] text-white/15 text-center mt-6">{tt(t.aiTutor.poweredBy)}</p>
      </div>
    </main>
  )
}
