'use client'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallBanner({ className }: { className?: string }) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if user previously dismissed
    if (localStorage.getItem('mathx-pwa-dismissed') === 'true') {
      setDismissed(true)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('pwa-install-ready', handler)
    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    })

    return () => {
      window.removeEventListener('pwa-install-ready', handler)
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('mathx-pwa-dismissed', 'true')
  }

  // Don't show if installed, dismissed, or no prompt available
  if (isInstalled || dismissed || !installPrompt) return null

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/10',
        'px-4 py-3 backdrop-blur-sm',
        className
      )}
    >
      {/* Icon */}
      <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden">
        <img src="/icons/icon-96x96.png" alt="MathX" className="w-full h-full object-cover" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-tight">Install MathX</p>
        <p className="text-xs text-white/40 leading-tight mt-0.5">
          Add to home screen for offline access
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleDismiss}
          className="text-xs text-white/30 hover:text-white/60 transition-colors px-1"
          aria-label="Dismiss"
        >
          ✕
        </button>
        <button
          onClick={handleInstall}
          className="rounded-lg bg-violet-600 hover:bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:scale-105"
        >
          Install
        </button>
      </div>
    </div>
  )
}
