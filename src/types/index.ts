// ─── Math Levels ────────────────────────────────────────────────────
export type Level = 'SCHOOL' | 'COLLEGE' | 'UNIVERSITY' | 'ADVANCED' | 'RESEARCH'
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'OLYMPIAD' | 'RESEARCH'
export type ProblemType = 'MCQ' | 'SHORT_ANSWER' | 'PROOF' | 'GRAPH_BASED' | 'INTERACTIVE' | 'PUZZLE'
export type Role = 'STUDENT' | 'TEACHER' | 'RESEARCHER' | 'ADMIN'

export interface Branch {
  id: string
  slug: string
  name: string
  nameBn?: string
  description?: string
  icon?: string
  color?: string
}

export interface SubTopic {
  id: string
  slug: string
  title: string
  order: number
}

export interface Topic {
  id: string
  slug: string
  title: string
  titleBn?: string
  description?: string
  branchId: string
  level: Level
  order: number
  parentId?: string
  children?: Topic[]
  subTopics?: SubTopic[]
}

export interface Formula {
  id: string
  title: string
  latex: string
  description?: string
  topicId: string
  tags: string[]
}

export interface Theorem {
  id: string
  title: string
  statement: string
  proof?: string
  topicId: string
  tags: string[]
}

export interface Problem {
  id: string
  title: string
  statement: string
  solution?: string
  difficulty: Difficulty
  type: ProblemType
  topicId: string
  tags: string[]
  source?: string
}

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  firebaseUid?: string
  role: Role
}

export interface Progress {
  userId: string
  topicId: string
  mastery: number
  lastStudied: Date
}

export interface FunctionPlotConfig {
  expression: string
  xRange: [number, number]
  yRange: [number, number]
  color?: string
  label?: string
}

export interface TutorMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
