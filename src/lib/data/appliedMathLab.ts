import { ComponentType, LazyExoticComponent, lazy } from 'react'
import { Target, Group, Brain, type LucideIcon } from 'lucide-react'

export interface AppliedMathLabMeta {
  slug: string
  labelKey: 'computationalMath' | 'dataScienceMath' | 'aiMath'
  descKey: 'computationalMathDesc' | 'dataScienceMathDesc' | 'aiMathDesc'
  icon: LucideIcon
  color: string
  bg: string
  component: LazyExoticComponent<ComponentType>
}

export const APPLIED_MATH_LAB_TOOLS: AppliedMathLabMeta[] = [
  {
    slug: 'computational-mathematics',
    labelKey: 'computationalMath',
    descKey: 'computationalMathDesc',
    icon: Target,
    color: 'text-orange-400',
    bg: 'bg-orange-500/8 border-orange-500/20',
    component: lazy(() => import('@/components/applied-math-lab/ComputationalMathematics').then((m) => ({ default: m.ComputationalMathematics }))),
  },
  {
    slug: 'data-science-mathematics',
    labelKey: 'dataScienceMath',
    descKey: 'dataScienceMathDesc',
    icon: Group,
    color: 'text-teal-400',
    bg: 'bg-teal-500/8 border-teal-500/20',
    component: lazy(() => import('@/components/applied-math-lab/DataScienceMathematics').then((m) => ({ default: m.DataScienceMathematics }))),
  },
  {
    slug: 'ai-mathematics',
    labelKey: 'aiMath',
    descKey: 'aiMathDesc',
    icon: Brain,
    color: 'text-violet-400',
    bg: 'bg-violet-500/8 border-violet-500/20',
    component: lazy(() => import('@/components/applied-math-lab/AIMathematics').then((m) => ({ default: m.AIMathematics }))),
  },
]

export function getAppliedMathLabToolBySlug(slug: string): AppliedMathLabMeta | undefined {
  return APPLIED_MATH_LAB_TOOLS.find((g) => g.slug === slug)
}
