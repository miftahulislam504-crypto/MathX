'use client'
import { useState, useEffect } from 'react'

interface LocalProgress {
  [topicSlug: string]: {
    mastery: number
    lastStudied: string
    sessionsCount: number
  }
}

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgress>({})

  useEffect(() => {
    const stored = localStorage.getItem('mathx_progress')
    if (stored) setProgress(JSON.parse(stored))
  }, [])

  const updateProgress = (topicSlug: string, mastery: number) => {
    const updated = {
      ...progress,
      [topicSlug]: {
        mastery,
        lastStudied: new Date().toISOString(),
        sessionsCount: (progress[topicSlug]?.sessionsCount ?? 0) + 1,
      },
    }
    setProgress(updated)
    localStorage.setItem('mathx_progress', JSON.stringify(updated))
  }

  const getMastery = (topicSlug: string) => progress[topicSlug]?.mastery ?? 0

  return { progress, updateProgress, getMastery }
}
