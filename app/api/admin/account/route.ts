import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { AdminUser } from "@/models/AdminUser"
import dbConnect from "@/lib/db"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { updateEmailSchema, updatePasswordSchema } from "@/lib/schemas"
import { VerificationToken } from "@/models/VerificationToken"
import { EMAIL_VERIFICATION_EXPIRY } from "@/lib/constants"
import {
  sendEmailChangeVerification,
  sendEmailChangeAlert,
  sendPasswordChangeAlert,
} from "@/lib/email"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()

    await dbConnect()
    const user = session.user.id
      ? await AdminUser.findById(session.user.id)
      : await AdminUser.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (body.type === "email") {
      const parsed = updateEmailSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid data", details: parsed.error.format() },
          { status: 400 }
        )
      }

      // Update pending email instead of immediate change
      user.pendingEmail = parsed.data.email
      await user.save()

      // Generate verification token
      const rawToken = crypto.randomBytes(32).toString("hex")
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex")

      await VerificationToken.create({
        identifier: user.id,
        token: hashedToken,
        type: "EMAIL_CHANGE",
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY),
      })

      // Send emails
      await Promise.all([
        sendEmailChangeVerification(parsed.data.email, rawToken),
        sendEmailChangeAlert(user.email, parsed.data.email),
      ])

      return NextResponse.json({
        success: true,
        message: "Verification email sent to new address.",
      })
    } else if (body.type === "password") {
      const parsed = updatePasswordSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid data", details: parsed.error.format() },
          { status: 400 }
        )
      }

      const { currentPassword, newPassword } = parsed.data

      if (!user.password) {
        return NextResponse.json({ error: "Password not set" }, { status: 400 })
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect current password" },
          { status: 400 }
        )
      }

      // Update password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
      await user.save()

      // Send notification
      await sendPasswordChangeAlert(user.email)

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: "Invalid update type" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[PATCH /api/admin/account]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
