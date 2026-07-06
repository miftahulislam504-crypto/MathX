import Link from 'next/link'
import { Binary, GitBranch, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react'

interface Connective {
  symbol: string
  name: string
  meaning: string
  truth: string
}

const CONNECTIVES: Connective[] = [
  { symbol: '¬P',        name: 'Negation (NOT)',     meaning: 'True when P is false, false when P is true.',                  truth: '¬T = F,  ¬F = T' },
  { symbol: 'P ∧ Q',     name: 'Conjunction (AND)',  meaning: 'True only when both P and Q are true.',                        truth: 'T∧T=T · otherwise F' },
  { symbol: 'P ∨ Q',     name: 'Disjunction (OR)',   meaning: 'True when at least one of P, Q is true.',                      truth: 'F∨F=F · otherwise T' },
  { symbol: 'P → Q',     name: 'Implication',        meaning: 'False only when P is true and Q is false.',                    truth: 'T→F=F · otherwise T' },
  { symbol: 'P ↔ Q',     name: 'Biconditional',      meaning: 'True when P and Q share the same truth value.',                truth: 'T↔T=T · F↔F=T · else F' },
]

const QUANTIFIERS = [
  { symbol: '∀x', name: 'Universal quantifier', reading: '"For all x"', example: '∀x ∈ ℕ, x + 0 = x  (every natural number plus zero equals itself)' },
  { symbol: '∃x', name: 'Existential quantifier', reading: '"There exists an x"', example: '∃x ∈ ℤ, x + 5 = 3  (some integer satisfies this — namely −2)' },
]

const PROOF_METHODS: { icon: LucideIcon; name: string; desc: string; example: string }[] = [
  {
    icon: CheckCircle2,
    name: 'Direct Proof',
    desc: 'Assume the hypothesis is true, then use logical steps to arrive directly at the conclusion.',
    example: 'To prove "if n is even, n² is even": let n = 2k, so n² = 4k² = 2(2k²), which is even.',
  },
  {
    icon: GitBranch,
    name: 'Proof by Contrapositive',
    desc: 'To prove "P → Q," instead prove the logically equivalent statement "¬Q → ¬P."',
    example: 'To prove "if n² is even, n is even," prove instead "if n is odd, n² is odd."',
  },
  {
    icon: XCircle,
    name: 'Proof by Contradiction',
    desc: 'Assume the opposite of what you want to prove, then derive a logical impossibility.',
    example: 'To prove √2 is irrational: assume √2 = a/b in lowest terms, derive that both a and b must be even — a contradiction.',
  },
  {
    icon: Binary,
    name: 'Proof by Induction',
    desc: 'Prove a base case, then prove that truth for case k guarantees truth for case k+1.',
    example: 'To prove 1+2+…+n = n(n+1)/2: verify n=1, then show the formula for k implies it for k+1.',
  },
]

export default function LogicPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-violet-400 text-sm font-mono mb-2">// Foundation → Logic</p>
          <h1 className="text-4xl font-bold text-white mb-3">Mathematical Logic Basics</h1>
          <p className="text-white/40 leading-relaxed">
            Logic is the grammar of mathematics — the rules that let us combine statements and guarantee that
            true premises lead only to true conclusions. Every proof, no matter how advanced, rests on these basics.
          </p>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Statements & Truth Values</h2>
        <p className="text-sm text-white/45 mb-6 leading-relaxed">
          A <span className="text-white/70 font-medium">proposition</span> is a statement that is either
          unambiguously true (T) or false (F) — never both, never neither. &ldquo;5 is a prime number&rdquo; is a
          proposition. &ldquo;5 is a big number&rdquo; is not, since &ldquo;big&rdquo; is not well-defined.
        </p>

        <h2 className="text-xl font-bold text-white mb-5">Logical Connectives</h2>
        <div className="rounded-xl border border-white/6 bg-white/[0.02] overflow-hidden mb-14">
          {CONNECTIVES.map((c, i) => (
            <div
              key={c.symbol}
              className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 ${i !== CONNECTIVES.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <span className="font-mono text-violet-300 text-base w-20 shrink-0">{c.symbol}</span>
              <span className="text-sm font-semibold text-white/80 w-44 shrink-0">{c.name}</span>
              <span className="text-xs text-white/45 flex-1">{c.meaning}</span>
              <span className="text-[11px] font-mono text-white/30 shrink-0">{c.truth}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mb-5">Quantifiers</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {QUANTIFIERS.map((q) => (
            <div key={q.symbol} className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-cyan-300 text-xl">{q.symbol}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white/85">{q.name}</h3>
                  <p className="text-xs text-white/40">{q.reading}</p>
                </div>
              </div>
              <p className="text-xs text-white/45 leading-relaxed mt-2">{q.example}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mb-5">Core Proof Methods</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {PROOF_METHODS.map((m) => (
            <div key={m.name} className="rounded-xl border border-white/6 bg-white/[0.02] p-5">
              <m.icon className="w-6 h-6 mb-3 text-amber-400" />
              <h3 className="text-sm font-semibold text-white/85 mb-2">{m.name}</h3>
              <p className="text-xs text-white/45 leading-relaxed mb-3">{m.desc}</p>
              <p className="text-[11px] text-white/30 leading-relaxed border-t border-white/5 pt-2">{m.example}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Why Logic Matters</h2>
          <p className="text-sm text-white/55 leading-relaxed">
            Without formal logic, mathematics would be a collection of plausible-sounding claims with no way to
            separate truth from error. Logic guarantees that if the axioms are accepted, every theorem derived
            from them by valid rules must also be true — this is what makes a mathematical proof different from
            an opinion.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/foundation/evolution" className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-all">
            Evolution of Mathematics →
          </Link>
          <Link href="/foundation/thinking" className="rounded-lg border border-white/10 hover:border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all">
            Mathematical Thinking →
          </Link>
        </div>
      </div>
    </main>
  )
}
