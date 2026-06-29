/* eslint-disable @typescript-eslint/no-explicit-any */
import { create, all } from 'mathjs'

const math = create(all)

export interface PlotPoint { x: number; y: number }

const COLORS = ['#7c3aed','#06b6d4','#f59e0b','#10b981','#ef4444','#ec4899','#84cc16']

export function pickColor(index: number): string {
  return COLORS[index % COLORS.length]
}

function compileExpr(expression: string): any {
  return (math.compile as any)(expression)
}

function evalSafe(compiled: any, x: number): number {
  try {
    const v = compiled.evaluate({ x })
    return typeof v === 'number' && isFinite(v) ? v : NaN
  } catch { return NaN }
}

export function buildPoints(
  expression: string,
  xMin: number,
  xMax: number,
  steps = 600
): { points: PlotPoint[]; valid: boolean; error?: string } {
  if (!expression.trim()) return { points: [], valid: false, error: 'Empty expression' }

  let compiled: any
  try { compiled = compileExpr(expression) }
  catch (e) { return { points: [], valid: false, error: String(e) } }

  const points: PlotPoint[] = []
  const step = (xMax - xMin) / steps
  let prevY: number | null = null

  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * step
    const y = evalSafe(compiled, x)

    if (isFinite(y)) {
      if (prevY !== null && Math.abs(y - prevY) > 50) {
        points.push({ x, y: NaN })
      }
      points.push({ x, y })
      prevY = y
    } else {
      points.push({ x, y: NaN })
      prevY = null
    }
  }

  return { points, valid: true }
}

export function buildDerivativePoints(
  expression: string,
  xMin: number,
  xMax: number,
  steps = 400
): PlotPoint[] {
  let compiled: any
  try { compiled = compileExpr(expression) } catch { return [] }

  const h = 1e-6
  const points: PlotPoint[] = []
  const step = (xMax - xMin) / steps

  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * step
    const yp = evalSafe(compiled, x + h)
    const ym = evalSafe(compiled, x - h)
    const dy = (yp - ym) / (2 * h)
    points.push({ x, y: isFinite(dy) ? dy : NaN })
  }
  return points
}

export function buildIntegralRegion(
  expression: string,
  a: number,
  b: number,
  steps = 300
): PlotPoint[] {
  let compiled: any
  try { compiled = compileExpr(expression) } catch { return [] }

  const pts: PlotPoint[] = [{ x: a, y: 0 }]
  const step = (b - a) / steps

  for (let i = 0; i <= steps; i++) {
    const x = a + i * step
    const y = evalSafe(compiled, x)
    if (isFinite(y)) pts.push({ x, y })
  }
  pts.push({ x: b, y: 0 })
  return pts
}

export function numericalIntegral(
  expression: string,
  a: number,
  b: number,
  n = 1000
): number {
  if (n % 2 !== 0) n++
  let compiled: any
  try { compiled = compileExpr(expression) } catch { return NaN }

  const h = (b - a) / n
  let sum = 0
  for (let i = 0; i <= n; i++) {
    const x = a + i * h
    const y = evalSafe(compiled, x)
    const c = i === 0 || i === n ? 1 : i % 2 === 0 ? 2 : 4
    sum += c * (isFinite(y) ? y : 0)
  }
  return (h / 3) * sum
}

export function tangentLine(
  expression: string,
  x0: number,
  xMin: number,
  xMax: number
): PlotPoint[] {
  let compiled: any
  try { compiled = compileExpr(expression) } catch { return [] }

  const h = 1e-6
  const y0 = evalSafe(compiled, x0)
  const slope = (evalSafe(compiled, x0 + h) - evalSafe(compiled, x0 - h)) / (2 * h)

  if (!isFinite(y0) || !isFinite(slope)) return []

  return [
    { x: xMin, y: y0 + slope * (xMin - x0) },
    { x: xMax, y: y0 + slope * (xMax - x0) },
  ]
}
