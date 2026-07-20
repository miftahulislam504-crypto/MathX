import { notFound } from 'next/navigation'
import { MODELING_CENTER_TOOLS, getModelingCenterToolBySlug } from '@/lib/data/modelingCenter'
import { ModelingCenterRunner } from '@/components/modeling-center/ModelingCenterRunner'

export async function generateStaticParams() {
  return MODELING_CENTER_TOOLS.map((g) => ({ slug: g.slug }))
}

interface Props { params: Promise<{ slug: string }> }

export default async function ModelingCenterDetailPage({ params }: Props) {
  const { slug } = await params
  const tool = getModelingCenterToolBySlug(slug)
  if (!tool) notFound()

  return <ModelingCenterRunner slug={slug} />
}
