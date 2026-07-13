export interface Puzzle {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  question: string
  options: string[]
  answer: number
  explanation: string
  category: string
}

export const PUZZLES: Puzzle[] = [
  // ── Migrated from the original Games > Logic Puzzles tab ──────────────
  {
    id:'p1', title:'The Liars', difficulty:'Easy', category:'Logic',
    question:'Alex says "I always lie." Bob says "Alex is telling the truth." Who is lying?',
    options:['Alex only','Bob only','Both Alex and Bob','Neither'],
    answer:2,
    explanation:'If Alex always lies, then "I always lie" is a lie — meaning Alex sometimes tells truth. Contradiction. So Alex lies here, and Bob who says Alex tells truth is also lying. Both lie.',
  },
  {
    id:'p2', title:'The Missing Dollar', difficulty:'Easy', category:'Arithmetic',
    question:'Three friends pay $30 for a hotel room. Manager returns $5. Each person gets $1 back, keeping $2. So each paid $9 × 3 = $27 + $2 tip = $29. Where is the missing dollar?',
    options:['There is no missing dollar','Manager kept it','Hotel kept it','Math error'],
    answer:0,
    explanation:'There is no missing dollar — it\'s a misdirection. The $27 paid already includes the $2 tip. $25 (hotel) + $2 (tip) + $3 (returned) = $30. Never add $27 + $2.',
  },
  {
    id:'p3', title:'Monkeys and Bananas', difficulty:'Medium', category:'Algebra',
    question:'5 monkeys eat 5 bananas in 5 minutes. How many minutes for 100 monkeys to eat 100 bananas?',
    options:['100 minutes','20 minutes','5 minutes','1 minute'],
    answer:2,
    explanation:'Each monkey eats 1 banana in 5 minutes. 100 monkeys eating 100 bananas = each monkey eats 1 banana = 5 minutes. The rate per monkey does not change.',
  },
  {
    id:'p4', title:'Birthday Paradox', difficulty:'Medium', category:'Probability',
    question:'In a room of 23 people, what is the probability that at least 2 share a birthday?',
    options:['About 23%','About 50%','About 75%','About 90%'],
    answer:1,
    explanation:'Counter-intuitively, with 23 people the probability exceeds 50% (≈50.7%). With 50 people it reaches ~97%. This is because there are C(23,2)=253 possible pairs.',
  },
  {
    id:'p5', title:'The Barber Paradox', difficulty:'Hard', category:'Logic',
    question:'A barber shaves all men who do not shave themselves. Who shaves the barber?',
    options:['The barber shaves himself','Someone else shaves him','No one shaves him','The paradox has no solution'],
    answer:3,
    explanation:'This is Russell\'s Paradox — no consistent answer exists. If he shaves himself, he shouldn\'t (only shaves non-self-shavers). If he doesn\'t, he must. The barber cannot exist. This led to the axiomatic foundations of set theory.',
  },
  {
    id:'p6', title:'Bridges of Königsberg', difficulty:'Hard', category:'Graph Theory',
    question:'Can you cross all 7 bridges of Königsberg exactly once and return to start?',
    options:['Yes, with the right path','No — it is impossible','Only with 6 bridges','Depends on starting point'],
    answer:1,
    explanation:'Euler proved it impossible. For an Eulerian circuit to exist, every vertex must have even degree. Three of Königsberg\'s four landmasses have odd degree (bridges). This problem founded graph theory in 1736.',
  },
  {
    id:'p7', title:'Infinite Hotel', difficulty:'Hard', category:'Infinity',
    question:"Hilbert's Hotel has infinite rooms all occupied. A new guest arrives. Can they get a room?",
    options:['No — the hotel is full','Yes — move everyone one room up','Only if someone leaves','Depends on the hotel size'],
    answer:1,
    explanation:'Move guest in room n to room n+1 for all n. Room 1 is now free. Infinity is not a number — it behaves differently. You can even fit infinitely many new guests by moving guest in room n to room 2n.',
  },
  {
    id:'p8', title:'The Pirate Gold', difficulty:'Medium', category:'Game Theory',
    question:'5 pirates rank A>B>C>D>E. A proposes gold split. Majority vote — if tied, A wins. A is thrown overboard if majority rejects. How much gold does A keep from 100 coins?',
    options:['0 coins','50 coins','98 coins','100 coins'],
    answer:2,
    explanation:'Working backwards: with 2 pirates, B takes all. With 3, C votes yes for 1 coin (better than 0). With 4, D gets 0. With 5 pirates, A gives 1 to C, 0 to D, 1 to E (beats their next-case scenario). A keeps 98.',
  },

  // ── New: Geometry Puzzles ────────────────────────────────────────────
  {
    id:'p9', title:'Doubling the Square', difficulty:'Easy', category:'Geometry',
    question:'If you double the side length of a square, how does its area change?',
    options:['It doubles','It triples','It quadruples','It stays proportional to the perimeter'],
    answer:2,
    explanation:'A square with side s has area s². Doubling the side gives (2s)²=4s² — four times the original area, not two. This common misconception matters in real scaling problems: area scales with the square of linear dimensions.',
  },
  {
    id:'p10', title:'The Exterior Angle Mystery', difficulty:'Medium', category:'Geometry',
    question:'What is the sum of the exterior angles of ANY convex polygon — a triangle, a hexagon, or a 100-sided shape?',
    options:['Always 180°','Always 360°','Depends on the number of sides','360° only for regular polygons'],
    answer:1,
    explanation:'Remarkably, the sum of exterior angles is always exactly 360° for any convex polygon, regardless of how many sides it has. Walking around the perimeter once means turning through one full rotation — 360° — no matter the shape.',
  },

  // ── New: Olympiad Puzzles ────────────────────────────────────────────
  {
    id:'p11', title:'The Digit Sum Shortcut', difficulty:'Easy', category:'Olympiad',
    question:'Without dividing, how can you tell if 987,654,321 is divisible by 9?',
    options:['Check if the last digit is 9','Sum all the digits — if that sum is divisible by 9, so is the number','Check if the number of digits is divisible by 9','It is never divisible by 9'],
    answer:1,
    explanation:'The digits of 987,654,321 sum to 45, and 45 is divisible by 9 — so the whole number is too. This works because 10 ≡ 1 (mod 9), so a number\'s value modulo 9 always equals its digit sum modulo 9, a classic competition shortcut.',
  },
  {
    id:'p12', title:'Three in a Row', difficulty:'Medium', category:'Olympiad',
    question:'Prove or disprove: the sum of any 3 consecutive integers is always divisible by 3.',
    options:['True — always divisible by 3','False — only sometimes','True, but only for positive integers','False — only for even starting numbers'],
    answer:0,
    explanation:'Let the integers be n, n+1, n+2. Their sum is 3n+3=3(n+1), which is always a multiple of 3 by algebraic construction — regardless of what n is, positive, negative, even, or odd.',
  },
]

export function getPuzzlesByCategory(category: string): Puzzle[] {
  if (category === 'All') return PUZZLES
  return PUZZLES.filter((p) => p.category === category)
}

export function getPuzzleCategories(): string[] {
  return Array.from(new Set(PUZZLES.map((p) => p.category)))
}
