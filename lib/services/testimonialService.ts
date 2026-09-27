/**
 * testimonialService.ts
 *
 * Single source of truth for all Testimonial DB queries.
 * Used by API routes and server components.
 */
import dbConnect from "@/lib/db"
import { Testimonial } from "@/models/Testimonial"
import { TestimonialFormValues } from "@/lib/schemas"
import { serializeTestimonial } from "@/lib/serializers"

export async function getTestimonials(options: { activeOnly?: boolean } = {}) {
  await dbConnect()
  const query = options.activeOnly ? { isActive: true } : {}
  const testimonials = await Testimonial.find(query)
    .sort({ order: 1, createdAt: -1 })
    .lean()
  return testimonials.map(serializeTestimonial)
}

export async function getTestimonialById(id: string) {
  await dbConnect()
  const testimonial = await Testimonial.findById(id).lean()
  return serializeTestimonial(testimonial)
}

export async function createTestimonial(data: TestimonialFormValues) {
  await dbConnect()
  const testimonial = new Testimonial(data)
  await testimonial.save()
  return serializeTestimonial(testimonial.toJSON())
}

export async function updateTestimonial(
  id: string,
  data: Partial<TestimonialFormValues>
) {
  await dbConnect()
  const testimonial = await Testimonial.findByIdAndUpdate(id, data, {
    new: true,
  }).lean()
  return serializeTestimonial(testimonial)
}

export async function deleteTestimonial(id: string) {
  await dbConnect()
  await Testimonial.findByIdAndDelete(id)
  return { success: true }
}
