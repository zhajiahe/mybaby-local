/**
 * Media (photos/videos) related types
 */

export type MediaType = 'IMAGE' | 'VIDEO'

export interface MediaItem {
  id: string
  babyId: string
  date: string
  title: string
  description?: string | null
  url: string
  mediaType: MediaType
  format?: string | null
  thumbnailUrl?: string | null
  duration?: number | null
  createdAt: string
  updatedAt: string
}

export interface MediaItemWithAge extends MediaItem {
  age: string // Computed field
}

export interface MediaItemFormData {
  babyId: string
  date: string
  title?: string
  description?: string
  url: string
  mediaType: MediaType
  format?: string
  thumbnailUrl?: string
  duration?: number
}

export interface MediaUploadResult {
  url: string
  mediaType: MediaType
  format?: string
  originalFormat?: string
  thumbnailUrl?: string | null
  duration?: number | null
}

export interface PresignedUploadResult {
  success: boolean
  uploadUrl: string
  key: string
  publicUrl: string
  mediaType: MediaType
  format: string
  contentType: string
  thumbnailUploadUrl?: string | null
  thumbnailKey?: string | null
  thumbnailPublicUrl?: string | null
}


