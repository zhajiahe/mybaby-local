'use client'

import { useRef } from 'react'
import { Upload, Image as ImageIcon, Film } from 'lucide-react'
import { UploadFileItem } from './types'

interface PhotoUploaderProps {
  isOpen: boolean
  onClose: () => void
  uploadFiles: UploadFileItem[]
  uploadDate: string
  isUploading: boolean
  uploadError: string | null
  onFileSelect: (files: FileList | null) => void
  onDateChange: (date: string) => void
  onTitleChange: (id: string, title: string) => void
  onRemoveFile: (id: string) => void
  onClearAll: () => void
  onUpload: () => void
}

export function PhotoUploader({
  isOpen,
  onClose,
  uploadFiles,
  uploadDate,
  isUploading,
  uploadError,
  onFileSelect,
  onDateChange,
  onTitleChange,
  onRemoveFile,
  onClearAll,
  onUpload,
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-t-2xl md:rounded-xl w-full md:max-w-2xl p-4 md:p-6 max-h-[85vh] md:max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">上传媒体文件</h3>
          <button
            onClick={() => {
              if (isUploading) return
              onClose()
            }}
            className="text-gray-400 hover:text-gray-600 text-2xl p-1"
            disabled={isUploading}
          >
            ×
          </button>
        </div>

        {uploadError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">发生错误: </strong>
            <span className="block sm:inline">{uploadError}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* File selection area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择文件 (支持多选，图片/视频)
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer"
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                e.currentTarget.classList.add('border-teal-400', 'bg-teal-50')
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                e.stopPropagation()
                e.currentTarget.classList.remove('border-teal-400', 'bg-teal-50')
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                e.currentTarget.classList.remove('border-teal-400', 'bg-teal-50')
                onFileSelect(e.dataTransfer.files)
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => onFileSelect(e.target.files)}
                disabled={isUploading}
              />
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <p className="text-text-primary mb-1 font-medium">拖拽文件到这里，或点击选择</p>
              <p className="text-xs text-text-muted">支持图片和视频，单个文件最大 200MB</p>
            </div>
          </div>

          {/* Date setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              拍摄日期 <span className="text-gray-400 font-normal">(应用于所有文件)</span>
            </label>
            <input
              type="date"
              value={uploadDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="input-field"
              disabled={isUploading}
            />
          </div>

          {/* File list */}
          {uploadFiles.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  已选择 {uploadFiles.length} 个文件
                </label>
                {!isUploading && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    清空全部
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                {uploadFiles.map((item) => (
                  <FileItem
                    key={item.id}
                    item={item}
                    isUploading={isUploading}
                    onTitleChange={onTitleChange}
                    onRemove={onRemoveFile}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upload button */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onUpload}
              className="btn-primary flex-1"
              disabled={isUploading || uploadFiles.length === 0}
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  上传中...
                </span>
              ) : (
                `上传 ${uploadFiles.length || ''} 个文件`
              )}
            </button>
            <button
              onClick={() => {
                if (isUploading) return
                onClose()
              }}
              className={`btn-secondary flex-1 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isUploading}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FileItemProps {
  item: UploadFileItem
  isUploading: boolean
  onTitleChange: (id: string, title: string) => void
  onRemove: (id: string) => void
}

function FileItem({ item, isUploading, onTitleChange, onRemove }: FileItemProps) {
  const statusClasses = {
    success: 'bg-green-50 border border-green-200',
    error: 'bg-red-50 border border-red-200',
    uploading: 'bg-blue-50 border border-blue-200',
    pending: 'bg-white border border-gray-200',
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${statusClasses[item.status]}`}>
      {/* File type icon */}
      <div className="flex-shrink-0">
        {item.file.type.startsWith('image/') ? (
          <ImageIcon className="w-6 h-6 text-blue-500" />
        ) : (
          <Film className="w-6 h-6 text-purple-500" />
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{item.file.name}</p>
        <p className="text-xs text-gray-500">
          {(item.file.size / (1024 * 1024)).toFixed(2)} MB
          {item.file.type.startsWith('video/') && ' · 视频将自动生成封面'}
        </p>

        {/* Title input */}
        {item.status === 'pending' && (
          <input
            type="text"
            value={item.title}
            onChange={(e) => onTitleChange(item.id, e.target.value)}
            placeholder="标题 (可选)"
            className="mt-2 w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            disabled={isUploading}
          />
        )}

        {/* Progress bar */}
        {item.status === 'uploading' && (
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-300"
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <p className="text-xs text-teal-600 mt-1">
              {item.progress < 50 ? '上传中...' : item.progress < 90 ? '处理中...' : '即将完成...'} {item.progress}%
            </p>
          </div>
        )}

        {/* Success status */}
        {item.status === 'success' && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <span>✓</span> 上传成功
          </p>
        )}

        {/* Error status */}
        {item.status === 'error' && (
          <p className="text-xs text-red-600 mt-1">✗ {item.errorMessage}</p>
        )}
      </div>

      {/* Remove button */}
      {item.status === 'pending' && !isUploading && (
        <button
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-500 flex-shrink-0 p-1"
        >
          ✕
        </button>
      )}
    </div>
  )
}

