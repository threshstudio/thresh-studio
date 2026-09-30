import { NextResponse } from "next/server"
import { AdminUser } from "@/models/AdminUser"
import { VerificationToken } from "@/models/VerificationToken"
import dbConnect from "@/lib/db"
import crypto from "crypto"
import { verifyEmailSchema } from "@/lib/schemas"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = verifyEmailSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { token } = parsed.data

    await dbConnect()

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const verificationToken = await VerificationToken.findOne({
      token: hashedToken,
      type: "EMAIL_CHANGE",
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      )
    }

    if (verificationToken.expiresAt < new Date()) {
      await VerificationToken.deleteOne({ _id: verificationToken._id })
      return NextResponse.json({ error: "Token has expired" }, { status: 400 })
    }

    const user = await AdminUser.findById(verificationToken.identifier)

    if (!user || !user.pendingEmail) {
      return NextResponse.json(
        { error: "User not found or no pending email change" },
        { status: 400 }
      )
    }

    // Update email and clear pendingEmail
    user.email = user.pendingEmail
    user.pendingEmail = undefined
    await user.save()

    // Delete the token
    await VerificationToken.deleteOne({ _id: verificationToken._id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[POST /api/admin/verify-email]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
