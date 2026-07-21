import { notFound } from 'next/navigation'
import { LABS, getLabBySlug } from '@/lib/data/labs'
import { LabRunner } from '@/components/lab/LabRunner'

export async function generateStaticParams() {
  return LABS.map((l) => ({ slug: l.slug }))
}

interface Props { params: Promise<{ slug: string }> }

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params
  const lab = getLabBySlug(slug)
  if (!lab) notFound()

  return <LabRunner slug={slug} />
}
