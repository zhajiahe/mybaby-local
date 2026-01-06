'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, Clock, Film, Trash2, X } from 'lucide-react'
import { MediaItem, ImageDimensions } from './types'
import { formatDuration, getContainerStyle } from './utils'

interface PhotoViewerProps {
  item: MediaItem | null
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, data: { title: string; description: string | null }) => Promise<void>
}

export function PhotoViewer({ item, onClose, onDelete, onUpdate }: PhotoViewerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({ title: '', description: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null)

  if (!item) return null

  const handleStartEdit = () => {
    setEditFormData({
      title: item.title,
      description: item.description || ''
    })
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditFormData({ title: '', description: '' })
  }

  const handleSaveEdit = async () => {
    setIsSaving(true)
    try {
      await onUpdate(item.id, {
        title: editFormData.title.trim(),
        description: editFormData.description.trim() || null
      })
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    const aspectRatio = img.naturalWidth / img.naturalHeight
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
      aspectRatio
    })
  }

  const handleClose = () => {
    setIsEditing(false)
    setImageDimensions(null)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 50
      }}
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            {!isEditing ? (
              <h3 className="text-xl font-bold text-gray-800">
                {item.title || <span className="text-gray-400 italic"> </span>}
              </h3>
            ) : (
              <div className="flex-1 mr-4">
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-xl font-bold text-gray-800 w-full border-b-2 border-blue-300 focus:border-blue-500 outline-none bg-transparent"
                  placeholder="输入标题..."
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleStartEdit}
                    className="text-blue-500 hover:text-blue-700 text-sm px-3 py-1 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                    title="编辑媒体信息"
                  >
                    ✏️ 编辑
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-50 transition-colors"
                    title="删除媒体文件"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> 删除
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="text-green-500 hover:text-green-700 text-sm px-3 py-1 border border-green-300 rounded hover:bg-green-50 transition-colors disabled:opacity-50"
                    title="保存修改"
                  >
                    {isSaving ? '保存中...' : '💾 保存'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                    title="取消编辑"
                  >
                    <X className="w-4 h-4 mr-1" /> 取消
                  </button>
                </>
              )}
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-slate-700 hover:bg-red-500 text-gray-600 dark:text-gray-300 hover:text-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg group"
                title="关闭"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Media container */}
          <div
            className="bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden"
            style={getContainerStyle(imageDimensions)}
          >
            {item.mediaType === 'IMAGE' ? (
              <Image
                src={item.url}
                alt={item.title}
                className="w-full h-full object-contain"
                width={imageDimensions?.width || 800}
                height={imageDimensions?.height || 600}
                onLoad={handleImageLoad}
                onError={(e) => {
                  console.error('Modal image failed to load:', item.url)
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : item.mediaType === 'VIDEO' ? (
              <video
                src={item.url}
                poster={item.thumbnailUrl}
                controls
                className="w-full h-full object-contain"
                style={{ maxHeight: '70vh' }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2">❓</div>
                <p className="text-gray-600">未知媒体类型</p>
                <p className="text-sm text-gray-500">{item.url}</p>
              </div>
            )}

            {/* Error fallback */}
            <div className="hidden w-full h-full flex items-center justify-center bg-red-50">
              <div className="text-center">
                <div className="text-4xl mb-2">⚠️</div>
                <p className="text-red-600 mb-2">图片加载失败</p>
                <p className="text-sm text-gray-500 break-all px-4">{item.url}</p>
                <button
                  onClick={() => window.open(item.url, '_blank')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  尝试在新窗口打开
                </button>
              </div>
            </div>
          </div>

          {/* Info section */}
          <div className="space-y-3">
            <div className="flex items-center flex-wrap gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {item.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {item.age}
              </span>
              {item.mediaType === 'VIDEO' && item.duration && (
                <span className="flex items-center gap-1">
                  <Film className="w-4 h-4" /> {formatDuration(item.duration)}
                </span>
              )}
              {imageDimensions && (
                <span>📐 {imageDimensions.width} × {imageDimensions.height}</span>
              )}
            </div>

            {/* Description section */}
            {!isEditing ? (
              <div>
                <p className="text-gray-700 text-sm font-medium mb-1">描述：</p>
                <p className="text-gray-700">
                  {item.description || '暂无描述'}
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">描述：</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  rows={3}
                  placeholder="描述这个媒体文件的故事..."
                />
              </div>
            )}

            <div className="text-xs text-gray-500">
              {item.format && <span>格式: {item.format}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

