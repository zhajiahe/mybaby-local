import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const babies = await prisma.baby.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: {
            growthRecords: true,
            milestones: true,
            mediaItems: true,
          },
        },
      },
    })

    return NextResponse.json(babies, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching babies:', error)
    return NextResponse.json({ error: 'Failed to fetch babies' }, { status: 500 })
  }
}

