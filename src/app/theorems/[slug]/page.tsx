import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DisplayMath } from '@/components/math/LatexRenderer'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { THEOREMS, getTheoremBySlug } from '@/lib/data/theorems'
import { getTopicBySlug } from '@/lib/data/topics'
import { CheckCircle2, BookOpen, Lightbulb } from 'lucide-react'

export async function generateStaticParams() {
  return THEOREMS.map((th) => ({ slug: th.slug }))
}

interface Props { params: Promise<{ slug: string }> }

export default async function TheoremPage({ params }: Props) {
  const { slug } = await params
  const theorem = getTheoremBySlug(slug)
  if (!theorem) notFound()

  const branch = MATH_BRANCHES.find((b) => b.id === theorem.branchId)
  const topic = getTopicBySlug(theorem.topicSlug)

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-white/30 mb-8 font-mono flex-wrap">
          <Link href="/theorems" className="hover:text-white/60 transition-colors">Theorem Library</Link>
          <span>/</span>
          {branch && (
            <>
              <Link href={`/learn/${branch.slug}`} className="hover:text-white/60 transition-colors">
                {branch.icon} {branch.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-white/60">{theorem.title}</span>
        </nav>

        {/* Header */}
        <div className="pb-6 border-b border-white/5 mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-xs border rounded-full px-2.5 py-0.5 border-cyan-500/30 text-cyan-400 bg-cyan-500/8">
              {theorem.proofMethod}
            </span>
            <span className="text-xs text-white/25 font-mono">{theorem.year}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{theorem.title}</h1>
          <p className="text-white/40 text-sm">Discovered by {theorem.discoveredBy}</p>
        </div>

        {/* Statement */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" /> Statement
          </h2>
          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-6">
            <p className="text-white/70 leading-relaxed mb-4">{theorem.statement}</p>
            {theorem.latex && (
              <div className="bg-black/30 rounded-lg p-5 border border-white/5 overflow-x-auto">
                <DisplayMath latex={theorem.latex} />
              </div>
            )}
          </div>
        </section>

        {/* Proof */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Proof
          </h2>
          <p className="text-xs text-white/30 mb-4 font-mono">Method: {theorem.proofMethod}</p>
          <div className="rounded-xl border border-white/6 bg-white/[0.02] overflow-hidden">
            {theorem.proofSketch.map((step, i) => (
              <div
                key={i}
                className={`flex gap-4 p-4 ${i !== theorem.proofSketch.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-white/60 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Historical Context */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-3">Historical Context</h2>
          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-5">
            <p className="text-sm text-white/55 leading-relaxed">{theorem.historicalContext}</p>
          </div>
        </section>

        {/* Applications */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" /> Applications
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {theorem.applications.map((app) => (
              <div key={app} className="flex gap-3 rounded-lg border border-amber-500/15 bg-amber-500/5 p-4">
                <span className="text-amber-400/60 shrink-0">→</span>
                <p className="text-sm text-white/60 leading-relaxed">{app}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-links */}
        <div className="flex flex-wrap gap-3">
          {topic && branch && (
            <Link
              href={`/learn/${branch.slug}/${topic.slug}`}
              className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all"
            >
              Study {topic.title} →
            </Link>
          )}
          <Link
            href="/theorems"
            className="rounded-lg border border-white/10 hover:border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all"
          >
            ← All Theorems
          </Link>
        </div>
      </div>
    </main>
  )
}
