'use client'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { LanguageToggle } from '@/components/shared/LanguageToggle'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const { tt } = useLanguage()

  const NAV_LINKS = [
    { href: '/learn',      label: tt(t.nav.learn) },
    { href: '/visualizer',  label: tt(t.nav.visualize) },
    { href: '/practice',   label: tt(t.nav.practice) },
    { href: '/problems',   label: tt(t.nav.problems) },
    { href: '/lab',        label: tt(t.nav.lab) },
    { href: '/experiments', label: tt(t.nav.experimentCenter) },
    { href: '/assessment',  label: tt(t.nav.assessmentSystem) },
    { href: '/geometry-center', label: tt(t.nav.geometryCenterNav) },
    { href: '/tools',      label: tt(t.nav.tools) },
    { href: '/games',      label: tt(t.nav.games) },
    { href: '/puzzles',    label: tt(t.nav.puzzles) },
    { href: '/ai-tutor',   label: tt(t.nav.aiTutor) },
  ]

  const MORE_LINKS = [
    { href: '/encyclopedia', label: tt(t.nav.encyclopedia) },
    { href: '/formulas',     label: tt(t.nav.formulaLibrary) },
    { href: '/theorems',     label: tt(t.nav.theoremLibrary) },
    { href: '/statistics',   label: tt(t.nav.statistics) },
    { href: '/applied',      label: tt(t.nav.appliedMath) },
    { href: '/research',     label: tt(t.nav.research) },
    { href: '/map',          label: tt(t.nav.knowledgeMap) },
    { href: '/foundation',   label: tt(t.nav.foundation) },
    { href: '/community',    label: tt(t.nav.community) },
    { href: '/dashboard',    label: tt(t.nav.dashboard) },
  ]

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
                {tt(t.common.more)} <span className="text-[8px]">▾</span>
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
            <LanguageToggle className="hidden sm:flex" />
            <Link href="/dashboard"
              className="hidden sm:block text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all">
              {tt(t.nav.dashboard)}
            </Link>
            <Link href="/ai-tutor"
              className="rounded-md bg-violet-600 hover:bg-violet-500 px-3 py-1.5 text-xs font-medium text-white transition-colors">
              {tt(t.nav.aiTutor)}
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
        <div className="lg:hidden border-t border-white/5 bg-black/90 px-4 py-3">
          <div className="flex justify-center mb-3 pb-3 border-b border-white/5">
            <LanguageToggle />
          </div>
          <div className="grid grid-cols-2 gap-1">
            {[...NAV_LINKS, ...MORE_LINKS].map(link => (
              <Link key={link.href} href={link.href}
                className="block py-2 px-3 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
