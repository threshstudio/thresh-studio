"use client"

import React, { useState, Suspense } from "react"
import { Loader2, Key, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialEmail = searchParams.get("email") || ""

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const otp = formData.get("otp") as string
    const newPassword = formData.get("newPassword") as string

    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Password reset successfully! You can now log in.")
        router.push("/admin/login")
      } else {
        toast.error(data.error || "Failed to reset password")
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-medium tracking-wider text-neutral-400 uppercase"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={initialEmail}
            disabled={isLoading || !!initialEmail}
            className="block w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3.5 text-neutral-100 transition-all placeholder:text-neutral-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="otp"
            className="mb-1.5 block text-xs font-medium tracking-wider text-neutral-400 uppercase"
          >
            6-Digit OTP
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            required
            maxLength={6}
            disabled={isLoading}
            className="block w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3.5 text-center font-mono tracking-[0.5em] text-neutral-100 transition-all placeholder:text-neutral-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 sm:text-sm"
            placeholder="••••••"
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="mb-1.5 block text-xs font-medium tracking-wider text-neutral-400 uppercase"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              disabled={isLoading}
              className="block w-full rounded-lg border border-neutral-800 bg-neutral-900/50 py-3.5 pr-12 pl-4 text-neutral-100 transition-all placeholder:text-neutral-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 sm:text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-500 transition-colors hover:text-neutral-300 disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative flex w-full items-center justify-center rounded-lg bg-brand-200 px-4 py-4 text-sm font-bold tracking-widest text-neutral-950 uppercase shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-100 hover:shadow-xl hover:shadow-brand-500/30 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Resetting...
          </>
        ) : (
          <>
            Reset Password
            <ArrowRight className="ml-2 h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  )
}

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
