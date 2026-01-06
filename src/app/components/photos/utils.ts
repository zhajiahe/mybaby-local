/**
 * Utility functions for photo gallery
 */

/**
 * Format duration from seconds to MM:SS
 */
export function formatDuration(seconds: number | undefined): string | null {
  if (seconds === undefined || seconds === null) return null
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Format date to Chinese readable format
 */
export function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Calculate age from birth date to photo date
 */
export function calculateAge(birthDate: string, photoDate: string): string {
  const birth = new Date(birthDate)
  const photo = new Date(photoDate)
  const diffTime = Math.abs(photo.getTime() - birth.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1

  if (diffDays <= 0) {
    return '出生当天'
  } else if (diffDays < 30) {
    return `${diffDays}天`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    const days = diffDays % 30
    return `${months}个月${days}天`
  } else {
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    return `${years}岁${months}个月`
  }
}

/**
 * Sanitize file name for safe usage
 */
export function sanitizeFileName(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  const baseName = name.substring(0, name.lastIndexOf('.') || name.length)
  const safeName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50)
  return ext ? `${safeName}.${ext}` : safeName
}

/**
 * Get container style for adaptive media display
 */
export function getContainerStyle(dimensions: { width: number; height: number; aspectRatio: number } | null) {
  if (!dimensions) {
    return { maxWidth: '100%', maxHeight: '70vh', aspectRatio: '16/9' }
  }

  const maxWidth = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 800
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.7 : 600
  const { aspectRatio } = dimensions

  let width, height

  if (aspectRatio > 1) {
    width = Math.min(maxWidth, 800)
    height = width / aspectRatio
    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }
  } else {
    height = Math.min(maxHeight, 600)
    width = height * aspectRatio
    if (width > maxWidth) {
      width = maxWidth
      height = width / aspectRatio
    }
  }

  return {
    width: `${width}px`,
    height: `${height}px`,
    maxWidth: '90vw',
    maxHeight: '80vh'
  }
}

