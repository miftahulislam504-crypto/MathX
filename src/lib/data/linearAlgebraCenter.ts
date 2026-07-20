import { ComponentType, LazyExoticComponent, lazy } from 'react'
import { MoveDiagonal, Rows3, GitBranch, Combine, Waypoints, RotateCw, type LucideIcon } from 'lucide-react'

export interface LinearAlgebraCenterMeta {
  slug: string
  labelKey: 'vectorOperations' | 'matrixOperations' | 'systemSolver' | 'vectorSpaceExplorer' | 'eigenvalueExplorer' | 'transformationVisualizer'
  descKey: 'vectorOperationsDesc' | 'matrixOperationsDesc' | 'systemSolverDesc' | 'vectorSpaceExplorerDesc' | 'eigenvalueExplorerDesc' | 'transformationVisualizerDesc'
  icon: LucideIcon
  color: string
  bg: string
  component: LazyExoticComponent<ComponentType>
}

export const LINEAR_ALGEBRA_CENTER_TOOLS: LinearAlgebraCenterMeta[] = [
  {
    slug: 'vector-operations',
    labelKey: 'vectorOperations',
    descKey: 'vectorOperationsDesc',
    icon: MoveDiagonal,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/8 border-cyan-500/20',
    component: lazy(() => import('@/components/linear-algebra-center/VectorOperations').then((m) => ({ default: m.VectorOperations }))),
  },
  {
    slug: 'matrix-operations',
    labelKey: 'matrixOperations',
    descKey: 'matrixOperationsDesc',
    icon: Rows3,
    color: 'text-violet-400',
    bg: 'bg-violet-500/8 border-violet-500/20',
    component: lazy(() => import('@/components/linear-algebra-center/MatrixOperationsExplorer').then((m) => ({ default: m.MatrixOperationsExplorer }))),
  },
  {
    slug: 'system-solver',
    labelKey: 'systemSolver',
    descKey: 'systemSolverDesc',
    icon: GitBranch,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
    component: lazy(() => import('@/components/linear-algebra-center/SystemSolver').then((m) => ({ default: m.SystemSolver }))),
  },
  {
    slug: 'vector-space-explorer',
    labelKey: 'vectorSpaceExplorer',
    descKey: 'vectorSpaceExplorerDesc',
    icon: Combine,
    color: 'text-rose-400',
    bg: 'bg-rose-500/8 border-rose-500/20',
    component: lazy(() => import('@/components/linear-algebra-center/VectorSpaceExplorer').then((m) => ({ default: m.VectorSpaceExplorer }))),
  },
  {
    slug: 'eigenvalue-explorer',
    labelKey: 'eigenvalueExplorer',
    descKey: 'eigenvalueExplorerDesc',
    icon: Waypoints,
    color: 'text-amber-400',
    bg: 'bg-amber-500/8 border-amber-500/20',
    component: lazy(() => import('@/components/linear-algebra-center/EigenvalueExplorer').then((m) => ({ default: m.EigenvalueExplorer }))),
  },
  {
    slug: 'transformation-visualizer',
    labelKey: 'transformationVisualizer',
    descKey: 'transformationVisualizerDesc',
    icon: RotateCw,
    color: 'text-sky-400',
    bg: 'bg-sky-500/8 border-sky-500/20',
    component: lazy(() => import('@/components/linear-algebra-center/TransformationVisualizer').then((m) => ({ default: m.TransformationVisualizer }))),
  },
]

export function getLinearAlgebraCenterToolBySlug(slug: string): LinearAlgebraCenterMeta | undefined {
  return LINEAR_ALGEBRA_CENTER_TOOLS.find((g) => g.slug === slug)
}
