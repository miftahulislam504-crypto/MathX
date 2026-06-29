import Link from 'next/link'

const BRANCHES_OVERVIEW = [
  { icon:'🔢', name:'Arithmetic',       desc:'The study of numbers and basic operations — the oldest branch.' },
  { icon:'📐', name:'Algebra',          desc:'Generalizing arithmetic using symbols — from equations to abstract structures.' },
  { icon:'△',  name:'Geometry',         desc:'Shape, size, and properties of figures in space.' },
  { icon:'∫',  name:'Calculus',         desc:'Mathematics of change and accumulation — derivatives and integrals.' },
  { icon:'ℝ',  name:'Analysis',         desc:'Rigorous foundation of calculus — limits, sequences, continuity.' },
  { icon:'#',  name:'Number Theory',    desc:'"Queen of Mathematics" — deep study of integers.' },
  { icon:'∘',  name:'Abstract Algebra', desc:'Groups, rings, fields — algebraic structures beyond numbers.' },
  { icon:'∞',  name:'Topology',         desc:'Properties preserved under deformation. Coffee cup = donut.' },
  { icon:'📊', name:'Statistics',       desc:'Analyzing and interpreting data from random processes.' },
  { icon:'🎲', name:'Probability',      desc:'Quantifying uncertainty — the mathematics of chance.' },
]

const THINKING = [
  { icon:'🔍', title:'Pattern Recognition',    desc:'Mathematics begins by noticing patterns in nature, numbers, and structure.' },
  { icon:'⚙️', title:'Abstraction',            desc:'Stripping specifics to find universal truths that apply everywhere.' },
  { icon:'🔗', title:'Logical Reasoning',      desc:'Building chains of deduction from axioms to theorems through proof.' },
  { icon:'🌐', title:'Generalization',         desc:'Extending a specific result to its most general form possible.' },
  { icon:'🔄', title:'Problem Reformulation',  desc:'Restating a hard problem in a form that reveals the solution.' },
  { icon:'💡', title:'Intuition + Rigor',      desc:'Creative leaps guided by intuition, then verified by rigorous proof.' },
]

export default function AboutPage() {
  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="mb-10">
            <p className="text-violet-400 text-sm font-mono mb-2">// Foundation → About</p>
            <h1 className="text-4xl font-bold text-white mb-3">What is Mathematics?</h1>
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-8 mb-10">
            <p className="text-lg text-white/75 leading-relaxed mb-4">
              Mathematics is the abstract study of{' '}
              <span className="text-violet-300 font-semibold">quantity, structure, space, and change</span>.
              It uses logic and rigorous reasoning to discover truths that are universal and eternal.
            </p>
            <p className="text-white/50 leading-relaxed">
              Unlike the natural sciences, mathematics does not depend on experiment for its truth.
              A mathematical theorem, once proven, is true for all time. This makes mathematics simultaneously
              the most abstract and the most applicable of all disciplines.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
              <h2 className="text-base font-bold text-cyan-400 mb-3">Pure Mathematics</h2>
              <p className="text-sm text-white/55 leading-relaxed mb-3">
                Studied for beauty and truth — without concern for practical application.
              </p>
              <ul className="space-y-1 text-sm text-white/45">
                {['Number Theory','Abstract Algebra','Topology','Real Analysis','Complex Analysis'].map(s => (
                  <li key={s} className="flex gap-2"><span className="text-cyan-400/50">→</span>{s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
              <h2 className="text-base font-bold text-amber-400 mb-3">Applied Mathematics</h2>
              <p className="text-sm text-white/55 leading-relaxed mb-3">
                Mathematics developed to solve real-world problems in science and engineering.
              </p>
              <ul className="space-y-1 text-sm text-white/45">
                {['Statistics & Probability','Mathematical Physics','Computational Math','Financial Mathematics','Operations Research'].map(s => (
                  <li key={s} className="flex gap-2"><span className="text-amber-400/50">→</span>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-5">Major Branches</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-12">
            {BRANCHES_OVERVIEW.map(b => (
              <div key={b.name} className="flex gap-4 rounded-xl border border-white/6 bg-white/[0.02] p-4">
                <span className="text-2xl shrink-0 mt-0.5">{b.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white/80 mb-1">{b.name}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-white mb-5">Mathematical Thinking</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
            {THINKING.map(t => (
              <div key={t.title} className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
                <div className="text-2xl mb-2">{t.icon}</div>
                <h3 className="text-sm font-semibold text-white/80 mb-1">{t.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Mathematical Philosophy</h2>
            <div className="space-y-4 text-sm text-white/55 leading-relaxed">
              <p><span className="text-white/80 font-semibold">Platonism</span> — Mathematical objects exist independently of human minds. We discover them, not invent them. Defended by Gödel, Hardy.</p>
              <p><span className="text-white/80 font-semibold">Formalism</span> — Mathematics is a formal game of symbols. Truth means consistency. Championed by Hilbert.</p>
              <p><span className="text-white/80 font-semibold">Intuitionism</span> — Mathematics is mental construction. Only constructively provable statements are true. Founded by Brouwer.</p>
              <p><span className="text-white/80 font-semibold">Structuralism</span> — Mathematics studies abstract structures. Numbers are positions in structures, not objects.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/learn" className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-all">
              Start Learning →
            </Link>
            <Link href="/foundation/history" className="rounded-lg border border-white/10 hover:border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all">
              History of Math →
            </Link>
          </div>
        </div>
      </main>

    </>
  )
}
