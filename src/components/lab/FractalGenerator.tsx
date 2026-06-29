'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

type FractalType = 'mandelbrot' | 'julia' | 'sierpinski'

const MAX_ITER = 100

function mandelbrot(cx: number, cy: number): number {
  let x = 0, y = 0
  for (let i = 0; i < MAX_ITER; i++) {
    if (x*x + y*y > 4) return i / MAX_ITER
    const xt = x*x - y*y + cx
    y = 2*x*y + cy; x = xt
  }
  return 1
}

function julia(zx: number, zy: number, cx: number, cy: number): number {
  for (let i = 0; i < MAX_ITER; i++) {
    if (zx*zx + zy*zy > 4) return i / MAX_ITER
    const xt = zx*zx - zy*zy + cx
    zy = 2*zx*zy + cy; zx = xt
  }
  return 1
}

function hslToRgb(h: number, s: number, l: number): [number,number,number] {
  s /= 100; l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1-l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n), 1)))
  return [Math.round(f(0)*255), Math.round(f(8)*255), Math.round(f(4)*255)]
}

export function FractalGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [type, setType] = useState<FractalType>('mandelbrot')
  const [juliaC, setJuliaC] = useState({ x: -0.7, y: 0.27 })
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState({ x: -0.5, y: 0 })
  const [size, setSize] = useState(400)
  const [rendering, setRendering] = useState(false)
  const [palette, setPalette] = useState<'cosmic'|'fire'|'ice'>('cosmic')

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((e) => {
      const w = Math.min(e[0].contentRect.width, 520)
      setSize(Math.max(280, w))
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const colorize = useCallback((t: number): [number,number,number] => {
    if (t >= 1) return [0,0,0]
    if (palette === 'cosmic') return hslToRgb(t*360, 80, 50)
    if (palette === 'fire') return hslToRgb(t*60, 100, t < 0.5 ? t*100 : 100-t*60)
    // ice
    return hslToRgb(200 + t*40, 80, 20 + t*60)
  }, [palette])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size; canvas.height = size
    setRendering(true)

    const imageData = ctx.createImageData(size, size)
    const data = imageData.data

    if (type === 'sierpinski') {
      // Draw Sierpinski triangle using chaos game
      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, 0, size, size)

      const vertices = [
        { x: size/2, y: 8 },
        { x: 8, y: size-8 },
        { x: size-8, y: size-8 },
      ]
      let px = size/2, py = size/2

      ctx.fillStyle = '#7c3aed'
      for (let i = 0; i < 60000; i++) {
        const v = vertices[Math.floor(Math.random()*3)]
        px = (px + v.x) / 2; py = (py + v.y) / 2
        if (i > 20) {
          ctx.fillRect(Math.round(px), Math.round(py), 1, 1)
        }
      }
      setRendering(false)
      return
    }

    const scale = 3.5 / zoom
    const xMin = center.x - scale/2, xMax = center.x + scale/2
    const yMin = center.y - scale/2, yMax = center.y + scale/2

    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        const cx = xMin + (px/size) * (xMax-xMin)
        const cy = yMin + (py/size) * (yMax-yMin)
        const t = type === 'mandelbrot'
          ? mandelbrot(cx, cy)
          : julia(cx, cy, juliaC.x, juliaC.y)
        const [r,g,b] = colorize(t)
        const idx = (py*size + px) * 4
        data[idx]=r; data[idx+1]=g; data[idx+2]=b; data[idx+3]=255
      }
    }

    ctx.putImageData(imageData, 0, 0)
    setRendering(false)
  }, [type, juliaC, zoom, center, size, colorize])

  const JULIA_PRESETS = [
    { label: 'Dendrite', c: {x:-0.7,y:0.27} },
    { label: 'Rabbit',   c: {x:-0.123,y:0.745} },
    { label: 'Dragon',   c: {x:0.285,y:0.01} },
    { label: 'Sea Horse',c: {x:-0.745,y:0.113} },
  ]

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div className="flex gap-2">
        {(['mandelbrot','julia','sierpinski'] as FractalType[]).map(t=>(
          <button key={t} onClick={()=>setType(t)}
            className={`flex-1 text-xs rounded-lg px-3 py-2 border transition-all capitalize ${
              type===t ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                : 'border-white/8 text-white/40 hover:text-white/70'
            }`}>{t}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-start">
        {/* Canvas */}
        <div ref={containerRef} className="relative">
          <canvas ref={canvasRef}
            className="rounded-xl border border-white/8 w-full"
            style={{imageRendering:'pixelated'}}/>
          {rendering && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60">
              <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin"/>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Palette */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-mono">Color Palette</p>
            <div className="flex gap-2">
              {(['cosmic','fire','ice'] as const).map(p=>(
                <button key={p} onClick={()=>setPalette(p)}
                  className={`flex-1 text-xs rounded-lg px-2 py-1.5 border transition-all capitalize ${
                    palette===p ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                      : 'border-white/8 text-white/40 hover:text-white/70'
                  }`}>{p}</button>
              ))}
            </div>
          </div>

          {/* Zoom (Mandelbrot/Julia) */}
          {type !== 'sierpinski' && (
            <>
              <div>
                <p className="text-[10px] text-white/30 mb-1">Zoom: {zoom.toFixed(1)}×</p>
                <input type="range" min={1} max={50} step={0.5} value={zoom}
                  onChange={(e)=>setZoom(Number(e.target.value))}
                  className="w-full accent-violet-500"/>
              </div>
              {type==='mandelbrot' && (
                <div className="grid grid-cols-2 gap-2">
                  {[{k:'x',label:'Center X'},{k:'y',label:'Center Y'}].map(({k,label})=>(
                    <div key={k}>
                      <p className="text-[10px] text-white/30 mb-1">{label}: {(center as any)[k].toFixed(3)}</p>
                      <input type="range" min={-2} max={2} step={0.05}
                        value={(center as any)[k]}
                        onChange={(e)=>setCenter(c=>({...c,[k]:Number(e.target.value)}))}
                        className="w-full accent-violet-500"/>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Julia presets */}
          {type==='julia' && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-mono">Julia Presets</p>
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {JULIA_PRESETS.map(p=>(
                  <button key={p.label} onClick={()=>setJuliaC(p.c)}
                    className="text-xs rounded-lg px-2 py-1.5 border border-white/8 text-white/40 hover:text-white/80 hover:border-white/20 transition-all">
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[{k:'x',label:'c (real)'},{k:'y',label:'c (imag)'}].map(({k,label})=>(
                  <div key={k}>
                    <p className="text-[10px] text-white/30 mb-1">{label}: {(juliaC as any)[k].toFixed(3)}</p>
                    <input type="range" min={-1.5} max={1.5} step={0.005}
                      value={(juliaC as any)[k]}
                      onChange={(e)=>setJuliaC(c=>({...c,[k]:Number(e.target.value)}))}
                      className="w-full accent-cyan-500"/>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-white/35 leading-relaxed">
            {type==='mandelbrot' && 'The Mandelbrot set: points c where zₙ₊₁=zₙ²+c stays bounded. Colors show how fast points escape to ∞.'}
            {type==='julia' && 'Julia sets use a fixed c and vary z₀. Small changes in c produce dramatically different shapes.'}
            {type==='sierpinski' && 'The Chaos Game: pick a random vertex, move halfway there, plot. 60,000 iterations reveal the triangle.'}
          </div>
        </div>
      </div>
    </div>
  )
}
