'use client'

import Image from 'next/image'
import { Calendar } from 'lucide-react'
import { MediaItem } from './types'
import { formatDuration } from './utils'

interface PhotoGridProps {
  items: MediaItem[]
  onItemClick: (item: MediaItem) => void
  groupByMonth?: boolean
}

export function PhotoGrid({ items, onItemClick, groupByMonth = true }: PhotoGridProps) {
  if (!groupByMonth) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </div>
    )
  }

  // Group by month
  const grouped = items.reduce((acc, item) => {
    const month = item.date.substring(0, 7)
    if (!acc[month]) acc[month] = []
    acc[month].push(item)
    return acc
  }, {} as Record<string, MediaItem[]>)

  return (
    <div className="space-y-8">
      {Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([month, monthItems]) => (
          <div key={month} className="space-y-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              {month}
              <span className="ml-2 text-sm text-text-muted font-normal">
                ({monthItems.length} 个媒体)
              </span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {monthItems
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((item) => (
                  <MediaCard key={item.id} item={item} onClick={() => onItemClick(item)} />
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}

interface MediaCardProps {
  item: MediaItem
  onClick: () => void
}

function MediaCard({ item, onClick }: MediaCardProps) {
  return (
    <div onClick={onClick} className="cursor-pointer group">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow relative">
        {item.mediaType === 'IMAGE' ? (
          <Image
            src={item.url}
            alt={item.title}
            className="w-full h-full object-cover"
            width={500}
            height={500}
            onError={(e) => {
              console.error('Image failed to load:', item.url)
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : item.mediaType === 'VIDEO' ? (
          <>
            <Image
              src={item.thumbnailUrl || '/placeholder-video-thumb.svg'}
              alt={item.title + ' thumbnail'}
              className="w-full h-full object-cover"
              width={500}
              height={500}
              onError={(e) => {
                console.error('Video thumbnail failed to load:', item.thumbnailUrl)
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity">
              <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {item.duration && (
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                {formatDuration(item.duration)}
              </span>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">❓</div>
              <p className="text-xs text-gray-600 px-2">{item.title}</p>
            </div>
          </div>
        )}

        {/* Error fallback */}
        <div className="hidden w-full h-full flex items-center justify-center bg-red-50">
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <p className="text-xs text-red-600 px-2">图片加载失败</p>
            <p className="text-xs text-gray-500 px-2 mt-1">{item.title}</p>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-sm font-medium text-gray-800 truncate">
          {item.title || <span className="text-gray-400 italic"> </span>}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{item.date}</span>
          <span>{item.age}</span>
        </div>
      </div>
    </div>
  )
}


