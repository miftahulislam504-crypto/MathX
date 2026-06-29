'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap'
import { BranchMasteryChart } from '@/components/dashboard/BranchMasteryChart'
import { AchievementsGrid } from '@/components/dashboard/AchievementsGrid'
import { RecentTopics } from '@/components/dashboard/RecentTopics'
import { ACHIEVEMENTS } from '@/lib/data/achievements'
import { TOPICS } from '@/lib/data/topics'
import { MATH_BRANCHES } from '@/lib/data/branches'
import {
  computeAnalytics, updateStreak, updateStats, getStats,
  setTopicProgress, TopicProgress,
} from '@/lib/data/user-progress'

type Tab = 'overview' | 'achievements' | 'progress'

function seedDemoData() {
  const stats = getStats()
  if (stats.totalXP > 0) return
  const slugs = ['limits','differentiation','quadratic-equations','vectors','trig-ratios','fractions']
  slugs.forEach((slug, i) => setTopicProgress(slug, 30 + i * 12, 600 + i * 120))
  const key = 'mathx_daily_sessions'
  const sessions: {date:string;minutes:number;topicsStudied:string[]}[] = []
  for (let d = 0; d < 22; d++) {
    if (Math.random() < 0.65) {
      const date = new Date(Date.now() - d * 86400000)
      const ds = date.toISOString().split('T')[0]
      sessions.push({ date: ds, minutes: Math.floor(Math.random()*50+10), topicsStudied:[slugs[d%slugs.length]] })
    }
  }
  localStorage.setItem(key, JSON.stringify(sessions))
  updateStats({ totalXP:420, level:3, streak:5, lastActive:new Date().toISOString(),
    topicsCompleted:6, problemsSolved:14, labExperiments:3, tutorSessions:4,
    achievements:['first-topic','five-topics','first-problem','first-lab','streak-3'] })
}

const QUICK_ACTIONS = [
  { icon:'📚', label:'Continue Learning', href:'/learn',    color:'border-violet-500/20 bg-violet-500/8 hover:bg-violet-500/15' },
  { icon:'✏️', label:'Practice Problems', href:'/practice', color:'border-cyan-500/20 bg-cyan-500/8 hover:bg-cyan-500/15' },
  { icon:'∫',  label:'Visualizer',        href:'/visualize',color:'border-amber-500/20 bg-amber-500/8 hover:bg-amber-500/15' },
  { icon:'🤖', label:'AI Tutor',          href:'/ai-tutor', color:'border-emerald-500/20 bg-emerald-500/8 hover:bg-emerald-500/15' },
  { icon:'🧪', label:'Math Lab',          href:'/lab',      color:'border-rose-500/20 bg-rose-500/8 hover:bg-rose-500/15' },
  { icon:'🔧', label:'Tools',             href:'/tools',    color:'border-sky-500/20 bg-sky-500/8 hover:bg-sky-500/15' },
]

function formatTime(sec: number): string {
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<ReturnType<typeof computeAnalytics>|null>(null)
  const [tab, setTab] = useState<Tab>('overview')

  useEffect(() => {
    seedDemoData()
    updateStreak()
    setAnalytics(computeAnalytics())
  }, [])

  if (!analytics) {
    return (
      <><Navbar />
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin"/>
      </main></>
    )
  }

  const { stats, progress, masteredTopics, totalTimeSpent, branchMastery, heatmap, xpToNextLevel, levelProgress } = analytics

  const TABS: {key:Tab;label:string}[] = [
    { key:'overview',     label:'Overview' },
    { key:'achievements', label:`Achievements (${stats.achievements.length})` },
    { key:'progress',     label:'Topic Progress' },
  ]

  // Recent earned achievements (last 6)
  const earnedAchievements = stats.achievements
    .slice(-6)
    .map(id => ACHIEVEMENTS.find(a => a.id === id))
    .filter(Boolean) as typeof ACHIEVEMENTS

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-violet-400 text-sm font-mono mb-2">// Personal Dashboard</p>
              <h1 className="text-4xl font-bold text-white mb-1">Your Progress</h1>
              <p className="text-white/40 text-sm">
                {formatTime(totalTimeSpent)} studied · {masteredTopics.length} topics mastered
              </p>
            </div>
            {stats.streak > 0 && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-5 py-3 text-center">
                <p className="text-3xl">🔥</p>
                <p className="text-xl font-bold font-mono text-rose-400">{stats.streak}</p>
                <p className="text-[10px] text-white/30">day streak</p>
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
                  <h3 className="text-sm font-semibold text-white/70 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {QUICK_ACTIONS.map(a => (
                      <Link key={a.href} href={a.href}
                        className={`rounded-xl border p-4 flex items-center gap-3 transition-all group ${a.color}`}>
                        <span className="text-xl">{a.icon}</span>
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
                    <h3 className="text-sm font-semibold text-white/70">Recent Achievements</h3>
                    <button onClick={() => setTab('achievements')}
                      className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                      View all →
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {earnedAchievements.map(a => (
                      <div key={a.id}
                        className="flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2">
                        <span className="text-lg">{a.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-violet-300">{a.title}</p>
                          <p className="text-[10px] text-white/30">+{a.xp} XP</p>
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
                  {stats.achievements.length}/{ACHIEVEMENTS.length} unlocked
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
              <BranchMasteryChart data={branchMastery} />
              <div>
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider font-mono mb-4">
                  All Studied Topics
                </h3>
                {Object.keys(progress).length === 0 ? (
                  <p className="text-white/30 text-sm">
                    No topics yet. <Link href="/learn" className="text-violet-400">Start learning →</Link>
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
                              <span>{p.sessionsCount} session{p.sessionsCount!==1?'s':''}</span>
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
      <Footer />
    </>
  )
}
