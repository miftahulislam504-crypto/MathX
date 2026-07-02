'use client'
import { useState } from 'react'
import { StudyGroup } from '@/lib/data/community-data'
import { Check, Users, Clock } from 'lucide-react'

interface Props { group: StudyGroup }

const LEVEL_COLOR: Record<string, string> = {
  School:     'text-emerald-400 border-emerald-500/20 bg-emerald-500/8',
  College:    'text-blue-400 border-blue-500/20 bg-blue-500/8',
  University: 'text-violet-400 border-violet-500/20 bg-violet-500/8',
  Advanced:   'text-amber-400 border-amber-500/20 bg-amber-500/8',
  Mixed:      'text-white/50 border-white/15 bg-white/5',
}

export function StudyGroupCard({ group }: Props) {
  const [joined, setJoined] = useState(false)
  const [count, setCount]   = useState(group.members)
  const lvl = LEVEL_COLOR[group.level] ?? LEVEL_COLOR.Mixed

  const toggle = () => {
    setJoined(j => !j)
    setCount(c => joined ? c - 1 : c + 1)
  }

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/14 p-5 transition-all flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xl font-mono text-violet-400">
            {group.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90">{group.name}</h3>
            <span className={`text-[10px] border rounded-full px-2 py-0.5 ${lvl}`}>
              {group.level}
            </span>
          </div>
        </div>
        <button
          onClick={toggle}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            joined
              ? 'bg-violet-600/20 border border-violet-500/40 text-violet-300'
              : 'bg-violet-600 hover:bg-violet-500 text-white'
          }`}
        >
          {joined ? <span className="inline-flex items-center gap-1"><Check className="w-3 h-3" /> Joined</span> : 'Join'}
        </button>
      </div>

      <p className="text-xs text-white/45 leading-relaxed">{group.description}</p>

      <div className="flex items-center justify-between text-[10px] text-white/25 font-mono">
        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {count} members</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {group.meetingSchedule}</span>
      </div>
    </div>
  )
}
