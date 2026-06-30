import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AppShell } from '@/components/layout/AppShell'
import { PWARegister } from '@/components/layout/PWARegister'

export const metadata: Metadata = {
  title: {
    default: 'MathX — Learn. Explore. Experience Mathematics.',
    template: '%s | MathX',
  },
  description:
    'A complete Mathematics Learning & Exploration Ecosystem — from school arithmetic to advanced research.',
  keywords: ['mathematics', 'math learning', 'calculus', 'algebra', 'geometry'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MathX',
    startupImage: [
      { url: '/icons/icon-512x512.png' },
    ],
  },
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png',  sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png',  sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/icon-192x192.png', color: '#7c3aed' },
    ],
  },
  openGraph: {
    title: 'MathX',
    description: 'Learn. Explore. Experience Mathematics.',
    type: 'website',
    images: [{ url: '/icons/icon-512x512.png', width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary',
    title: 'MathX',
    description: 'Learn. Explore. Experience Mathematics.',
    images: ['/icons/icon-512x512.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
        />
        {/* PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MathX" />
        <meta name="application-name" content="MathX" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
        <PWARegister />
      </body>
    </html>
  )
}
