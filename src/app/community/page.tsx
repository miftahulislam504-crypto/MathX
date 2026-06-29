'use client'
import { useState, useMemo } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PostCard } from '@/components/community/PostCard'
import { StudyGroupCard } from '@/components/community/StudyGroupCard'
import { NewPostModal } from '@/components/community/NewPostModal'
import {
  COMMUNITY_POSTS, STUDY_GROUPS, CAT_STYLE,
  Post, PostCategory,
} from '@/lib/data/community-data'

type Tab = 'forum' | 'groups' | 'leaderboard'

const LEADERBOARD = [
  { rank:1,  name:'OlympiadStar',    xp:4820, badge:'🏆', streak:47 },
  { rank:2,  name:'MathEnthusiast',  xp:3910, badge:'🥈', streak:32 },
  { rank:3,  name:'ProbabilityNerd', xp:3450, badge:'🥉', streak:28 },
  { rank:4,  name:'AlgebraFan',      xp:2980, badge:'⭐', streak:21 },
  { rank:5,  name:'LinearLearner',   xp:2640, badge:'⭐', streak:19 },
  { rank:6,  name:'RahulM',          xp:2100, badge:'⭐', streak:14 },
  { rank:7,  name:'PracticalMath',   xp:1860, badge:'⭐', streak:11 },
  { rank:8,  name:'ChaosExplorer',   xp:1540, badge:'⭐', streak:9  },
  { rank:9,  name:'FractalArtist',   xp:1230, badge:'⭐', streak:7  },
  { rank:10, name:'TopologyFan',     xp:980,  badge:'⭐', streak:5  },
]

export default function CommunityPage() {
  const [tab, setTab]       = useState<Tab>('forum')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<PostCategory | 'all'>('all')
  const [posts, setPosts]   = useState<Post[]>(COMMUNITY_POSTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'recent' | 'top'>('recent')

  const filtered = useMemo(() => {
    let list = posts
    if (catFilter !== 'all') list = list.filter(p => p.category === catFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    }
    if (sortBy === 'top') list = [...list].sort((a,b) => b.upvotes - a.upvotes)
    // Always show pinned first
    return [...list.filter(p => p.pinned), ...list.filter(p => !p.pinned)]
  }, [posts, catFilter, search, sortBy])

  const handleNewPost = (title: string, body: string, category: PostCategory, tags: string[]) => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      title, body, category, tags,
      author: 'You', avatar: '👤',
      timeAgo: 'Just now',
      upvotes: 0, replies: 0,
    }
    setPosts(prev => [newPost, ...prev])
  }

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key:'forum',       label:'Forum',       icon:'💬' },
    { key:'groups',      label:'Study Groups', icon:'👥' },
    { key:'leaderboard', label:'Leaderboard', icon:'🏆' },
  ]

  const CATS: (PostCategory | 'all')[] = ['all','question','discussion','solution','resource','challenge']

  return (
    <>
      <Navbar />
      <NewPostModal open={modalOpen} onClose={() => setModalOpen(false)} onPost={handleNewPost} />

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
            <div>
              <p className="text-violet-400 text-sm font-mono mb-2">// Community</p>
              <h1 className="text-4xl font-bold text-white mb-2">Math Community</h1>
              <p className="text-white/40 text-sm">
                {posts.length} posts · {STUDY_GROUPS.length} study groups · Ask, discuss, collaborate.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-all flex items-center gap-2">
              <span>✏️</span> New Post
            </button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
            {[
              { label:'Posts',        val: posts.length },
              { label:'Questions',    val: posts.filter(p=>p.category==='question').length },
              { label:'Solved',       val: posts.filter(p=>p.solved).length },
              { label:'Study Groups', val: STUDY_GROUPS.length },
              { label:'Members',      val: STUDY_GROUPS.reduce((s,g)=>s+g.members,0) },
              { label:'Challenges',   val: posts.filter(p=>p.category==='challenge').length },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-white/6 bg-white/[0.02] p-3 text-center">
                <p className="text-lg font-bold font-mono text-violet-400">{s.val}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/8 mb-6">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                  tab === t.key
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* ── Forum ── */}
          {tab === 'forum' && (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Posts list */}
              <div className="lg:col-span-3 space-y-4">
                {/* Controls */}
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative flex-1 min-w-48">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">⌕</span>
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search posts..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                  </div>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 focus:outline-none appearance-none">
                    <option value="recent" className="bg-zinc-900">Most Recent</option>
                    <option value="top"    className="bg-zinc-900">Most Upvoted</option>
                  </select>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2">
                  {CATS.map(cat => {
                    const s = cat !== 'all' ? CAT_STYLE[cat] : null
                    return (
                      <button key={cat} onClick={() => setCatFilter(cat)}
                        className={`text-xs rounded-full px-3 py-1.5 border transition-all capitalize ${
                          catFilter === cat
                            ? cat === 'all'
                              ? 'bg-white/10 border-white/20 text-white'
                              : `${s!.bg} ${s!.color}`
                            : 'border-white/8 text-white/40 hover:text-white/70'
                        }`}>
                        {cat === 'all' ? 'All Posts' : s!.label}
                      </button>
                    )
                  })}
                </div>

                <p className="text-xs text-white/25 font-mono">{filtered.length} posts</p>

                {filtered.map(post => <PostCard key={post.id} post={post} />)}

                {filtered.length === 0 && (
                  <div className="text-center py-16 text-white/20">
                    <p className="text-4xl mb-3">∅</p>
                    <p className="text-sm">No posts match your search.</p>
                    <button onClick={() => setModalOpen(true)}
                      className="mt-4 text-violet-400 hover:text-violet-300 text-xs transition-colors">
                      Be the first to post →
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Quick post */}
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <h3 className="text-sm font-semibold text-violet-300 mb-2">Have a question?</h3>
                  <p className="text-xs text-white/35 mb-3 leading-relaxed">
                    Ask the community! Our members range from high-schoolers to PhD researchers.
                  </p>
                  <button onClick={() => setModalOpen(true)}
                    className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 py-2 text-xs font-semibold text-white transition-all">
                    Ask a Question
                  </button>
                </div>

                {/* Tags cloud */}
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                  <h3 className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Popular Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set(posts.flatMap(p => p.tags)))
                      .slice(0, 16)
                      .map(tag => (
                        <button key={tag}
                          onClick={() => setSearch(tag)}
                          className="text-[10px] text-white/40 hover:text-white/70 border border-white/8 hover:border-white/20 rounded-full px-2 py-0.5 transition-all">
                          {tag}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Community rules */}
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                  <h3 className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Community Rules</h3>
                  <ul className="space-y-2 text-xs text-white/35">
                    {[
                      'Be kind and respectful',
                      'Show your work — explain your thinking',
                      'Use LaTeX for math expressions',
                      'Search before posting a question',
                      'Mark questions as solved when answered',
                    ].map((rule, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-violet-400/50 shrink-0">{i+1}.</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── Study Groups ── */}
          {tab === 'groups' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/40">{STUDY_GROUPS.length} active groups</p>
                <button className="text-xs text-violet-400 hover:text-violet-300 border border-violet-500/20 rounded-lg px-4 py-1.5 transition-all">
                  + Create Group
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {STUDY_GROUPS.map(g => <StudyGroupCard key={g.id} group={g} />)}
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.01] p-8 text-center">
                <p className="text-2xl mb-3">🤝</p>
                <h3 className="text-base font-semibold text-white mb-2">Don't see your topic?</h3>
                <p className="text-sm text-white/35 mb-4">Create a new study group and invite others.</p>
                <button className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-all">
                  Create Study Group
                </button>
              </div>
            </div>
          )}

          {/* ── Leaderboard ── */}
          {tab === 'leaderboard' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white/40">All-time XP leaderboard</p>
                <span className="text-xs text-white/20 font-mono">Updates daily</span>
              </div>

              {/* Top 3 podium */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((user, i) => (
                  <div key={user.rank} className={`rounded-xl border p-4 text-center transition-all ${
                    i === 1
                      ? 'border-amber-500/40 bg-amber-500/8 scale-105'
                      : 'border-white/8 bg-white/[0.02]'
                  }`}>
                    <p className="text-2xl mb-1">{user.badge}</p>
                    <p className={`text-xs font-semibold ${i===1?'text-amber-300':'text-white/70'}`}>
                      {user.name}
                    </p>
                    <p className={`text-sm font-bold font-mono mt-1 ${i===1?'text-amber-400':'text-violet-400'}`}>
                      {user.xp.toLocaleString()} XP
                    </p>
                    <p className="text-[10px] text-white/25 mt-0.5">🔥{user.streak} day streak</p>
                  </div>
                ))}
              </div>

              {/* Full list */}
              <div className="rounded-xl border border-white/8 overflow-hidden">
                {LEADERBOARD.map((user, i) => (
                  <div key={user.rank} className={`flex items-center gap-4 px-5 py-3.5 transition-all hover:bg-white/[0.03] ${
                    i < LEADERBOARD.length-1 ? 'border-b border-white/5' : ''
                  }`}>
                    <span className={`w-7 text-center text-sm font-bold font-mono shrink-0 ${
                      user.rank === 1 ? 'text-amber-400' :
                      user.rank === 2 ? 'text-white/50' :
                      user.rank === 3 ? 'text-orange-400' : 'text-white/25'
                    }`}>
                      {user.rank}
                    </span>
                    <span className="text-xl shrink-0">{user.badge}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/80">{user.name}</p>
                      <p className="text-[10px] text-white/25 font-mono">🔥 {user.streak} day streak</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold font-mono text-violet-400">
                        {user.xp.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-white/25">XP</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-violet-500/15 bg-violet-500/5 p-4 text-center">
                <p className="text-xs text-white/40">
                  Earn XP by studying topics, solving problems, and earning achievements.
                  <br/>
                  <span className="text-violet-400">Check your rank on the Dashboard →</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
