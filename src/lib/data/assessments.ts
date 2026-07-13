import { ComponentType, LazyExoticComponent, lazy } from 'react'
import { FileCheck2, BookMarked, GraduationCap, Sparkles, Trophy, Landmark, Target, type LucideIcon } from 'lucide-react'

export interface AssessmentMeta {
  slug: string
  labelKey: 'quiz' | 'unitTest' | 'mockExam' | 'adaptiveExam' | 'olympiadTest' | 'universityTest' | 'skillAssessment'
  descKey: 'quizDesc' | 'unitTestDesc' | 'mockExamDesc' | 'adaptiveExamDesc' | 'olympiadTestDesc' | 'universityTestDesc' | 'skillAssessmentDesc'
  icon: LucideIcon
  color: string
  bg: string
  component: LazyExoticComponent<ComponentType>
}

export const ASSESSMENTS: AssessmentMeta[] = [
  {
    slug: 'quiz',
    labelKey: 'quiz',
    descKey: 'quizDesc',
    icon: FileCheck2,
    color: 'text-violet-400',
    bg: 'bg-violet-500/8 border-violet-500/20',
    component: lazy(() => import('@/components/assessment/QuizAssessment').then((m) => ({ default: m.QuizAssessment }))),
  },
  {
    slug: 'unit-test',
    labelKey: 'unitTest',
    descKey: 'unitTestDesc',
    icon: BookMarked,
    color: 'text-blue-400',
    bg: 'bg-blue-500/8 border-blue-500/20',
    component: lazy(() => import('@/components/assessment/UnitTestAssessment').then((m) => ({ default: m.UnitTestAssessment }))),
  },
  {
    slug: 'mock-exam',
    labelKey: 'mockExam',
    descKey: 'mockExamDesc',
    icon: GraduationCap,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
    component: lazy(() => import('@/components/assessment/MockExamAssessment').then((m) => ({ default: m.MockExamAssessment }))),
  },
  {
    slug: 'adaptive-exam',
    labelKey: 'adaptiveExam',
    descKey: 'adaptiveExamDesc',
    icon: Sparkles,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/8 border-fuchsia-500/20',
    component: lazy(() => import('@/components/assessment/AdaptiveExamAssessment').then((m) => ({ default: m.AdaptiveExamAssessment }))),
  },
  {
    slug: 'olympiad-test',
    labelKey: 'olympiadTest',
    descKey: 'olympiadTestDesc',
    icon: Trophy,
    color: 'text-amber-400',
    bg: 'bg-amber-500/8 border-amber-500/20',
    component: lazy(() => import('@/components/assessment/OlympiadTestAssessment').then((m) => ({ default: m.OlympiadTestAssessment }))),
  },
  {
    slug: 'university-test',
    labelKey: 'universityTest',
    descKey: 'universityTestDesc',
    icon: Landmark,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/8 border-cyan-500/20',
    component: lazy(() => import('@/components/assessment/UniversityTestAssessment').then((m) => ({ default: m.UniversityTestAssessment }))),
  },
  {
    slug: 'skill-assessment',
    labelKey: 'skillAssessment',
    descKey: 'skillAssessmentDesc',
    icon: Target,
    color: 'text-rose-400',
    bg: 'bg-rose-500/8 border-rose-500/20',
    component: lazy(() => import('@/components/assessment/SkillAssessment').then((m) => ({ default: m.SkillAssessment }))),
  },
]

export function getAssessmentBySlug(slug: string): AssessmentMeta | undefined {
  return ASSESSMENTS.find((a) => a.slug === slug)
}
