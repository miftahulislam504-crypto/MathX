import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DisplayMath, InlineMath } from '@/components/math/LatexRenderer'
import { FormulaCard } from '@/components/math/FormulaCard'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { getTopicBySlug, getTopicsByBranch } from '@/lib/data/topics'
import { getFormulasByTopic } from '@/lib/data/formulas'
import { getTopicContent } from '@/lib/data/topic-content'
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

  const formulas = getFormulasByTopic(topicSlug)
  const content = getTopicContent(topicSlug)
  const branchTopics = getTopicsByBranch(branch.id)
  const currentIndex = branchTopics.findIndex((t) => t.slug === topicSlug)
  const prevTopic = currentIndex > 0 ? branchTopics[currentIndex - 1] : null
  const nextTopic = currentIndex < branchTopics.length - 1 ? branchTopics[currentIndex + 1] : null

  return (
    <>
      <Navbar />
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

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main content */}
            <div className="lg:col-span-3 space-y-8">

              {/* Topic Header */}
              <div className="pb-6 border-b border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs border rounded-full px-2.5 py-0.5 border-violet-500/30 text-violet-400 bg-violet-500/8">
                    {topic.level.charAt(0) + topic.level.slice(1).toLowerCase()}
                  </span>
                  <span className="text-xs text-white/25">{branch.name}</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-1">{topic.title}</h1>
                {topic.titleBn && <p className="text-white/35 text-lg">{topic.titleBn}</p>}
              </div>

              {/* Overview */}
              {content ? (
                <>
                  <section>
                    <h2 className="text-lg font-semibold text-white mb-3">Overview</h2>
                    <p className="text-white/60 leading-relaxed text-[15px]">{content.overview}</p>
                  </section>

                  {/* Key Points */}
                  <section>
                    <h2 className="text-lg font-semibold text-white mb-4">Key Concepts</h2>
                    <ul className="space-y-3">
                      {content.keyPoints.map((point, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-violet-400 font-mono text-sm mt-0.5 shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-white/60 text-sm leading-relaxed">
                            {/* Render inline LaTeX if present */}
                            {point.includes('\\(') ? (
                              <span dangerouslySetInnerHTML={{ __html: point }} />
                            ) : (
                              point
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Worked Example */}
                  {content.example && (
                    <section className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-6">
                      <h2 className="text-base font-semibold text-amber-400 mb-4">
                        ✎ Worked Example
                      </h2>
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

                  {/* Prerequisites & Next */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {content.prerequisites && content.prerequisites.length > 0 && (
                      <div className="rounded-lg border border-white/8 p-4">
                        <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
                          Prerequisites
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {content.prerequisites.map((pre) => (
                            <Link
                              key={pre}
                              href={`/learn/${slug}/${pre}`}
                              className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded-full px-3 py-1 transition-all"
                            >
                              ← {pre.replace(/-/g, ' ')}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {content.nextTopics && content.nextTopics.length > 0 && (
                      <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 p-4">
                        <p className="text-xs text-violet-400/60 uppercase tracking-wider mb-3">
                          Learn Next
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {content.nextTopics.map((next) => (
                            <Link
                              key={next}
                              href={`/learn/${slug}/${next}`}
                              className="text-xs text-violet-300 hover:text-violet-100 border border-violet-500/20 hover:border-violet-400/40 rounded-full px-3 py-1 transition-all"
                            >
                              {next.replace(/-/g, ' ')} →
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-8 text-center">
                  <p className="text-white/40 text-sm">
                    Content for this topic is being prepared...
                  </p>
                  <p className="text-white/20 text-xs mt-2">
                    Check back soon or explore the formulas →
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
                  href={`/practice?topic=${topicSlug}`}
                  className="shrink-0 rounded-lg bg-violet-600 hover:bg-violet-500 px-5 py-2 text-sm font-semibold text-white transition-colors"
                >
                  Practice →
                </Link>
              </div>

              {/* Prev / Next nav */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                {prevTopic ? (
                  <Link
                    href={`/learn/${slug}/${prevTopic.slug}`}
                    className="flex flex-col gap-1 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] p-4 transition-all"
                  >
                    <span className="text-[10px] text-white/25 uppercase tracking-wider">← Previous</span>
                    <span className="text-sm text-white/70 font-medium">{prevTopic.title}</span>
                  </Link>
                ) : <div />}
                {nextTopic && (
                  <Link
                    href={`/learn/${slug}/${nextTopic.slug}`}
                    className="flex flex-col gap-1 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] p-4 transition-all text-right"
                  >
                    <span className="text-[10px] text-white/25 uppercase tracking-wider">Next →</span>
                    <span className="text-sm text-white/70 font-medium">{nextTopic.title}</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Sidebar — topic list */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-3 font-mono">
                  {branch.name} Topics
                </p>
                <div className="space-y-1">
                  {branchTopics.map((t) => (
                    <Link
                      key={t.id}
                      href={`/learn/${slug}/${t.slug}`}
                      className={`block rounded-lg px-3 py-2 text-xs transition-all ${
                        t.slug === topicSlug
                          ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
                          : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                      }`}
                    >
                      {t.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
