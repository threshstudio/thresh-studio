"use client"

import React, { useState } from "react"
import { Mail, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/admin/auth/ForgotPasswordForm"

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleSuccess = (email: string) => {
    setIsSuccess(true)
    setTimeout(() => {
      router.push(`/admin/reset-password?email=${encodeURIComponent(email)}`)
    }, 2000)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 p-4">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-10">
        <div className="text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 shadow-lg shadow-brand-500/10">
            {isSuccess ? (
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            ) : (
              <Mail className="h-8 w-8 text-brand-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isSuccess ? "Check Your Email" : "Forgot Password?"}
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            {isSuccess
              ? "We've sent a 6-digit OTP to your email address."
              : "Enter your admin email address and we'll send you an OTP to reset your password."}
          </p>
        </div>

        {!isSuccess && <ForgotPasswordForm onSuccess={handleSuccess} />}

        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-white"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
