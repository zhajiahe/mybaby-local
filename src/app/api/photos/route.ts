import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const babyId = searchParams.get('babyId')

    if (!babyId) {
      return NextResponse.json({ error: 'Baby ID is required' }, { status: 400 })
    }

    const mediaItems = await prisma.mediaItem.findMany({ // Changed from prisma.photo.findMany
      where: { babyId },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(mediaItems) // Changed from photos
  } catch (error) {
    console.error('Error fetching media items:', error) // Changed from photos
    return NextResponse.json({ error: 'Failed to fetch media items' }, { status: 500 }) // Changed from photos
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('Received data for media item creation:', data)
    
    // Validate required fields
    if (!data.babyId) {
      console.error('Missing babyId')
      return NextResponse.json({ error: 'Baby ID is required' }, { status: 400 })
    }
    // title is now optional - will use empty string if not provided
    if (!data.url) {
      console.error('Missing url')
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }
    if (!data.mediaType) {
      console.error('Missing mediaType')
      return NextResponse.json({ error: 'Media type is required' }, { status: 400 })
    }

    const mediaItem = await prisma.mediaItem.create({ // Changed from prisma.photo.create
      data: {
        babyId: data.babyId,
        date: new Date(data.date),
        title: data.title || '', // title is optional, default to empty string
        description: data.description || null,
        url: data.url, // URL of the main media (image or video)
        mediaType: data.mediaType, // "IMAGE" or "VIDEO"
        format: data.format || null, // e.g., "jpeg", "mp4"
        thumbnailUrl: data.thumbnailUrl || null, // URL of video thumbnail
        duration: data.duration ? Math.round(data.duration) : null, // Video duration in seconds, ensure integer
      },
    })

    console.log('Successfully created media item:', mediaItem)
    return NextResponse.json(mediaItem, { status: 201 }) // Changed from photo
  } catch (error) {
    console.error('Error creating media item:', error) // Changed from photo
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ error: 'Failed to create media item' }, { status: 500 }) // Changed from photo
  }
} 