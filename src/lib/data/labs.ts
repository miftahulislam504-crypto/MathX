import { ComponentType, LazyExoticComponent, lazy } from 'react'
import {
  Target, Footprints, Orbit, Dices, Wind, Sigma, Shapes, Waves,
  Infinity as InfinityIcon, Box, Compass, Network, type LucideIcon,
} from 'lucide-react'

export interface LabMeta {
  slug: string
  labelKey: 'monteCarlo' | 'randomWalk' | 'fractals' | 'probabilityLab' | 'chaosTheory' | 'algebraLab' | 'geometryLab' | 'trigonometryLab' | 'calculusLab' | 'vectorLab' | 'matrixLab' | 'graphTheoryLab'
  descKey: 'monteCarloDesc' | 'randomWalkDesc' | 'fractalsDesc' | 'probabilityDesc' | 'chaosDesc' | 'algebraLabDesc' | 'geometryLabDesc' | 'trigonometryLabDesc' | 'calculusLabDesc' | 'vectorLabDesc' | 'matrixLabDesc' | 'graphTheoryLabDesc'
  icon: LucideIcon
  color: string
  bg: string
  component: LazyExoticComponent<ComponentType>
}

export const LABS: LabMeta[] = [
  {
    slug: 'montecarlo',
    labelKey: 'monteCarlo',
    descKey: 'monteCarloDesc',
    icon: Target,
    color: 'text-violet-400',
    bg: 'bg-violet-500/8 border-violet-500/20',
    component: lazy(() => import('@/components/lab/MonteCarlo').then((m) => ({ default: m.MonteCarlo }))),
  },
  {
    slug: 'randomwalk',
    labelKey: 'randomWalk',
    descKey: 'randomWalkDesc',
    icon: Footprints,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/8 border-cyan-500/20',
    component: lazy(() => import('@/components/lab/RandomWalk').then((m) => ({ default: m.RandomWalk }))),
  },
  {
    slug: 'fractal',
    labelKey: 'fractals',
    descKey: 'fractalsDesc',
    icon: Orbit,
    color: 'text-amber-400',
    bg: 'bg-amber-500/8 border-amber-500/20',
    component: lazy(() => import('@/components/lab/FractalGenerator').then((m) => ({ default: m.FractalGenerator }))),
  },
  {
    slug: 'probability',
    labelKey: 'probabilityLab',
    descKey: 'probabilityDesc',
    icon: Dices,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
    component: lazy(() => import('@/components/lab/ProbabilityLab').then((m) => ({ default: m.ProbabilityLab }))),
  },
  {
    slug: 'chaos',
    labelKey: 'chaosTheory',
    descKey: 'chaosDesc',
    icon: Wind,
    color: 'text-rose-400',
    bg: 'bg-rose-500/8 border-rose-500/20',
    component: lazy(() => import('@/components/lab/ChaosLab').then((m) => ({ default: m.ChaosLab }))),
  },
  {
    slug: 'algebra',
    labelKey: 'algebraLab',
    descKey: 'algebraLabDesc',
    icon: Sigma,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/8 border-fuchsia-500/20',
    component: lazy(() => import('@/components/lab/AlgebraLab').then((m) => ({ default: m.AlgebraLab }))),
  },
  {
    slug: 'geometry',
    labelKey: 'geometryLab',
    descKey: 'geometryLabDesc',
    icon: Shapes,
    color: 'text-teal-400',
    bg: 'bg-teal-500/8 border-teal-500/20',
    component: lazy(() => import('@/components/lab/GeometryLab').then((m) => ({ default: m.GeometryLab }))),
  },
  {
    slug: 'trigonometry',
    labelKey: 'trigonometryLab',
    descKey: 'trigonometryLabDesc',
    icon: Waves,
    color: 'text-sky-400',
    bg: 'bg-sky-500/8 border-sky-500/20',
    component: lazy(() => import('@/components/lab/TrigonometryLab').then((m) => ({ default: m.TrigonometryLab }))),
  },
  {
    slug: 'calculus',
    labelKey: 'calculusLab',
    descKey: 'calculusLabDesc',
    icon: InfinityIcon,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/8 border-indigo-500/20',
    component: lazy(() => import('@/components/lab/CalculusLab').then((m) => ({ default: m.CalculusLab }))),
  },
  {
    slug: 'vector',
    labelKey: 'vectorLab',
    descKey: 'vectorLabDesc',
    icon: Box,
    color: 'text-orange-400',
    bg: 'bg-orange-500/8 border-orange-500/20',
    component: lazy(() => import('@/components/lab/VectorLab').then((m) => ({ default: m.VectorLab }))),
  },
  {
    slug: 'matrix',
    labelKey: 'matrixLab',
    descKey: 'matrixLabDesc',
    icon: Compass,
    color: 'text-sky-400',
    bg: 'bg-sky-500/8 border-sky-500/20',
    component: lazy(() => import('@/components/lab/MatrixLab').then((m) => ({ default: m.MatrixLab }))),
  },
  {
    slug: 'graphtheory',
    labelKey: 'graphTheoryLab',
    descKey: 'graphTheoryLabDesc',
    icon: Network,
    color: 'text-lime-400',
    bg: 'bg-lime-500/8 border-lime-500/20',
    component: lazy(() => import('@/components/lab/GraphTheoryLab').then((m) => ({ default: m.GraphTheoryLab }))),
  },
]

export function getLabBySlug(slug: string): LabMeta | undefined {
  return LABS.find((l) => l.slug === slug)
}
