import { notFound } from 'next/navigation'
import { ASSESSMENTS, getAssessmentBySlug } from '@/lib/data/assessments'
import { AssessmentRunner } from '@/components/assessment/AssessmentRunner'

export async function generateStaticParams() {
  return ASSESSMENTS.map((a) => ({ slug: a.slug }))
}

interface Props { params: Promise<{ slug: string }> }

export default async function AssessmentDetailPage({ params }: Props) {
  const { slug } = await params
  const assessment = getAssessmentBySlug(slug)
  if (!assessment) notFound()

  return <AssessmentRunner assessment={assessment} />
}
