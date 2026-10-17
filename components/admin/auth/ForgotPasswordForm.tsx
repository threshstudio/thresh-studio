"use client"

import React, { useState } from "react"
import { Loader2, ArrowRight } from "lucide-react"

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    try {
      await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      onSuccess(email)
    } catch (error) {
      console.error(error)
      onSuccess(email)
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
  )
}
