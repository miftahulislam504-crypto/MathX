import Link from 'next/link'

const OPEN_PROBLEMS = [
  {
    name: 'Riemann Hypothesis',
    year: '1859',
    prize: '$1,000,000',
    status: 'Unsolved',
    field: 'Number Theory / Analysis',
    description: 'All non-trivial zeros of the Riemann zeta function ζ(s) have real part exactly ½.',
    whyItMatters: 'Controls the distribution of prime numbers. Proof would unlock deep structure of primes and have implications for cryptography.',
    difficulty: '★★★★★',
  },
  {
    name: 'P vs NP',
    year: '1971',
    prize: '$1,000,000',
    status: 'Unsolved',
    field: 'Computer Science / Logic',
    description: 'Is every problem whose solution can be quickly verified also quickly solvable?',
    whyItMatters: 'If P=NP, most encryption would break instantly. Most believe P≠NP but no proof exists.',
    difficulty: '★★★★★',
  },
  {
    name: "Goldbach's Conjecture",
    year: '1742',
    prize: 'No prize (but famous)',
    status: 'Unsolved',
    field: 'Number Theory',
    description: 'Every even integer greater than 2 is the sum of two prime numbers. e.g. 28 = 5 + 23.',
    whyItMatters: 'Verified for all even numbers up to 4×10¹⁸ but never proved for all cases.',
    difficulty: '★★★★☆',
  },
  {
    name: 'Twin Prime Conjecture',
    year: '~300 BCE',
    prize: 'No prize',
    status: 'Unsolved',
    field: 'Number Theory',
    description: 'There are infinitely many pairs of primes that differ by 2 (e.g. 11,13 — 41,43 — 101,103).',
    whyItMatters: 'Zhang (2013) proved infinitely many prime pairs within 70 million — later reduced to 246. Still not 2.',
    difficulty: '★★★★☆',
  },
  {
    name: 'Collatz Conjecture',
    year: '1937',
    prize: '$1,200 (Erdős)',
    status: 'Unsolved',
    field: 'Number Theory',
    description: 'Start with any positive integer. If even, divide by 2. If odd, multiply by 3 and add 1. Always reach 1.',
    whyItMatters: 'Verified for all n up to 2⁶⁸ but resists all proof attempts. Erdős: "Mathematics is not yet ready for such problems."',
    difficulty: '★★★☆☆',
  },
  {
    name: 'Navier-Stokes Existence',
    year: '1845',
    prize: '$1,000,000',
    status: 'Unsolved',
    field: 'Analysis / Physics',
    description: 'Do smooth solutions to the 3D Navier-Stokes equations (fluid dynamics) always exist?',
    whyItMatters: 'Fundamental equations of fluid flow — understanding turbulence, weather, aerodynamics.',
    difficulty: '★★★★★',
  },
]

const RESEARCH_AREAS = [
  { name:'Number Theory',       desc:'Prime distribution, L-functions, elliptic curves, modular forms', icon:'#' },
  { name:'Algebraic Geometry',  desc:'Schemes, varieties, sheaves — uniting algebra and geometry', icon:'⬡' },
  { name:'Topology',            desc:'Manifolds, knot theory, homology, persistent homology in data', icon:'∞' },
  { name:'Analysis',            desc:'PDEs, harmonic analysis, functional analysis, spectral theory', icon:'∫' },
  { name:'Combinatorics',       desc:'Graph theory, extremal combinatorics, Ramsey theory', icon:'⋅' },
  { name:'Mathematical Physics',desc:'Quantum field theory, string theory, quantum gravity', icon:'⚛' },
  { name:'Probability Theory',  desc:'Stochastic processes, random matrices, percolation', icon:'◈' },
  { name:'Logic & Foundations', desc:'Set theory, model theory, proof theory, type theory', icon:'⊢' },
]

const ROADMAPS = [
  {
    field: 'Number Theory',
    path: ['Modular arithmetic','Ring theory','Algebraic number fields','p-adic numbers','L-functions','Research frontier'],
    color: 'border-violet-500/30 text-violet-400',
  },
  {
    field: 'Topology',
    path: ['Point-set topology','Algebraic topology (π₁)','Homology/cohomology','Differential topology','Manifolds','Research frontier'],
    color: 'border-cyan-500/30 text-cyan-400',
  },
  {
    field: 'Analysis / PDEs',
    path: ['Real analysis','Complex analysis','Functional analysis','Sobolev spaces','Elliptic PDEs','Research frontier'],
    color: 'border-amber-500/30 text-amber-400',
  },
]

export default function ResearchPage() {
  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="mb-10">
            <p className="text-violet-400 text-sm font-mono mb-2">// Research Center</p>
            <h1 className="text-4xl font-bold text-white mb-3">Mathematics Research</h1>
            <p className="text-white/40">
              The frontier of mathematical knowledge — open problems, active research areas, and paths to research.
            </p>
          </div>

          {/* Open Problems */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-6">
              Famous Unsolved Problems
              <span className="ml-3 text-sm font-normal text-white/30">{OPEN_PROBLEMS.length} problems</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {OPEN_PROBLEMS.map((p, i) => (
                <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] p-5 hover:border-white/15 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{p.name}</h3>
                      <p className="text-xs text-white/30 font-mono mt-0.5">{p.field} · {p.year}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {p.prize !== 'No prize' && p.prize !== 'No prize (but famous)' ? (
                        <span className="text-xs text-amber-400 border border-amber-500/30 bg-amber-500/8 rounded-full px-2 py-0.5">
                          🏆 {p.prize}
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/20 border border-white/8 rounded-full px-2 py-0.5">No prize</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed mb-3">{p.description}</p>
                  <div className="rounded-lg bg-black/20 border border-white/5 px-4 py-2.5 mb-3">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Why it matters</p>
                    <p className="text-xs text-white/50 leading-relaxed">{p.whyItMatters}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/25">Difficulty</span>
                    <span className="text-sm text-amber-400/80">{p.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Research Areas */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-6">Active Research Areas</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {RESEARCH_AREAS.map(a => (
                <div key={a.name} className="rounded-xl border border-white/8 bg-white/[0.02] p-4 hover:border-white/15 hover:bg-white/[0.04] transition-all">
                  <div className="text-2xl font-mono text-violet-400/50 mb-2">{a.icon}</div>
                  <h3 className="text-sm font-semibold text-white/80 mb-1">{a.name}</h3>
                  <p className="text-xs text-white/35 leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Research Roadmaps */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-6">
              Research Roadmaps
              <span className="ml-3 text-sm font-normal text-white/30">How to get from basics to frontier</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {ROADMAPS.map(r => (
                <div key={r.field} className={`rounded-xl border ${r.color} bg-white/[0.02] p-5`}>
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'inherit' }}>{r.field}</h3>
                  <div className="space-y-2">
                    {r.path.map((step, si) => (
                      <div key={si} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 font-mono ${
                          si === r.path.length - 1 ? 'border-current bg-current/10 text-white' : 'border-white/15 text-white/25'
                        }`}>
                          {si === r.path.length - 1 ? '★' : si + 1}
                        </div>
                        <p className={`text-xs ${si === r.path.length - 1 ? 'text-white/70 font-semibold' : 'text-white/40'}`}>
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Academic Resources</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name:'arXiv.org',          type:'Preprint server',      desc:'Free access to math research preprints', url:'https://arxiv.org/archive/math' },
                { name:'MathSciNet',         type:'Review database',      desc:'Mathematical Reviews — comprehensive coverage', url:'https://mathscinet.ams.org' },
                { name:'Erdős Number Project',type:'Collaboration graph', desc:'Six degrees of mathematical collaboration', url:'https://oakland.edu/enp' },
                { name:'OEIS',               type:'Integer sequences',    desc:'On-Line Encyclopedia of Integer Sequences', url:'https://oeis.org' },
                { name:'Wolfram MathWorld',  type:'Encyclopedia',         desc:'Comprehensive mathematics reference', url:'https://mathworld.wolfram.com' },
                { name:'AMS Journals',        type:'Peer-reviewed',       desc:'American Mathematical Society publications', url:'https://www.ams.org/publications' },
              ].map(r => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] p-4 transition-all group block">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                      {r.name}
                    </h3>
                    <span className="text-[10px] text-white/25 shrink-0">↗</span>
                  </div>
                  <p className="text-[10px] text-violet-400/60 mb-1">{r.type}</p>
                  <p className="text-xs text-white/35">{r.desc}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>

    </>
  )
}
