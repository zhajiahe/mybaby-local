import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Storage configuration from environment variables
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://localhost:9500'
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'minioadmin'
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'minioadmin'
const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'my-baby'
const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL || 'http://localhost:9500/my-baby'

// Initialize S3-compatible client for MinIO
const s3Client = new S3Client({
  region: 'us-east-1', // Required but not used by MinIO
  endpoint: MINIO_ENDPOINT,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
})

export interface UploadResult {
  url: string
  key: string
}

/**
 * Upload a file to object storage
 */
export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<UploadResult> {
  const command = new PutObjectCommand({
    Bucket: MINIO_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  })

  await s3Client.send(command)

  const publicUrl = `${MINIO_PUBLIC_URL.replace(/\/$/, '')}/${key}`
  
  return {
    url: publicUrl,
    key,
  }
}

/**
 * Delete a file from object storage
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: MINIO_BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(command)
}

/**
 * Generate a presigned URL for direct upload
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const command = new PutObjectCommand({
    Bucket: MINIO_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn })
  const publicUrl = `${MINIO_PUBLIC_URL.replace(/\/$/, '')}/${key}`

  return { uploadUrl, publicUrl }
}

/**
 * Extract key from a full URL
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    // Remove leading slash and bucket name if present
    const pathname = urlObj.pathname
    const parts = pathname.split('/').filter(Boolean)
    
    // If bucket name is in path, skip it
    if (parts[0] === MINIO_BUCKET_NAME) {
      return parts.slice(1).join('/')
    }
    
    return parts.join('/')
  } catch {
    return null
  }
}

/**
 * Get storage configuration (for debugging/info)
 */
export function getStorageConfig() {
  return {
    endpoint: MINIO_ENDPOINT,
    bucket: MINIO_BUCKET_NAME,
    publicUrl: MINIO_PUBLIC_URL,
    isConfigured: Boolean(MINIO_ENDPOINT && MINIO_ACCESS_KEY && MINIO_SECRET_KEY),
  }
}

// Export client for advanced usage
export { s3Client, MINIO_BUCKET_NAME, MINIO_PUBLIC_URL }

