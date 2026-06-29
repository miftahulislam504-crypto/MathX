import Link from 'next/link'

const SECTIONS = [
  {
    href: '/foundation/about',
    icon: '∞',
    title: 'About Mathematics',
    desc: 'What is mathematics? Branches, philosophy, and mathematical thinking.',
    color: 'border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10',
    tag: 'text-violet-400',
  },
  {
    href: '/foundation/history',
    icon: '📜',
    title: 'History & Evolution',
    desc: 'From ancient Babylon to modern era — 4000 years of mathematical discovery.',
    color: 'border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10',
    tag: 'text-cyan-400',
  },
  {
    href: '/foundation/mathematicians',
    icon: '🧠',
    title: 'Mathematicians Archive',
    desc: '12 greatest mathematicians — biographies, contributions, and quotes.',
    color: 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10',
    tag: 'text-amber-400',
  },
]

export default function FoundationPage() {
  return (
    <>

      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-violet-400 text-sm font-mono mb-2">// Foundation</p>
            <h1 className="text-4xl font-bold text-white mb-3">Foundation of Mathematics</h1>
            <p className="text-white/40">
              Before equations and proofs — understand what mathematics truly is.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {SECTIONS.map(s => (
              <Link key={s.href} href={s.href}
                className={`rounded-2xl border p-6 transition-all group ${s.color}`}>
                <div className={`text-4xl mb-4 font-mono ${s.tag}`}>{s.icon}</div>
                <h2 className="text-base font-bold text-white mb-2 group-hover:text-white/90">{s.title}</h2>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>

          {/* Math Philosophy teaser */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 text-center math-grid">
            <p className="text-5xl mb-4 font-mono text-violet-400/30">φ</p>
            <blockquote className="text-xl font-light text-white/60 italic max-w-2xl mx-auto mb-4">
              "Mathematics is the language in which God has written the universe."
            </blockquote>
            <p className="text-sm text-white/25">— Galileo Galilei</p>
          </div>
        </div>
      </main>

    </>
  )
}
