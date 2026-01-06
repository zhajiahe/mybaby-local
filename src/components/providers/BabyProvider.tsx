'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface Baby {
  id: string
  name: string
  birthDate: string
  birthTime?: string
  gender: string
  avatar?: string
  birthWeight?: number
  birthHeight?: number
  birthHeadCircumference?: number
  bloodType?: string
  allergies?: string
  notes?: string
  _count?: {
    growthRecords: number
    milestones: number
    mediaItems: number
  }
}

interface BabyContextType {
  babies: Baby[]
  currentBaby: Baby | null
  currentBabyId: string | null
  loading: boolean
  error: string | null
  switchBaby: (id: string) => void
  refreshBabies: () => Promise<void>
  refreshCurrentBaby: () => Promise<void>
  createBaby: (data: Omit<Baby, 'id' | '_count'>) => Promise<Baby>
  updateBaby: (data: Partial<Baby> & { id: string }) => Promise<Baby>
}

const BabyContext = createContext<BabyContextType | null>(null)

const STORAGE_KEY = 'currentBabyId'

export function BabyProvider({ children }: { children: ReactNode }) {
  const [babies, setBabies] = useState<Baby[]>([])
  // 从 localStorage 初始化，避免竞态条件
  const [currentBabyId, setCurrentBabyId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY)
    }
    return null
  })
  const [currentBaby, setCurrentBaby] = useState<Baby | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all babies
  const refreshBabies = useCallback(async () => {
    try {
      setError(null) // Clear previous errors
      const response = await fetch('/api/babies')
      if (!response.ok) {
        // If fetch fails, set empty babies array - user can still add babies
        console.warn('Failed to fetch babies, starting with empty list')
        setBabies([])
        return []
      }
      const data = await response.json()
      setBabies(Array.isArray(data) ? data : [])

      // If no current baby selected, select the first one
      if (!currentBabyId && data.length > 0) {
        const firstBabyId = data[0].id
        setCurrentBabyId(firstBabyId)
        localStorage.setItem(STORAGE_KEY, firstBabyId)
      }

      // If saved baby ID is no longer valid, select first baby
      if (currentBabyId && data.length > 0) {
        const exists = data.some((b: Baby) => b.id === currentBabyId)
        if (!exists) {
          const firstBabyId = data[0].id
          setCurrentBabyId(firstBabyId)
          localStorage.setItem(STORAGE_KEY, firstBabyId)
        }
      }

      return data
    } catch (err) {
      // Network error or other issues - still allow app to function
      console.error('Error fetching babies:', err)
      setBabies([])
      return []
    }
  }, [currentBabyId])

  // Fetch current baby details
  const refreshCurrentBaby = useCallback(async () => {
    if (!currentBabyId) {
      setCurrentBaby(null)
      return
    }

    try {
      const response = await fetch(`/api/baby?id=${currentBabyId}`)
      if (!response.ok) {
        console.warn('Failed to fetch baby details')
        setCurrentBaby(null)
        return
      }
      const data = await response.json()
      setCurrentBaby(data)
    } catch (err) {
      console.error('Error fetching baby details:', err)
      setCurrentBaby(null)
    }
  }, [currentBabyId])

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        await refreshBabies()
      } finally {
        setLoading(false)
      }
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch current baby when ID changes
  useEffect(() => {
    if (currentBabyId) {
      refreshCurrentBaby()
    } else {
      setCurrentBaby(null)
    }
  }, [currentBabyId, refreshCurrentBaby])

  const switchBaby = useCallback((id: string) => {
    setCurrentBabyId(id)
    localStorage.setItem(STORAGE_KEY, id)
  }, [])

  const createBaby = useCallback(async (data: Omit<Baby, 'id' | '_count'>) => {
    const response = await fetch('/api/baby', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create baby')
    const newBaby = await response.json()

    // Refresh list and switch to new baby
    await refreshBabies()
    switchBaby(newBaby.id)

    return newBaby
  }, [refreshBabies, switchBaby])

  const updateBaby = useCallback(async (data: Partial<Baby> & { id: string }) => {
    const response = await fetch('/api/baby', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update baby')
    const updatedBaby = await response.json()

    // Refresh both list and current baby
    await Promise.all([refreshBabies(), refreshCurrentBaby()])

    return updatedBaby
  }, [refreshBabies, refreshCurrentBaby])

  return (
    <BabyContext.Provider
      value={{
        babies,
        currentBaby,
        currentBabyId,
        loading,
        error,
        switchBaby,
        refreshBabies,
        refreshCurrentBaby,
        createBaby,
        updateBaby,
      }}
    >
      {children}
    </BabyContext.Provider>
  )
}

export function useBabyContext() {
  const context = useContext(BabyContext)
  if (!context) {
    throw new Error('useBabyContext must be used within a BabyProvider')
  }
  return context
}

