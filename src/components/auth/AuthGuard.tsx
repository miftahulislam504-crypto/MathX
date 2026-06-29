'use client'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: Props) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin"/>
      </div>
    )
  }

  if (!user) {
    return fallback ?? (
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-12 text-center">
        <p className="text-3xl mb-4">🔐</p>
        <h3 className="text-lg font-bold text-white mb-2">Sign in to continue</h3>
        <p className="text-sm text-white/40 mb-6">
          Create a free account to access this feature and track your progress.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/auth/signup"
            className="rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-all">
            Create Account
          </Link>
          <Link href="/auth/login"
            className="rounded-lg border border-white/15 hover:border-white/25 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all">
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
