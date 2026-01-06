'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Baby, Plus, Check } from 'lucide-react'
import { useBabyContext } from '@/components/providers/BabyProvider'

interface BabySelectorProps {
  onAddBaby?: () => void
}

export function BabySelector({ onAddBaby }: BabySelectorProps) {
  const { babies, currentBaby, switchBaby, loading } = useBabyContext()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-teal-500 rounded-full animate-spin" />
        <span>加载中...</span>
      </div>
    )
  }

  if (babies.length === 0) {
    return (
      <button
        onClick={onAddBaby}
        className="flex items-center gap-2 px-3 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>添加宝宝</span>
      </button>
    )
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Baby className="w-4 h-4 text-teal-500" />
        <span className="max-w-[120px] truncate">{currentBaby?.name || '选择宝宝'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {babies.map((baby) => (
            <button
              key={baby.id}
              onClick={() => {
                switchBaby(baby.id)
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="flex-1 text-left truncate">{baby.name}</span>
              {currentBaby?.id === baby.id && (
                <Check className="w-4 h-4 text-teal-500" />
              )}
            </button>
          ))}

          {onAddBaby && (
            <>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => {
                  onAddBaby()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-teal-600 hover:bg-teal-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>添加新宝宝</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

