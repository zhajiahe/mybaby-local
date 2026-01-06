import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getPresignedUploadUrl, getStorageConfig } from '@/lib/storage'

// Determine media type from content type
function getMediaType(contentType: string): 'IMAGE' | 'VIDEO' {
  if (contentType.startsWith('video/')) {
    return 'VIDEO'
  }
  return 'IMAGE'
}

// Normalize content type (convert HEIC to JPEG etc.)
function normalizeContentType(contentType: string, filename: string): { contentType: string; extension: string } {
  const lowerType = contentType.toLowerCase()
  
  // HEIC/HEIF images need client-side conversion to JPEG
  if (lowerType === 'image/heic' || lowerType === 'image/heif') {
    return { contentType: 'image/jpeg', extension: 'jpg' }
  }
  
  // Video types keep original
  if (lowerType.startsWith('video/')) {
    const ext = filename.split('.').pop()?.toLowerCase() || 'mp4'
    return { contentType: lowerType, extension: ext }
  }
  
  // Other image types
  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
  }
  
  return { 
    contentType: lowerType, 
    extension: extMap[lowerType] || filename.split('.').pop() || 'jpg'
  }
}

export async function POST(request: NextRequest) {
  const storageConfig = getStorageConfig()
  
  if (!storageConfig.isConfigured) {
    console.error('Storage is not properly configured')
    return NextResponse.json({ error: 'Server configuration error: Storage not configured' }, { status: 500 })
  }

  try {
    const { filename, contentType, isVideo = false } = await request.json()

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Filename and contentType are required' }, { status: 400 })
    }

    // Normalize content type and extension
    const normalized = normalizeContentType(contentType, filename)
    const mediaType = getMediaType(contentType)
    
    // Generate unique filename
    const uniqueId = uuidv4()
    const uniqueKey = `${uniqueId}.${normalized.extension}`
    
    // Generate presigned URL for main file
    const { uploadUrl, publicUrl } = await getPresignedUploadUrl(uniqueKey, normalized.contentType)
    
    // If video, also generate thumbnail upload URL
    let thumbnailUploadUrl: string | null = null
    let thumbnailKey: string | null = null
    let thumbnailPublicUrl: string | null = null
    
    if (isVideo || mediaType === 'VIDEO') {
      thumbnailKey = `thumbnails/${uniqueId}_thumb.jpg`
      const thumbnailResult = await getPresignedUploadUrl(thumbnailKey, 'image/jpeg')
      thumbnailUploadUrl = thumbnailResult.uploadUrl
      thumbnailPublicUrl = thumbnailResult.publicUrl
    }

    return NextResponse.json({
      success: true,
      uploadUrl,
      key: uniqueKey,
      publicUrl,
      mediaType,
      format: normalized.extension,
      contentType: normalized.contentType,
      // Video specific
      thumbnailUploadUrl,
      thumbnailKey,
      thumbnailPublicUrl,
    })

  } catch (error) {
    console.error('Error generating pre-signed URL:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: 'Failed to generate upload URL', details: errorMessage }, { status: 500 })
  }
}
