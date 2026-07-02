'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import {
  Home, ScrollText, BookOpen, FlaskConical, Settings, type LucideIcon,
} from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()
  const { tt } = useLanguage()

  // 5 main bottom nav items
  const BOTTOM_TABS: { href: string; icon: LucideIcon; label: string }[] = [
    { href: '/dashboard', icon: Home, label: tt(t.nav.dashboard) },
    { href: '/foundation', icon: ScrollText, label: tt(t.nav.foundation) },
    { href: '/learn', icon: BookOpen, label: tt(t.nav.learn) },
    { href: '/lab', icon: FlaskConical, label: tt(t.nav.mathLab) },
    { href: '/settings', icon: Settings, label: tt(t.nav.settings) },
  ]

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[80] border-t border-white/8 bg-black/80 backdrop-blur-xl">
        <div className="flex items-stretch h-16">
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
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium leading-none mt-0.5">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
