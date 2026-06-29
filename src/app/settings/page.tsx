'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

type Theme = 'dark' | 'midnight' | 'deep'
type Lang  = 'en' | 'bn'

const THEMES: { id: Theme; label: string; bg: string; preview: string }[] = [
  { id: 'dark',     label: 'Dark',     bg: 'bg-[#0a0a0f]', preview: '#0a0a0f' },
  { id: 'midnight', label: 'Midnight', bg: 'bg-[#060610]', preview: '#060610' },
  { id: 'deep',     label: 'Deep',     bg: 'bg-[#0d0810]', preview: '#0d0810' },
]

export default function SettingsPage() {
  const { user, displayName, isAuthenticated } = useAuth()
  const router = useRouter()
  const [theme, setTheme] = useState<Theme>('dark')
  const [lang, setLang] = useState<Lang>('en')
  const [notifications, setNotifications] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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
          <p className="text-violet-400 text-xs font-mono mb-1">// Settings</p>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>

        {/* Account Section */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Account</h2>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] divide-y divide-white/5">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-lg">
                    {displayName?.[0]?.toUpperCase() ?? '👤'}
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
                  <span>Sign Out</span>
                  <span className="text-rose-400/50">→</span>
                </button>
              </>
            ) : (
              <div className="px-5 py-4 text-sm text-white/40">
                Not signed in.{' '}
                <button onClick={() => router.push('/')} className="text-violet-400 hover:text-violet-300">
                  Sign in
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Appearance */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Appearance</h2>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <p className="text-sm text-white/60 mb-3">Theme</p>
            <div className="flex gap-3">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl p-3 border transition-all ${
                    theme === t.id
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-white/8 bg-white/[0.02] hover:border-white/15'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: t.preview }} />
                  <span className="text-xs text-white/50">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Language</h2>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex gap-3">
              {([['en', 'English'], ['bn', 'বাংলা']] as [Lang, string][]).map(([id, label]) => (
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
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Notifications</h2>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] divide-y divide-white/5">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm text-white">Daily Reminders</p>
                <p className="text-xs text-white/30 mt-0.5">Get reminded to practice daily</p>
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

        {/* About */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">About</h2>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] divide-y divide-white/5">
            {[
              ['Version', 'MathX v2.0'],
              ['Build', '2025 Edition'],
              ['License', 'Educational Use'],
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
          <span className="text-xl font-bold">
            <span className="text-white">Math</span>
            <span className="text-violet-400">X</span>
          </span>
          <p className="text-xs text-white/20 mt-1">Learn. Explore. Experience Mathematics.</p>
        </div>
      </div>

      {/* Logout Confirm Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative z-10 w-full max-w-xs rounded-2xl border border-white/10 bg-[#0a0a0f] p-6 text-center">
            <p className="text-white font-semibold mb-2">Sign Out?</p>
            <p className="text-sm text-white/40 mb-6">You will be returned to the home page.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-sm text-white font-medium transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
