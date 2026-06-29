import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TopicCard } from '@/components/math/TopicCard'
import { FormulaCard } from '@/components/math/FormulaCard'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { getTopicsByBranch } from '@/lib/data/topics'
import { getFormulasByBranch } from '@/lib/data/formulas'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return MATH_BRANCHES.map((b) => ({ slug: b.slug }))
}

export default async function BranchPage({ params }: Props) {
  const { slug } = await params
  const branch = MATH_BRANCHES.find((b) => b.slug === slug)
  if (!branch) notFound()

  const topics = getTopicsByBranch(branch.id)
  const formulas = getFormulasByBranch(branch.id)

  const byLevel = {
    SCHOOL:     topics.filter((t) => t.level === 'SCHOOL'),
    COLLEGE:    topics.filter((t) => t.level === 'COLLEGE'),
    UNIVERSITY: topics.filter((t) => t.level === 'UNIVERSITY'),
    ADVANCED:   topics.filter((t) => t.level === 'ADVANCED'),
  }

  const LEVEL_META = {
    SCHOOL:     { label: 'School', color: 'text-emerald-400', dot: 'bg-emerald-400' },
    COLLEGE:    { label: 'College', color: 'text-blue-400', dot: 'bg-blue-400' },
    UNIVERSITY: { label: 'University', color: 'text-violet-400', dot: 'bg-violet-400' },
    ADVANCED:   { label: 'Advanced', color: 'text-amber-400', dot: 'bg-amber-400' },
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Branch Header */}
          <div className="flex items-center gap-5 mb-10 pb-8 border-b border-white/5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{ backgroundColor: `${branch.color}18`, border: `1px solid ${branch.color}30` }}
            >
              {branch.icon}
            </div>
            <div>
              <p className="text-white/30 text-sm font-mono mb-1">// Branch</p>
              <h1 className="text-3xl font-bold text-white">{branch.name}</h1>
              {branch.nameBn && <p className="text-white/40 text-base mt-0.5">{branch.nameBn}</p>}
              <p className="text-white/25 text-sm mt-2">
                {topics.length} topics · {formulas.length} formulas
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Topics — left 2/3 */}
            <div className="lg:col-span-2 space-y-10">
              {(Object.entries(byLevel) as [keyof typeof byLevel, typeof topics][]).map(([lvl, tpcs]) => {
                if (tpcs.length === 0) return null
                const meta = LEVEL_META[lvl]
                return (
                  <section key={lvl}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                      <h2 className={`text-sm font-semibold uppercase tracking-wider ${meta.color}`}>
                        {meta.label}
                      </h2>
                      <span className="text-white/20 text-xs">({tpcs.length})</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {tpcs.map((topic) => (
                        <TopicCard
                          key={topic.id}
                          topic={topic}
                          href={`/learn/${slug}/${topic.slug}`}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>

            {/* Formulas sidebar — right 1/3 */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                Key Formulas
              </h2>
              {formulas.length > 0 ? (
                formulas.map((f) => <FormulaCard key={f.id} formula={f} compact />)
              ) : (
                <p className="text-white/25 text-sm">Formulas coming soon...</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
