// Client-side per-mode Practice Center progress store, mirrors the pattern
// in user-progress.ts. Tracks separate stats for each of the 5 practice
// modes (Chapter, Skill, Theorem, Timed, Adaptive) so each mode can show
// its own streak, best score, and attempt history.

export type PracticeMode = 'chapter' | 'skill' | 'theorem' | 'timed' | 'adaptive'

export interface PracticeAttempt {
  date: string       // ISO date
  mode: PracticeMode
  score: number       // correct answers
  total: number       // total questions
  durationSec: number
  topicSlug?: string
}

export interface ModeStats {
  bestScore: number      // best (score/total) ratio, 0-100
  bestStreak: number     // longest correct-in-a-row streak
  currentStreak: number
  attemptsCount: number
  totalCorrect: number
  totalAttempted: number
  lastPlayed: string
}

const DEFAULT_MODE_STATS: ModeStats = {
  bestScore: 0, bestStreak: 0, currentStreak: 0,
  attemptsCount: 0, totalCorrect: 0, totalAttempted: 0, lastPlayed: '',
}

const KEYS = {
  modeStats: 'mathx_practice_mode_stats',
  history: 'mathx_practice_history',
}

export function getAllModeStats(): Record<PracticeMode, ModeStats> {
  if (typeof window === 'undefined') {
    return { chapter: DEFAULT_MODE_STATS, skill: DEFAULT_MODE_STATS, theorem: DEFAULT_MODE_STATS, timed: DEFAULT_MODE_STATS, adaptive: DEFAULT_MODE_STATS }
  }
  try {
    const stored = JSON.parse(localStorage.getItem(KEYS.modeStats) || '{}')
    return {
      chapter: { ...DEFAULT_MODE_STATS, ...stored.chapter },
      skill: { ...DEFAULT_MODE_STATS, ...stored.skill },
      theorem: { ...DEFAULT_MODE_STATS, ...stored.theorem },
      timed: { ...DEFAULT_MODE_STATS, ...stored.timed },
      adaptive: { ...DEFAULT_MODE_STATS, ...stored.adaptive },
    }
  } catch {
    return { chapter: DEFAULT_MODE_STATS, skill: DEFAULT_MODE_STATS, theorem: DEFAULT_MODE_STATS, timed: DEFAULT_MODE_STATS, adaptive: DEFAULT_MODE_STATS }
  }
}

export function getModeStats(mode: PracticeMode): ModeStats {
  return getAllModeStats()[mode]
}

// Records the result of a single question within a practice session.
// Updates running streak, best streak, and correct/attempted counts for
// the given mode. Call once per question answered.
export function recordAnswer(mode: PracticeMode, correct: boolean) {
  const all = getAllModeStats()
  const stats = all[mode]
  const currentStreak = correct ? stats.currentStreak + 1 : 0
  const bestStreak = Math.max(stats.bestStreak, currentStreak)
  const totalCorrect = stats.totalCorrect + (correct ? 1 : 0)
  const totalAttempted = stats.totalAttempted + 1

  all[mode] = { ...stats, currentStreak, bestStreak, totalCorrect, totalAttempted }
  localStorage.setItem(KEYS.modeStats, JSON.stringify(all))
  return all[mode]
}

// Records the completion of a full practice session (a set of questions),
// updating bestScore and attempt count, and appending to history.
export function recordSessionComplete(mode: PracticeMode, score: number, total: number, durationSec: number, topicSlug?: string) {
  const all = getAllModeStats()
  const stats = all[mode]
  const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0
  const bestScore = Math.max(stats.bestScore, scorePercent)

  all[mode] = {
    ...stats,
    bestScore,
    attemptsCount: stats.attemptsCount + 1,
    lastPlayed: new Date().toISOString(),
  }
  localStorage.setItem(KEYS.modeStats, JSON.stringify(all))

  const history = getHistory()
  history.unshift({ date: new Date().toISOString(), mode, score, total, durationSec, topicSlug })
  localStorage.setItem(KEYS.history, JSON.stringify(history.slice(0, 100))) // cap at 100 entries

  return all[mode]
}

export function getHistory(limit = 20): PracticeAttempt[] {
  if (typeof window === 'undefined') return []
  try {
    const all: PracticeAttempt[] = JSON.parse(localStorage.getItem(KEYS.history) || '[]')
    return all.slice(0, limit)
  } catch { return [] }
}

export function resetPracticeProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEYS.modeStats)
  localStorage.removeItem(KEYS.history)
}
