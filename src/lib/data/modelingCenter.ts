import { ComponentType, LazyExoticComponent, lazy } from 'react'
import { Car, DollarSign, Cog, Leaf, type LucideIcon } from 'lucide-react'

export interface ModelingCenterMeta {
  slug: string
  labelKey: 'trafficModels' | 'economicModels' | 'engineeringModels' | 'environmentalModels'
  descKey: 'trafficModelsDesc' | 'economicModelsDesc' | 'engineeringModelsDesc' | 'environmentalModelsDesc'
  icon: LucideIcon
  color: string
  bg: string
  component: LazyExoticComponent<ComponentType>
}

export const MODELING_CENTER_TOOLS: ModelingCenterMeta[] = [
  {
    slug: 'traffic-models',
    labelKey: 'trafficModels',
    descKey: 'trafficModelsDesc',
    icon: Car,
    color: 'text-amber-400',
    bg: 'bg-amber-500/8 border-amber-500/20',
    component: lazy(() => import('@/components/modeling-center/TrafficModels').then((m) => ({ default: m.TrafficModels }))),
  },
  {
    slug: 'economic-models',
    labelKey: 'economicModels',
    descKey: 'economicModelsDesc',
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
    component: lazy(() => import('@/components/modeling-center/EconomicModels').then((m) => ({ default: m.EconomicModels }))),
  },
  {
    slug: 'engineering-models',
    labelKey: 'engineeringModels',
    descKey: 'engineeringModelsDesc',
    icon: Cog,
    color: 'text-slate-300',
    bg: 'bg-slate-500/8 border-slate-500/20',
    component: lazy(() => import('@/components/modeling-center/EngineeringModels').then((m) => ({ default: m.EngineeringModels }))),
  },
  {
    slug: 'environmental-models',
    labelKey: 'environmentalModels',
    descKey: 'environmentalModelsDesc',
    icon: Leaf,
    color: 'text-lime-400',
    bg: 'bg-lime-500/8 border-lime-500/20',
    component: lazy(() => import('@/components/modeling-center/EnvironmentalModels').then((m) => ({ default: m.EnvironmentalModels }))),
  },
]

export function getModelingCenterToolBySlug(slug: string): ModelingCenterMeta | undefined {
  return MODELING_CENTER_TOOLS.find((g) => g.slug === slug)
}
