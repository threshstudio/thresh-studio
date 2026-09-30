"use client"

import React, { useState } from "react"
import { Loader2, Mail, ArrowRight, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setIsSuccess(true)
        // Redirect to reset password with email prepopulated after 2 seconds
        setTimeout(() => {
          router.push(
            `/admin/reset-password?email=${encodeURIComponent(email)}`
          )
        }, 2000)
      } else {
        // Even if it fails, we shouldn't necessarily show it to prevent enumeration,
        // but for now we'll just handle basic errors
        const data = await res.json()
        throw new Error(data.error || "Failed to request reset")
      }
    } catch (error) {
      console.error(error)
      // Usually, show a generic success to prevent email enumeration, but here we can just go to next step
      setIsSuccess(true)
      setTimeout(() => {
        router.push(`/admin/reset-password?email=${encodeURIComponent(email)}`)
      }, 2000)
    } finally {
      setIsLoading(false)
    }
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

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                disabled={isLoading}
                className="block w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3.5 text-neutral-100 transition-all placeholder:text-neutral-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 sm:text-sm"
                placeholder="admin@threshstudio.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center rounded-lg bg-brand-200 px-4 py-4 text-sm font-bold tracking-widest text-neutral-950 uppercase shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-100 hover:shadow-xl hover:shadow-brand-500/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}

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
