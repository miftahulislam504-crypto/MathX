import { ComponentType, LazyExoticComponent, lazy } from 'react'
import { Gauge, Boxes, Network, Cpu, type LucideIcon } from 'lucide-react'

export interface ExperimentMeta {
  slug: string
  labelKey: 'optimization' | 'modeling' | 'network' | 'algorithm'
  descKey: 'optimizationDesc' | 'modelingDesc' | 'networkDesc' | 'algorithmDesc'
  icon: LucideIcon
  color: string
  bg: string
  component: LazyExoticComponent<ComponentType>
}

export const EXPERIMENTS: ExperimentMeta[] = [
  {
    slug: 'optimization',
    labelKey: 'optimization',
    descKey: 'optimizationDesc',
    icon: Gauge,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
    component: lazy(() => import('@/components/experiments/OptimizationExperiments').then((m) => ({ default: m.OptimizationExperiments }))),
  },
  {
    slug: 'modeling',
    labelKey: 'modeling',
    descKey: 'modelingDesc',
    icon: Boxes,
    color: 'text-violet-400',
    bg: 'bg-violet-500/8 border-violet-500/20',
    component: lazy(() => import('@/components/experiments/ModelingExperiments').then((m) => ({ default: m.ModelingExperiments }))),
  },
  {
    slug: 'network',
    labelKey: 'network',
    descKey: 'networkDesc',
    icon: Network,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/8 border-cyan-500/20',
    component: lazy(() => import('@/components/experiments/NetworkExperiments').then((m) => ({ default: m.NetworkExperiments }))),
  },
  {
    slug: 'algorithm',
    labelKey: 'algorithm',
    descKey: 'algorithmDesc',
    icon: Cpu,
    color: 'text-amber-400',
    bg: 'bg-amber-500/8 border-amber-500/20',
    component: lazy(() => import('@/components/experiments/AlgorithmExperiments').then((m) => ({ default: m.AlgorithmExperiments }))),
  },
]

export function getExperimentBySlug(slug: string): ExperimentMeta | undefined {
  return EXPERIMENTS.find((e) => e.slug === slug)
}
