'use client'
import { useState } from 'react'
import { StudyGroup, GROUP_MESSAGES, GroupMessage } from '@/lib/data/community-data'
import { Check, Users, Clock, MessageSquare, Send, Lock } from 'lucide-react'

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
  const [showThread, setShowThread] = useState(false)
  const [messages, setMessages] = useState<GroupMessage[]>(GROUP_MESSAGES[group.id] ?? [])
  const [draft, setDraft] = useState('')
  const lvl = LEVEL_COLOR[group.level] ?? LEVEL_COLOR.Mixed

  const toggleJoin = () => {
    setJoined(j => !j)
    setCount(c => joined ? c - 1 : c + 1)
    if (joined) setShowThread(false) // leaving closes the thread too
  }

  const postMessage = () => {
    const text = draft.trim()
    if (!text) return
    setMessages(prev => [...prev, { id: `local-${Date.now()}`, author: 'You', avatar: 'Y', timeAgo: 'Just now', body: text }])
    setDraft('')
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
          onClick={toggleJoin}
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

      {/* Group discussion toggle */}
      {joined ? (
        <button
          onClick={() => setShowThread(s => !s)}
          className="flex items-center justify-center gap-1.5 text-xs rounded-lg border border-white/8 hover:border-white/20 text-white/50 hover:text-white/80 py-2 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {showThread ? 'Hide discussion' : `Group discussion (${messages.length})`}
        </button>
      ) : (
        <div className="flex items-center justify-center gap-1.5 text-[11px] rounded-lg border border-white/5 text-white/20 py-2">
          <Lock className="w-3 h-3" /> Join to see the group discussion
        </div>
      )}

      {joined && showThread && (
        <div className="rounded-lg border border-white/8 bg-black/20 p-3 space-y-3">
          <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
            {messages.map((m) => (
              <div key={m.id} className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-[10px] font-mono text-violet-300 shrink-0">
                  {m.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-white/75">{m.author}</span>
                    <span className="text-[10px] text-white/25">{m.timeAgo}</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{m.body}</p>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-xs text-white/25 text-center py-2">No messages yet — say hello to the group.</p>
            )}
          </div>

          <div className="flex gap-2 pt-2 border-t border-white/5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') postMessage() }}
              placeholder="Write a message to the group…"
              className="flex-1 bg-white/[0.05] border border-white/10 focus:border-violet-500/40 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none transition-all"
            />
            <button
              onClick={postMessage}
              disabled={!draft.trim()}
              className="shrink-0 w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
