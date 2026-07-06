import Link from 'next/link'
import {
  Search, Settings, Link as LinkIcon, Network, RefreshCw, Lightbulb,
  Puzzle, Layers, ArrowRightLeft, type LucideIcon,
} from 'lucide-react'

interface Skill {
  icon: LucideIcon
  title: string
  desc: string
  example: string
}

const CORE_SKILLS: Skill[] = [
  {
    icon: Search,
    title: 'Pattern Recognition',
    desc: 'Mathematics begins by noticing regularities in numbers, shapes, and processes, then asking whether the pattern always holds.',
    example: '1, 4, 9, 16, 25 — spotting that each term is a perfect square before ever writing n².',
  },
  {
    icon: Settings,
    title: 'Abstraction',
    desc: 'Stripping away the specific context of a problem to reveal a universal structure that applies far beyond the original case.',
    example: 'The rule for combining two rotations and the rule for combining two symmetries turn out to be the same abstract "group."',
  },
  {
    icon: LinkIcon,
    title: 'Logical Deduction',
    desc: 'Building an unbroken chain of valid inferences from agreed starting points (axioms) to a new, certain conclusion.',
    example: 'From "all primes greater than 2 are odd" and "7 is a prime greater than 2," deduce "7 is odd" with certainty.',
  },
  {
    icon: Network,
    title: 'Generalization',
    desc: 'Taking a result proven for a specific case and extending it to the widest possible class of cases it will still hold for.',
    example: "Pythagoras' theorem for right triangles generalizes to the law of cosines for any triangle.",
  },
  {
    icon: RefreshCw,
    title: 'Problem Reformulation',
    desc: 'Restating a difficult problem in a different mathematical language where the solution becomes visible or even trivial.',
    example: 'A geometry problem about circle tangents can become a simple algebra problem once placed on a coordinate grid.',
  },
  {
    icon: Lightbulb,
    title: 'Intuition Guided by Rigor',
    desc: 'Creative leaps and educated guesses point toward what might be true; formal proof then verifies whether it actually is.',
    example: 'Ramanujan intuited hundreds of formulas without proof — later mathematicians rigorously confirmed most of them.',
  },
  {
    icon: Puzzle,
    title: 'Working Backward',
    desc: 'Starting from the desired conclusion and asking what would need to be true just before it, repeating until reaching known facts.',
    example: 'To prove a maze has a solution, start at the exit and trace which cells could lead there.',
  },
  {
    icon: Layers,
    title: 'Decomposition',
    desc: 'Breaking one large, intimidating problem into a sequence of smaller problems that are each individually solvable.',
    example: 'Proving a formula for all n often splits into: prove it for n=1, then show n=k implies n=k+1 (induction).',
  },
  {
    icon: ArrowRightLeft,
    title: 'Analogical Reasoning',
    desc: 'Recognizing that a new, unfamiliar problem shares deep structure with a problem already solved, and transferring the method across.',
    example: 'Techniques for solving linear equations in numbers extend almost unchanged to solving linear equations in matrices.',
  },
]

const PROBLEM_SOLVING_STAGES = [
  { step: '1', title: 'Understand the Problem', desc: 'Restate it in your own words. Identify the unknown, the given data, and the condition connecting them.' },
  { step: '2', title: 'Devise a Plan', desc: 'Have you seen a related problem? Can you use a known theorem, work backward, or try a simpler special case first?' },
  { step: '3', title: 'Carry Out the Plan', desc: 'Execute each step carefully, checking that each one is logically justified before moving to the next.' },
  { step: '4', title: 'Look Back', desc: 'Can the result be checked? Can the argument be derived differently? Can the method be used for other problems?' },
]

export default function ThinkingPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-violet-400 text-sm font-mono mb-2">// Foundation → Thinking</p>
          <h1 className="text-4xl font-bold text-white mb-3">Mathematical Thinking</h1>
          <p className="text-white/40 leading-relaxed">
            Mathematics is less a body of facts to memorize and more a set of thinking habits. These nine
            habits of mind are what separate solving a problem from merely recalling an answer.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {CORE_SKILLS.map((s) => (
            <div key={s.title} className="rounded-xl border border-white/6 bg-white/[0.02] p-5">
              <s.icon className="w-6 h-6 mb-3 text-violet-400" />
              <h3 className="text-sm font-semibold text-white/85 mb-2">{s.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed mb-3">{s.desc}</p>
              <p className="text-[11px] text-white/30 leading-relaxed border-t border-white/5 pt-2">
                <span className="text-white/40 font-medium">Example: </span>{s.example}
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Pólya&apos;s Four-Step Method</h2>
        <p className="text-sm text-white/40 mb-6 leading-relaxed">
          George Pólya&apos;s 1945 framework <em>How to Solve It</em> remains the most widely taught approach to
          mathematical problem-solving.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {PROBLEM_SOLVING_STAGES.map((st) => (
            <div key={st.step} className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-bold flex items-center justify-center">
                  {st.step}
                </span>
                <h3 className="text-sm font-semibold text-white/85">{st.title}</h3>
              </div>
              <p className="text-xs text-white/45 leading-relaxed pl-10">{st.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 mb-10 text-center math-grid">
          <p className="text-5xl mb-4 font-mono text-violet-400/30">∴</p>
          <blockquote className="text-xl font-light text-white/60 italic max-w-2xl mx-auto mb-4">
            &ldquo;Mathematics is not about numbers, equations, or algorithms — it is about understanding.&rdquo;
          </blockquote>
          <p className="text-sm text-white/25">— William Paul Thurston</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/foundation/logic" className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-all">
            Logic Basics →
          </Link>
          <Link href="/foundation/philosophy" className="rounded-lg border border-white/10 hover:border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all">
            Mathematical Philosophy →
          </Link>
        </div>
      </div>
    </main>
  )
}
