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
  BarChart3, Globe, Telescope, ScrollText, TrendingUp,
  GraduationCap, PenTool, Shapes, Grid3x3, Dices, Boxes,
  Wrench, Compass, Route, Sparkles, Puzzle, Wand2,
  Sigma, Landmark, Users, ClipboardCheck, TestTube2, type LucideIcon,
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

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-xs text-violet-300 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          {tt(t.home.badge)}
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          <span className="text-white">{tt(t.home.headline1)}</span>{' '}
          <span className="text-violet-400">{tt(t.home.headline2)}</span>{' '}
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            {tt(t.home.headline3)}
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          {tt(t.home.subheadline)}
        </p>

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

// ─── Features Grid ─────────────────────────────────────────────────────
type Feature = { icon: LucideIcon; color: string; bg: string; title: string; desc: string }

function FeatureCard({ f, onClick, loginToExplore }: { f: Feature; onClick: () => void; loginToExplore: string }) {
  return (
    <button onClick={onClick}
      className={`group rounded-xl border ${f.bg} p-5 transition-all hover:scale-[1.02] text-left w-full`}>
      <div className={`mb-3 ${f.color}`}><f.icon className="w-6 h-6" /></div>
      <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
      <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
      <span className="mt-3 inline-block text-[10px] text-white/20 group-hover:text-white/40 transition-colors">
        {loginToExplore}
      </span>
    </button>
  )
}

function FeatureCategory({ title, features, onStartLearning, loginToExplore }: {
  title: string; features: Feature[]; onStartLearning: () => void; loginToExplore: string
}) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-4">{title}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {features.map(f => (
          <FeatureCard key={f.title} f={f} onClick={onStartLearning} loginToExplore={loginToExplore} />
        ))}
      </div>
    </div>
  )
}

function FeaturesGrid({ onStartLearning }: { onStartLearning: () => void }) {
  const { tt } = useLanguage()
  const loginToExplore = tt(t.common.loginToExplore)

  const learnPractice: Feature[] = [
    { icon:GraduationCap, color:'text-emerald-400', bg:'bg-emerald-500/5 border-emerald-500/10', title:tt(t.home.feat_learn_title), desc:tt(t.home.feat_learn_desc) },
    { icon:PenTool,       color:'text-rose-400',    bg:'bg-rose-500/5 border-rose-500/10',       title:tt(t.home.feat_practice_title), desc:tt(t.home.feat_practice_desc) },
    { icon:Trophy,        color:'text-rose-400',    bg:'bg-rose-500/5 border-rose-500/10',       title:tt(t.home.feat_problems_title), desc:tt(t.home.feat_problems_desc) },
    { icon:ClipboardCheck,color:'text-pink-400',    bg:'bg-pink-500/5 border-pink-500/10',       title:tt(t.home.feat_assessment_title), desc:tt(t.home.feat_assessment_desc) },
    { icon:Bot,           color:'text-violet-400',  bg:'bg-violet-500/5 border-violet-500/10',   title:tt(t.home.feat_tutor_title), desc:tt(t.home.feat_tutor_desc) },
    { icon:Wand2,         color:'text-violet-400',  bg:'bg-violet-500/5 border-violet-500/10',   title:tt(t.home.feat_solver_title), desc:tt(t.home.feat_solver_desc) },
    { icon:BookOpen,      color:'text-emerald-400', bg:'bg-emerald-500/5 border-emerald-500/10', title:tt(t.home.feat_encyclopedia_title), desc:tt(t.home.feat_encyclopedia_desc) },
    { icon:Sigma,         color:'text-yellow-400',  bg:'bg-yellow-500/5 border-yellow-500/10',   title:tt(t.home.feat_formulas_title), desc:tt(t.home.feat_formulas_desc) },
    { icon:Landmark,      color:'text-yellow-400',  bg:'bg-yellow-500/5 border-yellow-500/10',   title:tt(t.home.feat_theorems_title), desc:tt(t.home.feat_theorems_desc) },
  ]

  const exploreVisualize: Feature[] = [
    { icon:LineChart,   color:'text-amber-400',  bg:'bg-amber-500/5 border-amber-500/10',  title:tt(t.home.feat_visualizer_title), desc:tt(t.home.feat_visualizer_desc) },
    { icon:FlaskConical,color:'text-cyan-400',   bg:'bg-cyan-500/5 border-cyan-500/10',    title:tt(t.home.feat_lab_title), desc:tt(t.home.feat_lab_desc) },
    { icon:TestTube2,   color:'text-cyan-400',   bg:'bg-cyan-500/5 border-cyan-500/10',    title:tt(t.home.feat_experiments_title), desc:tt(t.home.feat_experiments_desc) },
    { icon:Gamepad2,    color:'text-sky-400',    bg:'bg-sky-500/5 border-sky-500/10',      title:tt(t.home.feat_games_title), desc:tt(t.home.feat_games_desc) },
    { icon:Puzzle,      color:'text-sky-400',    bg:'bg-sky-500/5 border-sky-500/10',      title:tt(t.home.feat_puzzles_title), desc:tt(t.home.feat_puzzles_desc) },
    { icon:Wrench,      color:'text-orange-400', bg:'bg-orange-500/5 border-orange-500/10',title:tt(t.home.feat_tools_title), desc:tt(t.home.feat_tools_desc) },
    { icon:Sparkles,    color:'text-fuchsia-400',bg:'bg-fuchsia-500/5 border-fuchsia-500/10',title:tt(t.home.feat_experience_title), desc:tt(t.home.feat_experience_desc) },
    { icon:Globe,       color:'text-orange-400', bg:'bg-orange-500/5 border-orange-500/10',title:tt(t.home.feat_reallife_title), desc:tt(t.home.feat_reallife_desc) },
  ]

  const centers: Feature[] = [
    { icon:Shapes,   color:'text-indigo-400', bg:'bg-indigo-500/5 border-indigo-500/10', title:tt(t.home.feat_geometry_title), desc:tt(t.home.feat_geometry_desc) },
    { icon:Grid3x3,  color:'text-indigo-400', bg:'bg-indigo-500/5 border-indigo-500/10', title:tt(t.home.feat_linalg_title), desc:tt(t.home.feat_linalg_desc) },
    { icon:Dices,    color:'text-fuchsia-400',bg:'bg-fuchsia-500/5 border-fuchsia-500/10',title:tt(t.home.feat_probability_title), desc:tt(t.home.feat_probability_desc) },
    { icon:BarChart3,color:'text-fuchsia-400',bg:'bg-fuchsia-500/5 border-fuchsia-500/10',title:tt(t.home.feat_stats_title), desc:tt(t.home.feat_stats_desc) },
    { icon:Boxes,    color:'text-teal-400',   bg:'bg-teal-500/5 border-teal-500/10',     title:tt(t.home.feat_modeling_title), desc:tt(t.home.feat_modeling_desc) },
    { icon:Globe,    color:'text-orange-400', bg:'bg-orange-500/5 border-orange-500/10', title:tt(t.home.feat_applied_title), desc:tt(t.home.feat_applied_desc) },
    { icon:FlaskConical,color:'text-teal-400',bg:'bg-teal-500/5 border-teal-500/10',     title:tt(t.home.feat_appliedlab_title), desc:tt(t.home.feat_appliedlab_desc) },
    { icon:Telescope,color:'text-indigo-400', bg:'bg-indigo-500/5 border-indigo-500/10', title:tt(t.home.feat_research_title), desc:tt(t.home.feat_research_desc) },
  ]

  const communityMore: Feature[] = [
    { icon:Users,      color:'text-sky-400',   bg:'bg-sky-500/5 border-sky-500/10',   title:tt(t.home.feat_community_title), desc:tt(t.home.feat_community_desc) },
    { icon:Route,      color:'text-lime-400',  bg:'bg-lime-500/5 border-lime-500/10', title:tt(t.home.feat_career_title), desc:tt(t.home.feat_career_desc) },
    { icon:Compass,    color:'text-teal-400',  bg:'bg-teal-500/5 border-teal-500/10', title:tt(t.home.feat_map_title), desc:tt(t.home.feat_map_desc) },
    { icon:ScrollText, color:'text-yellow-400',bg:'bg-yellow-500/5 border-yellow-500/10', title:tt(t.home.feat_foundation_title), desc:tt(t.home.feat_foundation_desc) },
    { icon:TrendingUp, color:'text-lime-400',  bg:'bg-lime-500/5 border-lime-500/10', title:tt(t.home.feat_dashboard_title), desc:tt(t.home.feat_dashboard_desc) },
  ]

  return (
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">{tt(t.home.everythingInOnePlace)}</h2>
          <p className="text-white/40">{tt(t.home.noMoreSwitching)}</p>
        </div>

        <FeatureCategory title={tt(t.home.categoryLearn)} features={learnPractice} onStartLearning={onStartLearning} loginToExplore={loginToExplore} />
        <FeatureCategory title={tt(t.home.categoryExplore)} features={exploreVisualize} onStartLearning={onStartLearning} loginToExplore={loginToExplore} />
        <FeatureCategory title={tt(t.home.categoryCenters)} features={centers} onStartLearning={onStartLearning} loginToExplore={loginToExplore} />
        <FeatureCategory title={tt(t.home.categoryMore)} features={communityMore} onStartLearning={onStartLearning} loginToExplore={loginToExplore} />
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
