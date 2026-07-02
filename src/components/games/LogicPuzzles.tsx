'use client'
import { useState } from 'react'
import { Check, X } from 'lucide-react'

interface Puzzle {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  question: string
  options: string[]
  answer: number
  explanation: string
  category: string
}

const PUZZLES: Puzzle[] = [
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
]

const DIFF_COLOR: Record<string,string> = {
  Easy:   'text-emerald-400 border-emerald-500/20 bg-emerald-500/8',
  Medium: 'text-amber-400 border-amber-500/20 bg-amber-500/8',
  Hard:   'text-rose-400 border-rose-500/20 bg-rose-500/8',
}

function PuzzleCard({ puzzle, index }: { puzzle: Puzzle; index: number }) {
  const [selected, setSelected] = useState<number|null>(null)
  const [revealed, setReveal] = useState(false)
  const isCorrect = selected === puzzle.answer

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-violet-400/60 font-mono text-xs">#{index+1}</span>
          <h3 className="text-sm font-bold text-white mt-0.5">{puzzle.title}</h3>
          <span className="text-[10px] text-white/25">{puzzle.category}</span>
        </div>
        <span className={`text-[10px] font-medium border rounded-full px-2.5 py-0.5 shrink-0 ${DIFF_COLOR[puzzle.difficulty]}`}>
          {puzzle.difficulty}
        </span>
      </div>

      <p className="text-sm text-white/70 leading-relaxed mb-4">{puzzle.question}</p>

      <div className="space-y-2 mb-4">
        {puzzle.options.map((opt, i) => (
          <button key={i} onClick={() => { setSelected(i); setReveal(false) }}
            disabled={selected !== null}
            className={`w-full text-left text-sm rounded-lg px-4 py-2.5 border transition-all ${
              selected === null
                ? 'border-white/8 text-white/60 hover:border-white/20 hover:bg-white/5'
                : i === puzzle.answer
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : i === selected
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                    : 'border-white/5 text-white/25'
            }`}>
            <span className="font-mono text-xs mr-3 opacity-60">{['A','B','C','D'][i]}</span>
            {opt}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className={`rounded-lg p-3 text-sm mb-3 ${isCorrect ? 'bg-emerald-500/8 border border-emerald-500/20' : 'bg-rose-500/8 border border-rose-500/20'}`}>
          <p className={`font-semibold mb-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isCorrect ? <span className="inline-flex items-center gap-1"><Check className="w-4 h-4" /> Correct!</span> : <span className="inline-flex items-center gap-1"><X className="w-4 h-4" /> Not quite</span>}
          </p>
        </div>
      )}

      {selected !== null && (
        <button onClick={() => setReveal(r => !r)}
          className="text-xs text-violet-400/70 hover:text-violet-400 transition-colors">
          {revealed ? '▾ Hide explanation' : '▸ Show explanation'}
        </button>
      )}

      {revealed && (
        <div className="mt-3 rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3">
          <p className="text-xs text-violet-400/70 uppercase tracking-wider mb-1">Explanation</p>
          <p className="text-sm text-white/60 leading-relaxed">{puzzle.explanation}</p>
        </div>
      )}
    </div>
  )
}

export function LogicPuzzles() {
  const [filter, setFilter] = useState<string>('All')
  const [cat, setCat] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(PUZZLES.map(p => p.category)))]
  const diffs = ['All', 'Easy', 'Medium', 'Hard']

  const filtered = PUZZLES.filter(p => {
    const matchDiff = filter === 'All' || p.difficulty === filter
    const matchCat  = cat === 'All' || p.category === cat
    return matchDiff && matchCat
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          {diffs.map(d => (
            <button key={d} onClick={() => setFilter(d)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                filter===d ? 'bg-violet-600 border-violet-500 text-white'
                  : 'border-white/8 text-white/40 hover:text-white/70'
              }`}>{d}</button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                cat===c ? 'bg-white/10 border-white/20 text-white'
                  : 'border-white/8 text-white/40 hover:text-white/70'
              }`}>{c}</button>
          ))}
        </div>
      </div>
      <p className="text-xs text-white/25 font-mono">{filtered.length} puzzles</p>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((p, i) => <PuzzleCard key={p.id} puzzle={p} index={PUZZLES.indexOf(p)} />)}
      </div>
    </div>
  )
}
