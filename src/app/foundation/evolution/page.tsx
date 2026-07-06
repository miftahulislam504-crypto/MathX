import Link from 'next/link'
import { TrendingUp, type LucideIcon } from 'lucide-react'

interface Arc {
  concept: string
  color: string
  glow: string
  stages: { era: string; state: string }[]
}

const ARCS: Arc[] = [
  {
    concept: 'The Concept of Number',
    color: 'border-violet-500/25 bg-violet-500/5',
    glow: 'text-violet-400',
    stages: [
      { era: 'Prehistoric', state: 'Tally marks for counting sheep, days, or objects — no abstract "number" concept yet.' },
      { era: 'Babylon (~2000 BCE)', state: 'Positional base-60 system; numbers become symbols independent of what is counted.' },
      { era: 'India (~628 CE)', state: 'Brahmagupta formalizes zero as a number with its own arithmetic rules.' },
      { era: 'Renaissance Europe', state: 'Negative numbers accepted as legitimate quantities, not just "debts."' },
      { era: '19th century', state: 'Cantor proves infinite sets come in different sizes — number extends beyond the finite.' },
      { era: '20th century', state: 'Numbers formally built from set theory (Peano axioms, von Neumann ordinals).' },
    ],
  },
  {
    concept: 'Geometry: From Measurement to Abstraction',
    color: 'border-cyan-500/25 bg-cyan-500/5',
    glow: 'text-cyan-400',
    stages: [
      { era: 'Egypt (~2700 BCE)', state: 'Practical land-surveying rules after Nile floods — geometry as measurement.' },
      { era: 'Greece (~300 BCE)', state: "Euclid's Elements builds geometry from 5 axioms via pure deduction — geometry becomes proof-based." },
      { era: '19th century', state: 'Non-Euclidean geometries (Lobachevsky, Bolyai, Riemann) show Euclid\'s parallel postulate is not the only option.' },
      { era: 'Early 20th century', state: "Einstein's general relativity uses Riemannian geometry to describe curved spacetime itself." },
      { era: 'Mid-20th century', state: 'Topology strips away distance and angle entirely, studying only which deformations preserve shape.' },
    ],
  },
  {
    concept: 'Algebra: From Words to Symbols to Structures',
    color: 'border-amber-500/25 bg-amber-500/5',
    glow: 'text-amber-400',
    stages: [
      { era: 'Babylon (~1800 BCE)', state: 'Quadratic equations solved via verbal recipes — no symbolic notation at all.' },
      { era: 'Al-Khwarizmi (~820 CE)', state: 'Systematic methods for solving equations named al-jabr — "algebra" is born as a discipline.' },
      { era: 'Descartes (~1637)', state: 'Letters (x, y, a, b) replace words; algebra becomes a symbolic language.' },
      { era: 'Galois (~1830)', state: 'Studying symmetries of equations gives birth to group theory — algebra shifts from solving to studying structure.' },
      { era: '20th century', state: 'Abstract algebra (groups, rings, fields) becomes a study of structure independent of numbers entirely.' },
    ],
  },
  {
    concept: 'Calculus: From Paradox to Rigor',
    color: 'border-emerald-500/25 bg-emerald-500/5',
    glow: 'text-emerald-400',
    stages: [
      { era: 'Zeno (~440 BCE)', state: "Paradoxes of motion and infinite division expose deep confusion about infinity and continuity." },
      { era: 'Archimedes (~250 BCE)', state: 'Method of exhaustion computes areas via infinite sequences — calculus in embryo.' },
      { era: 'Newton & Leibniz (~1670s)', state: 'Independently formalize derivatives and integrals using "infinitesimals" — powerful but logically shaky.' },
      { era: 'Cauchy & Weierstrass (~1820–1870)', state: 'Replace infinitesimals with rigorous epsilon-delta limits — calculus finally gets solid foundations.' },
      { era: '1960s', state: "Robinson's nonstandard analysis rehabilitates infinitesimals with full logical rigor." },
    ],
  },
  {
    concept: 'Probability: From Gambling to Science',
    color: 'border-rose-500/25 bg-rose-500/5',
    glow: 'text-rose-400',
    stages: [
      { era: 'Pascal & Fermat (~1654)', state: 'Correspondence on gambling disputes lays the first formal foundations of probability theory.' },
      { era: 'Bernoulli (~1713)', state: 'Law of large numbers connects theoretical probability to observed long-run frequency.' },
      { era: 'Gauss & Laplace (~1800s)', state: 'Normal distribution formalized — probability becomes central to measurement error and statistics.' },
      { era: 'Kolmogorov (1933)', state: 'Probability axiomatized using measure theory, placing it on the same rigorous footing as geometry.' },
      { era: '20th century', state: 'Stochastic processes and Bayesian inference expand probability into physics, finance, and AI.' },
    ],
  },
]

export default function EvolutionPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-violet-400 text-sm font-mono mb-2">// Foundation → Evolution</p>
          <h1 className="text-4xl font-bold text-white mb-3">Evolution of Mathematics</h1>
          <p className="text-white/40 leading-relaxed">
            History records <em>when</em> discoveries happened. Evolution traces <em>how ideas themselves
            transformed</em> — how a practical counting trick became set theory, or how a gambling dispute became
            measure-theoretic probability. Five core concepts, followed across their entire arc.
          </p>
        </div>

        <div className="space-y-8 mb-14">
          {ARCS.map((arc) => (
            <div key={arc.concept} className={`rounded-2xl border p-6 ${arc.color}`}>
              <div className="flex items-center gap-3 mb-5">
                <TrendingUp className={`w-6 h-6 shrink-0 ${arc.glow}`} />
                <h2 className="text-lg font-bold text-white">{arc.concept}</h2>
              </div>
              <div className="space-y-0">
                {arc.stages.map((s, i) => (
                  <div key={s.era} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <span className={`w-2.5 h-2.5 rounded-full ${arc.glow.replace('text-', 'bg-')}`} />
                      {i !== arc.stages.length - 1 && <span className="w-px flex-1 bg-white/10 my-1" />}
                    </div>
                    <div className="pb-5">
                      <p className={`text-xs font-mono mb-1 ${arc.glow}`}>{s.era}</p>
                      <p className="text-sm text-white/55 leading-relaxed">{s.state}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 mb-10">
          <h2 className="text-lg font-bold text-white mb-4">The Pattern Behind the Evolution</h2>
          <p className="text-sm text-white/55 leading-relaxed">
            Across every concept, the same arc repeats: a practical need creates an informal technique, the
            technique is generalized until it produces paradoxes or limitations, and a period of crisis forces
            mathematicians to rebuild the concept on more rigorous foundations — which then unlocks the next
            generation of applications. Mathematics does not just accumulate facts; it periodically re-examines
            and rebuilds its own foundations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/foundation/history" className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-all">
            Full Historical Timeline →
          </Link>
          <Link href="/foundation/philosophy" className="rounded-lg border border-white/10 hover:border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all">
            Mathematical Philosophy →
          </Link>
        </div>
      </div>
    </main>
  )
}
