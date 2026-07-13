// Client-side progress store using localStorage
// In production this syncs to PostgreSQL via API

import { TOPICS } from './topics'
import { MATH_BRANCHES } from './branches'
import { ACHIEVEMENTS } from './achievements'

export interface TopicProgress {
  topicSlug: string
  mastery: number      // 0–100
  lastStudied: string  // ISO date
  timeSpent: number    // seconds
  sessionsCount: number
}

export interface DailySession {
  date: string         // YYYY-MM-DD
  minutes: number
  topicsStudied: string[]
}

export interface UserStats {
  totalXP: number
  level: number
  streak: number
  lastActive: string
  topicsCompleted: number
  problemsSolved: number
  labExperiments: number
  tutorSessions: number
  achievements: string[]  // achievement ids
}

const DEFAULT_STATS: UserStats = {
  totalXP: 0, level: 1, streak: 0, lastActive: '',
  topicsCompleted: 0, problemsSolved: 0, labExperiments: 0,
  tutorSessions: 0, achievements: [],
}

const KEYS = {
  progress: 'mathx_topic_progress',
  stats:    'mathx_user_stats',
  sessions: 'mathx_daily_sessions',
}

// ── Progress ────────────────────────────────────────────────────────
export function getProgress(): Record<string, TopicProgress> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(KEYS.progress) || '{}') } catch { return {} }
}

export function setTopicProgress(slug: string, mastery: number, timeSpent = 0) {
  const all = getProgress()
  const existing = all[slug]
  all[slug] = {
    topicSlug: slug,
    mastery: Math.min(100, Math.max(0, mastery)),
    lastStudied: new Date().toISOString(),
    timeSpent: (existing?.timeSpent ?? 0) + timeSpent,
    sessionsCount: (existing?.sessionsCount ?? 0) + 1,
  }
  localStorage.setItem(KEYS.progress, JSON.stringify(all))
  return all[slug]
}

export function getMastery(slug: string): number {
  return getProgress()[slug]?.mastery ?? 0
}

// ── Stats ────────────────────────────────────────────────────────────
export function getStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS
  try { return { ...DEFAULT_STATS, ...JSON.parse(localStorage.getItem(KEYS.stats) || '{}') } }
  catch { return DEFAULT_STATS }
}

export function updateStats(patch: Partial<UserStats>) {
  const current = getStats()
  const updated = { ...current, ...patch }
  localStorage.setItem(KEYS.stats, JSON.stringify(updated))
  return updated
}

export function addXP(amount: number): UserStats {
  const stats = getStats()
  const newXP = stats.totalXP + amount
  const newLevel = Math.floor(1 + Math.sqrt(newXP / 100))
  return updateStats({ totalXP: newXP, level: newLevel })
}

export function unlockAchievement(id: string): boolean {
  const stats = getStats()
  if (stats.achievements.includes(id)) return false
  updateStats({ achievements: [...stats.achievements, id] })
  addXP(50)
  return true
}

// Re-evaluates the subset of achievement conditions that can be derived
// purely from UserStats numeric fields (topics_completed, problems_solved,
// streak, tutor_sessions, lab_visited). Mastery/branch-based conditions are
// intentionally skipped here since they need richer data than UserStats
// tracks today. Call this after any stat-changing action.
export function checkAchievements(): string[] {
  const stats = getStats()
  const unlocked: string[] = []

  const simpleChecks: Record<string, boolean> = {
    'first-topic':   stats.topicsCompleted >= 1,
    'five-topics':   stats.topicsCompleted >= 5,
    'ten-topics':    stats.topicsCompleted >= 10,
    'first-problem': stats.problemsSolved >= 1,
    'ten-problems':  stats.problemsSolved >= 10,
    'fifty-problems':stats.problemsSolved >= 50,
    'first-lab':     stats.labExperiments >= 1,
    'ai-student':    stats.tutorSessions >= 10,
    'streak-3':      stats.streak >= 3,
    'streak-7':      stats.streak >= 7,
    'streak-30':     stats.streak >= 30,
  }

  for (const achievement of ACHIEVEMENTS) {
    if (achievement.id in simpleChecks && simpleChecks[achievement.id]) {
      if (unlockAchievement(achievement.id)) unlocked.push(achievement.id)
    }
  }

  return unlocked
}

export function updateStreak() {
  const stats = getStats()
  const today = new Date().toISOString().split('T')[0]
  const last  = stats.lastActive?.split('T')[0] ?? ''
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  let streak = stats.streak
  if (last === today) return stats           // already updated today
  if (last === yesterday) streak++           // consecutive day
  else streak = 1                            // reset

  return updateStats({ streak, lastActive: new Date().toISOString() })
}

// Permanently erases all locally-stored progress (stats, topic mastery,
// and daily session history). Used by the "Reset Progress" control in
// Settings. This cannot be undone from the client.
export function resetProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEYS.stats)
  localStorage.removeItem(KEYS.progress)
  localStorage.removeItem(KEYS.sessions)
  localStorage.removeItem('mathx_practice_mode_stats')
  localStorage.removeItem('mathx_practice_history')
  localStorage.removeItem('mathx_assessment_attempts')
  localStorage.removeItem('mathx_assessment_certificates')
}

// ── Daily sessions ────────────────────────────────────────────────────
export function getDailySessions(days = 30): DailySession[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEYS.sessions) || '[]') }
  catch { return [] }
}

export function recordSession(topicSlug: string, minutes: number) {
  const sessions = getDailySessions()
  const today = new Date().toISOString().split('T')[0]
  const existing = sessions.find(s => s.date === today)
  if (existing) {
    existing.minutes += minutes
    if (!existing.topicsStudied.includes(topicSlug)) existing.topicsStudied.push(topicSlug)
  } else {
    sessions.push({ date: today, minutes, topicsStudied: [topicSlug] })
  }
  // Keep last 60 days
  const kept = sessions.slice(-60)
  localStorage.setItem(KEYS.sessions, JSON.stringify(kept))
}

// ── Computed analytics ────────────────────────────────────────────────
export function computeAnalytics() {
  const progress = getProgress()
  const stats = getStats()
  const sessions = getDailySessions()

  const masteredTopics = Object.values(progress).filter(p => p.mastery >= 70)
  const totalTimeSpent = Object.values(progress).reduce((s, p) => s + p.timeSpent, 0)

  // Branch mastery
  const branchMastery = MATH_BRANCHES.map(branch => {
    const branchTopics = TOPICS.filter(t => t.branchId === branch.id)
    if (!branchTopics.length) return { branch, mastery: 0, studied: 0, total: branchTopics.length }
    const avg = branchTopics.reduce((s, t) => s + getMastery(t.slug), 0) / branchTopics.length
    const studied = branchTopics.filter(t => (progress[t.slug]?.mastery ?? 0) > 0).length
    return { branch, mastery: Math.round(avg), studied, total: branchTopics.length }
  }).filter(b => b.total > 0)

  // Heatmap: last 52 weeks
  const heatmap = Array.from({ length: 52 * 7 }, (_, i) => {
    const d = new Date(Date.now() - (52 * 7 - i) * 86400000)
    const dateStr = d.toISOString().split('T')[0]
    const session = sessions.find(s => s.date === dateStr)
    return { date: dateStr, minutes: session?.minutes ?? 0, day: d.getDay() }
  })

  const xpToNextLevel = (stats.level * stats.level * 100) - stats.totalXP
  const levelProgress = Math.round(
    ((stats.totalXP - ((stats.level-1)**2 * 100)) /
     (stats.level**2 * 100 - (stats.level-1)**2 * 100)) * 100
  )

  return { progress, stats, masteredTopics, totalTimeSpent, branchMastery, heatmap, xpToNextLevel, levelProgress }
}
