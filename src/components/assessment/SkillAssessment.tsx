'use client'
import { useState } from 'react'
import { Target } from 'lucide-react'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { TOPICS } from '@/lib/data/topics'
import { buildSkillQuestions, QuizQuestion } from '@/lib/data/quiz-builder'
import { ExamRunner } from './ExamRunner'
import { ExamResults } from './ExamResults'
import { recordAttempt, AssessmentAttempt } from '@/lib/data/assessment-progress'

export function SkillAssessment() {
  const [activeBranch, setActiveBranch] = useState<string | null>(null)
  const [topicSlug, setTopicSlug] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<(number | null)[] | null>(null)
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null)
  const [startedAt, setStartedAt] = useState(0)

  const start = (slug: string) => {
    setTopicSlug(slug)
    setQuestions(buildSkillQuestions(slug, 8))
    setAnswers(null)
    setAttempt(null)
    setStartedAt(Date.now())
  }

  const handleComplete = (finalAnswers: (number | null)[]) => {
    const topic = TOPICS.find((tp) => tp.slug === topicSlug)
    const score = finalAnswers.filter((a, i) => a === questions[i].correctIndex).length
    const durationSec = Math.round((Date.now() - startedAt) / 1000)
    const rec = recordAttempt({
      type: 'skill-assessment',
      title: `${topic?.title ?? 'Skill'} Assessment`,
      score,
      total: questions.length,
      durationSec,
      level: topic?.level,
    })
    setAnswers(finalAnswers)
    setAttempt(rec)
  }

  if (attempt && answers) {
    const topic = TOPICS.find((tp) => tp.slug === topicSlug)
    return (
      <ExamResults
        questions={questions}
        answers={answers}
        attempt={attempt}
        certificateTitle={`${topic?.title ?? 'Skill'} Mastery`}
        onRetry={() => topicSlug && start(topicSlug)}
      />
    )
  }

  if (questions.length > 0) {
    return <ExamRunner questions={questions} onComplete={handleComplete} />
  }

  const branchesWithTopics = MATH_BRANCHES.filter((b) => TOPICS.some((tp) => tp.branchId === b.id))

  if (!activeBranch) {
    return (
      <div className="space-y-5">
        <div className="text-center py-4">
          <Target className="w-8 h-8 mx-auto text-rose-400 mb-3" />
          <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
            Get a certified score for one specific skill. First pick a branch, then a topic to be tested on.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {branchesWithTopics.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBranch(b.id)}
              className="text-left rounded-lg border border-white/8 bg-white/[0.02] hover:border-rose-500/30 hover:bg-white/[0.05] px-4 py-3 transition-all flex items-center gap-3"
            >
              <span className="text-lg">{b.icon}</span>
              <span className="text-sm text-white/70">{b.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const branch = MATH_BRANCHES.find((b) => b.id === activeBranch)
  const topicsHere = TOPICS.filter((tp) => tp.branchId === activeBranch)

  return (
    <div className="space-y-5">
      <button onClick={() => setActiveBranch(null)} className="text-xs text-white/40 hover:text-white/70 transition-colors">
        ← Back to branches
      </button>
      <p className="text-sm text-white/60">{branch?.icon} {branch?.name} — pick a topic to be tested on</p>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {topicsHere.map((tp) => (
          <button
            key={tp.id}
            onClick={() => start(tp.slug)}
            className="text-left rounded-lg border border-white/8 bg-white/[0.02] hover:border-rose-500/30 hover:bg-white/[0.05] px-4 py-2.5 transition-all text-sm text-white/65"
          >
            {tp.title}
          </button>
        ))}
      </div>
    </div>
  )
}
