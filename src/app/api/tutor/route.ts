export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { askTutor } from '@/lib/ai/tutor'
import { TutorMessage } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, topicContext } = body as {
      messages: TutorMessage[]
      topicContext?: string
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const reply = await askTutor(messages, topicContext)
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[tutor/route]', err)
    return NextResponse.json({ error: 'AI service error' }, { status: 500 })
  }
}
