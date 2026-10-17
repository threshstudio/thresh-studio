"use client"

import React, { Suspense } from "react"
import { Loader2, Key } from "lucide-react"
import Link from "next/link"
import { ResetPasswordForm } from "@/components/admin/auth/ResetPasswordForm"

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 p-4">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-10">
        <div className="text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 shadow-lg shadow-brand-500/10">
            <Key className="h-8 w-8 text-brand-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Set New Password
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Enter the OTP sent to your email and your new password.
          </p>
        </div>

        <Suspense
          fallback={
            <Loader2 className="mx-auto mt-8 h-8 w-8 animate-spin text-brand-500" />
          }
        >
          <ResetPasswordForm />
        </Suspense>

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
