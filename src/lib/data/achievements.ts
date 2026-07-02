import type { LucideIcon } from 'lucide-react'
import {
  Target, BookOpen, Telescope, School, GraduationCap, Brain, Waves,
  Pencil, Dumbbell, Swords, Award, Percent,
  FlaskConical, Orbit, Wind, Eye, Wrench, Bot,
  Flame, Calendar, CalendarDays,
  Ruler, Crown,
} from 'lucide-react'

export type AchievementCategory = 'learning' | 'practice' | 'explorer' | 'streak' | 'mastery'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: LucideIcon
  category: AchievementCategory
  condition: string      // what triggers it
  xp: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const ACHIEVEMENTS: Achievement[] = [
  // Learning
  { id:'first-topic',    title:'First Step',         description:'Complete your first topic',           icon:Target, category:'learning',  condition:'topics_completed >= 1',  xp:50,   rarity:'common' },
  { id:'five-topics',    title:'Getting Started',     description:'Complete 5 topics',                   icon:BookOpen, category:'learning',  condition:'topics_completed >= 5',  xp:100,  rarity:'common' },
  { id:'ten-topics',     title:'Knowledge Seeker',    description:'Complete 10 topics',                  icon:Telescope, category:'learning',  condition:'topics_completed >= 10', xp:200,  rarity:'rare' },
  { id:'all-school',     title:'School Graduate',     description:'Master all School level topics',      icon:School, category:'learning',  condition:'school_mastered',        xp:500,  rarity:'epic' },
  { id:'all-college',    title:'College Scholar',     description:'Master all College level topics',     icon:GraduationCap, category:'learning',  condition:'college_mastered',       xp:1000, rarity:'epic' },
  { id:'polymath',       title:'Polymath',            description:'Study 5 different branches',          icon:Brain, category:'learning',  condition:'branches_studied >= 5',  xp:300,  rarity:'rare' },
  { id:'deep-diver',     title:'Deep Diver',          description:'Reach University level in any branch',icon:Waves, category:'learning',  condition:'university_topic',       xp:400,  rarity:'rare' },

  // Practice
  { id:'first-problem',  title:'Problem Solver',      description:'Solve your first problem',            icon:Pencil, category:'practice',  condition:'problems_solved >= 1',   xp:25,   rarity:'common' },
  { id:'ten-problems',   title:'Practice Makes...',   description:'Solve 10 problems',                   icon:Dumbbell, category:'practice',  condition:'problems_solved >= 10',  xp:150,  rarity:'common' },
  { id:'fifty-problems', title:'Math Warrior',        description:'Solve 50 problems',                   icon:Swords, category:'practice',  condition:'problems_solved >= 50',  xp:500,  rarity:'rare' },
  { id:'olympiad-first', title:'Olympiad Challenger', description:'Attempt an Olympiad problem',         icon:Award, category:'practice',  condition:'olympiad_attempted',     xp:200,  rarity:'rare' },
  { id:'perfect-score',  title:'Perfect',             description:'Score 100% on a practice session',    icon:Percent, category:'practice',  condition:'perfect_session',        xp:300,  rarity:'epic' },

  // Explorer
  { id:'first-lab',      title:'Lab Rat',             description:'Run your first experiment in Math Lab',icon:FlaskConical,category:'explorer', condition:'lab_visited',            xp:50,   rarity:'common' },
  { id:'fractal-artist', title:'Fractal Artist',      description:'Generate 5 different fractals',       icon:Orbit, category:'explorer',  condition:'fractals_generated >= 5',xp:150,  rarity:'rare' },
  { id:'pi-hunter',      title:'π Hunter',            description:'Estimate π with Monte Carlo (3 decimal places)', icon:Target, category:'explorer', condition:'monte_carlo_3dp', xp:200, rarity:'rare' },
  { id:'chaos-theory',   title:'Chaos Theory',        description:'Explore the Lorenz Attractor',        icon:Wind, category:'explorer',  condition:'lorenz_viewed',          xp:100,  rarity:'common' },
  { id:'visualizer',     title:'Visual Thinker',      description:'Use all 6 visualizers',               icon:Eye,  category:'explorer',  condition:'all_visualizers',        xp:250,  rarity:'rare' },
  { id:'tool-master',    title:'Tool Master',         description:'Use all Math Tools',                  icon:Wrench, category:'explorer',  condition:'all_tools_used',         xp:200,  rarity:'rare' },
  { id:'ai-student',     title:'AI Student',          description:'Have 10 conversations with AI Tutor', icon:Bot, category:'explorer',  condition:'tutor_sessions >= 10',   xp:150,  rarity:'common' },

  // Streak
  { id:'streak-3',       title:'On a Roll',           description:'Study 3 days in a row',              icon:Flame, category:'streak',    condition:'streak >= 3',            xp:100,  rarity:'common' },
  { id:'streak-7',       title:'Week Warrior',        description:'Study 7 days in a row',              icon:Calendar, category:'streak',    condition:'streak >= 7',            xp:300,  rarity:'rare' },
  { id:'streak-30',      title:'Monthly Dedication',  description:'Study 30 days in a row',             icon:CalendarDays, category:'streak',    condition:'streak >= 30',           xp:1000, rarity:'legendary' },

  // Mastery
  { id:'master-calculus',title:'Calculus Master',     description:'Achieve 90%+ mastery in Calculus',   icon:Target,  category:'mastery',   condition:'calculus_mastery >= 90', xp:600,  rarity:'epic' },
  { id:'master-algebra', title:'Algebra Master',      description:'Achieve 90%+ mastery in Algebra',    icon:Ruler, category:'mastery',   condition:'algebra_mastery >= 90',  xp:600,  rarity:'epic' },
  { id:'grand-master',   title:'Grand Master',        description:'Achieve 90%+ in 5 branches',         icon:Crown, category:'mastery',   condition:'branch_mastery_5',       xp:2000, rarity:'legendary' },
]

export const RARITY_STYLE = {
  common:    { color: 'text-white/60',    border: 'border-white/15',         bg: 'bg-white/5' },
  rare:      { color: 'text-blue-400',    border: 'border-blue-500/30',      bg: 'bg-blue-500/8' },
  epic:      { color: 'text-violet-400',  border: 'border-violet-500/30',    bg: 'bg-violet-500/8' },
  legendary: { color: 'text-amber-400',   border: 'border-amber-500/40',     bg: 'bg-amber-500/10' },
}
