"use client"

import React, { useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface NewsletterSubscribeFormProps {
  source?: "footer" | "scroll_prompt" | "admin"
  onSuccess?: () => void
  className?: string
}

export function NewsletterSubscribeForm({
  source = "scroll_prompt",
  onSuccess,
  className = "mt-4 flex items-center gap-2",
}: NewsletterSubscribeFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/public/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Subscription failed.")
        setIsLoading(false)
        return
      }

      setEmail("")
      toast.success(data.message || "Thank you for subscribing!")
      onSuccess?.()
    } catch {
      toast.error("A network error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={isLoading}
          className="w-full rounded-full border border-neutral-800 bg-neutral-900/90 px-4 py-2 font-mono text-xs text-neutral-100 placeholder:text-neutral-500 focus:border-brand-400 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        aria-label="Submit newsletter subscription"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-400 text-neutral-950 transition-transform hover:scale-105 hover:bg-brand-300 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </button>
    </form>
  )
}
