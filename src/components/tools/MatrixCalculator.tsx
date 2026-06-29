'use client'
import { useState } from 'react'
import { create, all } from 'mathjs'

const math = create(all)

type MatOp = 'add' | 'subtract' | 'multiply' | 'inverse' | 'determinant' | 'transpose' | 'eigenvalues'

type Matrix = number[][]

function makeMatrix(rows: number, cols: number): Matrix {
  return Array.from({length:rows}, () => Array(cols).fill(0))
}

function formatNum(n: number): string {
  if (!isFinite(n)) return String(n)
  if (Number.isInteger(n)) return String(n)
  return n.toFixed(4).replace(/\.?0+$/, '')
}

export function MatrixCalculator() {
  const [size, setSize] = useState<{r:number;c:number}>({r:3,c:3})
  const [matA, setMatA] = useState<Matrix>(makeMatrix(3,3))
  const [matB, setMatB] = useState<Matrix>(makeMatrix(3,3))
  const [op, setOp] = useState<MatOp>('multiply')
  const [result, setResult] = useState<{type:'matrix'|'scalar'|'vector';value:Matrix|number|number[]|string} | null>(null)
  const [steps, setSteps] = useState<string[]>([])
  const [error, setError] = useState('')

  const setCell = (mat: 'A'|'B', r: number, c: number, val: string) => {
    const n = parseFloat(val) || 0
    if (mat==='A') setMatA(m => { const nm=[...m.map(r=>[...r])]; nm[r][c]=n; return nm })
    else setMatB(m => { const nm=[...m.map(r=>[...r])]; nm[r][c]=n; return nm })
  }

  const resize = (r: number, c: number) => {
    setSize({r,c})
    setMatA(makeMatrix(r,c))
    setMatB(makeMatrix(r,c))
    setResult(null); setSteps([]); setError('')
  }

  const calculate = () => {
    setError(''); setResult(null); setSteps([])
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = math as any
      const A = m.matrix(matA)
      const B = m.matrix(matB)
      const newSteps: string[] = []

      switch (op) {
        case 'add': {
          newSteps.push('A + B = element-wise addition')
          const res = m.add(A, B)
          setResult({type:'matrix', value: res.toArray() as Matrix})
          break
        }
        case 'subtract': {
          newSteps.push('A - B = element-wise subtraction')
          const res = m.subtract(A, B)
          setResult({type:'matrix', value: res.toArray() as Matrix})
          break
        }
        case 'multiply': {
          newSteps.push(`A (${size.r}×${size.c}) × B (${size.c}×${size.r})`)
          newSteps.push('Result[i][j] = Σ A[i][k] × B[k][j]')
          const res = m.multiply(A, B)
          setResult({type:'matrix', value: res.toArray() as Matrix})
          break
        }
        case 'determinant': {
          newSteps.push(`det(A) using ${size.r}×${size.r} matrix`)
          if (size.r !== size.c) throw new Error('Matrix must be square')
          const det = m.det(A)
          newSteps.push(`det(A) = ${formatNum(det)}`)
          if (Math.abs(det) < 1e-10) newSteps.push('det ≈ 0 → Matrix is singular (not invertible)')
          setResult({type:'scalar', value: det})
          break
        }
        case 'inverse': {
          if (size.r !== size.c) throw new Error('Matrix must be square')
          const det = m.det(A)
          newSteps.push(`det(A) = ${formatNum(det)}`)
          if (Math.abs(det) < 1e-10) throw new Error('Matrix is singular — inverse does not exist')
          newSteps.push('A⁻¹ = adj(A) / det(A)')
          const inv = m.inv(A)
          setResult({type:'matrix', value: inv.toArray() as Matrix})
          break
        }
        case 'transpose': {
          newSteps.push('Aᵀ[i][j] = A[j][i]')
          const t = m.transpose(A)
          setResult({type:'matrix', value: t.toArray() as Matrix})
          break
        }
        case 'eigenvalues': {
          if (size.r !== size.c) throw new Error('Matrix must be square')
          newSteps.push('Solve det(A - λI) = 0 for λ')
          const eig = m.eigs(A)
          const vals = (eig.values.toArray() as number[]).map(v=>formatNum(typeof v==='object'?(v as any).re:v))
          newSteps.push(`Eigenvalues: ${vals.join(', ')}`)
          setResult({type:'vector', value: vals.map(Number)})
          break
        }
      }
      setSteps(newSteps)
    } catch(e) {
      setError(String(e))
    }
  }

  const UNARY_OPS: MatOp[] = ['determinant','inverse','transpose','eigenvalues']
  const isUnary = UNARY_OPS.includes(op)

  const OPS: {key:MatOp;label:string}[] = [
    {key:'multiply',    label:'A × B'},
    {key:'add',         label:'A + B'},
    {key:'subtract',    label:'A − B'},
    {key:'determinant', label:'det(A)'},
    {key:'inverse',     label:'A⁻¹'},
    {key:'transpose',   label:'Aᵀ'},
    {key:'eigenvalues', label:'Eigenvalues'},
  ]

  const MatrixInput = ({mat,label}:{mat:'A'|'B';label:string}) => {
    const data = mat==='A' ? matA : matB
    return (
      <div>
        <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-2">Matrix {label}</p>
        <div className="inline-flex flex-col gap-1">
          {data.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((val, c) => (
                <input key={c} type="number" value={val}
                  onChange={e=>setCell(mat,r,c,e.target.value)}
                  className="w-14 bg-black/40 border border-white/10 focus:border-violet-500/50 rounded px-1.5 py-1.5 text-sm font-mono text-white focus:outline-none text-center" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const ResultMatrix = ({data}:{data:Matrix}) => (
    <div className="inline-flex flex-col gap-1">
      {data.map((row,r)=>(
        <div key={r} className="flex gap-1">
          {row.map((val,c)=>(
            <div key={c} className="w-20 bg-violet-500/8 border border-violet-500/15 rounded px-2 py-1.5 text-sm font-mono text-violet-300 text-center">
              {formatNum(val)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Size + op row */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-mono">Size</span>
          {[2,3,4].map(n=>(
            <button key={n} onClick={()=>resize(n,n)}
              className={`text-xs rounded-lg px-3 py-1.5 border transition-all font-mono ${
                size.r===n ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                  : 'border-white/8 text-white/40 hover:text-white/70'
              }`}>{n}×{n}</button>
          ))}
        </div>
      </div>

      {/* Operation tabs */}
      <div className="flex flex-wrap gap-1.5">
        {OPS.map(o=>(
          <button key={o.key} onClick={()=>{setOp(o.key);setResult(null)}}
            className={`text-xs rounded-lg px-3 py-1.5 border transition-all font-mono ${
              op===o.key ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}>{o.label}</button>
        ))}
      </div>

      {/* Matrix inputs */}
      <div className="flex flex-wrap gap-8 items-start">
        <MatrixInput mat="A" label="A" />
        {!isUnary && (
          <>
            <div className="flex items-center self-center">
              <span className="text-2xl text-white/30 font-mono">
                {op==='add'?'+':op==='subtract'?'−':'×'}
              </span>
            </div>
            <MatrixInput mat="B" label="B" />
          </>
        )}
      </div>

      <button onClick={calculate}
        className="w-full sm:w-auto rounded-lg bg-violet-600 hover:bg-violet-500 px-8 py-2.5 text-sm font-semibold text-white transition-all">
        Calculate →
      </button>

      {error && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/8 px-4 py-3 text-sm text-rose-400 font-mono">
          {error}
        </div>
      )}

      {(result || steps.length>0) && (
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
          {steps.length>0 && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-2">Steps</p>
              {steps.map((s,i)=>(
                <p key={i} className="text-sm font-mono text-white/50 mb-1">{s}</p>
              ))}
            </div>
          )}
          {result && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Result</p>
              {result.type==='matrix' && <ResultMatrix data={result.value as Matrix} />}
              {result.type==='scalar' && (
                <div className="rounded-lg border border-violet-500/20 bg-violet-500/8 px-4 py-3">
                  <p className="text-xl font-mono font-semibold text-violet-300">{formatNum(result.value as number)}</p>
                </div>
              )}
              {result.type==='vector' && (
                <div className="flex gap-2 flex-wrap">
                  {(result.value as number[]).map((v,i)=>(
                    <div key={i} className="rounded-lg border border-violet-500/20 bg-violet-500/8 px-4 py-2">
                      <p className="text-xs text-white/30 font-mono mb-0.5">λ{i+1}</p>
                      <p className="text-sm font-mono font-semibold text-violet-300">{formatNum(v)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
