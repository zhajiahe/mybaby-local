/**
 * Growth record related types
 */

export interface GrowthRecord {
  id: string
  babyId: string
  date: string
  weight?: number | null
  height?: number | null
  headCircumference?: number | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface GrowthRecordFormData {
  babyId: string
  date: string
  weight?: number
  height?: number
  headCircumference?: number
  notes?: string
}

export interface GrowthStats {
  latestWeight?: number
  latestHeight?: number
  latestHeadCircumference?: number
  weightChange?: number
  heightChange?: number
  recordCount: number
}

