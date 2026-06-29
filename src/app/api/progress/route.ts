import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // In production: save to PostgreSQL via Prisma
    // For now: acknowledge receipt
    return NextResponse.json({ success: true, data: body })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  // In production: fetch from PostgreSQL via Prisma
  return NextResponse.json({ userId, progress: [] })
}
