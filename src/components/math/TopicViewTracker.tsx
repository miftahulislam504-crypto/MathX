'use client'
import { useEffect, useRef } from 'react'
import {
  setTopicProgress, getMastery, updateStats, getStats,
  updateStreak, checkAchievements, addXP, recordSession,
} from '@/lib/data/user-progress'

interface Props { topicSlug: string }

// Minimum time on page before a view counts as real study, to avoid
// crediting accidental clicks / instant back-navigation.
const MIN_STUDY_SECONDS = 15

// Renders nothing — mounted inside the (server-rendered) topic page purely
// to record real study activity into the client-side progress store.
// Mastery increases by 25 points per distinct viewing session (capped at
// 100), and the actual seconds spent on the page are added to timeSpent.
export function TopicViewTracker({ topicSlug }: Props) {
  const startRef = useRef<number>(Date.now())
  const recordedRef = useRef(false)

  useEffect(() => {
    startRef.current = Date.now()
    recordedRef.current = false

    const recordProgress = () => {
      if (recordedRef.current) return
      recordedRef.current = true

      const secondsSpent = Math.round((Date.now() - startRef.current) / 1000)
      if (secondsSpent < MIN_STUDY_SECONDS) return

      const previousMastery = getMastery(topicSlug)
      const isFirstView = previousMastery === 0
      const newMastery = Math.min(100, previousMastery + 25)

      setTopicProgress(topicSlug, newMastery, secondsSpent)
      updateStreak()
      recordSession(topicSlug, Math.max(1, Math.round(secondsSpent / 60)))

      if (isFirstView) {
        updateStats({ topicsCompleted: getStats().topicsCompleted + 1 })
        addXP(20)
      }
      checkAchievements()
    }

    // Record when the user navigates away or closes the tab
    window.addEventListener('beforeunload', recordProgress)
    return () => {
      window.removeEventListener('beforeunload', recordProgress)
      recordProgress()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicSlug])

  return null
}
