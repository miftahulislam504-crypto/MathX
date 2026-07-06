'use client'
import { useState } from 'react'
import { BookOpen, Layers, Target as TargetIcon, BookOpenCheck, Timer, TrendingUp, type LucideIcon } from 'lucide-react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { TopicPractice } from '@/components/practice/TopicPractice'
import { ChapterPractice } from '@/components/practice/ChapterPractice'
import { SkillPractice } from '@/components/practice/SkillPractice'
import { TheoremPractice } from '@/components/practice/TheoremPractice'
import { TimedPractice } from '@/components/practice/TimedPractice'
import { AdaptivePractice } from '@/components/practice/AdaptivePractice'

type ModeId = 'topic' | 'chapter' | 'skill' | 'theorem' | 'timed' | 'adaptive'

export default function PracticePage() {
  const [mode, setMode] = useState<ModeId>('topic')
  const { tt } = useLanguage()

  const MODES: { id: ModeId; label: string; icon: LucideIcon; color: string }[] = [
    { id: 'topic', label: tt(t.practice.modeTopic), icon: BookOpen, color: 'text-violet-400' },
    { id: 'chapter', label: tt(t.practice.modeChapter), icon: Layers, color: 'text-blue-400' },
    { id: 'skill', label: tt(t.practice.modeSkill), icon: TargetIcon, color: 'text-emerald-400' },
    { id: 'theorem', label: tt(t.practice.modeTheorem), icon: BookOpenCheck, color: 'text-cyan-400' },
    { id: 'timed', label: tt(t.practice.modeTimed), icon: Timer, color: 'text-rose-400' },
    { id: 'adaptive', label: tt(t.practice.modeAdaptive), icon: TrendingUp, color: 'text-fuchsia-400' },
  ]

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.practice.tag)}</p>
          <h1 className="text-4xl font-bold text-white mb-3">{tt(t.practice.title)}</h1>
          <p className="text-white/40">{tt(t.practice.subtitle)}</p>
        </div>

        {/* Mode selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {MODES.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all ${
                mode === id ? 'bg-white/8 border-white/20' : 'border-white/8 bg-white/[0.01] hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`w-5 h-5 ${mode === id ? color : 'text-white/30'}`} />
              <span className={`text-[11px] text-center leading-tight ${mode === id ? 'text-white/85' : 'text-white/40'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Active mode */}
        {mode === 'topic' && <TopicPractice />}
        {mode === 'chapter' && <ChapterPractice />}
        {mode === 'skill' && <SkillPractice />}
        {mode === 'theorem' && <TheoremPractice />}
        {mode === 'timed' && <TimedPractice />}
        {mode === 'adaptive' && <AdaptivePractice />}
      </div>
    </main>
  )
}
