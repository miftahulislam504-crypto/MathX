import { create, all } from 'mathjs'

// Full mathjs instance with all functions
export const math = create(all)

// ─── Evaluate expression safely ─────────────────────────────────────
export function evaluate(expression: string, scope?: Record<string, number>): number | string {
  try {
    const result = math.evaluate(expression, scope)
    return typeof result === 'number' ? result : String(result)
  } catch (err) {
    throw new Error(`Invalid expression: ${expression}`)
  }
}

// ─── Generate function values for plotting ──────────────────────────
export function generatePoints(
  expression: string,
  xMin: number,
  xMax: number,
  steps = 500
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = []
  const step = (xMax - xMin) / steps

  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * step
    try {
      const y = math.evaluate(expression, { x }) as number
      if (isFinite(y)) points.push({ x, y })
    } catch {
      // skip discontinuities
    }
  }
  return points
}

// ─── Derivative (numerical) ──────────────────────────────────────────
export function numericalDerivative(expression: string, x: number, h = 1e-7): number {
  const f = (val: number) => math.evaluate(expression, { x: val }) as number
  return (f(x + h) - f(x - h)) / (2 * h)
}

// ─── Numerical Integration (Simpson's Rule) ──────────────────────────
export function numericalIntegrate(
  expression: string,
  a: number,
  b: number,
  n = 1000
): number {
  if (n % 2 !== 0) n++
  const h = (b - a) / n
  let sum = 0
  const f = (x: number) => math.evaluate(expression, { x }) as number

  for (let i = 0; i <= n; i++) {
    const x = a + i * h
    const coeff = i === 0 || i === n ? 1 : i % 2 === 0 ? 2 : 4
    sum += coeff * f(x)
  }
  return (h / 3) * sum
}
