import { NextResponse } from "next/server"
import { AdminUser } from "@/models/AdminUser"
import { VerificationToken } from "@/models/VerificationToken"
import dbConnect from "@/lib/db"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { sendPasswordChangeAlert } from "@/lib/email"
import { resetPasswordSchema } from "@/lib/schemas"

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

    await dbConnect()

    const user = await AdminUser.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")

    const verificationToken = await VerificationToken.findOne({
      identifier: user.id,
      token: hashedOtp,
      type: "PASSWORD_RESET",
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      )
    }

    if (verificationToken.expiresAt < new Date()) {
      await VerificationToken.deleteOne({ _id: verificationToken._id })
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      )
    }

    // Update password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    // Delete token
    await VerificationToken.deleteOne({ _id: verificationToken._id })

    // Send confirmation email
    await sendPasswordChangeAlert(user.email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[POST /api/admin/auth/reset-password]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
