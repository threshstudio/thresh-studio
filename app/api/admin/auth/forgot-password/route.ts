import { NextResponse } from "next/server"
import { AdminUser } from "@/models/AdminUser"
import { VerificationToken } from "@/models/VerificationToken"
import dbConnect from "@/lib/db"
import crypto from "crypto"
import { PASSWORD_RESET_OTP_EXPIRY } from "@/lib/constants"
import { sendPasswordResetOTP } from "@/lib/email"
import { forgotPasswordSchema } from "@/lib/schemas"

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

    await dbConnect()

    const user = await AdminUser.findOne({ email: email.toLowerCase() })

    // Even if user is not found, we return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, an OTP has been sent.",
      })
    }

    // Generate 6-digit OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString()

    // Hash it for secure storage
    const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex")

    // Delete any existing reset tokens for this user
    await VerificationToken.deleteMany({
      identifier: user.id,
      type: "PASSWORD_RESET",
    })

    await VerificationToken.create({
      identifier: user.id,
      token: hashedOtp,
      type: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() + PASSWORD_RESET_OTP_EXPIRY),
    })

    // Send email with RAW OTP
    await sendPasswordResetOTP(user.email, rawOtp)

    return NextResponse.json({
      success: true,
      message: "If an account exists, an OTP has been sent.",
    })
  } catch (error) {
    console.error("[POST /api/admin/auth/forgot-password]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
