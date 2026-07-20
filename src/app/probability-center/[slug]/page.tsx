import { notFound } from 'next/navigation'
import { PROBABILITY_CENTER_TOOLS, getProbabilityCenterToolBySlug } from '@/lib/data/probabilityCenter'
import { ProbabilityCenterRunner } from '@/components/probability-center/ProbabilityCenterRunner'

export async function generateStaticParams() {
  return PROBABILITY_CENTER_TOOLS.map((g) => ({ slug: g.slug }))
}

interface Props { params: Promise<{ slug: string }> }

export default async function ProbabilityCenterDetailPage({ params }: Props) {
  const { slug } = await params
  const tool = getProbabilityCenterToolBySlug(slug)
  if (!tool) notFound()

  return <ProbabilityCenterRunner slug={slug} />
}
