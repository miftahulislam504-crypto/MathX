// Client-side Assessment System store. Distinct from practice-progress.ts:
// assessments are formal, scored, and can produce a certificate on a strong
// pass. Practice Center is for casual drilling; Assessment System is exam-like.

export type AssessmentType = 'quiz' | 'unit-test' | 'mock-exam' | 'adaptive-exam' | 'olympiad-test' | 'university-test' | 'skill-assessment'

export interface AssessmentAttempt {
  id: string
  type: AssessmentType
  title: string
  score: number
  total: number
  percent: number
  passed: boolean
  date: string // ISO
  durationSec: number
  branchId?: string
  level?: string
}

export interface Certificate {
  id: string
  attemptId: string
  title: string          // e.g. "Algebra Mastery Certificate"
  recipientName: string
  percent: number
  dateIssued: string
  type: AssessmentType
}

const KEYS = {
  attempts: 'mathx_assessment_attempts',
  certificates: 'mathx_assessment_certificates',
}

// Passing threshold: 70% for most exams, configurable per call site if needed.
export const DEFAULT_PASS_THRESHOLD = 70
// Certificate threshold is stricter than merely passing — signals real mastery.
export const CERTIFICATE_THRESHOLD = 85

export function getAttempts(type?: AssessmentType): AssessmentAttempt[] {
  if (typeof window === 'undefined') return []
  try {
    const all: AssessmentAttempt[] = JSON.parse(localStorage.getItem(KEYS.attempts) || '[]')
    return type ? all.filter((a) => a.type === type) : all
  } catch { return [] }
}

export function recordAttempt(attempt: Omit<AssessmentAttempt, 'id' | 'date' | 'percent' | 'passed'>, passThreshold = DEFAULT_PASS_THRESHOLD): AssessmentAttempt {
  const percent = attempt.total > 0 ? Math.round((attempt.score / attempt.total) * 100) : 0
  const full: AssessmentAttempt = {
    ...attempt,
    id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
    percent,
    passed: percent >= passThreshold,
  }
  const all = getAttempts()
  all.unshift(full)
  localStorage.setItem(KEYS.attempts, JSON.stringify(all.slice(0, 200)))
  return full
}

export function getBestAttempt(type: AssessmentType): AssessmentAttempt | null {
  const attempts = getAttempts(type)
  if (attempts.length === 0) return null
  return attempts.reduce((best, a) => (a.percent > best.percent ? a : best), attempts[0])
}

export function getCertificates(): Certificate[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEYS.certificates) || '[]')
  } catch { return [] }
}

// Issues a certificate if the attempt clears the certificate threshold and
// no certificate already exists for this exact attempt. Returns the new
// certificate, or null if the attempt didn't qualify.
export function maybeIssueCertificate(attempt: AssessmentAttempt, recipientName: string, certTitle: string): Certificate | null {
  if (attempt.percent < CERTIFICATE_THRESHOLD) return null
  const existing = getCertificates()
  if (existing.some((c) => c.attemptId === attempt.id)) return existing.find((c) => c.attemptId === attempt.id) ?? null

  const cert: Certificate = {
    id: `cert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    attemptId: attempt.id,
    title: certTitle,
    recipientName: recipientName || 'Student',
    percent: attempt.percent,
    dateIssued: new Date().toISOString(),
    type: attempt.type,
  }
  const all = [cert, ...existing]
  localStorage.setItem(KEYS.certificates, JSON.stringify(all.slice(0, 100)))
  return cert
}

export function resetAssessmentProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEYS.attempts)
  localStorage.removeItem(KEYS.certificates)
}
