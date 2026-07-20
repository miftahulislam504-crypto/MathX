import { notFound } from 'next/navigation'
import { APPLIED_MATH_LAB_TOOLS, getAppliedMathLabToolBySlug } from '@/lib/data/appliedMathLab'
import { AppliedMathLabRunner } from '@/components/applied-math-lab/AppliedMathLabRunner'

export async function generateStaticParams() {
  return APPLIED_MATH_LAB_TOOLS.map((g) => ({ slug: g.slug }))
}

interface Props { params: Promise<{ slug: string }> }

export default async function AppliedMathLabDetailPage({ params }: Props) {
  const { slug } = await params
  const tool = getAppliedMathLabToolBySlug(slug)
  if (!tool) notFound()

  return <AppliedMathLabRunner slug={slug} />
}
