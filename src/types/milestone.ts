/**
 * Milestone related types
 */

export interface Milestone {
  id: string
  babyId: string
  date: string
  title: string
  description?: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface MilestoneFormData {
  babyId: string
  date: string
  title: string
  description?: string
  tags: string[]
}

export interface MilestoneWithBaby extends Milestone {
  baby: {
    name: string
  }
}


