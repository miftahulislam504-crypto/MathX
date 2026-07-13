// Shared question-generation helpers for Practice Center. Builds multiple-
// choice questions from existing static data (formulas, theorems, topics)
// rather than calling the AI generator — this keeps Practice Center modes
// instant and deterministic, unlike the AI-based /practice generator.

import { FORMULAS, FormulaEntry } from './formulas'
import { THEOREMS, TheoremEntry } from './theorems'
import { TOPICS } from './topics'
import { Topic } from '@/types'
import { MATH_BRANCHES } from './branches'

export interface QuizQuestion {
  id: string
  prompt: string
  promptLatex?: string
  choices: string[]
  correctIndex: number
  explanation: string
  topicSlug?: string
  branchId?: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistractors<T>(pool: T[], exclude: T, count: number, key: (item: T) => string): T[] {
  const candidates = pool.filter((item) => key(item) !== key(exclude))
  return shuffle(candidates).slice(0, count)
}

// ── Formula-based questions: "Which formula matches this description?" ────
export function buildFormulaQuestion(formula: FormulaEntry): QuizQuestion {
  const distractors = pickDistractors(FORMULAS, formula, 3, (f) => f.id)
  const choices = shuffle([formula, ...distractors])
  return {
    id: `q-formula-${formula.id}`,
    prompt: `Which formula is used for: "${formula.description}"?`,
    choices: choices.map((f) => f.title),
    correctIndex: choices.findIndex((f) => f.id === formula.id),
    explanation: `${formula.title}: this is the formula for ${formula.description.toLowerCase()}.`,
    topicSlug: formula.topicSlug,
    branchId: formula.branchId,
  }
}

// ── Theorem-based questions: "Who proved / what method for this theorem?" ──
export function buildTheoremQuestion(theorem: TheoremEntry): QuizQuestion {
  const mode = Math.random() < 0.5 ? 'discoverer' : 'method'
  if (mode === 'discoverer') {
    const distractors = pickDistractors(THEOREMS, theorem, 3, (th) => th.id)
    const choiceValues = shuffle([theorem, ...distractors]).map((th) => th.discoveredBy.split(';')[0].split(',')[0])
    const correctVal = theorem.discoveredBy.split(';')[0].split(',')[0]
    return {
      id: `q-theorem-who-${theorem.id}`,
      prompt: `Who is credited with the "${theorem.title}"?`,
      choices: choiceValues,
      correctIndex: choiceValues.indexOf(correctVal),
      explanation: `${theorem.title} (${theorem.year}) is credited to ${theorem.discoveredBy}.`,
      topicSlug: theorem.topicSlug,
      branchId: theorem.branchId,
    }
  }
  const distractors = pickDistractors(THEOREMS, theorem, 3, (th) => th.id)
  const choiceValues = shuffle([theorem, ...distractors]).map((th) => th.proofMethod)
  return {
    id: `q-theorem-method-${theorem.id}`,
    prompt: `What proof method is used for the "${theorem.title}"?`,
    choices: choiceValues,
    correctIndex: choiceValues.indexOf(theorem.proofMethod),
    explanation: `${theorem.title} is proved using: ${theorem.proofMethod}.`,
    topicSlug: theorem.topicSlug,
    branchId: theorem.branchId,
  }
}

// ── Topic-based questions: "Which branch does this topic belong to?" ──────
export function buildTopicQuestion(topic: Topic): QuizQuestion {
  const branch = MATH_BRANCHES.find((b) => b.id === topic.branchId)
  const distractorBranches = shuffle(MATH_BRANCHES.filter((b) => b.id !== topic.branchId)).slice(0, 3)
  const choices = shuffle([branch, ...distractorBranches].filter((b): b is NonNullable<typeof b> => !!b))
  return {
    id: `q-topic-${topic.id}`,
    prompt: `"${topic.title}" belongs to which branch of mathematics?`,
    choices: choices.map((b) => b.name),
    correctIndex: choices.findIndex((b) => b.id === topic.branchId),
    explanation: `${topic.title} is part of ${branch?.name ?? 'this branch'}.`,
    topicSlug: topic.slug,
    branchId: topic.branchId,
  }
}

// ── Mode-specific question set builders ────────────────────────────────────

export function buildChapterQuestions(branchId: string, count = 8): QuizQuestion[] {
  const branchFormulas = FORMULAS.filter((f) => f.branchId === branchId)
  const branchTheorems = THEOREMS.filter((th) => th.branchId === branchId)
  const branchTopics = TOPICS.filter((tp) => tp.branchId === branchId)

  const pool: QuizQuestion[] = [
    ...branchFormulas.map(buildFormulaQuestion),
    ...branchTheorems.map(buildTheoremQuestion),
    ...branchTopics.map(buildTopicQuestion),
  ]
  return shuffle(pool).slice(0, Math.min(count, pool.length))
}

export function buildSkillQuestions(topicSlug: string, count = 6): QuizQuestion[] {
  const formulasHere = FORMULAS.filter((f) => f.topicSlug === topicSlug)
  const theoremsHere = THEOREMS.filter((th) => th.topicSlug === topicSlug)
  const pool: QuizQuestion[] = [...formulasHere.map(buildFormulaQuestion), ...theoremsHere.map(buildTheoremQuestion)]
  // If a topic has too little dedicated content, pad with formulas from the same branch
  if (pool.length < count) {
    const topic = TOPICS.find((tp) => tp.slug === topicSlug)
    if (topic) {
      const branchFormulas = FORMULAS.filter((f) => f.branchId === topic.branchId && f.topicSlug !== topicSlug)
      pool.push(...shuffle(branchFormulas).slice(0, count - pool.length).map(buildFormulaQuestion))
    }
  }
  return shuffle(pool).slice(0, Math.min(count, pool.length))
}

export function buildTheoremPracticeQuestions(count = 8): QuizQuestion[] {
  return shuffle(THEOREMS).slice(0, count).map(buildTheoremQuestion)
}

export function buildMixedQuestions(count = 10): QuizQuestion[] {
  const pool: QuizQuestion[] = [
    ...shuffle(FORMULAS).slice(0, Math.ceil(count / 2)).map(buildFormulaQuestion),
    ...shuffle(THEOREMS).slice(0, Math.floor(count / 3)).map(buildTheoremQuestion),
    ...shuffle(TOPICS).slice(0, Math.floor(count / 4)).map(buildTopicQuestion),
  ]
  return shuffle(pool).slice(0, count)
}

// Adaptive: given current difficulty tier (0=easy branches like arithmetic,
// higher=advanced/research branches), pick a question from a branch at
// roughly that tier.
const BRANCH_TIERS: Record<string, number> = {
  '1': 0, '2': 0, '3': 0,           // Arithmetic, Algebra, Geometry
  '4': 1, '6': 1, '7': 1, '8': 1,   // Trigonometry, Linear Algebra, Statistics, Probability
  '5': 2, '9': 2, '10': 2,          // Calculus, Number Theory, Diff Eq
  '11': 3, '12': 3, '13': 3, '14': 3, '15': 3, // Real Analysis, Abstract Algebra, Topology, Complex Analysis, Numerical Methods
}

export function buildAdaptiveQuestion(tier: number): QuizQuestion {
  const clampedTier = Math.max(0, Math.min(3, tier))
  const eligibleBranches = Object.entries(BRANCH_TIERS).filter(([, t]) => t === clampedTier).map(([id]) => id)
  const pool = buildMixedQuestions(40).filter((q) => q.branchId && eligibleBranches.includes(q.branchId))
  const fallbackPool = buildMixedQuestions(20)
  const finalPool = pool.length > 0 ? pool : fallbackPool
  return finalPool[Math.floor(Math.random() * finalPool.length)]
}

// University-level: draws only from tier 2-3 branches (Calculus, Number
// Theory, Real Analysis, Abstract Algebra, Topology, Complex Analysis,
// Numerical Methods, etc.) — genuinely advanced/research-tier content.
export function buildUniversityQuestions(count = 15): QuizQuestion[] {
  const eligibleBranches = Object.entries(BRANCH_TIERS).filter(([, t]) => t >= 2).map(([id]) => id)
  const branchFormulas = FORMULAS.filter((f) => eligibleBranches.includes(f.branchId))
  const branchTheorems = THEOREMS.filter((th) => eligibleBranches.includes(th.branchId))
  const branchTopics = TOPICS.filter((tp) => eligibleBranches.includes(tp.branchId) && (tp.level === 'ADVANCED' || tp.level === 'RESEARCH' || tp.level === 'UNIVERSITY'))

  const pool: QuizQuestion[] = [
    ...branchFormulas.map(buildFormulaQuestion),
    ...branchTheorems.map(buildTheoremQuestion),
    ...branchTopics.map(buildTopicQuestion),
  ]
  return shuffle(pool).slice(0, Math.min(count, pool.length))
}
