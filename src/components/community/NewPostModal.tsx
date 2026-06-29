'use client'
import { useState } from 'react'
import { PostCategory, CAT_STYLE } from '@/lib/data/community-data'

interface Props {
  open: boolean
  onClose: () => void
  onPost: (title: string, body: string, category: PostCategory, tags: string[]) => void
}

export function NewPostModal({ open, onClose, onPost }: Props) {
  const [title, setTitle]       = useState('')
  const [body, setBody]         = useState('')
  const [category, setCategory] = useState<PostCategory>('question')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags]         = useState<string[]>([])

  if (!open) return null

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags(prev => [...prev, t])
      setTagInput('')
    }
  }

  const submit = () => {
    if (!title.trim() || !body.trim()) return
    onPost(title.trim(), body.trim(), category, tags)
    setTitle(''); setBody(''); setTags([]); setTagInput('')
    onClose()
  }

  const CATS: PostCategory[] = ['question', 'discussion', 'solution', 'resource', 'challenge']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}/>

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/12 bg-[#0d0d14] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">New Post</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-lg">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Category */}
          <div>
            <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-mono">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATS.map(cat => {
                const s = CAT_STYLE[cat]
                return (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`text-xs rounded-full px-3 py-1.5 border transition-all ${
                      category === cat ? `${s.bg} ${s.color}` : 'border-white/8 text-white/40 hover:text-white/70'
                    }`}>
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block uppercase tracking-wider font-mono">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="What's your question or topic?"
              maxLength={120}
              className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors"
            />
            <p className="text-[10px] text-white/20 text-right mt-1">{title.length}/120</p>
          </div>

          {/* Body */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block uppercase tracking-wider font-mono">Body</label>
            <textarea value={body} onChange={e => setBody(e.target.value)}
              placeholder="Describe your question or topic in detail. You can use LaTeX: write \( x^2 \) for inline or \[ \int f \, dx \] for display."
              rows={5}
              className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block uppercase tracking-wider font-mono">Tags (up to 5)</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="calculus, algebra..."
                className="flex-1 bg-white/5 border border-white/10 focus:border-violet-500/50 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors"
              />
              <button onClick={addTag}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs text-white/60 transition-all">
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map(t => (
                  <span key={t}
                    className="flex items-center gap-1 text-[10px] text-violet-400/70 bg-violet-500/8 border border-violet-500/15 rounded-full px-2 py-0.5">
                    {t}
                    <button onClick={() => setTags(prev => prev.filter(x => x !== t))}
                      className="text-violet-400/40 hover:text-violet-300 transition-colors">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-white/60 hover:text-white transition-all">
            Cancel
          </button>
          <button onClick={submit}
            disabled={!title.trim() || !body.trim()}
            className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/30 disabled:cursor-not-allowed py-2.5 text-sm font-semibold text-white transition-all">
            Post
          </button>
        </div>
      </div>
    </div>
  )
}
