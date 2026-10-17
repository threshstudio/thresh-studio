import { NextResponse } from "next/server"
import {
  getTestimonials,
  createTestimonial,
} from "@/lib/services/testimonialService"
import { testimonialSchema } from "@/lib/schemas"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const testimonials = await getTestimonials()
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("[GET /api/admin/testimonials]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = testimonialSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const testimonial = await createTestimonial(parsed.data)
    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error("[POST /api/admin/testimonials]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
