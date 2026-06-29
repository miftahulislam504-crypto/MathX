'use client'
import { useState, useCallback } from 'react'
import { generatePoints, evaluate, numericalDerivative, numericalIntegrate } from '@/lib/math/engine'
import { FunctionPlotConfig } from '@/types'

export function useMathEngine() {
  const [error, setError] = useState<string | null>(null)

  const getPlotPoints = useCallback(
    (config: FunctionPlotConfig) => {
      setError(null)
      try {
        return generatePoints(config.expression, config.xRange[0], config.xRange[1])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid expression')
        return []
      }
    },
    []
  )

  const computeDerivative = useCallback((expression: string, x: number) => {
    setError(null)
    try {
      return numericalDerivative(expression, x)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Derivative error')
      return null
    }
  }, [])

  const computeIntegral = useCallback((expression: string, a: number, b: number) => {
    setError(null)
    try {
      return numericalIntegrate(expression, a, b)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Integration error')
      return null
    }
  }, [])

  const evaluateExpr = useCallback((expression: string, scope?: Record<string, number>) => {
    setError(null)
    try {
      return evaluate(expression, scope)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation error')
      return null
    }
  }, [])

  return { getPlotPoints, computeDerivative, computeIntegral, evaluateExpr, error }
}
