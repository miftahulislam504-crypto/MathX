export function formatMastery(score: number): string {
  if (score >= 90) return 'Expert'
  if (score >= 70) return 'Proficient'
  if (score >= 50) return 'Developing'
  if (score >= 25) return 'Beginner'
  return 'New'
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
