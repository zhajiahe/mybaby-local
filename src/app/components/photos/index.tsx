'use client'

import { useState, useEffect, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import { useBabyContext } from '@/components/providers/BabyProvider'
import { useToastContext } from '@/components/providers/ToastProvider'
import { EmptyPhotos } from '@/components/ui/illustrations'
import { PhotoGrid } from './PhotoGrid'
import { PhotoUploader } from './PhotoUploader'
import { PhotoViewer } from './PhotoViewer'
import { MediaItem } from './types'
import { calculateAge } from './utils'

export default function PhotoGallery() {
  const { currentBaby: baby, loading, error } = useBabyContext()
  const toast = useToastContext()

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Upload state
  const [uploadFiles, setUploadFiles] = useState<Array<{
    id: string
    file: File
    title: string
    status: 'pending' | 'uploading' | 'success' | 'error'
    progress: number
    errorMessage?: string
    uploadedUrl?: string
  }>>([])
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0])
  const [isUploading, setIsUploading] = useState(false)

  const calcAge = useCallback((date: string) => {
    if (!baby?.birthDate) return '未知'
    return calculateAge(baby.birthDate, date)
  }, [baby?.birthDate])

  // Load media items
  useEffect(() => {
    const loadMediaItems = async () => {
      if (!baby?.id) {
        setMediaItems([])
        return
      }

      try {
        const response = await fetch(`/api/photos?babyId=${baby.id}`)
        if (response.ok) {
          const data = await response.json()
          const items = Array.isArray(data) ? data : (data.items || [])
          const itemsWithAge = items.map((item: MediaItem) => ({
            ...item,
            age: calcAge(item.date)
          }))
          setMediaItems(itemsWithAge)
        }
      } catch (err) {
        console.error('Error loading media items:', err)
      }
    }

    loadMediaItems()
  }, [baby?.id, calcAge])

  // Update ages when birth date changes
  useEffect(() => {
    if (baby?.birthDate) {
      setMediaItems(prev => {
        if (prev.length === 0) return prev
        return prev.map(item => ({
          ...item,
          age: calcAge(item.date)
        }))
      })
    }
  }, [baby?.birthDate, calcAge])

  // File handling
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const MAX_FILE_SIZE = 200 * 1024 * 1024
    const newItems: typeof uploadFiles = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > MAX_FILE_SIZE) {
        toast.error('文件过大', `文件 "${file.name}" 超过 200MB 限制`)
        continue
      }
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error('不支持的文件类型', `文件 "${file.name}" 不是图片或视频`)
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
  }

  const updateFileTitle = (id: string, title: string) => {
    setUploadFiles(prev => prev.map(item =>
      item.id === id ? { ...item, title } : item
    ))
  }

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(item => item.id !== id))
  }

  const clearAllFiles = () => {
    setUploadFiles([])
  }

  // Upload handling
  const handleUpload = async () => {
    if (!baby?.id) {
      toast.error('验证失败', '请先创建宝宝信息。')
      return
    }
    if (uploadFiles.length === 0) {
      toast.error('验证失败', '请先选择要上传的文件。')
      return
    }

    setIsUploading(true)
    const successfulItems: MediaItem[] = []

    for (let i = 0; i < uploadFiles.length; i++) {
      const item = uploadFiles[i]

      setUploadFiles(prev => prev.map(f =>
        f.id === item.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
      ))

      try {
        // Upload via server proxy
        const formData = new FormData()
        formData.append('file', item.file)

        setUploadFiles(prev => prev.map(f =>
          f.id === item.id ? { ...f, progress: 20 } : f
        ))

        const uploadResponse = await fetch('/api/photos/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}))
          throw new Error(errorData.error || errorData.details || '上传失败')
        }

        const uploadResult = await uploadResponse.json()

        setUploadFiles(prev => prev.map(f =>
          f.id === item.id ? { ...f, progress: 70 } : f
        ))

        // Save to database
        const saveResponse = await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            babyId: baby.id,
            date: uploadDate,
            title: item.title || '',
            url: uploadResult.url,
            mediaType: uploadResult.mediaType,
            format: uploadResult.format,
            thumbnailUrl: uploadResult.thumbnailUrl || null,
            duration: uploadResult.duration || null,
          }),
        })

        if (!saveResponse.ok) throw new Error('保存媒体信息失败')

        const savedItem = await saveResponse.json()
        successfulItems.push({
          ...savedItem,
          age: calcAge(savedItem.date),
        })

        setUploadFiles(prev => prev.map(f =>
          f.id === item.id ? { ...f, status: 'success' as const, progress: 100 } : f
        ))

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '上传失败'
        setUploadFiles(prev => prev.map(f =>
          f.id === item.id ? { ...f, status: 'error' as const, errorMessage } : f
        ))
      }
    }

    if (successfulItems.length > 0) {
      setMediaItems(prev => [...successfulItems, ...prev])
      toast.success('上传完成', `成功上传 ${successfulItems.length} 个文件`)
    }

    setIsUploading(false)

    const hasErrors = uploadFiles.some(f => f.status === 'error')
    if (!hasErrors && successfulItems.length === uploadFiles.length) {
      setUploadFiles([])
      setShowUploadForm(false)
    }
  }

  // Delete handler
  const handleDeleteMediaItem = async (id: string) => {
    if (!confirm('确定要删除这个媒体文件吗？此操作无法撤销。')) return

    try {
      const response = await fetch(`/api/photos/${id}`, { method: 'DELETE' })

      if (response.ok) {
        setMediaItems(prev => prev.filter(item => item.id !== id))
        if (selectedMediaItem?.id === id) {
          setSelectedMediaItem(null)
        }
        toast.success('删除成功', '媒体文件已成功删除')
      } else {
        throw new Error('删除失败')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除失败'
      toast.error('删除失败', errorMessage)
    }
  }

  // Update handler
  const handleUpdateMediaItem = async (id: string, data: { title: string; description: string | null }) => {
    const response = await fetch(`/api/photos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const updated = await response.json()
      setMediaItems(prev => prev.map(item =>
        item.id === id ? { ...item, title: updated.title, description: updated.description } : item
      ))
      setSelectedMediaItem(prev =>
        prev?.id === id ? { ...prev, title: updated.title, description: updated.description } : prev
      )
      toast.success('保存成功', '媒体信息已更新')
    } else {
      throw new Error('保存失败')
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto" />
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <X className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-600">加载失败: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-1">媒体墙</h2>
          <p className="text-sm md:text-base text-gray-600">记录宝宝成长的珍贵时刻</p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="btn-primary text-sm md:text-base py-2 md:py-3"
        >
          上传媒体文件
        </button>
      </div>

      {/* Upload Form */}
      <PhotoUploader
        isOpen={showUploadForm}
        onClose={() => {
          if (!isUploading) {
            setShowUploadForm(false)
            setUploadFiles([])
            setUploadError(null)
          }
        }}
        uploadFiles={uploadFiles}
        uploadDate={uploadDate}
        isUploading={isUploading}
        uploadError={uploadError}
        onFileSelect={handleFileSelect}
        onDateChange={setUploadDate}
        onTitleChange={updateFileTitle}
        onRemoveFile={removeFile}
        onClearAll={clearAllFiles}
        onUpload={handleUpload}
      />

      {/* Viewer Modal */}
      <PhotoViewer
        item={selectedMediaItem}
        onClose={() => setSelectedMediaItem(null)}
        onDelete={handleDeleteMediaItem}
        onUpdate={handleUpdateMediaItem}
      />

      {/* Gallery Grid */}
      {mediaItems.length > 0 ? (
        <PhotoGrid
          items={mediaItems}
          onItemClick={setSelectedMediaItem}
          groupByMonth={true}
        />
      ) : (
        <div className="text-center py-8 md:py-12 animate-fade-in-up">
          <EmptyPhotos className="w-40 h-32 md:w-48 md:h-40 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">还没有上传任何媒体</h3>
          <p className="text-sm md:text-base text-gray-600 mb-6">开始记录宝宝的珍贵时刻吧！</p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="btn-primary"
          >
            <Upload className="w-4 h-4" />
            上传第一个文件
          </button>
        </div>
      )}
    </div>
  )
}

// Re-export components for external use
export { PhotoGrid } from './PhotoGrid'
export { PhotoUploader } from './PhotoUploader'
export { PhotoViewer } from './PhotoViewer'
export type { MediaItem, UploadFileItem } from './types'

