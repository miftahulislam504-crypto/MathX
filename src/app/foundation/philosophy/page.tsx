import Link from 'next/link'
import { Sparkles, Blocks, Brain as BrainIcon, Network, Scale, type LucideIcon } from 'lucide-react'

interface School {
  icon: LucideIcon
  name: string
  founder: string
  era: string
  color: string
  glow: string
  summary: string
  claim: string
  critique: string
}

const SCHOOLS: School[] = [
  {
    icon: Sparkles,
    name: 'Platonism',
    founder: 'Plato · defended by Gödel, Hardy',
    era: '~380 BCE — present',
    color: 'border-violet-500/25 bg-violet-500/5',
    glow: 'text-violet-400',
    summary:
      'Mathematical objects — numbers, sets, triangles — exist in an abstract, timeless realm independent of human minds. Mathematicians do not invent these objects; they discover them, the way an astronomer discovers a planet.',
    claim: '"2 + 2 = 4" was true before any human existed, and would remain true if humanity vanished.',
    critique: 'If mathematical objects exist outside space and time, how do physical brains ever come to know them?',
  },
  {
    icon: Blocks,
    name: 'Formalism',
    founder: 'David Hilbert',
    era: '~1900 — present',
    color: 'border-cyan-500/25 bg-cyan-500/5',
    glow: 'text-cyan-400',
    summary:
      'Mathematics is a game played with meaningless symbols according to fixed rules. A theorem is simply a string of symbols derivable from the axioms — there is no deeper "truth" beyond internal consistency.',
    claim: 'Asking whether √2 "really exists" is like asking whether a legal chess move "really exists" — the question misunderstands the game.',
    critique: "Gödel's incompleteness theorems showed no formal system powerful enough for arithmetic can prove all truths about itself, or even prove its own consistency.",
  },
  {
    icon: BrainIcon,
    name: 'Intuitionism',
    founder: 'L.E.J. Brouwer',
    era: '~1907 — present',
    color: 'border-amber-500/25 bg-amber-500/5',
    glow: 'text-amber-400',
    summary:
      'Mathematics is a mental construction. A statement is only true if we can constructively prove it — proof by contradiction alone is not enough. This rejects the law of excluded middle for infinite sets.',
    claim: 'You cannot claim "there exists a number with property P" unless you can actually construct one.',
    critique: 'Rejecting classical proof techniques (like reductio ad absurdum) eliminates large parts of standard mathematics that most mathematicians rely on daily.',
  },
  {
    icon: Network,
    name: 'Structuralism',
    founder: 'Nicolas Bourbaki, Paul Benacerraf',
    era: '~1965 — present',
    color: 'border-emerald-500/25 bg-emerald-500/5',
    glow: 'text-emerald-400',
    summary:
      'Numbers are not objects at all — they are positions within a structure, defined entirely by their relationships to other positions. "3" is not a thing; it is "the successor of the successor of the successor of 0."',
    claim: 'Whether "3" is a set, a symbol, or an idea is irrelevant — only its structural role in arithmetic matters.',
    critique: 'It can struggle to explain why abstract structures apply so precisely to the physical world.',
  },
  {
    icon: Scale,
    name: 'Logicism',
    founder: 'Gottlob Frege, Bertrand Russell',
    era: '~1884 — 1930s',
    color: 'border-rose-500/25 bg-rose-500/5',
    glow: 'text-rose-400',
    summary:
      'All of mathematics can be reduced to pure logic — every mathematical truth is ultimately a logical truth in disguise, and every mathematical concept can be defined using only logical notions.',
    claim: "Russell and Whitehead's Principia Mathematica spent over 300 pages proving 1 + 1 = 2 from logical axioms alone.",
    critique: "Russell's Paradox exposed contradictions in naive set theory, forcing logicism to adopt increasingly complex axioms that arguably were no longer \"pure logic.\"",
  },
]

const QUESTIONS = [
  {
    q: 'Is mathematics discovered or invented?',
    body: 'The central question dividing every school above. Platonists say discovered — mathematical truths pre-exist us. Formalists and intuitionists lean toward invented — humans build the axioms and rules. Most working mathematicians are pragmatic Platonists: they invent notation but feel they discover the underlying structure.',
  },
  {
    q: 'Why does mathematics describe physical reality so well?',
    body: 'Physicist Eugene Wigner called this "the unreasonable effectiveness of mathematics." Abstract theory developed purely for internal elegance — like non-Euclidean geometry or complex numbers — later turned out to precisely describe general relativity and quantum mechanics. No philosophical school fully explains why this keeps happening.',
  },
  {
    q: 'Can mathematics be certain if its foundations cannot be proven consistent?',
    body: "Gödel's second incompleteness theorem (1931) proved that any formal system rich enough to describe arithmetic cannot prove its own consistency from within itself. This shattered Hilbert's dream of a complete, self-verifying foundation for all mathematics.",
  },
  {
    q: 'Are infinite sets legitimate mathematical objects?',
    body: "Cantor's set theory treats different sizes of infinity as objects to be studied. Intuitionists and constructivists reject completed infinities as meaningful — only step-by-step constructible processes count. This single disagreement changes which proofs are considered valid.",
  },
]

export default function PhilosophyPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-violet-400 text-sm font-mono mb-2">// Foundation → Philosophy</p>
          <h1 className="text-4xl font-bold text-white mb-3">Mathematical Philosophy</h1>
          <p className="text-white/40 leading-relaxed">
            Beneath every equation lies an unresolved question: what kind of thing is a number, and how do we know
            mathematical statements are true? Five major schools of thought offer very different answers.
          </p>
        </div>

        <div className="space-y-5 mb-14">
          {SCHOOLS.map((s) => (
            <div key={s.name} className={`rounded-2xl border p-6 ${s.color}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`shrink-0 ${s.glow}`}>
                  <s.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{s.name}</h2>
                  <p className="text-xs text-white/35 font-mono">{s.founder} · {s.era}</p>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-4">{s.summary}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-lg bg-black/20 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Core claim</p>
                  <p className="text-xs text-white/55 leading-relaxed">{s.claim}</p>
                </div>
                <div className="rounded-lg bg-black/20 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Main critique</p>
                  <p className="text-xs text-white/55 leading-relaxed">{s.critique}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mb-5">Open Philosophical Questions</h2>
        <div className="space-y-4 mb-14">
          {QUESTIONS.map((item) => (
            <div key={item.q} className="rounded-xl border border-white/6 bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white/85 mb-2">{item.q}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 mb-10 text-center math-grid">
          <p className="text-5xl mb-4 font-mono text-violet-400/30">∀</p>
          <blockquote className="text-xl font-light text-white/60 italic max-w-2xl mx-auto mb-4">
            &ldquo;God made the integers, all else is the work of man.&rdquo;
          </blockquote>
          <p className="text-sm text-white/25">— Leopold Kronecker</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/foundation/thinking" className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-all">
            Mathematical Thinking →
          </Link>
          <Link href="/foundation/logic" className="rounded-lg border border-white/10 hover:border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all">
            Logic Basics →
          </Link>
        </div>
      </div>
    </main>
  )
}
