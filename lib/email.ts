import { Resend } from "resend"
import EmailChangeVerification from "@/components/emails/EmailChangeVerification"
import EmailChangeAlert from "@/components/emails/EmailChangeAlert"
import PasswordChangeAlert from "@/components/emails/PasswordChangeAlert"
import PasswordResetOTP from "@/components/emails/PasswordResetOTP"

const resend = new Resend(process.env.RESEND_API_KEY || "re_test")
const sender =
  process.env.EMAIL_FROM || "Thresh Studio <admin@threshstudio.com>"
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

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

export const sendPasswordChangeAlert = async (email: string) => {
  return resend.emails.send({
    from: sender,
    to: email,
    subject: "Security Alert: Password Changed",
    react: PasswordChangeAlert({ email, date: new Date() }),
  })
}

export const sendPasswordResetOTP = async (email: string, otp: string) => {
  return resend.emails.send({
    from: sender,
    to: email,
    subject: "Password Reset OTP",
    react: PasswordResetOTP({ otp }),
  })
}
