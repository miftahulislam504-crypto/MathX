import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MathX — Learn. Explore. Experience Mathematics.',
    template: '%s | MathX',
  },
  description:
    'A complete Mathematics Learning & Exploration Ecosystem — from school arithmetic to advanced research.',
  keywords: ['mathematics', 'math learning', 'calculus', 'algebra', 'geometry'],
  openGraph: {
    title: 'MathX',
    description: 'Learn. Explore. Experience Mathematics.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
