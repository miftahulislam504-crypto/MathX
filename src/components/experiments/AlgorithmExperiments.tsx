'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowDownWideNarrow, Search, type LucideIcon } from 'lucide-react'

type ExpType = 'sorting' | 'search'

// ── Sorting Race ───────────────────────────────────────────────────────────
// Runs bubble sort, insertion sort, and merge sort step-recorded (not
// animated frame-by-frame with setTimeout chains) so comparison counts are
// exact and reproducible, then plays back the recorded frames.

function bubbleSortSteps(arr: number[]): { arr: number[]; comparisons: number; swaps: number }[] {
  const a = [...arr]
  const frames: { arr: number[]; comparisons: number; swaps: number }[] = []
  let comparisons = 0, swaps = 0
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        swaps++
        frames.push({ arr: [...a], comparisons, swaps })
      }
    }
  }
  frames.push({ arr: [...a], comparisons, swaps })
  return frames
}

function insertionSortSteps(arr: number[]): { arr: number[]; comparisons: number; swaps: number }[] {
  const a = [...arr]
  const frames: { arr: number[]; comparisons: number; swaps: number }[] = []
  let comparisons = 0, swaps = 0
  for (let i = 1; i < a.length; i++) {
    let j = i
    while (j > 0) {
      comparisons++
      if (a[j - 1] > a[j]) {
        ;[a[j - 1], a[j]] = [a[j], a[j - 1]]
        swaps++
        frames.push({ arr: [...a], comparisons, swaps })
        j--
      } else break
    }
  }
  frames.push({ arr: [...a], comparisons, swaps })
  return frames
}

function mergeSortSteps(arr: number[]): { arr: number[]; comparisons: number; swaps: number }[] {
  const frames: { arr: number[]; comparisons: number; swaps: number }[] = []
  let comparisons = 0
  const working = [...arr]

  function merge(lo: number, mid: number, hi: number) {
    const left = working.slice(lo, mid + 1)
    const right = working.slice(mid + 1, hi + 1)
    let i = 0, j = 0, k = lo
    while (i < left.length && j < right.length) {
      comparisons++
      if (left[i] <= right[j]) working[k++] = left[i++]
      else working[k++] = right[j++]
    }
    while (i < left.length) working[k++] = left[i++]
    while (j < right.length) working[k++] = right[j++]
    frames.push({ arr: [...working], comparisons, swaps: 0 })
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) return
    const mid = Math.floor((lo + hi) / 2)
    sort(lo, mid)
    sort(mid + 1, hi)
    merge(lo, mid, hi)
  }

  sort(0, working.length - 1)
  return frames
}

function SortingRace() {
  const [size] = useState(24)
  const [baseArray, setBaseArray] = useState<number[]>(() => Array.from({ length: 24 }, () => Math.floor(Math.random() * 100) + 5))
  const [frameIdx, setFrameIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef<number>(0)

  const bubbleFrames = bubbleSortSteps(baseArray)
  const insertionFrames = insertionSortSteps(baseArray)
  const mergeFrames = mergeSortSteps(baseArray)
  const maxFrames = Math.max(bubbleFrames.length, insertionFrames.length, mergeFrames.length)

  useEffect(() => {
    if (!playing) return
    const tick = () => {
      setFrameIdx((f) => {
        if (f >= maxFrames - 1) { setPlaying(false); return f }
        return f + 1
      })
      rafRef.current = requestAnimationFrame(() => setTimeout(tick, 40))
    }
    rafRef.current = requestAnimationFrame(() => setTimeout(tick, 40))
    return () => { cancelAnimationFrame(rafRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  const shuffle = () => {
    setBaseArray(Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5))
    setFrameIdx(0)
    setPlaying(false)
  }

  const getFrame = (frames: { arr: number[]; comparisons: number; swaps: number }[], idx: number) =>
    frames[Math.min(idx, frames.length - 1)]

  const bars = (arr: number[], color: string) => (
    <div className="flex items-end gap-[2px] h-24">
      {arr.map((v, i) => (
        <div key={i} className={`flex-1 rounded-sm ${color}`} style={{ height: `${v}%` }} />
      ))}
    </div>
  )

  const bf = getFrame(bubbleFrames, frameIdx)
  const inf = getFrame(insertionFrames, frameIdx)
  const mf = getFrame(mergeFrames, frameIdx)

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        Three algorithms sort the exact same shuffled array. Watch comparison counts to see why merge sort scales
        far better than bubble or insertion sort as arrays grow.
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-rose-400 font-medium">Bubble Sort</span>
            <span className="text-white/30 font-mono">{bf.comparisons} comparisons, {bf.swaps} swaps</span>
          </div>
          {bars(bf.arr, 'bg-rose-500/70')}
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-amber-400 font-medium">Insertion Sort</span>
            <span className="text-white/30 font-mono">{inf.comparisons} comparisons, {inf.swaps} swaps</span>
          </div>
          {bars(inf.arr, 'bg-amber-500/70')}
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-emerald-400 font-medium">Merge Sort</span>
            <span className="text-white/30 font-mono">{mf.comparisons} comparisons</span>
          </div>
          {bars(mf.arr, 'bg-emerald-500/70')}
        </div>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
        <input
          type="range" min={0} max={maxFrames - 1} value={frameIdx}
          onChange={(e) => { setFrameIdx(Number(e.target.value)); setPlaying(false) }}
          className="w-full accent-violet-500"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setPlaying((p) => !p)} className="flex-1 rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-all">
          {playing ? 'Pause' : 'Play Race'}
        </button>
        <button onClick={shuffle} className="rounded-lg border border-white/10 hover:border-white/20 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-all">
          New Array
        </button>
      </div>

      <p className="text-xs text-white/30 text-center font-mono">
        Array size: {size} · Bubble: O(n²) · Insertion: O(n²) · Merge: O(n log n)
      </p>
    </div>
  )
}

// ── Search Strategies ──────────────────────────────────────────────────────
function SearchStrategies() {
  const [size] = useState(40)
  const [sortedArray] = useState<number[]>(() => {
    const arr = Array.from({ length: 40 }, (_, i) => i * 3 + Math.floor(Math.random() * 2))
    return arr
  })
  const [target, setTarget] = useState(sortedArray[27])
  const [linearStep, setLinearStep] = useState(-1)
  const [binaryStep, setBinaryStep] = useState<{ lo: number; hi: number; mid: number } | null>(null)
  const [linearComparisons, setLinearComparisons] = useState(0)
  const [binaryComparisons, setBinaryComparisons] = useState(0)
  const [linearDone, setLinearDone] = useState(false)
  const [binaryDone, setBinaryDone] = useState(false)
  const [running, setRunning] = useState(false)

  const reset = (newTarget?: number) => {
    setTarget(newTarget ?? sortedArray[Math.floor(Math.random() * sortedArray.length)])
    setLinearStep(-1)
    setBinaryStep(null)
    setLinearComparisons(0)
    setBinaryComparisons(0)
    setLinearDone(false)
    setBinaryDone(false)
    setRunning(false)
  }

  useEffect(() => {
    if (!running) return
    let cancelled = false
    let li = 0
    let bLo = 0, bHi = sortedArray.length - 1
    let lComparisons = 0, bComparisons = 0

    const stepLinear = () => {
      if (cancelled || linearDone) return
      if (li >= sortedArray.length) { setLinearDone(true); return }
      lComparisons++
      setLinearStep(li)
      setLinearComparisons(lComparisons)
      if (sortedArray[li] === target) { setLinearDone(true); return }
      li++
      setTimeout(stepLinear, 120)
    }

    const stepBinary = () => {
      if (cancelled || binaryDone) return
      if (bLo > bHi) { setBinaryDone(true); return }
      const mid = Math.floor((bLo + bHi) / 2)
      bComparisons++
      setBinaryStep({ lo: bLo, hi: bHi, mid })
      setBinaryComparisons(bComparisons)
      if (sortedArray[mid] === target) { setBinaryDone(true); return }
      if (sortedArray[mid] < target) bLo = mid + 1
      else bHi = mid - 1
      setTimeout(stepBinary, 300)
    }

    stepLinear()
    stepBinary()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        On a <span className="text-white/60">sorted</span> array, binary search eliminates half the remaining
        possibilities each step — dramatically fewer comparisons than checking one element at a time.
      </p>

      <div>
        <p className="text-xs text-cyan-400 font-medium mb-2">Linear Search — comparisons: {linearComparisons}</p>
        <div className="flex flex-wrap gap-1">
          {sortedArray.map((v, i) => (
            <div key={i} className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-mono ${
              i === linearStep ? (v === target ? 'bg-emerald-500 text-white' : 'bg-cyan-500/60 text-white') : i < linearStep ? 'bg-white/5 text-white/20' : 'bg-white/5 text-white/40'
            }`}>
              {v}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-violet-400 font-medium mb-2">Binary Search — comparisons: {binaryComparisons}</p>
        <div className="flex flex-wrap gap-1">
          {sortedArray.map((v, i) => {
            const inRange = binaryStep && i >= binaryStep.lo && i <= binaryStep.hi
            const isMid = binaryStep && i === binaryStep.mid
            return (
              <div key={i} className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-mono ${
                isMid ? (v === target ? 'bg-emerald-500 text-white' : 'bg-violet-500/70 text-white') : inRange ? 'bg-violet-500/20 text-white/60' : 'bg-white/5 text-white/20'
              }`}>
                {v}
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-white/30 text-center font-mono">Searching for: {target}</p>

      <div className="flex gap-2">
        <button onClick={() => setRunning(true)} disabled={running} className="flex-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 px-4 py-2.5 text-sm font-semibold text-white transition-all">
          Race Both
        </button>
        <button onClick={() => reset()} className="rounded-lg border border-white/10 hover:border-white/20 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-all">
          New Target
        </button>
      </div>

      {linearDone && binaryDone && (
        <p className="text-xs text-center bg-white/[0.02] border border-white/8 rounded-lg px-3 py-2">
          <span className="text-cyan-400">Linear: {linearComparisons} steps</span>
          {' vs '}
          <span className="text-violet-400">Binary: {binaryComparisons} steps</span>
          {' — binary search finished in roughly log₂({size}) ≈ {Math.ceil(Math.log2(size))} steps.'}
        </p>
      )}
    </div>
  )
}

// ── Main Experiment Component ─────────────────────────────────────────────
export function AlgorithmExperiments() {
  const [exp, setExp] = useState<ExpType>('sorting')

  const EXPS: { id: ExpType; label: string; icon: LucideIcon }[] = [
    { id: 'sorting', label: 'Sorting Race', icon: ArrowDownWideNarrow },
    { id: 'search', label: 'Search Strategies', icon: Search },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {EXPS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setExp(id)}
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all ${
              exp === id
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {exp === 'sorting' && <SortingRace />}
      {exp === 'search' && <SearchStrategies />}
    </div>
  )
}
