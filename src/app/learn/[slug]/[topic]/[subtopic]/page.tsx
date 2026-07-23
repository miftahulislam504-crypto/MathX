import { FormulaCard } from '@/components/math/FormulaCard'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { getTopicBySlug, getSubTopicBySlug } from '@/lib/data/topics'
import { getFormulasByTopic } from '@/lib/data/formulas'
import { getTopicContent } from '@/lib/data/topic-content'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateStaticParams() {
  const { MATH_BRANCHES } = await import('@/lib/data/branches')
  const { TOPICS } = await import('@/lib/data/topics')
  return TOPICS.flatMap((topic) => {
    const branch = MATH_BRANCHES.find((b) => b.id === topic.branchId)
    if (!branch || !topic.subTopics) return []
    return topic.subTopics.map((s) => ({
      slug: branch.slug,
      topic: topic.slug,
      subtopic: s.slug,
    }))
  })
}

interface Props { params: Promise<{ slug: string; topic: string; subtopic: string }> }

export default async function SubTopicPage({ params }: Props) {
  const { slug, topic: topicSlug, subtopic: subTopicSlug } = await params
  const branch = MATH_BRANCHES.find((b) => b.slug === slug)
  const topic = getTopicBySlug(topicSlug)
  const subTopic = getSubTopicBySlug(topicSlug, subTopicSlug)
  if (!branch || !topic || !subTopic) notFound()

  // Content is keyed by sub-topic slug; not yet populated for the new outline.
  const content = getTopicContent(subTopicSlug)
  const formulas = getFormulasByTopic(subTopicSlug)

  const subTopics = topic.subTopics ?? []
  const currentIndex = subTopics.findIndex((s) => s.slug === subTopicSlug)
  const prevSub = currentIndex > 0 ? subTopics[currentIndex - 1] : null
  const nextSub = currentIndex < subTopics.length - 1 ? subTopics[currentIndex + 1] : null

  return (
    <>
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/30 mb-8 font-mono flex-wrap">
            <Link href="/learn" className="hover:text-white/60 transition-colors">Learn</Link>
            <span>/</span>
            <Link href={`/learn/${slug}`} className="hover:text-white/60 transition-colors">
              {branch.icon} {branch.name}
            </Link>
            <span>/</span>
            <Link href={`/learn/${slug}/${topicSlug}`} className="hover:text-white/60 transition-colors">
              {topic.title}
            </Link>
            <span>/</span>
            <span className="text-white/60">{subTopic.title}</span>
          </nav>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main content */}
            <div className="lg:col-span-3 space-y-8">

              {/* Header */}
              <div className="pb-6 border-b border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs border rounded-full px-2.5 py-0.5 border-violet-500/30 text-violet-400 bg-violet-500/8">
                    {topic.level.charAt(0) + topic.level.slice(1).toLowerCase()}
                  </span>
                  <span className="text-xs text-white/25">{branch.name} · {topic.title}</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-1">{subTopic.title}</h1>
              </div>

              {/* Content — placeholder until populated */}
              {content ? (
                <>
                  <section>
                    <h2 className="text-lg font-semibold text-white mb-3">Overview</h2>
                    <p className="text-white/60 leading-relaxed text-[15px]">{content.overview}</p>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold text-white mb-4">Key Concepts</h2>
                    <ul className="space-y-3">
                      {content.keyPoints.map((point, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-violet-400 font-mono text-sm mt-0.5 shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-white/60 text-sm leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {content.example && (
                    <section className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-6">
                      <h2 className="text-base font-semibold text-amber-400 mb-4">Worked Example</h2>
                      <div className="mb-4">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Problem</p>
                        <p className="text-white/80 text-sm">{content.example.problem}</p>
                      </div>
                      <div className="border-t border-white/5 pt-4">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Solution</p>
                        <p className="text-white/70 text-sm">{content.example.solution}</p>
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-8 text-center">
                  <p className="text-white/40 text-sm">
                    Content for this sub-topic is being prepared...
                  </p>
                  <p className="text-white/20 text-xs mt-2">
                    Check back soon.
                  </p>
                </div>
              )}

              {/* Formulas section */}
              {formulas.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-white mb-4">Formulas</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {formulas.map((f) => (
                      <FormulaCard key={f.id} formula={f} />
                    ))}
                  </div>
                </section>
              )}

              {/* Practice CTA */}
              <div className="rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/8 to-transparent p-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold mb-1">Ready to practice?</h3>
                  <p className="text-white/40 text-sm">Test your understanding with AI-generated problems</p>
                </div>
                <Link
                  href={`/practice?topic=${subTopicSlug}`}
                  className="shrink-0 rounded-lg bg-violet-600 hover:bg-violet-500 px-5 py-2 text-sm font-semibold text-white transition-colors"
                >
                  Practice →
                </Link>
              </div>

              {/* Prev / Next nav */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                {prevSub ? (
                  <Link
                    href={`/learn/${slug}/${topicSlug}/${prevSub.slug}`}
                    className="flex flex-col gap-1 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] p-4 transition-all"
                  >
                    <span className="text-[10px] text-white/25 uppercase tracking-wider">← Previous</span>
                    <span className="text-sm text-white/70 font-medium">{prevSub.title}</span>
                  </Link>
                ) : <div />}
                {nextSub && (
                  <Link
                    href={`/learn/${slug}/${topicSlug}/${nextSub.slug}`}
                    className="flex flex-col gap-1 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] p-4 transition-all text-right"
                  >
                    <span className="text-[10px] text-white/25 uppercase tracking-wider">Next →</span>
                    <span className="text-sm text-white/70 font-medium">{nextSub.title}</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Sidebar — sub-topic list */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-3 font-mono">
                  {topic.title}
                </p>
                <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
                  {subTopics.map((s) => (
                    <Link
                      key={s.id}
                      href={`/learn/${slug}/${topicSlug}/${s.slug}`}
                      className={`block rounded-lg px-3 py-2 text-xs transition-all ${
                        s.slug === subTopicSlug
                          ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
                          : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                      }`}
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
