import { NextResponse } from "next/server"
import { newsletterUnsubscribeSchema } from "@/lib/schemas"
import { unsubscribeUser } from "@/lib/services/newsletterService"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = newsletterUnsubscribeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid unsubscribe parameters." },
        { status: 400 }
      )
    }

    const result = await unsubscribeUser(parsed.data)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("[POST /api/public/newsletter/unsubscribe]", error)
    return NextResponse.json(
      { error: "Failed to process unsubscribe request." },
      { status: 500 }
    )
  }
}
