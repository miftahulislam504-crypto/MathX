export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { generatePracticeProblems } from '@/lib/ai/tutor'

export async function POST(req: NextRequest) {
  try {
    const { topic, level, count } = await req.json()
    const result = await generatePracticeProblems(topic, level, count ?? 5)
    const parsed = JSON.parse(result)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[problems/generate]', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
