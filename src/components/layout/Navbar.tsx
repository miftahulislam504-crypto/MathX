'use client'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

const NAV_LINKS = [
  { href: '/learn',      label: 'Learn' },
  { href: '/visualizer',  label: 'Visualize' },
  { href: '/practice',   label: 'Practice' },
  { href: '/problems',   label: 'Problems' },
  { href: '/lab',        label: 'Lab' },
  { href: '/tools',      label: 'Tools' },
  { href: '/games',      label: 'Games' },
  { href: '/ai-tutor',   label: 'AI Tutor' },
]

const MORE_LINKS = [
  { href: '/encyclopedia', label: 'Encyclopedia' },
  { href: '/formulas',     label: 'Formula Library' },
  { href: '/statistics',   label: 'Statistics' },
  { href: '/applied',      label: 'Applied Math' },
  { href: '/research',     label: 'Research' },
  { href: '/map',          label: 'Knowledge Map' },
  { href: '/foundation',   label: 'Foundation' },
  { href: '/community',    label: 'Community' },
  { href: '/dashboard',    label: 'Dashboard' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Math</span>
              <span className="text-violet-400">X</span>
            </span>
            <span className="hidden sm:block text-xs text-white/25 font-mono mt-1">∑ ecosystem</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                className="px-2.5 py-1.5 rounded-md text-xs text-white/55 hover:text-white hover:bg-white/5 transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(o => !o)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                className="px-2.5 py-1.5 rounded-md text-xs text-white/55 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1">
                More <span className="text-[8px]">▾</span>
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-white/10 bg-black/90 backdrop-blur-md p-1.5 shadow-xl z-50">
                  {MORE_LINKS.map(l => (
                    <Link key={l.href} href={l.href}
                      onClick={() => setMoreOpen(false)}
                      className="block rounded-lg px-3 py-2 text-xs text-white/55 hover:text-white hover:bg-white/5 transition-colors">
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard"
              className="hidden sm:block text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all">
              Dashboard
            </Link>
            <Link href="/ai-tutor"
              className="rounded-md bg-violet-600 hover:bg-violet-500 px-3 py-1.5 text-xs font-medium text-white transition-colors">
              AI Tutor
            </Link>
            <button className="lg:hidden p-2 text-white/60 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}>
              <div className={cn('w-5 h-0.5 bg-current mb-1 transition-all', mobileOpen && 'rotate-45 translate-y-1.5')}/>
              <div className={cn('w-5 h-0.5 bg-current mb-1 transition-all', mobileOpen && 'opacity-0')}/>
              <div className={cn('w-5 h-0.5 bg-current transition-all', mobileOpen && '-rotate-45 -translate-y-1.5')}/>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-black/90 px-4 py-3 grid grid-cols-2 gap-1">
          {[...NAV_LINKS, ...MORE_LINKS].map(link => (
            <Link key={link.href} href={link.href}
              className="block py-2 px-3 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
