'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

type ExpType = 'coinflip' | 'dice' | 'birthday' | 'montyhall'

export function ProbabilityLab() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [exp, setExp] = useState<ExpType>('coinflip')
  const [dims, setDims] = useState({ w: 520, h: 240 })

  // Coin flip state
  const [coinTrials, setCoinTrials] = useState(0)
  const [coinHeads, setCoinHeads] = useState(0)
  const [coinHistory, setCoinHistory] = useState<number[]>([])

  // Birthday state
  const [bDayN, setBDayN] = useState(23)
  const [bDaySims, setBDaySims] = useState(10000)
  const [bDayResult, setBDayResult] = useState<number|null>(null)

  // Monty Hall state
  const [montyGames, setMontyGames] = useState(0)
  const [montySwitch, setMontySwitch] = useState(0)
  const [montyStay, setMontyStay] = useState(0)
  const [montyAuto, setMontyAuto] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width
      setDims({ w: Math.max(280, w), h: Math.max(180, Math.min(260, w*0.44)) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Coin chart
  useEffect(() => {
    if (exp !== 'coinflip' || coinHistory.length === 0) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const { w, h } = dims
    const M = { t:16, r:16, b:32, l:52 }
    const W = w-M.l-M.r, H = h-M.t-M.b

    const xSc = d3.scaleLinear().domain([0, coinHistory.length-1]).range([0,W])
    const ySc = d3.scaleLinear().domain([0,1]).range([H,0])

    svg.attr('width',w).attr('height',h)
    const g = svg.append('g').attr('transform',`translate(${M.l},${M.t})`)
    g.append('rect').attr('width',W).attr('height',H).attr('fill','#09090b')

    // 0.5 reference
    g.append('line').attr('x1',0).attr('x2',W).attr('y1',ySc(0.5)).attr('y2',ySc(0.5))
      .attr('stroke','rgba(255,255,255,0.15)').attr('stroke-dasharray','5,3')
    g.append('text').attr('x',W+4).attr('y',ySc(0.5)+4)
      .attr('fill','rgba(255,255,255,0.3)').attr('font-size','9px').attr('font-family','monospace').text('0.5')

    const line = d3.line<number>().x((_,i)=>xSc(i)).y(d=>ySc(d))
    g.append('path').datum(coinHistory).attr('fill','none')
      .attr('stroke','#7c3aed').attr('stroke-width',2).attr('d',line)

    g.append('g').attr('transform',`translate(0,${H})`).call(d3.axisBottom(xSc).ticks(5).tickSize(3))
      .call(a=>{ a.select('.domain').remove(); a.selectAll('.tick text').attr('fill','rgba(255,255,255,0.3)').attr('font-size','9px').attr('font-family','monospace') })
    g.append('g').call(d3.axisLeft(ySc).ticks(4).tickSize(3))
      .call(a=>{ a.select('.domain').remove(); a.selectAll('.tick text').attr('fill','rgba(255,255,255,0.3)').attr('font-size','9px').attr('font-family','monospace') })

    g.append('text').attr('x',8).attr('y',12).attr('fill','rgba(255,255,255,0.3)')
      .attr('font-size','10px').attr('font-family','monospace').text('Heads proportion (converges to 0.5)')
  }, [coinHistory, exp, dims])

  const flipCoins = (n: number) => {
    let h = coinHeads, t = coinTrials
    const newHistory = [...coinHistory]
    for (let i = 0; i < n; i++) {
      t++; if (Math.random() < 0.5) h++
      if (t % 10 === 0 || t <= 20) newHistory.push(h/t)
    }
    setCoinHeads(h); setCoinTrials(t); setCoinHistory(newHistory)
  }

  const runBirthday = () => {
    let matches = 0
    for (let sim = 0; sim < bDaySims; sim++) {
      const days = new Set<number>()
      for (let p = 0; p < bDayN; p++) {
        const d = Math.floor(Math.random()*365)
        if (days.has(d)) { matches++; break }
        days.add(d)
      }
    }
    setBDayResult(matches/bDaySims)
  }

  const theoretical = 1 - Array.from({length:bDayN},(_,i)=>i)
    .reduce((p,i)=>p*(365-i)/365, 1)

  const playMonty = (strategy: 'switch'|'stay') => {
    const car = Math.floor(Math.random()*3)
    const pick = Math.floor(Math.random()*3)
    // Host reveals a goat door (not car, not pick)
    let reveal = -1
    for (let d=0; d<3; d++) { if (d!==pick && d!==car) { reveal=d; break } }
    // Switch: pick the remaining door
    let finalPick = pick
    if (strategy==='switch') {
      for (let d=0; d<3; d++) { if (d!==pick && d!==reveal) { finalPick=d; break } }
    }
    const won = finalPick===car
    setMontyGames(g=>g+1)
    if (strategy==='switch') setMontySwitch(s=>s+(won?1:0))
    else setMontyStay(s=>s+(won?1:0))
  }

  const runManyMonty = () => {
    for (let i=0; i<1000; i++) {
      const car=Math.floor(Math.random()*3), pick=Math.floor(Math.random()*3)
      let reveal=-1
      for (let d=0; d<3; d++) { if(d!==pick&&d!==car){reveal=d;break} }
      let sw=pick
      for (let d=0; d<3; d++) { if(d!==pick&&d!==reveal){sw=d;break} }
      setMontyGames(g=>g+1)
      setMontySwitch(s=>s+(sw===car?1:0))
      setMontyStay(s=>s+(pick===car?1:0))
    }
  }

  const EXP_TABS: {key:ExpType;label:string;icon:string}[] = [
    {key:'coinflip', label:'Coin Flip', icon:'🪙'},
    {key:'dice', label:'Dice', icon:'🎲'},
    {key:'birthday', label:'Birthday', icon:'🎂'},
    {key:'montyhall', label:'Monty Hall', icon:'🚪'},
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {EXP_TABS.map(t=>(
          <button key={t.key} onClick={()=>setExp(t.key)}
            className={`flex items-center gap-1.5 text-xs rounded-lg px-3 py-2 border transition-all ${
              exp===t.key ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}><span>{t.icon}</span><span>{t.label}</span></button>
        ))}
      </div>

      {/* Coin Flip */}
      {exp==='coinflip' && (
        <div className="space-y-3">
          <div ref={containerRef} className="rounded-xl border border-white/8 bg-[#09090b] overflow-hidden">
            {coinHistory.length===0 ? (
              <div className="flex items-center justify-center h-40 text-white/20 text-sm">Flip coins to see Law of Large Numbers</div>
            ) : <svg ref={svgRef} className="w-full"/>}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              {label:'Total',val:coinTrials,c:'text-white'},
              {label:'Heads',val:coinHeads,c:'text-violet-400'},
              {label:'Ratio',val:coinTrials>0?(coinHeads/coinTrials).toFixed(4):'—',c:'text-cyan-400'},
            ].map(({label,val,c})=>(
              <div key={label} className="rounded-lg border border-white/6 bg-white/[0.02] p-2">
                <p className={`text-lg font-mono font-semibold ${c}`}>{val}</p>
                <p className="text-[10px] text-white/30">{label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {[1,10,100,1000].map(n=>(
              <button key={n} onClick={()=>flipCoins(n)}
                className="flex-1 rounded-lg bg-violet-600 hover:bg-violet-500 px-3 py-2 text-sm font-semibold text-white transition-all">
                Flip {n}
              </button>
            ))}
            <button onClick={()=>{setCoinTrials(0);setCoinHeads(0);setCoinHistory([])}}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/50 hover:text-white transition-all">
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Birthday Problem */}
      {exp==='birthday' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
            <p className="text-sm text-white/60 mb-4">With <span className="text-violet-300 font-mono font-semibold">{bDayN}</span> people in a room, what is the probability that at least two share a birthday?</p>
            <div className="mb-4">
              <p className="text-[10px] text-white/30 mb-1">People: {bDayN}</p>
              <input type="range" min={2} max={80} value={bDayN} onChange={e=>setBDayN(Number(e.target.value))} className="w-full accent-violet-500"/>
            </div>
            <div className="mb-4">
              <p className="text-[10px] text-white/30 mb-1">Simulations: {bDaySims.toLocaleString()}</p>
              <input type="range" min={1000} max={50000} step={1000} value={bDaySims} onChange={e=>setBDaySims(Number(e.target.value))} className="w-full accent-violet-500"/>
            </div>
            <button onClick={runBirthday} className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 py-2.5 text-sm font-semibold text-white transition-all">
              Run Simulation
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-center">
              <p className="text-[10px] text-violet-400/60 mb-1">Theoretical</p>
              <p className="text-2xl font-mono font-bold text-violet-300">{(theoretical*100).toFixed(2)}%</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
              <p className="text-[10px] text-cyan-400/60 mb-1">Simulated</p>
              <p className="text-2xl font-mono font-bold text-cyan-300">
                {bDayResult!==null ? `${(bDayResult*100).toFixed(2)}%` : '—'}
              </p>
            </div>
          </div>
          {bDayN>=23 && <p className="text-xs text-emerald-400 text-center">With 23 people: &gt;50% chance! Counterintuitive? That's math.</p>}
        </div>
      )}

      {/* Monty Hall */}
      {exp==='montyhall' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
            <p className="text-sm text-white/60 mb-4">3 doors. 1 car, 2 goats. You pick a door. Host reveals a goat. Do you switch?</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={()=>playMonty('switch')} className="rounded-lg bg-violet-600 hover:bg-violet-500 py-2.5 text-sm font-semibold text-white transition-all">
                Switch 🚗
              </button>
              <button onClick={()=>playMonty('stay')} className="rounded-lg bg-white/10 hover:bg-white/15 py-2.5 text-sm font-semibold text-white transition-all">
                Stay 🐐
              </button>
            </div>
            <button onClick={runManyMonty} className="w-full rounded-lg border border-violet-500/30 text-violet-400 py-2 text-sm hover:bg-violet-500/10 transition-all">
              Auto-play 1000 games
            </button>
          </div>
          {montyGames > 0 && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-white/6 bg-white/[0.02] p-3">
                <p className="text-xl font-mono font-bold text-white">{montyGames}</p>
                <p className="text-[10px] text-white/30">Total games</p>
              </div>
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
                <p className="text-xl font-mono font-bold text-violet-300">
                  {montySwitch>0 ? `${(montySwitch/montyGames*200).toFixed(1)}%` : '—'}
                </p>
                <p className="text-[10px] text-violet-400/60">Switch win rate</p>
                <p className="text-[10px] text-white/20 mt-0.5">Expected: 66.7%</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                <p className="text-xl font-mono font-bold text-white/60">
                  {montyStay>0 ? `${(montyStay/montyGames*200).toFixed(1)}%` : '—'}
                </p>
                <p className="text-[10px] text-white/30">Stay win rate</p>
                <p className="text-[10px] text-white/20 mt-0.5">Expected: 33.3%</p>
              </div>
            </div>
          )}
        </div>
      )}

      {exp==='dice' && (
        <div className="p-8 text-center text-white/30">
          <p className="text-4xl mb-3">🎲</p>
          <p className="text-sm">Dice distribution simulator — coming soon</p>
        </div>
      )}
    </div>
  )
}
