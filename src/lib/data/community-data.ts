export type PostCategory = 'question' | 'discussion' | 'solution' | 'resource' | 'challenge'

export interface Post {
  id: string
  title: string
  body: string
  category: PostCategory
  author: string
  avatar: string
  timeAgo: string
  upvotes: number
  replies: number
  tags: string[]
  solved?: boolean
  pinned?: boolean
}

export interface StudyGroup {
  id: string
  name: string
  description: string
  members: number
  topic: string
  level: string
  meetingSchedule: string
  icon: string
}

export const COMMUNITY_POSTS: Post[] = [
  {
    id:'p1', category:'question', solved:true,
    title:"How do I understand the epsilon-delta definition of a limit?",
    body:"I've been struggling with the formal ε-δ definition. Every time I read it, it makes sense, but I can't apply it to actual problems. Can someone break it down?",
    author:'RahulM', avatar:'🧑‍💻', timeAgo:'2h ago', upvotes:24, replies:8,
    tags:['calculus','limits','real-analysis'],
  },
  {
    id:'p2', category:'discussion',
    title:"Why is the Riemann Hypothesis so hard to prove?",
    body:"I've read the statement many times — all non-trivial zeros of ζ(s) have Re(s) = 1/2. It seems so clean and simple. Why has no one proved it in 165 years?",
    author:'MathEnthusiast', avatar:'🔭', timeAgo:'5h ago', upvotes:47, replies:15,
    tags:['number-theory','riemann','open-problems'],
  },
  {
    id:'p3', category:'challenge', pinned:true,
    title:"Weekly Challenge #23 — Find all integer solutions to x² + y² = z³",
    body:"This week's problem: Find all integer solutions to the equation x² + y² = z³. Post your approach in the comments. Winner gets featured next week!",
    author:'MathXTeam', avatar:'⭐', timeAgo:'1d ago', upvotes:89, replies:31,
    tags:['number-theory','Diophantine','challenge'],
  },
  {
    id:'p4', category:'solution',
    title:"Complete solution: IMO 2023 Problem 1",
    body:"Here's a detailed walkthrough of IMO 2023 Problem 1 using the substitution method. I'll show both the elegant 3-line solution and the longer but more illuminating approach.",
    author:'OlympiadStar', avatar:'🏅', timeAgo:'3d ago', upvotes:112, replies:22,
    tags:['olympiad','IMO','combinatorics'],
  },
  {
    id:'p5', category:'resource',
    title:"Free resources to learn Abstract Algebra from scratch",
    body:"Compiled the best free resources for abstract algebra: Judson's open textbook, Visual Group Theory series, and 3Blue1Brown's essence of group theory. All free!",
    author:'AlgebraFan', avatar:'📚', timeAgo:'4d ago', upvotes:76, replies:12,
    tags:['abstract-algebra','resources','groups'],
  },
  {
    id:'p6', category:'question',
    title:"What's the geometric intuition behind eigenvectors?",
    body:"I can compute eigenvectors easily, but I don't feel like I truly understand what they mean geometrically. The definition feels algebraic. Is there a good visual way to think about them?",
    author:'LinearLearner', avatar:'🎯', timeAgo:'6h ago', upvotes:38, replies:9,
    tags:['linear-algebra','eigenvectors','geometry'],
  },
  {
    id:'p7', category:'discussion',
    title:"Is category theory actually useful for \"applied\" mathematics?",
    body:"I keep seeing category theory described as abstract nonsense vs. a profound unifying framework. Has anyone actually found it useful outside of pure math?",
    author:'PracticalMath', avatar:'🔧', timeAgo:'2d ago', upvotes:31, replies:18,
    tags:['category-theory','applied','discussion'],
  },
  {
    id:'p8', category:'solution', solved:true,
    title:"How to visualize the Monty Hall problem — finally understood it!",
    body:"After months of not getting it, here's the visualization that finally made it click for me. It's all about how the host's action gives you information...",
    author:'ProbabilityNerd', avatar:'🎲', timeAgo:'1d ago', upvotes:54, replies:7,
    tags:['probability','Monty-Hall','visualization'],
  },
]

export const STUDY_GROUPS: StudyGroup[] = [
  { id:'sg1', name:'Calculus Study Circle',    description:'Working through Stewart Calculus together', members:47, topic:'Calculus',      level:'College',    meetingSchedule:'Every Tuesday 7PM', icon:'∫' },
  { id:'sg2', name:'IMO Preparation Group',    description:'Training for mathematical olympiads',        members:23, topic:'Olympiad',      level:'Advanced',   meetingSchedule:'Weekends 10AM',     icon:'🏅' },
  { id:'sg3', name:'Linear Algebra Deep Dive', description:'Gilbert Strang MIT 18.06 cohort',            members:61, topic:'Linear Algebra',level:'University', meetingSchedule:'Mon/Wed 8PM',       icon:'⊞' },
  { id:'sg4', name:'Number Theory Explorers',  description:'Elementary to algebraic number theory',      members:19, topic:'Number Theory', level:'Advanced',   meetingSchedule:'Fridays 6PM',        icon:'#' },
  { id:'sg5', name:'High School Math Club',    description:'SAT/ACT prep + competition math',             members:84, topic:'Mixed',         level:'School',     meetingSchedule:'Daily',              icon:'📐' },
  { id:'sg6', name:'Real Analysis Reading',    description:'Baby Rudin chapter by chapter',              members:28, topic:'Real Analysis', level:'University', meetingSchedule:'Thursdays 9PM',     icon:'ℝ' },
]

export const CAT_STYLE: Record<PostCategory, { label: string; color: string; bg: string }> = {
  question:   { label:'Question',   color:'text-cyan-400',    bg:'bg-cyan-500/10 border-cyan-500/20' },
  discussion: { label:'Discussion', color:'text-violet-400',  bg:'bg-violet-500/10 border-violet-500/20' },
  solution:   { label:'Solution',   color:'text-emerald-400', bg:'bg-emerald-500/10 border-emerald-500/20' },
  resource:   { label:'Resource',   color:'text-amber-400',   bg:'bg-amber-500/10 border-amber-500/20' },
  challenge:  { label:'Challenge',  color:'text-rose-400',    bg:'bg-rose-500/10 border-rose-500/20' },
}
