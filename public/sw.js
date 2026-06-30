// MathX Service Worker — PWA Offline Support
const CACHE_NAME = 'mathx-v1'
const STATIC_CACHE = 'mathx-static-v1'
const DYNAMIC_CACHE = 'mathx-dynamic-v1'

// Core shell assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
]

// Pages that work well offline (static content)
const OFFLINE_PAGES = [
  '/learn',
  '/formulas',
  '/encyclopedia',
  '/tools',
  '/foundation',
]

// ── Install: Cache static shell ──────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    }).then(() => self.skipWaiting())
  )
})

// ── Activate: Clean old caches ───────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    }).then(() => self.clients.claim())
  )
})

// ── Fetch: Network-first with cache fallback ─────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and non-http(s) requests
  if (request.method !== 'GET') return
  if (!url.protocol.startsWith('http')) return

  // API routes — network only, no caching
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request).catch(() => {
      return new Response(JSON.stringify({ error: 'Offline — API unavailable' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 503,
      })
    }))
    return
  }

  // Static assets (icons, fonts, etc.) — cache first
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/_next/static/') ||
    url.hostname === 'cdn.jsdelivr.net'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // Next.js pages — network first, dynamic cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached
          // Serve offline fallback for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/').then((fallback) => {
              if (fallback) return fallback
              return new Response('<h1>MathX — Offline</h1><p>Check your connection.</p>', {
                headers: { 'Content-Type': 'text/html' },
              })
            })
          }
        })
      })
  )
})

// ── Background Sync (for future use) ────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    console.log('[SW] Background sync: progress')
  }
})

// ── Push Notifications (for future use) ──────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title || 'MathX', {
      body: data.body || 'New update from MathX',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'mathx-notification',
      renotify: true,
    })
  )
})
