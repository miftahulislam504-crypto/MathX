'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { AuthForm } from '@/components/auth/AuthForm'
import { Calculator } from 'lucide-react'

export default function SignupPage() {
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <Calculator className="w-12 h-12 mb-4 mx-auto text-violet-400" />
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to MathX!</h2>
            <p className="text-white/40 text-sm mb-6">
              Your account is ready. Start your mathematics journey.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/learn"
                className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-all">
                Start Learning →
              </Link>
              <Link href="/dashboard"
                className="rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/70 hover:text-white transition-all">
                View Dashboard
              </Link>
            </div>
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
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold">
              <span className="text-white">Math</span>
              <span className="text-violet-400">X</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mt-6 mb-1">Create Account</h1>
            <p className="text-white/40 text-sm">Join thousands of math learners</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <AuthForm mode="signup" onSuccess={() => setDone(true)} />

            <div className="mt-5 text-center">
              <p className="text-sm text-white/30">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] text-white/20 leading-relaxed">
            By creating an account, progress is synced across devices.<br />
            No spam, no ads — ever.
          </p>
        </div>
      </main>
    </>
  )
}
