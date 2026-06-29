'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface Props {
  latex: string
  display?: boolean
  className?: string
}

export function LatexRenderer({ latex, display = false, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    // Dynamic import to avoid SSR issues
    import('katex').then((katex) => {
      if (!ref.current) return
      try {
        katex.default.render(latex, ref.current, {
          displayMode: display,
          throwOnError: false,
          strict: false,
          trust: false,
        })
      } catch {
        if (ref.current) ref.current.textContent = latex
      }
    })
  }, [latex, display])

  return (
    <span
      ref={ref}
      className={cn(
        display ? 'block overflow-x-auto py-2 text-center' : 'inline',
        'text-white',
        className
      )}
    />
  )
}

// Convenience wrappers
export function InlineMath({ latex, className }: { latex: string; className?: string }) {
  return <LatexRenderer latex={latex} display={false} className={className} />
}

export function DisplayMath({ latex, className }: { latex: string; className?: string }) {
  return <LatexRenderer latex={latex} display={true} className={className} />
}
