import { ComponentType, LazyExoticComponent, lazy } from 'react'
import {
  Calculator, Scale, Grid3x3, Sigma, LineChart, Dice5, BarChart3, Ruler, Search,
  type LucideIcon,
} from 'lucide-react'

export interface ToolMeta {
  slug: string
  labelKey: 'calculator' | 'solver' | 'matrix' | 'integral' | 'derivative' | 'probabilityCalc' | 'statisticsCalc' | 'unitConverter' | 'formulaFinder'
  descKey: 'calculatorDesc' | 'solverDesc' | 'matrixDesc' | 'integralDesc' | 'derivativeDesc' | 'probabilityCalcDesc' | 'statisticsCalcDesc' | 'unitConverterDesc' | 'formulaFinderDesc'
  icon: LucideIcon
  color: string
  bg: string
  component: LazyExoticComponent<ComponentType>
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'calculator',
    labelKey: 'calculator',
    descKey: 'calculatorDesc',
    icon: Calculator,
    color: 'text-violet-400',
    bg: 'bg-violet-500/8 border-violet-500/20',
    component: lazy(() => import('@/components/tools/ScientificCalculator').then((m) => ({ default: m.ScientificCalculator }))),
  },
  {
    slug: 'equation-solver',
    labelKey: 'solver',
    descKey: 'solverDesc',
    icon: Scale,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/8 border-cyan-500/20',
    component: lazy(() => import('@/components/tools/EquationSolver').then((m) => ({ default: m.EquationSolver }))),
  },
  {
    slug: 'matrix',
    labelKey: 'matrix',
    descKey: 'matrixDesc',
    icon: Grid3x3,
    color: 'text-amber-400',
    bg: 'bg-amber-500/8 border-amber-500/20',
    component: lazy(() => import('@/components/tools/MatrixCalculator').then((m) => ({ default: m.MatrixCalculator }))),
  },
  {
    slug: 'integral-calculator',
    labelKey: 'integral',
    descKey: 'integralDesc',
    icon: Sigma,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
    component: lazy(() => import('@/components/tools/IntegralCalculator').then((m) => ({ default: m.IntegralCalculator }))),
  },
  {
    slug: 'derivative-calculator',
    labelKey: 'derivative',
    descKey: 'derivativeDesc',
    icon: LineChart,
    color: 'text-rose-400',
    bg: 'bg-rose-500/8 border-rose-500/20',
    component: lazy(() => import('@/components/tools/DerivativeCalculator').then((m) => ({ default: m.DerivativeCalculator }))),
  },
  {
    slug: 'probability-calculator',
    labelKey: 'probabilityCalc',
    descKey: 'probabilityCalcDesc',
    icon: Dice5,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/8 border-fuchsia-500/20',
    component: lazy(() => import('@/components/tools/ProbabilityCalculator').then((m) => ({ default: m.ProbabilityCalculator }))),
  },
  {
    slug: 'statistics-calculator',
    labelKey: 'statisticsCalc',
    descKey: 'statisticsCalcDesc',
    icon: BarChart3,
    color: 'text-sky-400',
    bg: 'bg-sky-500/8 border-sky-500/20',
    component: lazy(() => import('@/components/tools/StatisticsCalculator').then((m) => ({ default: m.StatisticsCalculator }))),
  },
  {
    slug: 'unit-converter',
    labelKey: 'unitConverter',
    descKey: 'unitConverterDesc',
    icon: Ruler,
    color: 'text-orange-400',
    bg: 'bg-orange-500/8 border-orange-500/20',
    component: lazy(() => import('@/components/tools/UnitConverter').then((m) => ({ default: m.UnitConverter }))),
  },
  {
    slug: 'formula-finder',
    labelKey: 'formulaFinder',
    descKey: 'formulaFinderDesc',
    icon: Search,
    color: 'text-lime-400',
    bg: 'bg-lime-500/8 border-lime-500/20',
    component: lazy(() => import('@/components/tools/FormulaFinder').then((m) => ({ default: m.FormulaFinder }))),
  },
]

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((tl) => tl.slug === slug)
}
