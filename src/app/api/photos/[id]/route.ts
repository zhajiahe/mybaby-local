import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteFile, extractKeyFromUrl } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const mediaItem = await prisma.mediaItem.findUnique({ // Changed from prisma.photo.findUnique
      where: { id },
      include: {
        baby: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!mediaItem) { // Changed from photo
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 }) // Changed from Photo
    }

    return NextResponse.json(mediaItem) // Changed from photo
  } catch (error) {
    console.error('Error fetching media item:', error) // Changed from photo
    return NextResponse.json({ error: 'Failed to fetch media item' }, { status: 500 }) // Changed from photo
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    const mediaItem = await prisma.mediaItem.update({ // Changed from prisma.photo.update
      where: { id },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        title: data.title,
        description: data.description,
        url: data.url,
        // Include new fields, making them updatable if provided
        mediaType: data.mediaType,
        format: data.format,
        thumbnailUrl: data.thumbnailUrl,
        duration: data.duration,
      },
    })

    return NextResponse.json(mediaItem) // Changed from photo
  } catch (error) {
    console.error('Error updating media item:', error) // Changed from photo
    return NextResponse.json({ error: 'Failed to update media item' }, { status: 500 }) // Changed from photo
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // First, get the media item to find the file URLs
    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id },
      select: { url: true, thumbnailUrl: true },
    })

    if (!mediaItem) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 })
    }

    // Delete from database
    await prisma.mediaItem.delete({
      where: { id },
    })

    // Try to delete files from storage (don't fail if storage delete fails)
    try {
      const mainKey = extractKeyFromUrl(mediaItem.url)
      if (mainKey) {
        await deleteFile(mainKey)
      }
      
      if (mediaItem.thumbnailUrl) {
        const thumbKey = extractKeyFromUrl(mediaItem.thumbnailUrl)
        if (thumbKey) {
          await deleteFile(thumbKey)
        }
      }
    } catch (storageError) {
      // Log but don't fail - the database record is already deleted
      console.warn('Failed to delete file from storage:', storageError)
    }

    return NextResponse.json({ message: 'Media item deleted successfully' })
  } catch (error) {
    console.error('Error deleting media item:', error)
    return NextResponse.json({ error: 'Failed to delete media item' }, { status: 500 })
  }
} 