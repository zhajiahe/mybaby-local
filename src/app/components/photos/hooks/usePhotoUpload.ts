'use client'

import { useState, useCallback } from 'react'
import { UploadFileItem, UploadResult } from '../types'
import { sanitizeFileName } from '../utils'

const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200MB

/**
 * Convert HEIC/HEIF to JPEG
 */
async function convertHeicToJpeg(file: File): Promise<{ blob: Blob; type: string }> {
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
                 file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')

  if (!isHeic) {
    const arrayBuffer = await file.arrayBuffer()
    return { blob: new Blob([arrayBuffer], { type: file.type }), type: file.type }
  }

  try {
    const heic2any = (await import('heic2any')).default
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.85,
    })

    const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
    return { blob: resultBlob, type: 'image/jpeg' }
  } catch (error) {
    console.warn('HEIC conversion failed, attempting fallback:', error)
    const arrayBuffer = await file.arrayBuffer()
    return { blob: new Blob([arrayBuffer], { type: file.type }), type: file.type }
  }
}

/**
 * Process video metadata (thumbnail + duration)
 */
async function processVideoMetadata(file: File): Promise<{
  thumbnail: Blob | null
  duration: number | null
}> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    let duration: number | null = null

    const timeout = setTimeout(() => {
      URL.revokeObjectURL(video.src)
      resolve({ thumbnail: null, duration })
    }, 10000)

    video.onloadedmetadata = () => {
      duration = Math.round(video.duration)
      video.currentTime = Math.min(1, video.duration / 2)
    }

    video.onseeked = () => {
      clearTimeout(timeout)
      try {
        const canvas = document.createElement('canvas')
        const width = 320
        const height = Math.round((video.videoHeight / video.videoWidth) * width) || 180
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, width, height)
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(video.src)
            resolve({ thumbnail: blob, duration })
          }, 'image/jpeg', 0.8)
        } else {
          URL.revokeObjectURL(video.src)
          resolve({ thumbnail: null, duration })
        }
      } catch (err) {
        console.error('Failed to generate video thumbnail:', err)
        URL.revokeObjectURL(video.src)
        resolve({ thumbnail: null, duration })
      }
    }

    video.onerror = () => {
      clearTimeout(timeout)
      URL.revokeObjectURL(video.src)
      resolve({ thumbnail: null, duration: null })
    }

    video.src = URL.createObjectURL(file)
  })
}

/**
 * Upload directly to storage
 */
async function uploadDirectToStorage(
  file: File,
  onProgress: (progress: number) => void
): Promise<UploadResult> {
  const isVideo = file.type.startsWith('video/')

  // Process file (HEIC conversion etc.)
  const { blob, type: processedType } = isVideo
    ? { blob: new Blob([await file.arrayBuffer()], { type: file.type }), type: file.type }
    : await convertHeicToJpeg(file)

  onProgress(10)

  // Step 1: Get presigned URL
  const urlResponse = await fetch('/api/photos/generate-upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: sanitizeFileName(file.name),
      contentType: processedType,
      isVideo,
    }),
  })

  if (!urlResponse.ok) {
    const errorData = await urlResponse.json().catch(() => ({}))
    throw new Error(errorData.error || '获取上传链接失败')
  }

  const urlData = await urlResponse.json()
  onProgress(20)

  // Step 2: Upload directly to storage
  const uploadResponse = await fetch(urlData.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': urlData.contentType,
    },
    body: blob,
  })

  if (!uploadResponse.ok) {
    throw new Error(`上传失败 (HTTP ${uploadResponse.status})`)
  }

  onProgress(70)

  // Video thumbnail and duration
  let thumbnailUrl: string | null = null
  let duration: number | null = null

  if (isVideo) {
    const { thumbnail: thumbnailBlob, duration: videoDuration } = await processVideoMetadata(file)
    duration = videoDuration

    if (thumbnailBlob && urlData.thumbnailUploadUrl) {
      try {
        const thumbResponse = await fetch(urlData.thumbnailUploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'image/jpeg' },
          body: thumbnailBlob,
        })
        if (thumbResponse.ok) {
          thumbnailUrl = urlData.thumbnailPublicUrl
        }
      } catch (err) {
        console.warn('Failed to upload video thumbnail:', err)
      }
    }
    onProgress(90)
  } else {
    onProgress(90)
  }

  return {
    url: urlData.publicUrl,
    mediaType: urlData.mediaType,
    format: urlData.format,
    thumbnailUrl,
    duration,
  }
}

interface UsePhotoUploadOptions {
  onSuccess?: (message: string) => void
  onError?: (title: string, message: string) => void
}

export function usePhotoUpload(options: UsePhotoUploadOptions = {}) {
  const [uploadFiles, setUploadFiles] = useState<UploadFileItem[]>([])
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const newItems: UploadFileItem[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > MAX_FILE_SIZE) {
        options.onError?.('文件过大', `文件 "${file.name}" 超过 ${MAX_FILE_SIZE / (1024 * 1024)}MB 限制`)
        continue
      }
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        options.onError?.('不支持的文件类型', `文件 "${file.name}" 不是图片或视频`)
        continue
      }
      newItems.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        title: '',
        status: 'pending',
        progress: 0,
      })
    }

    setUploadFiles(prev => [...prev, ...newItems])
  }, [options])

  const updateFileTitle = useCallback((id: string, title: string) => {
    setUploadFiles(prev => prev.map(item =>
      item.id === id ? { ...item, title } : item
    ))
  }, [])

  const removeFile = useCallback((id: string) => {
    setUploadFiles(prev => prev.filter(item => item.id !== id))
  }, [])

  const clearAllFiles = useCallback(() => {
    setUploadFiles([])
  }, [])

  const uploadFiles_ = useCallback(async (
    babyId: string,
    calculateAge: (date: string) => string
  ) => {
    if (uploadFiles.length === 0) {
      options.onError?.('验证失败', '请先选择要上传的文件。')
      return []
    }

    setIsUploading(true)
    const successfulItems: Array<Record<string, unknown>> = []

    for (let i = 0; i < uploadFiles.length; i++) {
      const item = uploadFiles[i]

      setUploadFiles(prev => prev.map(f =>
        f.id === item.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
      ))

      try {
        const uploadResult = await uploadDirectToStorage(item.file, (progress) => {
          setUploadFiles(prev => prev.map(f =>
            f.id === item.id ? { ...f, progress } : f
          ))
        })

        setUploadFiles(prev => prev.map(f =>
          f.id === item.id ? { ...f, progress: 85, uploadedUrl: uploadResult.url } : f
        ))

        const mediaDataForDb = {
          babyId,
          date: uploadDate,
          title: item.title || '',
          url: uploadResult.url,
          mediaType: uploadResult.mediaType,
          format: uploadResult.format,
          thumbnailUrl: uploadResult.thumbnailUrl || null,
          duration: uploadResult.duration || null,
        }

        const saveResponse = await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mediaDataForDb),
        })

        const saveResponseText = await saveResponse.text()

        if (!saveResponse.ok) {
          let errorMessage = '保存媒体信息失败'
          try {
            const errorData = JSON.parse(saveResponseText)
            errorMessage = errorData.error || errorData.message || errorMessage
          } catch {
            if (saveResponseText) {
              const cleanedMessage = saveResponseText.replace(/<[^>]*>/g, '').trim()
              errorMessage = cleanedMessage.substring(0, 100) || `保存失败 (HTTP ${saveResponse.status})`
            } else {
              errorMessage = `保存失败 (HTTP ${saveResponse.status})`
            }
          }
          throw new Error(errorMessage)
        }

        let savedItem
        try {
          savedItem = JSON.parse(saveResponseText)
        } catch {
          console.error('Failed to parse save response:', saveResponseText.substring(0, 200))
          throw new Error('保存响应格式错误')
        }

        successfulItems.push({
          ...savedItem,
          age: calculateAge(savedItem.date),
        })

        setUploadFiles(prev => prev.map(f =>
          f.id === item.id ? { ...f, status: 'success' as const, progress: 100 } : f
        ))

      } catch (error) {
        console.error(`Failed to upload ${item.file.name}:`, error)

        let errorMessage = '上传失败'
        if (error instanceof Error) {
          if (error.message.includes('pattern') || error.message.includes('Pattern')) {
            errorMessage = '文件格式验证失败，请尝试重新选择文件'
          } else if (error.message.includes('network') || error.message.includes('Network')) {
            errorMessage = '网络连接失败，请检查网络后重试'
          } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
            errorMessage = '上传超时，请稍后重试'
          } else {
            errorMessage = error.message
          }
        } else if (typeof error === 'string') {
          errorMessage = error
        }

        setUploadFiles(prev => prev.map(f =>
          f.id === item.id ? { ...f, status: 'error' as const, errorMessage } : f
        ))
      }
    }

    setIsUploading(false)

    if (successfulItems.length > 0) {
      options.onSuccess?.(`成功上传 ${successfulItems.length} 个文件`)
    }

    return successfulItems
  }, [uploadFiles, uploadDate, options])

  const hasErrors = uploadFiles.some(f => f.status === 'error')
  const allSuccess = uploadFiles.length > 0 && uploadFiles.every(f => f.status === 'success')

  return {
    uploadFiles,
    uploadDate,
    setUploadDate,
    isUploading,
    handleFileSelect,
    updateFileTitle,
    removeFile,
    clearAllFiles,
    doUpload: uploadFiles_,
    hasErrors,
    allSuccess,
  }
}

