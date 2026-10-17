"use client"

import React, { useState } from "react"
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export function ResetPasswordForm() {
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
