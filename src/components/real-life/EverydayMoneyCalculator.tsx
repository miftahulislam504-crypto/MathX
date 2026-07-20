'use client'
import { useState } from 'react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

type Mode = 'emi' | 'discount' | 'unitprice' | 'tip'

function fmt(n: number, d = 2): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

function EMICalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(10)
  const [months, setMonths] = useState(12)

  const r = rate / 12 / 100
  const emi = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  const totalPaid = emi * months
  const totalInterest = totalPaid - principal

  return (
    <div className="space-y-4">
      <p className="text-xs text-white/40 leading-relaxed">
        Estimate your monthly loan payment (EMI) — the same math behind car loans, home loans, and installment
        purchases.
      </p>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Loan amount</span><span className="font-mono">{principal.toLocaleString()}</span></div>
          <input type="range" min={5000} max={2000000} step={5000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Annual interest rate</span><span className="font-mono">{rate}%</span></div>
          <input type="range" min={1} max={30} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Loan term</span><span className="font-mono">{months} months</span></div>
          <input type="range" min={3} max={360} step={3} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
      </div>
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
        <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-1">Monthly Payment</p>
        <p className="text-2xl font-mono font-bold text-emerald-300">{fmt(emi)}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3"><p className="text-[10px] text-white/30 mb-1">Total paid</p><p className="text-sm font-mono text-white/70">{fmt(totalPaid)}</p></div>
        <div className="rounded-lg bg-black/20 p-3"><p className="text-[10px] text-white/30 mb-1">Total interest</p><p className="text-sm font-mono text-rose-300">{fmt(totalInterest)}</p></div>
      </div>
      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
        <LatexRenderer latex={`EMI = \\dfrac{P \\cdot r(1+r)^n}{(1+r)^n - 1}`} display />
      </div>
    </div>
  )
}

function DiscountStacking() {
  const [price, setPrice] = useState(1000)
  const [d1, setD1] = useState(20)
  const [d2, setD2] = useState(10)

  const afterFirst = price * (1 - d1 / 100)
  const afterSecond = afterFirst * (1 - d2 / 100)
  const effectiveDiscount = (1 - afterSecond / price) * 100
  const naiveSum = d1 + d2

  return (
    <div className="space-y-4">
      <p className="text-xs text-white/40 leading-relaxed">
        &quot;20% off, then an extra 10% off&quot; does <em>not</em> mean 30% off — discounts stack
        multiplicatively, not by addition. This is one of the most common shopping-math mistakes.
      </p>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Original price</span><span className="font-mono">{price.toLocaleString()}</span></div>
          <input type="range" min={100} max={10000} step={50} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-rose-500" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>First discount</span><span className="font-mono">{d1}%</span></div>
          <input type="range" min={0} max={70} step={1} value={d1} onChange={(e) => setD1(Number(e.target.value))} className="w-full accent-rose-500" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Second discount</span><span className="font-mono">{d2}%</span></div>
          <input type="range" min={0} max={70} step={1} value={d2} onChange={(e) => setD2(Number(e.target.value))} className="w-full accent-rose-500" />
        </div>
      </div>
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
        <p className="text-[10px] uppercase tracking-wider text-rose-400/70 mb-1">Final Price</p>
        <p className="text-2xl font-mono font-bold text-rose-300">{fmt(afterSecond)}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3"><p className="text-[10px] text-white/30 mb-1">Actual combined discount</p><p className="text-sm font-mono text-emerald-300">{fmt(effectiveDiscount, 1)}%</p></div>
        <div className="rounded-lg bg-black/20 p-3"><p className="text-[10px] text-white/30 mb-1">Naive (wrong) assumption</p><p className="text-sm font-mono text-white/40 line-through">{naiveSum}%</p></div>
      </div>
    </div>
  )
}

function UnitPriceComparison() {
  const [priceA, setPriceA] = useState(120)
  const [sizeA, setSizeA] = useState(500)
  const [priceB, setPriceB] = useState(200)
  const [sizeB, setSizeB] = useState(900)

  const unitA = sizeA > 0 ? priceA / sizeA : 0
  const unitB = sizeB > 0 ? priceB / sizeB : 0
  const better = unitA < unitB ? 'A' : unitB < unitA ? 'B' : 'tie'

  return (
    <div className="space-y-4">
      <p className="text-xs text-white/40 leading-relaxed">
        The bigger pack isn&apos;t always the better deal. Compare price-per-unit to find out which option truly
        costs less.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/70">Option A</p>
          <div><span className="text-[10px] text-white/30">Price</span><input type="number" value={priceA} onChange={(e) => setPriceA(Number(e.target.value) || 0)} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/80 font-mono mt-1" /></div>
          <div><span className="text-[10px] text-white/30">Size (g/ml/units)</span><input type="number" value={sizeA} onChange={(e) => setSizeA(Number(e.target.value) || 0)} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/80 font-mono mt-1" /></div>
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-amber-400/70">Option B</p>
          <div><span className="text-[10px] text-white/30">Price</span><input type="number" value={priceB} onChange={(e) => setPriceB(Number(e.target.value) || 0)} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/80 font-mono mt-1" /></div>
          <div><span className="text-[10px] text-white/30">Size (g/ml/units)</span><input type="number" value={sizeB} onChange={(e) => setSizeB(Number(e.target.value) || 0)} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/80 font-mono mt-1" /></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className={`rounded-lg p-3 ${better === 'A' ? 'bg-emerald-500/10 border border-emerald-500/25' : 'bg-black/20'}`}>
          <p className="text-[10px] text-white/30 mb-1">Unit price A</p>
          <p className={`text-sm font-mono ${better === 'A' ? 'text-emerald-300' : 'text-white/60'}`}>{fmt(unitA, 4)}/unit</p>
        </div>
        <div className={`rounded-lg p-3 ${better === 'B' ? 'bg-emerald-500/10 border border-emerald-500/25' : 'bg-black/20'}`}>
          <p className="text-[10px] text-white/30 mb-1">Unit price B</p>
          <p className={`text-sm font-mono ${better === 'B' ? 'text-emerald-300' : 'text-white/60'}`}>{fmt(unitB, 4)}/unit</p>
        </div>
      </div>
      {better !== 'tie' && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-center">
          Option {better} is the better value per unit.
        </p>
      )}
    </div>
  )
}

function TipSplitter() {
  const [bill, setBill] = useState(850)
  const [tipPct, setTipPct] = useState(15)
  const [people, setPeople] = useState(4)

  const tip = bill * (tipPct / 100)
  const total = bill + tip
  const perPerson = people > 0 ? total / people : 0

  return (
    <div className="space-y-4">
      <p className="text-xs text-white/40 leading-relaxed">
        Split a restaurant bill fairly, including tip, across any number of people.
      </p>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Bill amount</span><span className="font-mono">{bill.toLocaleString()}</span></div>
          <input type="range" min={50} max={10000} step={10} value={bill} onChange={(e) => setBill(Number(e.target.value))} className="w-full accent-sky-500" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Tip percentage</span><span className="font-mono">{tipPct}%</span></div>
          <input type="range" min={0} max={30} step={1} value={tipPct} onChange={(e) => setTipPct(Number(e.target.value))} className="w-full accent-sky-500" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Number of people</span><span className="font-mono">{people}</span></div>
          <input type="range" min={1} max={20} step={1} value={people} onChange={(e) => setPeople(Number(e.target.value))} className="w-full accent-sky-500" />
        </div>
      </div>
      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 text-center">
        <p className="text-[10px] uppercase tracking-wider text-sky-400/70 mb-1">Each Person Pays</p>
        <p className="text-2xl font-mono font-bold text-sky-300">{fmt(perPerson)}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-black/20 p-3"><p className="text-[10px] text-white/30 mb-1">Tip amount</p><p className="text-sm font-mono text-white/70">{fmt(tip)}</p></div>
        <div className="rounded-lg bg-black/20 p-3"><p className="text-[10px] text-white/30 mb-1">Total bill</p><p className="text-sm font-mono text-white/70">{fmt(total)}</p></div>
      </div>
    </div>
  )
}

export function EverydayMoneyCalculator() {
  const [mode, setMode] = useState<Mode>('emi')

  const MODES: { id: Mode; label: string }[] = [
    { id: 'emi', label: 'Loan / EMI' },
    { id: 'discount', label: 'Discount Stacking' },
    { id: 'unitprice', label: 'Unit Price' },
    { id: 'tip', label: 'Tip Splitter' },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {MODES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`text-xs px-3 py-2 rounded-lg border transition-all ${mode === id ? 'bg-white/10 border-white/25 text-white' : 'border-white/8 text-white/40 hover:text-white/70'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === 'emi' && <EMICalculator />}
      {mode === 'discount' && <DiscountStacking />}
      {mode === 'unitprice' && <UnitPriceComparison />}
      {mode === 'tip' && <TipSplitter />}
    </div>
  )
}
