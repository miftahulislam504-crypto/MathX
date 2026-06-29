'use client'
import { useState } from 'react'
import { Post, CAT_STYLE } from '@/lib/data/community-data'

interface Props { post: Post }

export function PostCard({ post }: Props) {
  const [upvoted, setUpvoted] = useState(false)
  const [votes, setVotes] = useState(post.upvotes)
  const style = CAT_STYLE[post.category]

  const toggleUpvote = () => {
    setUpvoted(u => !u)
    setVotes(v => upvoted ? v - 1 : v + 1)
  }

  return (
    <div className={`rounded-xl border bg-white/[0.02] hover:bg-white/[0.035] transition-all overflow-hidden ${
      post.pinned ? 'border-amber-500/25' : 'border-white/8'
    }`}>
      {post.pinned && (
        <div className="px-4 py-1.5 bg-amber-500/8 border-b border-amber-500/15 flex items-center gap-1.5">
          <span className="text-[10px] text-amber-400/70">📌 Pinned</span>
        </div>
      )}

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Upvote */}
          <button
            onClick={toggleUpvote}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-2 shrink-0 transition-all ${
              upvoted ? 'text-violet-400 bg-violet-500/10' : 'text-white/30 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            <span className="text-sm">▲</span>
            <span className="text-[10px] font-mono font-bold">{votes}</span>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[10px] font-medium border rounded-full px-2 py-0.5 ${style.bg} ${style.color}`}>
                {style.label}
              </span>
              {post.solved && (
                <span className="text-[10px] text-emerald-400 border border-emerald-500/20 bg-emerald-500/8 rounded-full px-2 py-0.5">
                  ✓ Solved
                </span>
              )}
            </div>

            <h3 className="text-sm font-semibold text-white/90 leading-snug mb-2 hover:text-violet-300 cursor-pointer transition-colors">
              {post.title}
            </h3>

            <p className="text-xs text-white/45 leading-relaxed line-clamp-2">{post.body}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3 ml-10">
          {post.tags.map(tag => (
            <span key={tag}
              className="text-[10px] text-violet-400/60 bg-violet-500/8 border border-violet-500/12 rounded-full px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between ml-10">
          <div className="flex items-center gap-2">
            <span className="text-base">{post.avatar}</span>
            <span className="text-xs text-white/35">{post.author}</span>
            <span className="text-white/15">·</span>
            <span className="text-xs text-white/25">{post.timeAgo}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <span>💬</span>
            <span>{post.replies} replies</span>
          </div>
        </div>
      </div>
    </div>
  )
}
