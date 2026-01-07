/**
 * Photo Gallery specific types
 */

export interface MediaItem {
  id: string
  url: string
  date: string
  title: string
  description: string | null
  age: string
  mediaType: 'IMAGE' | 'VIDEO'
  format?: string
  thumbnailUrl?: string
  duration?: number
}

export interface UploadFileItem {
  id: string
  file: File
  title: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  errorMessage?: string
  uploadedUrl?: string
}

export interface UploadResult {
  url: string
  mediaType: 'IMAGE' | 'VIDEO'
  format: string
  thumbnailUrl: string | null
  duration: number | null
}

export interface ImageDimensions {
  width: number
  height: number
  aspectRatio: number
}


