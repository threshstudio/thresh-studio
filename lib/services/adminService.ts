/**
 * @file adminService.ts
 * @description Service layer for retrieving and managing administrative user accounts.
 */

import crypto from "crypto"
import dbConnect from "@/lib/db"
import { AdminUser } from "@/models/AdminUser"
import { VerificationToken } from "@/models/VerificationToken"
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

  // Update email and clear pendingEmail (using null per guideline)
  user.email = user.pendingEmail
  user.pendingEmail = null as unknown as string
  await user.save()

  // Delete the token
  await VerificationToken.deleteOne({ _id: verificationToken._id })

  return serializeAdminUser(user)
}
