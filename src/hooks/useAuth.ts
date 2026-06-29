'use client'
import { useState, useEffect } from 'react'
import { User as FirebaseUser } from 'firebase/auth'

export function useAuth() {
  const [user, setUser]       = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Firebase
    let unsubscribe: (() => void) | null = null

    import('@/lib/firebase/auth').then(({ onAuthChange }) => {
      unsubscribe = onAuthChange((firebaseUser) => {
        setUser(firebaseUser)
        setLoading(false)
      })
    }).catch(() => {
      // Firebase not configured — still show the app
      setLoading(false)
    })

    return () => { unsubscribe?.() }
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    displayName: user?.displayName ?? user?.email?.split('@')[0] ?? 'Learner',
    photoURL: user?.photoURL ?? null,
  }
}
