import { notFound } from 'next/navigation'
import { LINEAR_ALGEBRA_CENTER_TOOLS, getLinearAlgebraCenterToolBySlug } from '@/lib/data/linearAlgebraCenter'
import { LinearAlgebraCenterRunner } from '@/components/linear-algebra-center/LinearAlgebraCenterRunner'

export async function generateStaticParams() {
  return LINEAR_ALGEBRA_CENTER_TOOLS.map((g) => ({ slug: g.slug }))
}

interface Props { params: Promise<{ slug: string }> }

export default async function LinearAlgebraCenterDetailPage({ params }: Props) {
  const { slug } = await params
  const tool = getLinearAlgebraCenterToolBySlug(slug)
  if (!tool) notFound()

  return <LinearAlgebraCenterRunner slug={slug} />
}
