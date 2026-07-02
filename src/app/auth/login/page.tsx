'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { AuthForm } from '@/components/auth/AuthForm'
import { PartyPopper, BarChart3, Trophy, Bot, AlertTriangle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center px-4">
          <div className="text-center">
            <PartyPopper className="w-10 h-10 mb-4 mx-auto text-amber-400" />
            <h2 className="text-xl font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-white/40 text-sm mb-6">You are now signed in.</p>
            <Link href="/dashboard"
              className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-all">
              Go to Dashboard →
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold">
              <span className="text-white">Math</span>
              <span className="text-violet-400">X</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mt-6 mb-1">Sign in</h1>
            <p className="text-white/40 text-sm">to your MathX account</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <AuthForm mode="login" onSuccess={() => setDone(true)} />

            <div className="mt-5 text-center">
              <p className="text-sm text-white/30">
                No account?{' '}
                <Link href="/auth/signup" className="text-violet-400 hover:text-violet-300 transition-colors">
                  Create one free
                </Link>
              </p>
            </div>
          </div>

          {/* Features reminder */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { icon:BarChart3, text:'Track progress' },
              { icon:Trophy, text:'Earn achievements' },
              { icon:Bot, text:'AI Tutor history' },
            ].map(f => (
              <div key={f.text} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <f.icon className="w-5 h-5 mb-1 mx-auto text-white/50" />
                <p className="text-[10px] text-white/30">{f.text}</p>
              </div>
            ))}
          </div>

          {/* Firebase config notice */}
          <div className="mt-6 rounded-lg border border-amber-500/15 bg-amber-500/5 px-4 py-3">
            <p className="text-[10px] text-amber-400/70 leading-relaxed text-center flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Add your Firebase credentials to <code className="font-mono">.env.local</code> to enable authentication.
              See <code className="font-mono">.env.example</code> for required keys.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
