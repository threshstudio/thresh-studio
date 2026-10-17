/**
 * @file project.ts
 * @description Domain types for portfolio project items and case studies.
 */

export interface ProjectStat {
  label: string
  value: string
}

export interface ProjectItem {
  id: string
  title: string
  slug: string
  category: string
  year: string
  tagline: string
  description: string
  services: string[]
  deliverables: string[]
  challenge: string
  approach: string
  outcome: string
  videoUrl?: string
  gallery: string[]
  stats: ProjectStat[]
  isPublished: boolean
  order: number
  createdAt: string | null
  updatedAt: string | null
}
