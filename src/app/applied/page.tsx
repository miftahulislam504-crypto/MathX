import Link from 'next/link'

const AREAS = [
  {
    icon: '🏗️', title: 'Engineering Mathematics',
    color: 'border-violet-500/20 bg-violet-500/5',
    tag: 'text-violet-400',
    items: [
      { name:'Structural Analysis', math:'Stiffness matrices, eigenvalue problems, differential equations' },
      { name:'Signal Processing',   math:'Fourier transforms, convolution, Laplace transforms' },
      { name:'Control Systems',     math:'Transfer functions, Bode plots, stability analysis' },
      { name:'Fluid Dynamics',      math:'Navier-Stokes equations, partial differential equations' },
    ],
    example: {
      title: 'Bridge Cable Tension',
      problem: 'A suspension bridge cable hangs in a parabolic shape y = x²/2000. Find the arc length from x = -100 to 100.',
      solution: 'Arc length = ∫√(1 + (dy/dx)²) dx. Here dy/dx = x/1000. L = ∫₋₁₀₀¹⁰⁰ √(1 + x²/10⁶) dx ≈ 200.003 m',
      insight: 'Only 3mm longer than the horizontal span — cables are remarkably efficient!'
    }
  },
  {
    icon: '💹', title: 'Financial Mathematics',
    color: 'border-cyan-500/20 bg-cyan-500/5',
    tag: 'text-cyan-400',
    items: [
      { name:'Compound Interest',   math:'A = P(1 + r/n)^(nt), continuous: A = Pe^(rt)' },
      { name:'Option Pricing',      math:'Black-Scholes PDE: ∂V/∂t + ½σ²S²∂²V/∂S² + rS∂V/∂S − rV = 0' },
      { name:'Portfolio Theory',    math:'Markowitz optimization, efficient frontier, CAPM' },
      { name:'Risk Analysis',       math:'Value at Risk (VaR), Monte Carlo simulation, normal distribution' },
    ],
    example: {
      title: 'Rule of 72',
      problem: 'How long to double money at 6% annual interest?',
      solution: 'Exact: n = ln(2)/ln(1.06) ≈ 11.89 years. Rule of 72: 72/6 = 12 years.',
      insight: 'The Rule of 72 works because ln(2) ≈ 0.693 ≈ 0.72/1.04 for typical interest rates.'
    }
  },
  {
    icon: '🤖', title: 'AI & Machine Learning Mathematics',
    color: 'border-amber-500/20 bg-amber-500/5',
    tag: 'text-amber-400',
    items: [
      { name:'Gradient Descent',    math:'θ ← θ − α∇J(θ). Minimizing loss via calculus.' },
      { name:'Neural Networks',     math:'Matrix multiplications, activation functions, backpropagation chain rule' },
      { name:'Principal Component Analysis', math:'Eigendecomposition of covariance matrix, variance maximization' },
      { name:'Bayesian Inference',  math:'P(H|D) = P(D|H)P(H)/P(D) — updating beliefs with data' },
    ],
    example: {
      title: 'Gradient Descent Step',
      problem: 'Minimize f(x) = x² − 4x + 5 using gradient descent with α = 0.3, starting at x = 0.',
      solution: "f'(x) = 2x − 4. Step 1: x₁ = 0 − 0.3(−4) = 1.2. Step 2: x₂ = 1.2 − 0.3(−1.6) = 1.68. Converges to x=2 (minimum).",
      insight: 'Learning rate α must be chosen carefully — too large oscillates, too small is slow.'
    }
  },
  {
    icon: '💻', title: 'Computer Science Mathematics',
    color: 'border-emerald-500/20 bg-emerald-500/5',
    tag: 'text-emerald-400',
    items: [
      { name:'Algorithm Complexity', math:'Big-O notation, recurrence relations, Master Theorem' },
      { name:'Cryptography',        math:'Modular arithmetic, RSA: c = m^e (mod n), Fermat\'s little theorem' },
      { name:'Graph Algorithms',    math:'Dijkstra (greedy), Floyd-Warshall (dynamic programming)' },
      { name:'Information Theory',  math:'Shannon entropy: H = −Σ p(x) log₂ p(x), compression bounds' },
    ],
    example: {
      title: 'RSA in One Step',
      problem: 'Encrypt m=7 with public key (e=3, n=33). Decrypt with d=7.',
      solution: 'Encrypt: c = 7³ mod 33 = 343 mod 33 = 13. Decrypt: m = 13⁷ mod 33 = 7. ✓',
      insight: 'RSA security relies on the hardness of factoring large n = p×q. No efficient algorithm is known.'
    }
  },
  {
    icon: '🧬', title: 'Mathematics in Medicine & Biology',
    color: 'border-rose-500/20 bg-rose-500/5',
    tag: 'text-rose-400',
    items: [
      { name:'Epidemiology (SIR)',   math:'dS/dt=−βSI, dI/dt=βSI−γI, dR/dt=γI. Basic reproduction R₀=β/γ' },
      { name:'Medical Imaging',     math:'Fourier transforms in MRI, Radon transform in CT scans' },
      { name:'Population Genetics', math:'Hardy-Weinberg: p²+2pq+q²=1. Gene frequency equilibrium.' },
      { name:'Drug Pharmacokinetics',math:'C(t) = C₀e^(−kt). Half-life: t₁/₂ = ln2/k' },
    ],
    example: {
      title: 'COVID-19 R₀',
      problem: 'If each infected person infects 2.5 others (R₀=2.5), what % must be immune to stop spread?',
      solution: 'Herd immunity threshold = 1 − 1/R₀ = 1 − 1/2.5 = 60%. At least 60% immune stops exponential spread.',
      insight: 'R₀ > 1 → epidemic grows. R₀ < 1 → dies out. Vaccination shifts effective R₀ below 1.'
    }
  },
  {
    icon: '🌍', title: 'Mathematics in Nature',
    color: 'border-sky-500/20 bg-sky-500/5',
    tag: 'text-sky-400',
    items: [
      { name:'Fibonacci & Golden Ratio', math:'φ = (1+√5)/2 ≈ 1.618. Limit of Fₙ₊₁/Fₙ. Appears in spirals.' },
      { name:'Fractals in Nature',       math:'Self-similarity, fractal dimension d = log(N)/log(s)' },
      { name:'Symmetry Groups',          math:'Wallpaper groups (17 types), crystal structures, molecular symmetry' },
      { name:'Optimal Packing',          math:'Honeycomb conjecture (Hales 1999): hexagons minimize perimeter' },
    ],
    example: {
      title: 'Sunflower Spirals',
      problem: 'A sunflower has 34 spirals clockwise and 55 counterclockwise. Why?',
      solution: '34 and 55 are consecutive Fibonacci numbers. The golden angle (137.5° = 360°/φ²) between seeds creates this pattern.',
      insight: 'Fibonacci numbers minimize seed crowding — evolution discovered the golden ratio.'
    }
  },
]

export default function AppliedPage() {
  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="mb-10">
            <p className="text-violet-400 text-sm font-mono mb-2">// Applied Mathematics</p>
            <h1 className="text-4xl font-bold text-white mb-3">Mathematics in the Real World</h1>
            <p className="text-white/40">
              Abstract math made concrete — how every equation shapes the world around us.
            </p>
          </div>

          <div className="space-y-8">
            {AREAS.map((area, ai) => (
              <div key={ai} className={`rounded-2xl border ${area.color} overflow-hidden`}>
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{area.icon}</span>
                    <h2 className={`text-xl font-bold ${area.tag}`}>{area.title}</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {area.items.map((item, ii) => (
                      <div key={ii} className="rounded-xl border border-white/6 bg-black/20 p-3">
                        <p className="text-sm font-semibold text-white/80 mb-1">{item.name}</p>
                        <p className="text-xs text-white/35 font-mono leading-relaxed">{item.math}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Worked Example */}
                <div className="p-6">
                  <p className={`text-xs uppercase tracking-wider font-mono mb-3 ${area.tag} opacity-60`}>
                    ✎ Worked Example
                  </p>
                  <h3 className="text-sm font-bold text-white/80 mb-2">{area.example.title}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase mb-1">Problem</p>
                      <p className="text-sm text-white/60 leading-relaxed">{area.example.problem}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase mb-1">Solution</p>
                      <p className="text-sm text-white/60 font-mono leading-relaxed">{area.example.solution}</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2.5">
                    <p className="text-xs text-white/35 italic">💡 {area.example.insight}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Links to related tools */}
          <div className="mt-12 rounded-2xl border border-white/5 bg-white/[0.01] p-8">
            <h2 className="text-lg font-bold text-white mb-4">Explore Related Tools</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon:'🧪', label:'Math Lab',       href:'/lab',        desc:'Monte Carlo, fractals, chaos experiments' },
                { icon:'∫',  label:'Visualizer',     href:'/visualize',  desc:'Plot functions, vectors, matrices' },
                { icon:'📊', label:'Statistics',     href:'/statistics', desc:'Distributions, regression analysis' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="rounded-xl border border-white/8 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] p-4 transition-all group">
                  <span className="text-2xl block mb-2">{l.icon}</span>
                  <p className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">{l.label}</p>
                  <p className="text-xs text-white/30 mt-1">{l.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

    </>
  )
}
