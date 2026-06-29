'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MATHEMATICIANS, ERAS, Mathematician } from '@/lib/data/mathematicians'

function MathCard({ m }: { m: Mathematician }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden hover:border-white/12 transition-all">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shrink-0">
            {m.portrait}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white mb-0.5">{m.name}</h3>
            <p className="text-xs text-white/40">{m.nationality}</p>
            <p className="text-xs text-white/25 font-mono">{m.born} — {m.died ?? 'present'}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-[10px] border border-white/10 rounded-full px-2 py-0.5 text-white/30">
                {m.era}
              </span>
              {m.fields.slice(0,2).map(f => (
                <span key={f} className="text-[10px] border border-violet-500/20 bg-violet-500/8 rounded-full px-2 py-0.5 text-violet-400/70">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Famous for */}
        <p className="text-sm text-white/65 leading-relaxed mb-3">{m.famousFor}</p>

        {/* Quote */}
        {m.quote && (
          <blockquote className="text-xs text-white/35 italic border-l-2 border-violet-500/30 pl-3 mb-3 leading-relaxed">
            {m.quote}
          </blockquote>
        )}

        {/* Toggle contributions */}
        <button onClick={() => setExpanded(e => !e)}
          className="text-xs text-violet-400/70 hover:text-violet-400 transition-colors">
          {expanded ? '▾ Hide contributions' : `▸ ${m.contributions.length} contributions`}
        </button>

        {expanded && (
          <ul className="mt-3 space-y-1.5">
            {m.contributions.map((c, i) => (
              <li key={i} className="flex gap-2 text-xs text-white/50">
                <span className="text-violet-400/50 shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function MathematiciansPage() {
  const [era, setEra] = useState<string | 'ALL'>('ALL')
  const [search, setSearch] = useState('')

  const filtered = MATHEMATICIANS.filter(m => {
    const matchEra = era === 'ALL' || m.era === era
    const q = search.toLowerCase()
    const matchSearch = !q || m.name.toLowerCase().includes(q) ||
      m.fields.some(f => f.toLowerCase().includes(q)) ||
      m.famousFor.toLowerCase().includes(q)
    return matchEra && matchSearch
  })

  const timeline = ERAS.filter(e => MATHEMATICIANS.some(m => m.era === e))

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-violet-400 text-sm font-mono mb-2">// Foundation → Mathematicians</p>
            <h1 className="text-4xl font-bold text-white mb-2">Mathematicians Archive</h1>
            <p className="text-white/40 text-sm">
              {MATHEMATICIANS.length} giants whose work shaped mathematics as we know it.
            </p>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
            <button onClick={() => setEra('ALL')}
              className={`text-xs px-3 py-1.5 rounded-l-full border transition-all whitespace-nowrap ${
                era==='ALL' ? 'bg-violet-600 border-violet-500 text-white' : 'border-white/10 text-white/40 hover:text-white/70'
              }`}>All Eras</button>
            {timeline.map((e, i) => (
              <button key={e} onClick={() => setEra(e)}
                className={`text-xs px-3 py-1.5 border-l-0 border transition-all whitespace-nowrap ${
                  i === timeline.length - 1 ? 'rounded-r-full' : ''
                } ${era===e ? 'bg-violet-600 border-violet-500 text-white' : 'border-white/10 text-white/40 hover:text-white/70'}`}>
                {e}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search by name or field..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50" />
          </div>

          <p className="text-xs text-white/25 font-mono mb-5">{filtered.length} mathematician{filtered.length!==1?'s':''}</p>

          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(m => <MathCard key={m.id} m={m} />)}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-white/20">
              <p className="text-4xl mb-3">∅</p>
              <p>No mathematicians match your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
