import { ComponentType, LazyExoticComponent, lazy } from 'react'
import { Percent, CircleDot, Network, type LucideIcon } from 'lucide-react'

export interface ProbabilityCenterMeta {
  slug: string
  labelKey: 'bayesianProbability' | 'randomVariables' | 'stochasticProcesses'
  descKey: 'bayesianProbabilityDesc' | 'randomVariablesDesc' | 'stochasticProcessesDesc'
  icon: LucideIcon
  color: string
  bg: string
  component: LazyExoticComponent<ComponentType>
}

export const PROBABILITY_CENTER_TOOLS: ProbabilityCenterMeta[] = [
  {
    slug: 'bayesian-probability',
    labelKey: 'bayesianProbability',
    descKey: 'bayesianProbabilityDesc',
    icon: Percent,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/8 border-fuchsia-500/20',
    component: lazy(() => import('@/components/probability-center/BayesianProbability').then((m) => ({ default: m.BayesianProbability }))),
  },
  {
    slug: 'random-variables',
    labelKey: 'randomVariables',
    descKey: 'randomVariablesDesc',
    icon: CircleDot,
    color: 'text-teal-400',
    bg: 'bg-teal-500/8 border-teal-500/20',
    component: lazy(() => import('@/components/probability-center/RandomVariablesExplorer').then((m) => ({ default: m.RandomVariablesExplorer }))),
  },
  {
    slug: 'stochastic-processes',
    labelKey: 'stochasticProcesses',
    descKey: 'stochasticProcessesDesc',
    icon: Network,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/8 border-indigo-500/20',
    component: lazy(() => import('@/components/probability-center/StochasticProcessExplorer').then((m) => ({ default: m.StochasticProcessExplorer }))),
  },
]

export function getProbabilityCenterToolBySlug(slug: string): ProbabilityCenterMeta | undefined {
  return PROBABILITY_CENTER_TOOLS.find((g) => g.slug === slug)
}
