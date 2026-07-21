'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import {
  LineChart, FlaskConical, Bot, BookOpen, Trophy, Gamepad2,
  BarChart3, Globe, Telescope, ScrollText, Map, TrendingUp, type LucideIcon,
  GraduationCap, Calculator, ListChecks, Award, ClipboardCheck, PenTool,
  Beaker, FlaskRound, Shapes, Grid3x3, Dices, Boxes,
  Sparkles, Wrench, Building2, Compass, Briefcase, Rocket,
  PuzzleIcon, Users, Orbit,
} from 'lucide-react'

// ─── Minimal Top Nav (Landing only) ───────────────────────────────────
function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="w-20 sm:w-28" />
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Math</span>
              <span className="text-violet-400">X</span>
            </span>
            <span className="text-xs text-white/25 font-mono mt-1 hidden sm:block">∑ ecosystem</span>
          </Link>
          <div className="w-20 sm:w-28 flex justify-end">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────
function Hero({ onStartLearning }: { onStartLearning: () => void }) {
  const { tt } = useLanguage()
  return (
    <section className="relative min-h-screen flex items-center justify-center math-grid overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-violet-600/8 blur-[140px]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24 pb-16">
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-10">
          <span className="text-white">{tt(t.home.headline1)}</span>{' '}
          <span className="text-violet-400">{tt(t.home.headline2)}</span>{' '}
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            {tt(t.home.headline3)}
          </span>
        </h1>

        {/* CTA — Start Learning only (no Visualizer button) */}
        <div className="flex justify-center">
          <button
            onClick={onStartLearning}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 px-10 py-4 text-base font-semibold text-white transition-all hover:scale-105 shadow-lg shadow-violet-600/25"
          >
            {tt(t.common.startLearning)}
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

// ─── Site Summary ────────────────────────────────────────────────────────
// Static, non-interactive overview of every module in the MathX ecosystem.
// Cards are informational only — no hover/active states, no click handlers.
function SiteSummary() {
  const { tt } = useLanguage()

  type Module = { icon: LucideIcon; color: string; title: string; desc: string }
  type Group = { label: string; modules: Module[] }

  const GROUPS: Group[] = [
    {
      label: 'Learn & Practice',
      modules: [
        { icon: GraduationCap, color: 'text-emerald-400', title: tt(t.siteMap.learn_title), desc: tt(t.siteMap.learn_desc) },
        { icon: BookOpen, color: 'text-emerald-400', title: tt(t.siteMap.encyclopedia_title), desc: tt(t.siteMap.encyclopedia_desc) },
        { icon: Calculator, color: 'text-emerald-400', title: tt(t.siteMap.formulas_title), desc: tt(t.siteMap.formulas_desc) },
        { icon: Trophy, color: 'text-emerald-400', title: tt(t.siteMap.problems_title), desc: tt(t.siteMap.problems_desc) },
        { icon: Award, color: 'text-emerald-400', title: tt(t.siteMap.theorems_title), desc: tt(t.siteMap.theorems_desc) },
        { icon: ClipboardCheck, color: 'text-emerald-400', title: tt(t.siteMap.assessment_title), desc: tt(t.siteMap.assessment_desc) },
        { icon: PenTool, color: 'text-emerald-400', title: tt(t.siteMap.practice_title), desc: tt(t.siteMap.practice_desc) },
      ],
    },
    {
      label: 'Visualize & Experiment',
      modules: [
        { icon: LineChart, color: 'text-amber-400', title: tt(t.siteMap.visualizer_title), desc: tt(t.siteMap.visualizer_desc) },
        { icon: FlaskConical, color: 'text-amber-400', title: tt(t.siteMap.lab_title), desc: tt(t.siteMap.lab_desc) },
        { icon: Beaker, color: 'text-amber-400', title: tt(t.siteMap.experiments_title), desc: tt(t.siteMap.experiments_desc) },
        { icon: Shapes, color: 'text-amber-400', title: tt(t.siteMap.geometry_title), desc: tt(t.siteMap.geometry_desc) },
        { icon: Grid3x3, color: 'text-amber-400', title: tt(t.siteMap.linearAlgebra_title), desc: tt(t.siteMap.linearAlgebra_desc) },
        { icon: Dices, color: 'text-amber-400', title: tt(t.siteMap.probability_title), desc: tt(t.siteMap.probability_desc) },
        { icon: Boxes, color: 'text-amber-400', title: tt(t.siteMap.modeling_title), desc: tt(t.siteMap.modeling_desc) },
      ],
    },
    {
      label: 'AI & Tools',
      modules: [
        { icon: Bot, color: 'text-violet-400', title: tt(t.siteMap.aiTutorCard_title), desc: tt(t.siteMap.aiTutorCard_desc) },
        { icon: Sparkles, color: 'text-violet-400', title: tt(t.siteMap.aiSolver_title), desc: tt(t.siteMap.aiSolver_desc) },
        { icon: Wrench, color: 'text-violet-400', title: tt(t.siteMap.tools_title), desc: tt(t.siteMap.tools_desc) },
      ],
    },
    {
      label: 'Applied & Real World',
      modules: [
        { icon: FlaskRound, color: 'text-orange-400', title: tt(t.siteMap.appliedLab_title), desc: tt(t.siteMap.appliedLab_desc) },
        { icon: Globe, color: 'text-orange-400', title: tt(t.siteMap.applied_title), desc: tt(t.siteMap.applied_desc) },
        { icon: Building2, color: 'text-orange-400', title: tt(t.siteMap.realLife_title), desc: tt(t.siteMap.realLife_desc) },
        { icon: Briefcase, color: 'text-orange-400', title: tt(t.siteMap.careerPath_title), desc: tt(t.siteMap.careerPath_desc) },
        { icon: Telescope, color: 'text-orange-400', title: tt(t.siteMap.research_title), desc: tt(t.siteMap.research_desc) },
      ],
    },
    {
      label: 'Explore & Community',
      modules: [
        { icon: Gamepad2, color: 'text-sky-400', title: tt(t.siteMap.games_title), desc: tt(t.siteMap.games_desc) },
        { icon: PuzzleIcon, color: 'text-sky-400', title: tt(t.siteMap.puzzles_title), desc: tt(t.siteMap.puzzles_desc) },
        { icon: Users, color: 'text-sky-400', title: tt(t.siteMap.community_title), desc: tt(t.siteMap.community_desc) },
        { icon: Orbit, color: 'text-sky-400', title: tt(t.siteMap.experienceZone_title), desc: tt(t.siteMap.experienceZone_desc) },
        { icon: ScrollText, color: 'text-sky-400', title: tt(t.siteMap.foundation_title), desc: tt(t.siteMap.foundation_desc) },
        { icon: Map, color: 'text-sky-400', title: tt(t.siteMap.map_title), desc: tt(t.siteMap.map_desc) },
        { icon: BarChart3, color: 'text-sky-400', title: tt(t.siteMap.statistics_title), desc: tt(t.siteMap.statistics_desc) },
      ],
    },
  ]

  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">{tt(t.siteMap.heading)}</h2>
          <p className="text-white/40">{tt(t.siteMap.subheading)}</p>
        </div>

        <div className="space-y-10">
          {GROUPS.map(group => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-4">
                {group.label}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {group.modules.map(m => (
                  <div
                    key={m.title}
                    className="select-none rounded-xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className={`mb-2 ${m.color}`}><m.icon className="w-6 h-6" /></div>
                    <h4 className="text-sm font-semibold text-white mb-1">{m.title}</h4>
                    <p className="text-xs text-white/40 leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Stats ─────────────────────────────────────────────────────────────
function Stats() {
  const { tt } = useLanguage()
  const stats = [
    { value:'14+', label:tt(t.home.mathBranches) },
    { value:'45+', label:tt(t.home.totalTopics) },
    { value:'46+', label:tt(t.home.formulas) },
    { value:'22+', label:tt(t.home.problems) },
    { value:'12',  label:tt(t.home.visualizers) },
    { value:'25',  label:tt(t.home.achievements) },
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
  const { tt } = useLanguage()
  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-transparent p-12">
          <p className="text-4xl font-bold font-mono text-violet-400/30 mb-4">∑ · ∫ · ∂ · ∞</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {tt(t.home.readyToExplore)}
          </h2>
          <p className="text-white/40 mb-8">
            {tt(t.home.joinPlatform)}
          </p>
          <button
            onClick={onStartLearning}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 px-10 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105"
          >
            {tt(t.common.getStartedFree)}
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
        <SiteSummary />
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
