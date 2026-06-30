'use client'
import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    // Register service worker
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[MathX PWA] Service Worker registered:', registration.scope)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (!newWorker) return
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[MathX PWA] New version available — refresh to update')
              }
            })
          })
        })
        .catch((err) => {
          console.warn('[MathX PWA] Service Worker registration failed:', err)
        })
    })

    // Handle install prompt (A2HS)
    let deferredPrompt: any = null
    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e
      // You can show a custom "Add to Home Screen" button here
      // by dispatching a custom event or setting state
      window.dispatchEvent(new CustomEvent('pwa-install-ready', { detail: deferredPrompt }))
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Track install
    window.addEventListener('appinstalled', () => {
      console.log('[MathX PWA] App installed successfully!')
      deferredPrompt = null
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  return null
}
