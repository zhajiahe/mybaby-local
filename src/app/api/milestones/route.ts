import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper: Parse tags from JSON string to array
function parseTags(tags: string | null): string[] {
  if (!tags) return []
  try {
    return JSON.parse(tags)
  } catch {
    return []
  }
}

// Helper: Convert tags array to JSON string
function stringifyTags(tags: string[] | undefined): string | null {
  if (!tags || tags.length === 0) return null
  return JSON.stringify(tags)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const babyId = searchParams.get('babyId')

    if (!babyId) {
      return NextResponse.json({ error: 'Baby ID is required' }, { status: 400 })
    }

    const milestones = await prisma.milestone.findMany({
      where: { babyId },
      orderBy: { date: 'desc' },
    })

    // Convert tags from JSON string to array for API response
    const milestonesWithParsedTags = milestones.map(m => ({
      ...m,
      tags: parseTags(m.tags),
    }))

    return NextResponse.json(milestonesWithParsedTags, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json({ error: 'Failed to fetch milestones' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const milestone = await prisma.milestone.create({
      data: {
        babyId: data.babyId,
        date: new Date(data.date),
        title: data.title,
        description: data.description || null,
        tags: stringifyTags(data.tags),
      },
    })

    // Return with parsed tags for consistency
    return NextResponse.json({
      ...milestone,
      tags: parseTags(milestone.tags),
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating milestone:', error)
    return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 })
  }
} 