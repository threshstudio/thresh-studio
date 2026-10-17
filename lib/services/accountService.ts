/**
 * @file accountService.ts
 * @description Domain service managing admin credentials, email changes, and password recovery.
 */

import crypto from "crypto"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/db"
import { AdminUser } from "@/models/AdminUser"
import { VerificationToken } from "@/models/VerificationToken"
import {
  EMAIL_VERIFICATION_EXPIRY,
  PASSWORD_RESET_OTP_EXPIRY,
} from "@/lib/constants"
import {
  sendEmailChangeVerification,
  sendEmailChangeAlert,
  sendPasswordChangeAlert,
  sendPasswordResetOTP,
} from "@/lib/email"

/**
 * Initiates an email change process for an authenticated admin user.
 */
export async function requestEmailChange({
  userId,
  userEmail,
  newEmail,
}: {
  userId?: string
  userEmail: string
  newEmail: string
}) {
  await dbConnect()

  const user = userId
    ? await AdminUser.findById(userId)
    : await AdminUser.findOne({ email: userEmail })

  if (!user) {
    throw new Error("USER_NOT_FOUND")
  }

  // Set pending email (using null-safe structure)
  user.pendingEmail = newEmail
  await user.save()

  // Generate verification token
  const rawToken = crypto.randomBytes(32).toString("hex")
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")

  await VerificationToken.create({
    identifier: user.id,
    token: hashedToken,
    type: "EMAIL_CHANGE",
    expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY),
  })

  // Send notification & verification emails
  await Promise.all([
    sendEmailChangeVerification(newEmail, rawToken),
    sendEmailChangeAlert(user.email, newEmail),
  ])

  return { success: true, message: "Verification email sent to new address." }
}

/**
 * Changes password for an authenticated admin user after verifying current password.
 */
export async function changeAdminPassword({
  userId,
  userEmail,
  currentPassword,
  newPassword,
}: {
  userId?: string
  userEmail: string
  currentPassword: string
  newPassword: string
}) {
  await dbConnect()

  const user = userId
    ? await AdminUser.findById(userId)
    : await AdminUser.findOne({ email: userEmail })

  if (!user) {
    throw new Error("USER_NOT_FOUND")
  }

  if (!user.password) {
    throw new Error("PASSWORD_NOT_SET")
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if (!isMatch) {
    throw new Error("INCORRECT_PASSWORD")
  }

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(newPassword, salt)
  await user.save()

  await sendPasswordChangeAlert(user.email)
  return { success: true }
}

/**
 * Initiates password recovery by issuing a 6-digit OTP.
 */
export async function requestPasswordResetOTP(email: string) {
  await dbConnect()

  const user = await AdminUser.findOne({ email: email.toLowerCase() })

  // Return success even if not found to prevent user enumeration
  if (!user) {
    return {
      success: true,
      message: "If an account exists, an OTP has been sent.",
    }
  }

  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString()
  const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex")

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

  await sendPasswordResetOTP(user.email, rawOtp)

  return {
    success: true,
    message: "If an account exists, an OTP has been sent.",
  }
}

/**
 * Resets admin password using a verified 6-digit OTP.
 */
export async function resetPasswordWithOTP({
  email,
  otp,
  newPassword,
}: {
  email: string
  otp: string
  newPassword: string
}) {
  await dbConnect()

  const user = await AdminUser.findOne({ email: email.toLowerCase() })
  if (!user) {
    throw new Error("INVALID_REQUEST")
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")

  const verificationToken = await VerificationToken.findOne({
    identifier: user.id,
    token: hashedOtp,
    type: "PASSWORD_RESET",
  })

  if (!verificationToken) {
    throw new Error("INVALID_OR_EXPIRED_OTP")
  }

  if (verificationToken.expiresAt < new Date()) {
    await VerificationToken.deleteOne({ _id: verificationToken._id })
    throw new Error("OTP_EXPIRED")
  }

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(newPassword, salt)
  await user.save()

  await VerificationToken.deleteOne({ _id: verificationToken._id })
  await sendPasswordChangeAlert(user.email)

  return { success: true }
}
