import { notFound } from 'next/navigation'
import { TOOLS, getToolBySlug } from '@/lib/data/tools'
import { ToolRunner } from '@/components/tools/ToolRunner'

export async function generateStaticParams() {
  return TOOLS.map((tl) => ({ slug: tl.slug }))
}

interface Props { params: Promise<{ slug: string }> }

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  return <ToolRunner slug={slug} />
}
