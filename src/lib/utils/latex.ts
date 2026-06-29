// Utility to sanitize and wrap LaTeX for rendering
export function wrapLatex(expression: string, display = false): string {
  if (display) return `\\[${expression}\\]`
  return `\\(${expression}\\)`
}

export function isValidLatex(expression: string): boolean {
  // Basic check — expand as needed
  try {
    return typeof expression === 'string' && expression.trim().length > 0
  } catch {
    return false
  }
}
