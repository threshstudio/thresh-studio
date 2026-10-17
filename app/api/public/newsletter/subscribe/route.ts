import { NextResponse } from "next/server"
import { newsletterSubscribeSchema } from "@/lib/schemas"
import { subscribeUser } from "@/lib/services/newsletterService"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = newsletterSubscribeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid email" },
        { status: 400 }
      )
    }

    const result = await subscribeUser(parsed.data)

    if (!result.success && result.alreadySubscribed) {
      return NextResponse.json(
        { error: result.message, alreadySubscribed: true },
        { status: 409 }
      )
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("[POST /api/public/newsletter/subscribe]", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    )
  }
}
