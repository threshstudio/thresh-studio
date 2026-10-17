import { NextResponse } from "next/server"
import { resetPasswordSchema } from "@/lib/schemas"
import { resetPasswordWithOTP } from "@/lib/services/accountService"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { email, otp, newPassword } = parsed.data

    try {
      await resetPasswordWithOTP({ email, otp, newPassword })
      return NextResponse.json({ success: true })
    } catch (err: unknown) {
      const error = err as Error
      if (error.message === "INVALID_REQUEST") {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
      }
      if (error.message === "INVALID_OR_EXPIRED_OTP") {
        return NextResponse.json(
          { error: "Invalid or expired OTP" },
          { status: 400 }
        )
      }
      if (error.message === "OTP_EXPIRED") {
        return NextResponse.json(
          { error: "OTP has expired. Please request a new one." },
          { status: 400 }
        )
      }
      throw err
    }
  } catch (error) {
    console.error("[POST /api/admin/auth/reset-password]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
