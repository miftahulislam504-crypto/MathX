'use client'
import { useState, useCallback } from 'react'
import { create, all } from 'mathjs'

const math = create(all)

type AngleMode = 'DEG' | 'RAD'

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['sin', 'cos', 'tan', '×'],
  ['ln', 'log', '√', '−'],
  ['x²', 'xʸ', 'π', '+'],
  ['(', ')', 'e', '='],
  ['7', '8', '9', ''],
  ['4', '5', '6', ''],
  ['1', '2', '3', ''],
  ['0', '.', 'ANS', ''],
]

const STYLE: Record<string, string> = {
  '=':   'bg-violet-600 hover:bg-violet-500 text-white col-span-1',
  '÷':   'bg-white/10 hover:bg-white/15 text-violet-300',
  '×':   'bg-white/10 hover:bg-white/15 text-violet-300',
  '−':   'bg-white/10 hover:bg-white/15 text-violet-300',
  '+':   'bg-white/10 hover:bg-white/15 text-violet-300',
  'C':   'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400',
  'sin': 'bg-white/5 hover:bg-white/10 text-cyan-400 text-xs',
  'cos': 'bg-white/5 hover:bg-white/10 text-cyan-400 text-xs',
  'tan': 'bg-white/5 hover:bg-white/10 text-cyan-400 text-xs',
  'ln':  'bg-white/5 hover:bg-white/10 text-cyan-400 text-xs',
  'log': 'bg-white/5 hover:bg-white/10 text-cyan-400 text-xs',
  '√':   'bg-white/5 hover:bg-white/10 text-cyan-400',
  'x²':  'bg-white/5 hover:bg-white/10 text-cyan-400 text-xs',
  'xʸ':  'bg-white/5 hover:bg-white/10 text-cyan-400 text-xs',
  'π':   'bg-white/5 hover:bg-white/10 text-amber-400',
  'e':   'bg-white/5 hover:bg-white/10 text-amber-400',
  '(':   'bg-white/5 hover:bg-white/10 text-white/60',
  ')':   'bg-white/5 hover:bg-white/10 text-white/60',
  '±':   'bg-white/5 hover:bg-white/10 text-white/60',
  '%':   'bg-white/5 hover:bg-white/10 text-white/60',
  'ANS': 'bg-white/5 hover:bg-white/10 text-emerald-400 text-xs',
}

export function ScientificCalculator() {
  const [expr, setExpr]         = useState('')
  const [display, setDisplay]   = useState('0')
  const [result, setResult]     = useState<string | null>(null)
  const [history, setHistory]   = useState<{expr: string; res: string}[]>([])
  const [ans, setAns]           = useState('0')
  const [mode, setMode]         = useState<AngleMode>('DEG')
  const [error, setError]       = useState(false)

  const calculate = useCallback((raw: string) => {
    let expression = raw
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/ANS/g, ans)

    // Trig: wrap with deg→rad conversion in DEG mode
    if (mode === 'DEG') {
      expression = expression
        .replace(/sin\(/g, 'sin(pi/180*')
        .replace(/cos\(/g, 'cos(pi/180*')
        .replace(/tan\(/g, 'tan(pi/180*')
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = (math as any).evaluate(expression)
      const str = typeof res === 'number'
        ? (Number.isInteger(res) ? String(res) : res.toPrecision(10).replace(/\.?0+$/, ''))
        : String(res)
      setResult(str)
      setAns(str)
      setHistory(h => [{expr: raw, res: str}, ...h.slice(0, 9)])
      setError(false)
      return str
    } catch {
      setError(true)
      setResult('Error')
      return 'Error'
    }
  }, [ans, mode])

  const handleBtn = (btn: string) => {
    if (btn === '') return
    setError(false)

    switch (btn) {
      case 'C':
        setExpr(''); setDisplay('0'); setResult(null); setError(false)
        return
      case '=':
        if (!expr) return
        const r = calculate(expr)
        setDisplay(r)
        setExpr(r === 'Error' ? '' : r)
        return
      case '±':
        setExpr(e => e.startsWith('-') ? e.slice(1) : '-' + e)
        return
      case '%':
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pct = (math as any).evaluate(expr.replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-')) / 100
          setExpr(String(pct)); setDisplay(String(pct))
        } catch { setError(true) }
        return
      case 'sin': case 'cos': case 'tan': case 'ln': case 'log': case '√':
        const fnMap: Record<string,string> = { sin:'sin(', cos:'cos(', tan:'tan(', ln:'ln(', log:'log(', '√':'sqrt(' }
        setExpr(e => e + fnMap[btn])
        return
      case 'x²':
        setExpr(e => e + '^2')
        return
      case 'xʸ':
        setExpr(e => e + '^')
        return
      default:
        setExpr(e => {
          // After = result, start fresh unless operator
          const newE = e + btn
          setDisplay(newE)
          return newE
        })
    }
  }

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {/* Calculator */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-4 select-none">
        {/* Display */}
        <div className="rounded-xl bg-black/60 border border-white/6 p-4 mb-4 min-h-[80px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-white/25 font-mono">{expr || '0'}</span>
            <button onClick={() => setMode(m => m === 'DEG' ? 'RAD' : 'DEG')}
              className="text-[10px] text-violet-400 border border-violet-500/30 rounded px-2 py-0.5 hover:bg-violet-500/10 transition-colors">
              {mode}
            </button>
          </div>
          <div className={`text-right font-mono text-3xl font-light truncate ${error ? 'text-rose-400' : 'text-white'}`}>
            {result !== null ? result : display}
          </div>
        </div>

        {/* Backspace */}
        <div className="flex justify-end mb-2">
          <button onClick={() => setExpr(e => e.slice(0,-1))}
            className="text-xs text-white/30 hover:text-white/60 border border-white/8 rounded-lg px-3 py-1 transition-colors">
            ⌫ Del
          </button>
        </div>

        {/* Button grid */}
        <div className="grid grid-cols-4 gap-1.5">
          {BUTTONS.flat().map((btn, i) => (
            <button key={i} onClick={() => handleBtn(btn)}
              className={`rounded-xl py-3 text-sm font-semibold transition-all active:scale-95 ${
                btn === '' ? 'invisible' :
                STYLE[btn] ?? 'bg-white/5 hover:bg-white/10 text-white'
              }`}>
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="space-y-3">
        <p className="text-xs text-white/40 uppercase tracking-wider font-mono">History</p>
        {history.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center text-white/20 text-sm">
            Calculations will appear here
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i}
                onClick={() => { setExpr(h.res); setDisplay(h.res); setResult(null) }}
                className="rounded-lg border border-white/6 bg-white/[0.02] hover:bg-white/[0.05] px-4 py-2.5 cursor-pointer transition-all group">
                <p className="text-xs text-white/30 font-mono truncate">{h.expr}</p>
                <p className="text-base font-mono text-white/80 group-hover:text-white transition-colors">= {h.res}</p>
              </div>
            ))}
            <button onClick={() => setHistory([])}
              className="w-full text-xs text-white/20 hover:text-white/40 py-1 transition-colors">
              Clear history
            </button>
          </div>
        )}

        {/* Quick reference */}
        <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4 mt-4">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Quick Reference</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs font-mono">
            {[
              ['sin(90)', mode === 'DEG' ? '= 1' : '≈ 0.894'],
              ['log(100)', '= 2'],
              ['ln(e)', '= 1'],
              ['sqrt(2)', '≈ 1.414'],
              ['2^10', '= 1024'],
              ['pi', '≈ 3.14159'],
            ].map(([ex, res]) => (
              <div key={ex} className="flex justify-between text-white/30">
                <button onClick={() => { setExpr(ex); setDisplay(ex) }}
                  className="text-violet-400/70 hover:text-violet-300 transition-colors">{ex}</button>
                <span>{res}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
