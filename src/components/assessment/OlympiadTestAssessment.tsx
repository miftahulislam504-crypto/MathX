'use client'
import { useState } from 'react'
import { Trophy, Lightbulb, CheckCircle2, XCircle } from 'lucide-react'
import { getProblemsByCategory, Problem } from '@/lib/data/problems'
import { recordAttempt, AssessmentAttempt } from '@/lib/data/assessment-progress'
import { ExamResults } from './ExamResults'
import { QuizQuestion } from '@/lib/data/quiz-builder'

// Olympiad problems are proof/derivation style, not multiple-choice — so
// this assessment shows one problem at a time, lets the student attempt it,
// reveals the hint then the full solution on request, and asks the student
// to honestly self-grade whether they solved it. This is a standard pattern
// for assessing open-ended proof-based work that can't be auto-graded.
export function OlympiadTestAssessment() {
  const problems = getProblemsByCategory('olympiad')
  const [running, setRunning] = useState(false)
  const [pIndex, setPIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [selfGrades, setSelfGrades] = useState<(boolean | null)[]>([])
  const [startedAt, setStartedAt] = useState(0)
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null)

  const start = () => {
    setRunning(true)
    setPIndex(0)
    setShowHint(false)
    setShowSolution(false)
    setSelfGrades(new Array(problems.length).fill(null))
    setStartedAt(Date.now())
    setAttempt(null)
  }

  const gradeSelf = (correct: boolean) => {
    const next = [...selfGrades]
    next[pIndex] = correct
    setSelfGrades(next)
    if (pIndex < problems.length - 1) {
      setTimeout(() => {
        setPIndex((i) => i + 1)
        setShowHint(false)
        setShowSolution(false)
      }, 400)
    } else {
      finish(next)
    }
  }

  const finish = (grades: (boolean | null)[]) => {
    setRunning(false)
    const score = grades.filter((g) => g === true).length
    const durationSec = Math.round((Date.now() - startedAt) / 1000)
    const rec = recordAttempt({
      type: 'olympiad-test',
      title: 'Olympiad Test',
      score,
      total: problems.length,
      durationSec,
    }, 60) // olympiad-level problems are hard — lower passing bar (60%) than standard exams
    setAttempt(rec)
  }

  if (attempt) {
    // Build pseudo-questions for ExamResults' review list, matching its expected shape
    const pseudoQuestions: QuizQuestion[] = problems.map((p) => ({
      id: p.id, prompt: p.title, choices: ['Solved correctly', 'Did not solve'],
      correctIndex: 0, explanation: p.solution,
    }))
    const pseudoAnswers = selfGrades.map((g) => (g ? 0 : 1))
    return (
      <ExamResults
        questions={pseudoQuestions}
        answers={pseudoAnswers}
        attempt={attempt}
        certificateTitle="Olympiad Test"
        onRetry={start}
      />
    )
  }

  if (running && problems[pIndex]) {
    const p: Problem = problems[pIndex]
    return (
      <div className="space-y-5">
        <p className="text-xs text-white/30 font-mono">Problem {pIndex + 1} / {problems.length}</p>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h3 className="text-sm font-semibold text-amber-300 mb-3">{p.title}</h3>
          <p className="text-sm text-white/75 leading-relaxed">{p.statement}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowHint((s) => !s)}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-white/10 hover:border-white/20 px-4 py-2.5 text-xs text-white/60 hover:text-white transition-all"
          >
            <Lightbulb className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          <button
            onClick={() => setShowSolution((s) => !s)}
            className="flex-1 rounded-lg border border-white/10 hover:border-white/20 px-4 py-2.5 text-xs text-white/60 hover:text-white transition-all"
          >
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
        </div>

        {showHint && (
          <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-amber-400/60 mb-1">Hint</p>
            <p className="text-sm text-amber-100/70">{p.hint}</p>
          </div>
        )}
        {showSolution && (
          <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-violet-400/60 mb-1">Full Solution</p>
            <p className="text-sm text-violet-100/80 leading-relaxed">{p.solution}</p>
          </div>
        )}

        {showSolution && (
          <div>
            <p className="text-xs text-white/40 text-center mb-3">Be honest — did you solve it before checking?</p>
            <div className="flex gap-2">
              <button
                onClick={() => gradeSelf(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> I Solved It
              </button>
              <button
                onClick={() => gradeSelf(false)}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-all"
              >
                <XCircle className="w-4 h-4" /> Did Not Solve
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="text-center py-10 space-y-6">
      <Trophy className="w-10 h-10 mx-auto text-amber-400" />
      <p className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
        {problems.length} competition-style problems from the Olympiad problem bank. These require full proofs,
        not multiple choice — attempt each, then self-grade honestly against the full solution.
      </p>
      <button
        onClick={start}
        className="rounded-lg bg-amber-600 hover:bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition-all"
      >
        Begin Olympiad Test
      </button>
    </div>
  )
}
