import { NextRequest, NextResponse } from 'next/server'

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://localhost:9500'
const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'my-baby'

/**
 * Proxy media files from MinIO for internal network access
 * This allows browsers to access MinIO files through the application
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filePath = path.join('/')
  
  if (!filePath) {
    return NextResponse.json({ error: 'File path is required' }, { status: 400 })
  }

  try {
    // Construct MinIO URL (internal network)
    const minioUrl = `${MINIO_ENDPOINT}/${MINIO_BUCKET_NAME}/${filePath}`
    
    // Fetch from MinIO
    const response = await fetch(minioUrl)
    
    if (!response.ok) {
      console.error(`Failed to fetch from MinIO: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: 'File not found' },
        { status: response.status }
      )
    }

    // Get content type from MinIO response
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentLength = response.headers.get('content-length')

    // Stream the response
    const headers: HeadersInit = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    }

    if (contentLength) {
      headers['Content-Length'] = contentLength
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Media proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}


