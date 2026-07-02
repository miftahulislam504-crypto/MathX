'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { PWAInstallBanner } from '@/components/layout/PWAInstallBanner'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'

type Theme = 'dark' | 'midnight' | 'deep'

export default function SettingsPage() {
  const { user, displayName, isAuthenticated } = useAuth()
  const router = useRouter()
  const { lang, setLang, tt } = useLanguage()
  const [theme, setTheme] = useState<Theme>('dark')
  const [notifications, setNotifications] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const THEMES: { id: Theme; label: string; bg: string; preview: string }[] = [
    { id: 'dark',     label: tt(t.settings.dark),     bg: 'bg-[#0a0a0f]', preview: '#0a0a0f' },
    { id: 'midnight', label: tt(t.settings.midnight), bg: 'bg-[#060610]', preview: '#060610' },
    { id: 'deep',     label: tt(t.settings.deep),     bg: 'bg-[#0d0810]', preview: '#0d0810' },
  ]

  const handleLogout = async () => {
    const { logOut } = await import('@/lib/firebase/auth')
    await logOut()
    router.push('/')
  }

  return (
    <main className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-violet-400 text-xs font-mono mb-1">{tt(t.settings.tag)}</p>
          <h1 className="text-2xl font-bold text-white">{tt(t.settings.title)}</h1>
        </div>

        {/* PWA Install Banner */}
        <PWAInstallBanner className="mb-6" />

        {/* Account Section */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">{tt(t.settings.account)}</h2>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] divide-y divide-white/5">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-lg">
                    {displayName?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{displayName}</p>
                    <p className="text-xs text-white/30">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center justify-between px-5 py-4 text-sm text-rose-400 hover:bg-rose-500/5 transition-colors"
                >
                  <span>{tt(t.common.signOut)}</span>
                  <span className="text-rose-400/50">→</span>
                </button>
              </>
            ) : (
              <div className="px-5 py-4 text-sm text-white/40">
                {tt(t.auth.notSignedIn)}{' '}
                <button onClick={() => router.push('/')} className="text-violet-400 hover:text-violet-300">
                  {tt(t.auth.signInPrompt)}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Appearance */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">{tt(t.settings.appearance)}</h2>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <p className="text-sm text-white/60 mb-3">{tt(t.settings.theme)}</p>
            <div className="flex gap-3">
              {THEMES.map(th => (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl p-3 border transition-all ${
                    theme === th.id
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-white/8 bg-white/[0.02] hover:border-white/15'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: th.preview }} />
                  <span className="text-xs text-white/50">{th.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Language — wired to the real global LanguageContext */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">{tt(t.settings.language)}</h2>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex gap-3">
              {([['en', 'English'], ['bn', 'বাংলা']] as ['en'|'bn', string][]).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setLang(id)}
                  className={`flex-1 rounded-xl py-3 text-sm font-medium border transition-all ${
                    lang === id
                      ? 'border-violet-500 bg-violet-500/10 text-white'
                      : 'border-white/8 bg-white/[0.02] text-white/40 hover:text-white/70'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">{tt(t.settings.notifications)}</h2>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] divide-y divide-white/5">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm text-white">{tt(t.settings.dailyReminders)}</p>
                <p className="text-xs text-white/30 mt-0.5">{tt(t.settings.reminderDesc)}</p>
              </div>
              <button
                onClick={() => setNotifications(n => !n)}
                className={`w-11 h-6 rounded-full transition-all relative ${notifications ? 'bg-violet-600' : 'bg-white/10'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* App Info */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">{tt(t.settings.about)}</h2>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] divide-y divide-white/5">
            {[
              [tt(t.settings.version), 'MathX v2.0'],
              [tt(t.settings.build), '2025 Edition'],
              [tt(t.settings.pwa), tt(t.settings.pwaValue)],
              [tt(t.settings.license), tt(t.settings.licenseValue)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-white/50">{label}</span>
                <span className="text-sm text-white/30 font-mono">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* MathX branding */}
        <div className="text-center mt-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <img src="/icons/icon-96x96.png" alt="MathX" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold">
              <span className="text-white">Math</span>
              <span className="text-violet-400">X</span>
            </span>
          </div>
          <p className="text-xs text-white/20">{tt(t.settings.tagline)}</p>
        </div>
      </div>

      {/* Logout Confirm Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative z-10 w-full max-w-xs rounded-2xl border border-white/10 bg-[#0a0a0f] p-6 text-center">
            <p className="text-white font-semibold mb-2">{tt(t.auth.signOutConfirm)}</p>
            <p className="text-sm text-white/40 mb-6">{tt(t.auth.signOutMessage)}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:bg-white/5 transition-all"
              >
                {tt(t.common.cancel)}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-sm text-white font-medium transition-all"
              >
                {tt(t.common.signOut)}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
