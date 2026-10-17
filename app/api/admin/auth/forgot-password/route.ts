import { NextResponse } from "next/server"
import { forgotPasswordSchema } from "@/lib/schemas"
import { requestPasswordResetOTP } from "@/lib/services/accountService"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { email } = parsed.data
    const result = await requestPasswordResetOTP(email)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[POST /api/admin/auth/forgot-password]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
