import { notFound } from 'next/navigation'
import { EXPERIMENTS, getExperimentBySlug } from '@/lib/data/experiments'
import { ExperimentRunner } from '@/components/experiments/ExperimentRunner'

export async function generateStaticParams() {
  return EXPERIMENTS.map((e) => ({ slug: e.slug }))
}

interface Props { params: Promise<{ slug: string }> }

export default async function ExperimentDetailPage({ params }: Props) {
  const { slug } = await params
  const experiment = getExperimentBySlug(slug)
  if (!experiment) notFound()

  return <ExperimentRunner slug={slug} />
}
