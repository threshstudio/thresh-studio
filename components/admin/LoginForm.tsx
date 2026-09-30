"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("admin-login", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        toast.error("Invalid email or password")
        setIsLoading(false)
      } else {
        toast.success("Login successful! Redirecting...")
        router.push("/admin/dashboard")
        router.refresh()
      }
    } catch {
      toast.error("An unexpected error occurred")
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
            disabled={isLoading}
            className="block w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3.5 text-neutral-100 transition-all placeholder:text-neutral-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 sm:text-sm"
            placeholder="admin@threshstudio.com"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-medium tracking-wider text-neutral-400 uppercase"
            >
              Password
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-xs font-medium text-brand-500 transition-colors hover:text-brand-400"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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
            Authenticating...
          </>
        ) : (
          <>
            Sign In Securely
            <ArrowRight className="ml-2 h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  )
}
