import { ComponentType, LazyExoticComponent, lazy } from 'react'
import { Compass, ScanSearch, LocateFixed, Box, type LucideIcon } from 'lucide-react'

export interface GeometryCenterMeta {
  slug: string
  labelKey: 'constructionTools' | 'shapeAnalyzer' | 'coordinateGeometryExplorer' | 'geometryViewer3d'
  descKey: 'constructionToolsDesc' | 'shapeAnalyzerDesc' | 'coordinateGeometryExplorerDesc' | 'geometryViewer3dDesc'
  icon: LucideIcon
  color: string
  bg: string
  component: LazyExoticComponent<ComponentType>
}

export const GEOMETRY_CENTER_TOOLS: GeometryCenterMeta[] = [
  {
    slug: 'construction-tools',
    labelKey: 'constructionTools',
    descKey: 'constructionToolsDesc',
    icon: Compass,
    color: 'text-violet-400',
    bg: 'bg-violet-500/8 border-violet-500/20',
    component: lazy(() => import('@/components/geometry-center/ConstructionTools').then((m) => ({ default: m.ConstructionTools }))),
  },
  {
    slug: 'shape-analyzer',
    labelKey: 'shapeAnalyzer',
    descKey: 'shapeAnalyzerDesc',
    icon: ScanSearch,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
    component: lazy(() => import('@/components/geometry-center/ShapeAnalyzer').then((m) => ({ default: m.ShapeAnalyzer }))),
  },
  {
    slug: 'coordinate-geometry-explorer',
    labelKey: 'coordinateGeometryExplorer',
    descKey: 'coordinateGeometryExplorerDesc',
    icon: LocateFixed,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/8 border-cyan-500/20',
    component: lazy(() => import('@/components/geometry-center/CoordinateGeometryExplorer').then((m) => ({ default: m.CoordinateGeometryExplorer }))),
  },
  {
    slug: '3d-geometry-viewer',
    labelKey: 'geometryViewer3d',
    descKey: 'geometryViewer3dDesc',
    icon: Box,
    color: 'text-amber-400',
    bg: 'bg-amber-500/8 border-amber-500/20',
    component: lazy(() => import('@/components/geometry-center/GeometryViewer3D').then((m) => ({ default: m.GeometryViewer3D }))),
  },
]

export function getGeometryCenterToolBySlug(slug: string): GeometryCenterMeta | undefined {
  return GEOMETRY_CENTER_TOOLS.find((g) => g.slug === slug)
}
