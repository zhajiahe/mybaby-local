/**
 * Baby related types
 */

export interface Baby {
  id: string
  name: string
  birthDate: string
  birthTime?: string | null
  gender: 'boy' | 'girl'
  avatar?: string | null
  birthWeight?: number | null
  birthHeight?: number | null
  birthHeadCircumference?: number | null
  bloodType?: string | null
  allergies?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface BabyWithStats extends Baby {
  _count: {
    growthRecords: number
    milestones: number
    mediaItems: number
  }
}

export interface BabyFormData {
  name: string
  birthDate: string
  birthTime?: string
  gender: 'boy' | 'girl'
  avatar?: string
  birthWeight?: number
  birthHeight?: number
  birthHeadCircumference?: number
  bloodType?: string
  allergies?: string
  notes?: string
}

