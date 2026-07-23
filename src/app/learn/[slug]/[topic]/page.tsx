import { MATH_BRANCHES } from '@/lib/data/branches'
import { getTopicBySlug, getTopicsByBranch } from '@/lib/data/topics'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateStaticParams() {
  const { MATH_BRANCHES } = await import('@/lib/data/branches')
  const { TOPICS } = await import('@/lib/data/topics')
  return TOPICS.flatMap((t) => {
    const branch = MATH_BRANCHES.find((b) => b.id === t.branchId)
    if (!branch) return []
    return [{ slug: branch.slug, topic: t.slug }]
  })
}

interface Props { params: Promise<{ slug: string; topic: string }> }

export default async function TopicPage({ params }: Props) {
  const { slug, topic: topicSlug } = await params
  const branch = MATH_BRANCHES.find((b) => b.slug === slug)
  const topic = getTopicBySlug(topicSlug)
  if (!branch || !topic) notFound()

  const subTopics = topic.subTopics ?? []
  const branchTopics = getTopicsByBranch(branch.id)
  const currentIndex = branchTopics.findIndex((t) => t.slug === topicSlug)
  const prevTopic = currentIndex > 0 ? branchTopics[currentIndex - 1] : null
  const nextTopic = currentIndex < branchTopics.length - 1 ? branchTopics[currentIndex + 1] : null

  return (
    <>
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/30 mb-8 font-mono">
            <Link href="/learn" className="hover:text-white/60 transition-colors">Learn</Link>
            <span>/</span>
            <Link href={`/learn/${slug}`} className="hover:text-white/60 transition-colors">
              {branch.icon} {branch.name}
            </Link>
            <span>/</span>
            <span className="text-white/60">{topic.title}</span>
          </nav>

          {/* Topic Header */}
          <div className="pb-6 mb-8 border-b border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs border rounded-full px-2.5 py-0.5 border-violet-500/30 text-violet-400 bg-violet-500/8">
                {topic.level.charAt(0) + topic.level.slice(1).toLowerCase()}
              </span>
              <span className="text-xs text-white/25">{branch.name}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">{topic.title}</h1>
            {topic.titleBn && <p className="text-white/35 text-lg">{topic.titleBn}</p>}
            <p className="text-white/25 text-sm mt-2">{subTopics.length} sub-topics</p>
          </div>

          {/* Sub-topics grid */}
          {subTopics.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {subTopics.map((s) => (
                <Link
                  key={s.id}
                  href={`/learn/${slug}/${topicSlug}/${s.slug}`}
                  className="group rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05] p-4 transition-all"
                >
                  <span className="text-[10px] text-white/25 font-mono">
                    {String(s.order).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors mt-1">
                    {s.title}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-8 text-center">
              <p className="text-white/40 text-sm">Sub-topics for this topic are being prepared...</p>
            </div>
          )}

          {/* Prev / Next topic nav */}
          <div className="grid grid-cols-2 gap-3 pt-8 mt-8 border-t border-white/5">
            {prevTopic ? (
              <Link
                href={`/learn/${slug}/${prevTopic.slug}`}
                className="flex flex-col gap-1 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] p-4 transition-all"
              >
                <span className="text-[10px] text-white/25 uppercase tracking-wider">← Previous Topic</span>
                <span className="text-sm text-white/70 font-medium">{prevTopic.title}</span>
              </Link>
            ) : <div />}
            {nextTopic && (
              <Link
                href={`/learn/${slug}/${nextTopic.slug}`}
                className="flex flex-col gap-1 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] p-4 transition-all text-right"
              >
                <span className="text-[10px] text-white/25 uppercase tracking-wider">Next Topic →</span>
                <span className="text-sm text-white/70 font-medium">{nextTopic.title}</span>
              </Link>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
