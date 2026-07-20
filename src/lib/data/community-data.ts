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

export interface GroupMessage {
  id: string
  author: string
  avatar: string
  timeAgo: string
  body: string
}

export const GROUP_MESSAGES: Record<string, GroupMessage[]> = {
  sg1: [
    { id:'gm1', author:'Priya', avatar:'P', timeAgo:'1h ago', body:"Did anyone finish the related rates problems from chapter 3? #14 is giving me trouble." },
    { id:'gm2', author:'Sam', avatar:'S', timeAgo:'45m ago', body:"Yeah #14 — draw the right triangle first, then differentiate both sides w.r.t. t. I can share my work tonight." },
    { id:'gm3', author:'Priya', avatar:'P', timeAgo:'30m ago', body:"That would help a lot, thank you!" },
  ],
  sg2: [
    { id:'gm4', author:'Arjun', avatar:'A', timeAgo:'3h ago', body:"This week's mock paper is posted in the shared folder. Let's discuss problem 5 (the combinatorics one) on Saturday." },
    { id:'gm5', author:'Lin', avatar:'L', timeAgo:'2h ago', body:"I got a different bound for problem 5 — will bring my approach Saturday." },
  ],
  sg3: [
    { id:'gm6', author:'DeShawn', avatar:'D', timeAgo:'5h ago', body:"Lecture 12 (eigenvalues) notes are up. The proof at 24:00 uses a trick we haven't seen before — worth reviewing before Wednesday." },
    { id:'gm7', author:'Mira', avatar:'M', timeAgo:'1h ago', body:"Agreed, that trick (using the characteristic polynomial's trace) comes up again in lecture 15 too." },
  ],
  sg4: [
    { id:'gm8', author:'Youssef', avatar:'Y', timeAgo:'1d ago', body:"Found a cleaner proof of quadratic reciprocity using Eisenstein's lattice-point counting — sharing my notes Friday." },
  ],
  sg5: [
    { id:'gm9', author:'Aisha', avatar:'A', timeAgo:'2h ago', body:"Reminder: practice SAT set 7 is due before tomorrow's session. DM me if you're stuck on the geometry section." },
    { id:'gm10', author:'Tomás', avatar:'T', timeAgo:'1h ago', body:"Question 22 on that set — is it asking for the inscribed or circumscribed circle? The wording is ambiguous to me." },
  ],
  sg6: [
    { id:'gm11', author:'Elena', avatar:'E', timeAgo:'4h ago', body:"Chapter 2 exercise 17 (proving compactness in metric spaces) — anyone want to walk through it before Thursday?" },
  ],
}

export const COMMUNITY_POSTS: Post[] = [
  {
    id:'p1', category:'question', solved:true,
    title:"How do I understand the epsilon-delta definition of a limit?",
    body:"I've been struggling with the formal ε-δ definition. Every time I read it, it makes sense, but I can't apply it to actual problems. Can someone break it down?",
    author:'RahulM', avatar:'R', timeAgo:'2h ago', upvotes:24, replies:8,
    tags:['calculus','limits','real-analysis'],
  },
  {
    id:'p2', category:'discussion',
    title:"Why is the Riemann Hypothesis so hard to prove?",
    body:"I've read the statement many times — all non-trivial zeros of ζ(s) have Re(s) = 1/2. It seems so clean and simple. Why has no one proved it in 165 years?",
    author:'MathEnthusiast', avatar:'M', timeAgo:'5h ago', upvotes:47, replies:15,
    tags:['number-theory','riemann','open-problems'],
  },
  {
    id:'p3', category:'challenge', pinned:true,
    title:"Weekly Challenge #23 — Find all integer solutions to x² + y² = z³",
    body:"This week's problem: Find all integer solutions to the equation x² + y² = z³. Post your approach in the comments. Winner gets featured next week!",
    author:'MathXTeam', avatar:'M', timeAgo:'1d ago', upvotes:89, replies:31,
    tags:['number-theory','Diophantine','challenge'],
  },
  {
    id:'p4', category:'solution',
    title:"Complete solution: IMO 2023 Problem 1",
    body:"Here's a detailed walkthrough of IMO 2023 Problem 1 using the substitution method. I'll show both the elegant 3-line solution and the longer but more illuminating approach.",
    author:'OlympiadStar', avatar:'O', timeAgo:'3d ago', upvotes:112, replies:22,
    tags:['olympiad','IMO','combinatorics'],
  },
  {
    id:'p5', category:'resource',
    title:"Free resources to learn Abstract Algebra from scratch",
    body:"Compiled the best free resources for abstract algebra: Judson's open textbook, Visual Group Theory series, and 3Blue1Brown's essence of group theory. All free!",
    author:'AlgebraFan', avatar:'A', timeAgo:'4d ago', upvotes:76, replies:12,
    tags:['abstract-algebra','resources','groups'],
  },
  {
    id:'p6', category:'question',
    title:"What's the geometric intuition behind eigenvectors?",
    body:"I can compute eigenvectors easily, but I don't feel like I truly understand what they mean geometrically. The definition feels algebraic. Is there a good visual way to think about them?",
    author:'LinearLearner', avatar:'L', timeAgo:'6h ago', upvotes:38, replies:9,
    tags:['linear-algebra','eigenvectors','geometry'],
  },
  {
    id:'p7', category:'discussion',
    title:"Is category theory actually useful for \"applied\" mathematics?",
    body:"I keep seeing category theory described as abstract nonsense vs. a profound unifying framework. Has anyone actually found it useful outside of pure math?",
    author:'PracticalMath', avatar:'P', timeAgo:'2d ago', upvotes:31, replies:18,
    tags:['category-theory','applied','discussion'],
  },
  {
    id:'p8', category:'solution', solved:true,
    title:"How to visualize the Monty Hall problem — finally understood it!",
    body:"After months of not getting it, here's the visualization that finally made it click for me. It's all about how the host's action gives you information...",
    author:'ProbabilityNerd', avatar:'P', timeAgo:'1d ago', upvotes:54, replies:7,
    tags:['probability','Monty-Hall','visualization'],
  },
]

export const STUDY_GROUPS: StudyGroup[] = [
  { id:'sg1', name:'Calculus Study Circle',    description:'Working through Stewart Calculus together', members:47, topic:'Calculus',      level:'College',    meetingSchedule:'Every Tuesday 7PM', icon:'∫' },
  { id:'sg2', name:'IMO Preparation Group',    description:'Training for mathematical olympiads',        members:23, topic:'Olympiad',      level:'Advanced',   meetingSchedule:'Weekends 10AM',     icon:'Ω' },
  { id:'sg3', name:'Linear Algebra Deep Dive', description:'Gilbert Strang MIT 18.06 cohort',            members:61, topic:'Linear Algebra',level:'University', meetingSchedule:'Mon/Wed 8PM',       icon:'⊞' },
  { id:'sg4', name:'Number Theory Explorers',  description:'Elementary to algebraic number theory',      members:19, topic:'Number Theory', level:'Advanced',   meetingSchedule:'Fridays 6PM',        icon:'#' },
  { id:'sg5', name:'High School Math Club',    description:'SAT/ACT prep + competition math',             members:84, topic:'Mixed',         level:'School',     meetingSchedule:'Daily',              icon:'∑' },
  { id:'sg6', name:'Real Analysis Reading',    description:'Baby Rudin chapter by chapter',              members:28, topic:'Real Analysis', level:'University', meetingSchedule:'Thursdays 9PM',     icon:'ℝ' },
]

export const CAT_STYLE: Record<PostCategory, { label: string; color: string; bg: string }> = {
  question:   { label:'Question',   color:'text-cyan-400',    bg:'bg-cyan-500/10 border-cyan-500/20' },
  discussion: { label:'Discussion', color:'text-violet-400',  bg:'bg-violet-500/10 border-violet-500/20' },
  solution:   { label:'Solution',   color:'text-emerald-400', bg:'bg-emerald-500/10 border-emerald-500/20' },
  resource:   { label:'Resource',   color:'text-amber-400',   bg:'bg-amber-500/10 border-amber-500/20' },
  challenge:  { label:'Challenge',  color:'text-rose-400',    bg:'bg-rose-500/10 border-rose-500/20' },
}
