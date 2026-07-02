'use client'
import { usePathname } from 'next/navigation'
import { BottomNav } from './BottomNav'
import { Navbar } from './Navbar'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'

// Pages that use the old full Navbar (inner app pages)
const APP_PAGES = [
  '/dashboard', '/foundation', '/learn', '/lab', '/settings',
  '/visualizer', '/practice', '/problems', '/ai-tutor', '/tools',
  '/games', '/encyclopedia', '/formulas', '/statistics',
  '/applied', '/research', '/map', '/community',
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isLandingPage = pathname === '/'
  const isAuthPage = pathname.startsWith('/auth/')

  // Show bottom nav on all inner app pages (not landing, not auth)
  const showBottomNav = !isLandingPage && !isAuthPage

  // Show top navbar only on inner pages (for desktop)
  const showTopNav = !isLandingPage && !isAuthPage

  return (
    <LanguageProvider>
      {showTopNav && <Navbar />}
      <div className={showBottomNav ? 'pb-16' : ''}>
        {children}
      </div>
      {showBottomNav && <BottomNav />}
    </LanguageProvider>
  )
}
