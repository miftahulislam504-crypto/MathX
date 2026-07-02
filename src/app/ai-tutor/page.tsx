'use client'
import { useState, useRef, useEffect } from 'react'
import { TOPICS } from '@/lib/data/topics'
import { MATH_BRANCHES } from '@/lib/data/branches'
import { TutorMessage } from '@/types'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'

function MessageBubble({ msg }: { msg: TutorMessage & { pending?: boolean } }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
        isUser ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/70'
      }`}>
        {isUser ? 'U' : '∑'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-violet-600 text-white rounded-tr-sm'
          : 'bg-white/[0.06] border border-white/8 text-white/85 rounded-tl-sm'
      }`}>
        {(msg as any).pending ? (
          <span className="flex gap-1 items-center h-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        ) : (
          <span className="whitespace-pre-wrap">{msg.content}</span>
        )}
      </div>
    </div>
  )
}

export default function AITutorPage() {
  const { tt } = useLanguage()
  const [messages, setMessages] = useState<(TutorMessage & { pending?: boolean })[]>([
    {
      role: 'assistant',
      content: tt(t.aiTutor.greeting),
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [topicContext, setTopicContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: TutorMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg, { role: 'assistant', content: '', timestamp: new Date(), pending: true }])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const history = messages
        .filter((m) => !m.pending && m.content)
        .concat(userMsg)
        .map(({ role, content }) => ({ role, content, timestamp: new Date() }))

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, topicContext }),
      })

      const data = await res.json()
      const reply = data.reply ?? tt(t.aiTutor.errorReply)

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: reply, timestamp: new Date() },
      ])
    } catch {
      setMessages((prev) => prev.slice(0, -1))
      setError(tt(t.aiTutor.connectionError))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: tt(t.aiTutor.cleared),
      timestamp: new Date(),
    }])
    setError('')
  }

  const QUICK_PROMPTS = [
    tt(t.aiTutor.prompts.p1),
    tt(t.aiTutor.prompts.p2),
    tt(t.aiTutor.prompts.p3),
    tt(t.aiTutor.prompts.p4),
    tt(t.aiTutor.prompts.p5),
  ]

  return (
    <>

      <div className="flex h-screen pt-16">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-black/40 p-4 overflow-y-auto">
          <p className="text-xs text-white/30 uppercase tracking-wider mb-3 font-mono">{tt(t.aiTutor.topicContext)}</p>
          <select
            value={topicContext}
            onChange={(e) => setTopicContext(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 mb-6 appearance-none"
          >
            <option value="" className="bg-zinc-900">{tt(t.aiTutor.generalContext)}</option>
            {MATH_BRANCHES.map((branch) => (
              <optgroup key={branch.id} label={`${branch.icon} ${branch.name}`} className="bg-zinc-900">
                {TOPICS.filter((t) => t.branchId === branch.id).map((t) => (
                  <option key={t.id} value={t.title} className="bg-zinc-900">
                    {t.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <p className="text-xs text-white/30 uppercase tracking-wider mb-3 font-mono">{tt(t.aiTutor.quickPrompts)}</p>
          <div className="space-y-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setInput(p)}
                className="w-full text-left text-xs text-white/40 hover:text-white/80 hover:bg-white/5 rounded-lg px-3 py-2.5 transition-all border border-transparent hover:border-white/8 leading-relaxed"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-white/5">
            <button
              onClick={clearChat}
              className="w-full text-xs text-white/25 hover:text-white/50 transition-colors py-2"
            >
              {tt(t.aiTutor.clearChat)}
            </button>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Chat header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-white/70 font-medium">{tt(t.aiTutor.tag)}</span>
              {topicContext && (
                <span className="text-xs text-violet-400/70 bg-violet-500/8 border border-violet-500/15 rounded-full px-2 py-0.5">
                  {topicContext}
                </span>
              )}
            </div>
            <button
              onClick={clearChat}
              className="lg:hidden text-xs text-white/25 hover:text-white/50 transition-colors"
            >
              {tt(t.common.clear)}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {error && (
              <p className="text-xs text-rose-400 text-center bg-rose-500/8 border border-rose-500/20 rounded-lg px-4 py-2 mx-auto max-w-sm">
                {error}
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 sm:px-8 py-4 border-t border-white/5 bg-black/20">
            <div className="max-w-3xl mx-auto flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={tt(t.aiTutor.inputPlaceholder)}
                  rows={1}
                  className="w-full bg-white/[0.06] border border-white/10 focus:border-violet-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none transition-all resize-none max-h-32"
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    const t = e.currentTarget
                    t.style.height = 'auto'
                    t.style.height = Math.min(t.scrollHeight, 128) + 'px'
                  }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="shrink-0 w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed flex items-center justify-center transition-all"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="text-white text-base">↑</span>
                )}
              </button>
            </div>
            <p className="text-[10px] text-white/15 text-center mt-2">
              {tt(t.aiTutor.poweredBy)}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
