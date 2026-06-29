'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

// ─── Minimal Top Nav (Landing only) ───────────────────────────────────
function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Math</span>
              <span className="text-violet-400">X</span>
            </span>
            <span className="text-xs text-white/25 font-mono mt-1 hidden sm:block">∑ ecosystem</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────
function Hero({ onStartLearning }: { onStartLearning: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center math-grid overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-violet-600/8 blur-[140px]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-xs text-violet-300 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Wikipedia + Khan Academy + GeoGebra + Wolfram Alpha — unified
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          <span className="text-white">Learn.</span>{' '}
          <span className="text-violet-400">Explore.</span>{' '}
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Experience Mathematics.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          From school arithmetic to graduate research — one platform for every mathematician.
          Visualize, experiment, practice, and discover.
        </p>

        {/* CTA — Start Learning only (no Visualizer button) */}
        <div className="flex justify-center">
          <button
            onClick={onStartLearning}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 px-10 py-4 text-base font-semibold text-white transition-all hover:scale-105 shadow-lg shadow-violet-600/25"
          >
            Start Learning →
          </button>
        </div>

        {/* Floating math symbols */}
        <div className="mt-16 flex justify-center gap-6 sm:gap-8 text-2xl sm:text-3xl text-white/10 font-mono select-none flex-wrap">
          {['∑','∫','∂','π','∞','√','Δ','ℝ','ℂ'].map((sym, i) => (
            <span key={sym} className="animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
              {sym}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Branches Grid ─────────────────────────────────────────────────────
function BranchesGrid({ onStartLearning }: { onStartLearning: () => void }) {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Explore All Branches</h2>
          <p className="text-white/30 text-sm">{MATH_BRANCHES.length} branches — login to dive in</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {MATH_BRANCHES.map(branch => (
            <button
              key={branch.slug}
              onClick={onStartLearning}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] p-4 text-center transition-all hover:border-white/10 hover:scale-105"
            >
              <span className="text-2xl">{branch.icon}</span>
              <span className="text-[11px] text-white/60 group-hover:text-white/90 transition-colors leading-tight">
                {branch.name}
              </span>
              {branch.nameBn && (
                <span className="text-[9px] text-white/20">{branch.nameBn}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features Grid ─────────────────────────────────────────────────────
const FEATURES = [
  { icon:'∫',  color:'text-amber-400',  bg:'bg-amber-500/5 border-amber-500/10',    title:'Interactive Visualizer',   desc:'Plot functions, animate derivatives, explore integrals — all live.' },
  { icon:'🧪', color:'text-cyan-400',   bg:'bg-cyan-500/5 border-cyan-500/10',      title:'Mathematics Lab',          desc:'Monte Carlo, fractals, chaos theory — run real experiments.' },
  { icon:'🤖', color:'text-violet-400', bg:'bg-violet-500/5 border-violet-500/10',  title:'AI Math Tutor',            desc:'Step-by-step explanations with LaTeX, examples, and practice.' },
  { icon:'📚', color:'text-emerald-400',bg:'bg-emerald-500/5 border-emerald-500/10',title:'Encyclopedia',             desc:'Every definition, theorem, and formula — with proofs.' },
  { icon:'🏆', color:'text-rose-400',   bg:'bg-rose-500/5 border-rose-500/10',      title:'Problem Hub',              desc:'Beginner to Olympiad problems with hints and solutions.' },
  { icon:'🎮', color:'text-sky-400',    bg:'bg-sky-500/5 border-sky-500/10',        title:'Math Games',               desc:'Number guessing, Nim, logic puzzles — math as play.' },
  { icon:'📊', color:'text-fuchsia-400',bg:'bg-fuchsia-500/5 border-fuchsia-500/10',title:'Statistics Center',        desc:'Distribution visualizer, regression explorer, hypothesis testing.' },
  { icon:'🌍', color:'text-orange-400', bg:'bg-orange-500/5 border-orange-500/10',  title:'Applied Mathematics',      desc:'Engineering, Finance, AI, Biology — math in the real world.' },
  { icon:'🔭', color:'text-indigo-400', bg:'bg-indigo-500/5 border-indigo-500/10',  title:'Research Center',          desc:'Open problems, research areas, roadmaps, and resources.' },
  { icon:'📜', color:'text-yellow-400', bg:'bg-yellow-500/5 border-yellow-500/10',  title:'Foundation',               desc:'History, philosophy, and the greatest mathematicians.' },
  { icon:'🗺️', color:'text-teal-400',  bg:'bg-teal-500/5 border-teal-500/10',      title:'Knowledge Map',            desc:'Visualize how every topic connects. Navigate your path.' },
  { icon:'📈', color:'text-lime-400',   bg:'bg-lime-500/5 border-lime-500/10',      title:'Dashboard',                desc:'Track progress, earn achievements, visualize mastery.' },
]

function FeaturesGrid({ onStartLearning }: { onStartLearning: () => void }) {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Everything in One Place</h2>
          <p className="text-white/40">No more switching between 10 different websites</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {FEATURES.map(f => (
            <button key={f.title} onClick={onStartLearning}
              className={`group rounded-xl border ${f.bg} p-5 transition-all hover:scale-[1.02] text-left w-full`}>
              <div className={`text-2xl mb-3 ${f.color}`}>{f.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              <span className="mt-3 inline-block text-[10px] text-white/20 group-hover:text-white/40 transition-colors">
                Login to explore →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Stats ─────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value:'14+', label:'Math Branches' },
    { value:'45+', label:'Topics' },
    { value:'46+', label:'Formulas' },
    { value:'22+', label:'Problems' },
    { value:'12',  label:'Visualizers' },
    { value:'25',  label:'Achievements' },
  ]
  return (
    <section className="py-16 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-6 text-center">
        {stats.map(s => (
          <div key={s.label}>
            <div className="text-2xl sm:text-3xl font-bold text-violet-400 font-mono">{s.value}</div>
            <div className="text-xs text-white/30 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── CTA Banner ────────────────────────────────────────────────────────
function CTABanner({ onStartLearning }: { onStartLearning: () => void }) {
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-transparent p-12">
          <p className="text-4xl font-bold font-mono text-violet-400/30 mb-4">∑ · ∫ · ∂ · ∞</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to explore mathematics?
          </h2>
          <p className="text-white/40 mb-8">
            Join the most complete mathematics learning platform ever built.
            From school to research — all in one place.
          </p>
          <button
            onClick={onStartLearning}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 px-10 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105"
          >
            Get Started Free →
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────
export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<'login'|'signup'>('login')
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleStartLearning = () => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      setAuthOpen(true)
    }
  }

  return (
    <>
      <LandingNav />
      <main className="pb-10">
        <Hero onStartLearning={handleStartLearning} />
        <BranchesGrid onStartLearning={handleStartLearning} />
        <FeaturesGrid onStartLearning={handleStartLearning} />
        <Stats />
        <CTABanner onStartLearning={handleStartLearning} />
      </main>

      {/* Login/Signup Modal */}
      {authOpen && (
        <AuthModal
          tab={authTab}
          onTabChange={setAuthTab}
          onClose={() => setAuthOpen(false)}
          onSuccess={() => {
            setAuthOpen(false)
            router.push('/dashboard')
          }}
        />
      )}
    </>
  )
}
