'use client'
import { useMemo, useState } from 'react'
import { LatexRenderer } from '@/components/math/LatexRenderer'

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}
function sigmoidPrime(x: number): number {
  const s = sigmoid(x)
  return s * (1 - s)
}
function fmt(n: number, d = 4): string {
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(d)
}

interface NetworkState {
  W1: number[][] // 2x2 : input->hidden
  b1: number[]
  W2: number[] // hidden->output
  b2: number
}

const INITIAL: NetworkState = {
  W1: [[0.5, -0.3], [0.2, 0.8]],
  b1: [0.1, -0.1],
  W2: [0.6, -0.4],
  b2: 0.05,
}

function forward(net: NetworkState, x: [number, number]) {
  const z1 = [
    net.W1[0][0] * x[0] + net.W1[0][1] * x[1] + net.b1[0],
    net.W1[1][0] * x[0] + net.W1[1][1] * x[1] + net.b1[1],
  ]
  const a1 = z1.map(sigmoid)
  const z2 = net.W2[0] * a1[0] + net.W2[1] * a1[1] + net.b2
  const a2 = sigmoid(z2)
  return { z1, a1, z2, a2 }
}

function backward(net: NetworkState, x: [number, number], target: number) {
  const { z1, a1, z2, a2 } = forward(net, x)
  const dL_da2 = a2 - target
  const da2_dz2 = sigmoidPrime(z2)
  const delta2 = dL_da2 * da2_dz2 // dL/dz2

  const gradW2 = a1.map((a) => delta2 * a)
  const gradB2 = delta2

  const delta1 = net.W2.map((w, i) => delta2 * w * sigmoidPrime(z1[i]))
  const gradW1 = [
    [delta1[0] * x[0], delta1[0] * x[1]],
    [delta1[1] * x[0], delta1[1] * x[1]],
  ]
  const gradB1 = delta1

  const loss = 0.5 * (a2 - target) ** 2
  return { z1, a1, z2, a2, loss, gradW1, gradB1, gradW2, gradB2 }
}

export function AIMathematics() {
  const [net, setNet] = useState<NetworkState>(INITIAL)
  const [x1, setX1] = useState(1)
  const [x2, setX2] = useState(0.5)
  const [target, setTarget] = useState(1)
  const [lr, setLr] = useState(1.5)
  const [trainCount, setTrainCount] = useState(0)

  const result = useMemo(() => backward(net, [x1, x2], target), [net, x1, x2, target])

  const trainStep = () => {
    const g = backward(net, [x1, x2], target)
    setNet((prev) => ({
      W1: [
        [prev.W1[0][0] - lr * g.gradW1[0][0], prev.W1[0][1] - lr * g.gradW1[0][1]],
        [prev.W1[1][0] - lr * g.gradW1[1][0], prev.W1[1][1] - lr * g.gradW1[1][1]],
      ],
      b1: [prev.b1[0] - lr * g.gradB1[0], prev.b1[1] - lr * g.gradB1[1]],
      W2: [prev.W2[0] - lr * g.gradW2[0], prev.W2[1] - lr * g.gradW2[1]],
      b2: prev.b2 - lr * g.gradB2,
    }))
    setTrainCount((c) => c + 1)
  }

  const resetNetwork = () => {
    setNet(INITIAL)
    setTrainCount(0)
  }

  // Node layout for a simple 2-2-1 diagram
  const inputY = [70, 170]
  const hiddenY = [50, 190]
  const outputY = [120]

  const nodeR = 18

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 leading-relaxed">
        A tiny 2-input, 2-hidden-neuron, 1-output network. Adjust the inputs and target, then watch a forward
        pass compute the output — and a single gradient-descent step (backpropagation) nudge every weight to
        reduce the error.
      </p>

      <div className="rounded-xl border border-white/8 bg-[#09090b] p-3 overflow-x-auto">
        <svg viewBox="0 0 320 240" className="w-full" style={{ minWidth: 280 }}>
          {/* connections input->hidden */}
          {[0, 1].map((i) =>
            [0, 1].map((j) => {
              const w = net.W1[j][i]
              return (
                <line key={`ih-${i}-${j}`} x1={60} y1={inputY[i]} x2={160} y2={hiddenY[j]}
                  stroke={w >= 0 ? '#22d3ee' : '#fb7185'} strokeWidth={Math.min(4, Math.abs(w) * 2.5 + 0.5)} opacity={0.6} />
              )
            })
          )}
          {/* connections hidden->output */}
          {[0, 1].map((j) => (
            <line key={`ho-${j}`} x1={160} y1={hiddenY[j]} x2={260} y2={outputY[0]}
              stroke={net.W2[j] >= 0 ? '#22d3ee' : '#fb7185'} strokeWidth={Math.min(4, Math.abs(net.W2[j]) * 2.5 + 0.5)} opacity={0.6} />
          ))}

          {/* input nodes */}
          {[x1, x2].map((v, i) => (
            <g key={`in-${i}`}>
              <circle cx={60} cy={inputY[i]} r={nodeR} fill="#18181b" stroke="#71717a" strokeWidth={2} />
              <text x={60} y={inputY[i] + 4} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#d4d4d8">{fmt(v, 2)}</text>
            </g>
          ))}
          {/* hidden nodes */}
          {result.a1.map((a, i) => (
            <g key={`hid-${i}`}>
              <circle cx={160} cy={hiddenY[i]} r={nodeR} fill="#18181b" stroke="#a78bfa" strokeWidth={2} />
              <text x={160} y={hiddenY[i] + 4} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#c4b5fd">{fmt(a, 2)}</text>
            </g>
          ))}
          {/* output node */}
          <circle cx={260} cy={outputY[0]} r={nodeR} fill="#18181b" stroke="#34d399" strokeWidth={2} />
          <text x={260} y={outputY[0] + 4} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#6ee7b7">{fmt(result.a2, 2)}</text>

          <text x={60} y={30} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="rgba(255,255,255,0.3)">input</text>
          <text x={160} y={30} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="rgba(255,255,255,0.3)">hidden</text>
          <text x={260} y={30} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="rgba(255,255,255,0.3)">output</text>
        </svg>
      </div>
      <p className="text-[11px] text-white/25 text-center">
        <span className="text-cyan-400">Cyan edges = positive weight</span> · <span className="text-rose-400">Rose edges = negative weight</span> · thickness = |weight|
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Inputs &amp; Target</p>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>x₁</span><span className="font-mono">{fmt(x1, 2)}</span></div>
            <input type="range" min={-2} max={2} step={0.1} value={x1} onChange={(e) => setX1(Number(e.target.value))} className="w-full accent-violet-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>x₂</span><span className="font-mono">{fmt(x2, 2)}</span></div>
            <input type="range" min={-2} max={2} step={0.1} value={x2} onChange={(e) => setX2(Number(e.target.value))} className="w-full accent-violet-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Target output</span><span className="font-mono">{fmt(target, 2)}</span></div>
            <input type="range" min={0} max={1} step={0.05} value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Learning rate</span><span className="font-mono">{fmt(lr, 2)}</span></div>
            <input type="range" min={0.1} max={5} step={0.1} value={lr} onChange={(e) => setLr(Number(e.target.value))} className="w-full accent-amber-500" />
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono mb-3">Forward Pass</p>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-xs text-white/40">Output ŷ</span><span className="text-sm font-mono text-emerald-300">{fmt(result.a2)}</span></div>
            <div className="flex justify-between"><span className="text-xs text-white/40">Loss (½(ŷ−y)²)</span><span className="text-sm font-mono text-rose-300">{fmt(result.loss)}</span></div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
            <button onClick={trainStep} className="flex-1 rounded-lg bg-violet-600 hover:bg-violet-500 py-2 text-xs font-semibold text-white transition-all">
              Train 1 step
            </button>
            <button onClick={resetNetwork} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 hover:text-white transition-all">
              Reset
            </button>
          </div>
          <p className="text-[10px] text-white/25 mt-2 text-center">Steps trained: {trainCount}</p>
        </div>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4 space-y-2">
        <LatexRenderer latex={`\\delta_{output} = (\\hat{y}-y)\\,\\sigma'(z_2), \\quad \\dfrac{\\partial L}{\\partial W_2} = \\delta_{output}\\cdot a_1`} display />
      </div>

      <p className="text-[11px] text-white/25 leading-relaxed">
        Each &quot;Train 1 step&quot; click computes the gradient of the loss with respect to every weight
        (backpropagation), then moves each weight a little in the direction that reduces the loss — this is the
        core loop behind training every neural network, just scaled up to millions of weights.
      </p>
    </div>
  )
}
