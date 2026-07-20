'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap'
import { BranchMasteryChart } from '@/components/dashboard/BranchMasteryChart'
import { SkillGraph } from '@/components/dashboard/SkillGraph'
import { AchievementsGrid } from '@/components/dashboard/AchievementsGrid'
import { RecentTopics } from '@/components/dashboard/RecentTopics'
import { ACHIEVEMENTS } from '@/lib/data/achievements'
import { TOPICS } from '@/lib/data/topics'
import { MATH_BRANCHES } from '@/lib/data/branches'
import {
  computeAnalytics, updateStreak, TopicProgress,
} from '@/lib/data/user-progress'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { BookOpen, Pencil, LineChart, Bot, FlaskConical, Wrench, Flame, Beaker, Award, Shapes, Grid3x3, Percent, Boxes, TestTubes, PiggyBank, Wand2, Compass, Sparkles, type LucideIcon } from 'lucide-react'

type Tab = 'overview' | 'achievements' | 'progress'

function formatTime(sec: number): string {
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<ReturnType<typeof computeAnalytics>|null>(null)
  const [tab, setTab] = useState<Tab>('overview')
  const { tt } = useLanguage()

  const QUICK_ACTIONS: { icon: LucideIcon; label: string; href: string; color: string }[] = [
    { icon:BookOpen, label:tt(t.dashboard.continueLearning), href:'/learn',    color:'border-violet-500/20 bg-violet-500/8 hover:bg-violet-500/15' },
    { icon:Pencil, label:tt(t.dashboard.practiceProblems), href:'/practice', color:'border-cyan-500/20 bg-cyan-500/8 hover:bg-cyan-500/15' },
    { icon:LineChart,  label:tt(t.dashboard.visualizer),        href:'/visualize',color:'border-amber-500/20 bg-amber-500/8 hover:bg-amber-500/15' },
    { icon:Bot, label:tt(t.dashboard.aiTutor),          href:'/ai-tutor', color:'border-emerald-500/20 bg-emerald-500/8 hover:bg-emerald-500/15' },
    { icon:Wand2, label:tt(t.dashboard.aiProblemSolverNav), href:'/ai-problem-solver', color:'border-violet-500/20 bg-violet-500/8 hover:bg-violet-500/15' },
    { icon:FlaskConical, label:tt(t.dashboard.mathLab),          href:'/lab',      color:'border-rose-500/20 bg-rose-500/8 hover:bg-rose-500/15' },
    { icon:Beaker, label:tt(t.dashboard.experimentCenter),  href:'/experiments', color:'border-lime-500/20 bg-lime-500/8 hover:bg-lime-500/15' },
    { icon:Award, label:tt(t.dashboard.assessmentSystem),  href:'/assessment', color:'border-amber-500/20 bg-amber-500/8 hover:bg-amber-500/15' },
    { icon:Shapes, label:tt(t.dashboard.geometryCenterNav), href:'/geometry-center', color:'border-violet-500/20 bg-violet-500/8 hover:bg-violet-500/15' },
    { icon:Grid3x3, label:tt(t.dashboard.linearAlgebraCenterNav), href:'/linear-algebra-center', color:'border-cyan-500/20 bg-cyan-500/8 hover:bg-cyan-500/15' },
    { icon:Percent, label:tt(t.dashboard.probabilityCenterNav), href:'/probability-center', color:'border-fuchsia-500/20 bg-fuchsia-500/8 hover:bg-fuchsia-500/15' },
    { icon:Boxes, label:tt(t.dashboard.modelingCenterNav), href:'/modeling-center', color:'border-amber-500/20 bg-amber-500/8 hover:bg-amber-500/15' },
    { icon:TestTubes, label:tt(t.dashboard.appliedMathLabNav), href:'/applied-math-lab', color:'border-orange-500/20 bg-orange-500/8 hover:bg-orange-500/15' },
    { icon:PiggyBank, label:tt(t.dashboard.realLifeNav), href:'/real-life', color:'border-amber-500/20 bg-amber-500/8 hover:bg-amber-500/15' },
    { icon:Compass, label:tt(t.dashboard.careerPathNav), href:'/career-path', color:'border-cyan-500/20 bg-cyan-500/8 hover:bg-cyan-500/15' },
    { icon:Sparkles, label:tt(t.dashboard.experienceZoneNav), href:'/experience-zone', color:'border-violet-500/20 bg-violet-500/8 hover:bg-violet-500/15' },
    { icon:Wrench, label:tt(t.dashboard.tools),             href:'/tools',    color:'border-sky-500/20 bg-sky-500/8 hover:bg-sky-500/15' },
  ]

  useEffect(() => {
    updateStreak()
    setAnalytics(computeAnalytics())
  }, [])

  if (!analytics) {
    return (
      <>
      <main className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin"/>
      </main></>
    )
  }

  const { stats, progress, masteredTopics, totalTimeSpent, branchMastery, heatmap, xpToNextLevel, levelProgress } = analytics

  const TABS: {key:Tab;label:string}[] = [
    { key:'overview',     label:tt(t.dashboard.overview) },
    { key:'achievements', label:`${tt(t.dashboard.achievements)} (${stats.achievements.length})` },
    { key:'progress',     label:tt(t.dashboard.topicProgress) },
  ]

  // Recent earned achievements (last 6)
  const earnedAchievements = stats.achievements
    .slice(-6)
    .map(id => ACHIEVEMENTS.find(a => a.id === id))
    .filter(Boolean) as typeof ACHIEVEMENTS

  return (
    <>

      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.dashboard.personalDashboard)}</p>
              <h1 className="text-4xl font-bold text-white mb-1">{tt(t.dashboard.yourProgress)}</h1>
              <p className="text-white/40 text-sm">
                {formatTime(totalTimeSpent)} {tt(t.common.studied)} · {masteredTopics.length} {tt(t.common.topicsMastered)}
              </p>
            </div>
            {stats.streak > 0 && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-5 py-3 text-center">
                <Flame className="w-7 h-7 mx-auto text-rose-400" />
                <p className="text-xl font-bold font-mono text-rose-400">{stats.streak}</p>
                <p className="text-[10px] text-white/30">{tt(t.common.dayStreak)}</p>
              </div>
            )}
          </div>

          <StatsRow stats={stats} levelProgress={levelProgress} xpToNext={xpToNextLevel} />

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/8 mt-8 mb-6">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                  tab===t.key ? 'border-violet-500 text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}>{t.label}</button>
            ))}
          </div>

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <RecentTopics progress={progress} />
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                  <h3 className="text-sm font-semibold text-white/70 mb-4">{tt(t.dashboard.quickActions)}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {QUICK_ACTIONS.map(a => (
                      <Link key={a.href} href={a.href}
                        className={`rounded-xl border p-4 flex items-center gap-3 transition-all group ${a.color}`}>
                        <a.icon className="w-5 h-5 shrink-0" />
                        <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{a.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <ActivityHeatmap heatmap={heatmap} />
              <BranchMasteryChart data={branchMastery} />

              {earnedAchievements.length > 0 && (
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white/70">{tt(t.dashboard.recentAchievements)}</h3>
                    <button onClick={() => setTab('achievements')}
                      className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                      {tt(t.common.viewAll)}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {earnedAchievements.map(a => (
                      <div key={a.id}
                        className="flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2">
                        <a.icon className="w-4 h-4 shrink-0 text-violet-300" />
                        <div>
                          <p className="text-xs font-semibold text-violet-300">{a.title}</p>
                          <p className="text-[10px] text-white/30">+{a.xp} {tt(t.common.xpPoints)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Achievements ── */}
          {tab === 'achievements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white/40">
                  {stats.achievements.length}/{ACHIEVEMENTS.length} {tt(t.common.unlocked)}
                </p>
                <div className="h-2 w-40 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-violet-500"
                    style={{ width:`${(stats.achievements.length/ACHIEVEMENTS.length)*100}%` }}/>
                </div>
              </div>
              <AchievementsGrid earned={stats.achievements} />
            </div>
          )}

          {/* ── Progress ── */}
          {tab === 'progress' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <BranchMasteryChart data={branchMastery} />
                <SkillGraph data={branchMastery} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider font-mono mb-4">
                  {tt(t.dashboard.allStudiedTopics)}
                </h3>
                {Object.keys(progress).length === 0 ? (
                  <p className="text-white/30 text-sm">
                    {tt(t.dashboard.noTopicsYet)} <Link href="/learn" className="text-violet-400">{tt(t.dashboard.startLearning)}</Link>
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(Object.values(progress) as TopicProgress[])
                      .sort((a,b) => b.mastery - a.mastery)
                      .map(p => {
                        const topic  = TOPICS.find(t => t.slug === p.topicSlug)
                        const branch = topic ? MATH_BRANCHES.find(b => b.id === topic.branchId) : null
                        if (!topic) return null
                        return (
                          <Link key={p.topicSlug}
                            href={`/learn/${branch?.slug ?? 'math'}/${p.topicSlug}`}
                            className="rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/15 p-4 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <span>{branch?.icon}</span>
                              <span className="text-sm text-white/80 font-medium truncate">{topic.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-white/5">
                                <div className="h-full rounded-full bg-violet-500"
                                  style={{ width:`${p.mastery}%` }}/>
                              </div>
                              <span className="text-xs font-mono text-white/40">{p.mastery}%</span>
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-white/20 font-mono">
                              <span>{p.sessionsCount} {tt(t.common.session)}{p.sessionsCount!==1?'s':''}</span>
                              <span>{formatTime(p.timeSpent)}</span>
                            </div>
                          </Link>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

    </>
  )
}
