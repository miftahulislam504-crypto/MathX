'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

// 5 main bottom nav items
const BOTTOM_TABS = [
  { href: '/dashboard', icon: '🏠', label: 'Home' },
  { href: '/foundation', icon: '📜', label: 'Foundation' },
  { href: '/learn', icon: '📚', label: 'Learn' },
  { href: '/lab', icon: '🧪', label: 'Math Lab' },
  { href: '/settings', icon: '⚙️', label: 'Settings' },
]

// Hamburger menu items (all others)
const HAMBURGER_LINKS = [
  { href: '/visualizer',  icon: '∫',  label: 'Visualizer' },
  { href: '/practice',    icon: '✏️', label: 'Practice' },
  { href: '/problems',    icon: '🏆', label: 'Problem Hub' },
  { href: '/ai-tutor',    icon: '🤖', label: 'AI Tutor' },
  { href: '/tools',       icon: '🔧', label: 'Tools' },
  { href: '/games',       icon: '🎮', label: 'Math Games' },
  { href: '/encyclopedia',icon: '📖', label: 'Encyclopedia' },
  { href: '/formulas',    icon: '∑',  label: 'Formulas' },
  { href: '/statistics',  icon: '📊', label: 'Statistics' },
  { href: '/applied',     icon: '🌍', label: 'Applied Math' },
  { href: '/research',    icon: '🔭', label: 'Research' },
  { href: '/map',         icon: '🗺️', label: 'Knowledge Map' },
  { href: '/community',   icon: '👥', label: 'Community' },
]

export function BottomNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* Hamburger Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[90] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="relative z-10 bg-[#0d0d14] border-t border-white/10 rounded-t-2xl pb-24 pt-4 px-4 max-h-[75vh] overflow-y-auto">
            {/* Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3 px-1">
              More Features
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {HAMBURGER_LINKS.map(link => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all',
                      active
                        ? 'bg-violet-600/20 border border-violet-500/30 text-violet-300'
                        : 'bg-white/[0.03] border border-white/5 text-white/60 hover:bg-white/[0.06] hover:text-white'
                    )}
                  >
                    <span className="text-lg shrink-0">{link.icon}</span>
                    <span className="text-sm font-medium leading-tight">{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[80] border-t border-white/8 bg-black/80 backdrop-blur-xl">
        <div className="flex items-stretch h-16">
          {/* 5 main tabs */}
          {BOTTOM_TABS.map(tab => {
            const active = pathname === tab.href || pathname.startsWith(tab.href + '/')
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 transition-all relative',
                  active ? 'text-violet-400' : 'text-white/40 hover:text-white/70'
                )}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-violet-400" />
                )}
                <span className="text-xl leading-none">{tab.icon}</span>
                <span className="text-[10px] font-medium leading-none mt-0.5">{tab.label}</span>
              </Link>
            )
          })}

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 transition-all relative',
              menuOpen ? 'text-violet-400' : 'text-white/40 hover:text-white/70'
            )}
          >
            {menuOpen && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-violet-400" />
            )}
            {/* Hamburger icon */}
            <span className="flex flex-col gap-[3px] items-center">
              <span className={cn('w-4 h-0.5 bg-current rounded-full transition-all', menuOpen && 'rotate-45 translate-y-[7px]')} />
              <span className={cn('w-4 h-0.5 bg-current rounded-full transition-all', menuOpen && 'opacity-0')} />
              <span className={cn('w-4 h-0.5 bg-current rounded-full transition-all', menuOpen && '-rotate-45 -translate-y-[7px]')} />
            </span>
            <span className="text-[10px] font-medium leading-none mt-0.5">More</span>
          </button>
        </div>
      </nav>
    </>
  )
}
