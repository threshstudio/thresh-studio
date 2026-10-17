import { NextResponse } from "next/server"
import {
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/services/testimonialService"
import { testimonialSchema } from "@/lib/schemas"
import { auth } from "@/auth"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const testimonial = await getTestimonialById(id)
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error("[GET /api/admin/testimonials/[id]]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const parsed = testimonialSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const testimonial = await updateTestimonial(id, parsed.data)
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error("[PUT /api/admin/testimonials/[id]]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await deleteTestimonial(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/admin/testimonials/[id]]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
