import dbConnect from "@/lib/db"
import { AdminUser } from "@/models/AdminUser"
import { serializeAdminUser } from "@/lib/serializers"

/**
 * Fetch an admin user by ID and return a serialized plain object.
 */
export async function getAdminUserById(id: string) {
  await dbConnect()
  const user = await AdminUser.findById(id).lean()
  return serializeAdminUser(user)
}

/**
 * Fetch an admin user by email and return a serialized plain object.
 */
export async function getAdminUserByEmail(email: string) {
  await dbConnect()
  const user = await AdminUser.findOne({ email }).lean()
  return serializeAdminUser(user)
}

import crypto from "crypto"
import { VerificationToken } from "@/models/VerificationToken"

/**
 * Verifies an email change token and updates the user's email.
 */
export async function verifyEmailToken(token: string) {
  await dbConnect()

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  const verificationToken = await VerificationToken.findOne({
    token: hashedToken,
    type: "EMAIL_CHANGE",
  })

  if (!verificationToken) {
    throw new Error("Invalid or expired token")
  }

  if (verificationToken.expiresAt < new Date()) {
    await VerificationToken.deleteOne({ _id: verificationToken._id })
    throw new Error("Token has expired")
  }

  const user = await AdminUser.findById(verificationToken.identifier)

  if (!user || !user.pendingEmail) {
    throw new Error("User not found or no pending email change")
  }

  // Update email and clear pendingEmail
  user.email = user.pendingEmail
  user.pendingEmail = undefined
  await user.save()

  // Delete the token
  await VerificationToken.deleteOne({ _id: verificationToken._id })

  return serializeAdminUser(user)
}
