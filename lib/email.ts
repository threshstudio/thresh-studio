/**
 * @file email.ts
 * @description Email delivery client and transactional email dispatch routines via Resend.
 */

import { Resend } from "resend"
import EmailChangeVerification from "@/components/emails/EmailChangeVerification"
import EmailChangeAlert from "@/components/emails/EmailChangeAlert"
import PasswordChangeAlert from "@/components/emails/PasswordChangeAlert"
import PasswordResetOTP from "@/components/emails/PasswordResetOTP"
import NewsletterTemplate from "@/components/emails/NewsletterTemplate"
import WelcomeSubscriberEmail from "@/components/emails/WelcomeSubscriberEmail"

const resend = new Resend(process.env.RESEND_API_KEY || "re_test")
const sender =
  process.env.EMAIL_FROM || "Thresh Studio <admin@threshstudio.com>"
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

/**
 * Sends an email change verification link to the prospective new email address.
 */
export const sendEmailChangeVerification = async (
  newEmail: string,
  token: string
) => {
  const verificationLink = `${baseUrl}/admin/verify-email?token=${token}`

  return resend.emails.send({
    from: sender,
    to: newEmail,
    subject: "Verify your new email address",
    react: EmailChangeVerification({ verificationLink, newEmail }),
  })
}

/**
 * Sends a security notification to the current email address alerting of a change attempt.
 */
export const sendEmailChangeAlert = async (
  oldEmail: string,
  newEmail: string
) => {
  return resend.emails.send({
    from: sender,
    to: oldEmail,
    subject: "Security Alert: Email change requested",
    react: EmailChangeAlert({ oldEmail, newEmail, date: new Date() }),
  })
}

/**
 * Dispatches an alert confirming that the account password has been modified.
 */
export const sendPasswordChangeAlert = async (email: string) => {
  return resend.emails.send({
    from: sender,
    to: email,
    subject: "Security Alert: Password Changed",
    react: PasswordChangeAlert({ email, date: new Date() }),
  })
}

/**
 * Sends a one-time numeric passcode for password recovery.
 */
export const sendPasswordResetOTP = async (email: string, otp: string) => {
  return resend.emails.send({
    from: sender,
    to: email,
    subject: "Password Reset OTP",
    react: PasswordResetOTP({ otp }),
  })
}

/**
 * Dispatches the welcome and confirmation email to a newly registered newsletter subscriber.
 */
export const sendWelcomeSubscriberEmail = async (
  email: string,
  unsubscribeToken: string
) => {
  const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(email)}`

  const result = await resend.emails.send({
    from: sender,
    to: email,
    subject: "Welcome to Thresh Studio",
    react: WelcomeSubscriberEmail({ unsubscribeUrl }),
  })

  if (result.error) {
    console.error(
      "[SERVICE /lib/email/sendWelcomeSubscriberEmail]",
      result.error
    )
    throw new Error(result.error.message || "Failed to send email via Resend")
  }

  return result
}

/**
 * Sends a rich HTML newsletter dispatch to a single recipient with a secure unsubscribe token.
 */
export const sendNewsletterBroadcastEmail = async ({
  to,
  subject,
  previewText,
  contentHtml,
  unsubscribeToken,
}: {
  to: string
  subject: string
  previewText?: string
  contentHtml: string
  unsubscribeToken?: string
}) => {
  const unsubscribeUrl = unsubscribeToken
    ? `${baseUrl}/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(to)}`
    : `${baseUrl}/unsubscribe`

  return resend.emails.send({
    from: sender,
    to,
    subject,
    react: NewsletterTemplate({
      subject,
      previewText,
      contentHtml,
      unsubscribeUrl,
    }),
  })
}
