import { NextResponse } from "next/server"
import { getTestimonials } from "@/lib/services/testimonialService"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const testimonials = await getTestimonials({ activeOnly: true })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("[GET /api/public/testimonials]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
