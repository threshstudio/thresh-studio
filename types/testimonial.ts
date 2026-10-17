/**
 * @file testimonial.ts
 * @description Domain types for client testimonials and reviews.
 */

export interface TestimonialItem {
  id: string
  quote: string
  author: string
  role: string
  avatar?: string
  rating: number
  isActive: boolean
  order: number
  createdAt: string | null
  updatedAt: string | null
}
