import { notFound } from 'next/navigation'
import { GEOMETRY_CENTER_TOOLS, getGeometryCenterToolBySlug } from '@/lib/data/geometryCenter'
import { GeometryCenterRunner } from '@/components/geometry-center/GeometryCenterRunner'

export async function generateStaticParams() {
  return GEOMETRY_CENTER_TOOLS.map((g) => ({ slug: g.slug }))
}

interface Props { params: Promise<{ slug: string }> }

export default async function GeometryCenterDetailPage({ params }: Props) {
  const { slug } = await params
  const tool = getGeometryCenterToolBySlug(slug)
  if (!tool) notFound()

  return <GeometryCenterRunner tool={tool} />
}
