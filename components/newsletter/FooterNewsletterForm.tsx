"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { ArrowRight, Loader2, Check } from "lucide-react"
import { useOptionalCursor } from "../cursor/CursorContext"

interface FooterNewsletterFormProps {
  className?: string
}

export function FooterNewsletterForm({
  className,
}: FooterNewsletterFormProps = {}) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const cursorCtx = useOptionalCursor()

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
        body: JSON.stringify({ email, source: "footer" }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Subscription failed. Please try again.")
        setIsLoading(false)
        return
      }

      setIsSubscribed(true)
      setEmail("")
      toast.success(data.message || "Thank you for subscribing!")
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "thresh_newsletter_dismissed",
          Date.now().toString()
        )
      }
    } catch {
      toast.error("A network error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <div
        className={`flex items-center gap-3 rounded-full border border-brand-500/40 bg-brand-500/10 px-5 py-3 text-brand-200 ${className || "mt-6"}`}
      >
        <Check className="h-4 w-4 shrink-0 text-brand-300" />
        <span className="font-mono text-xs tracking-wider uppercase">
          You&apos;re on the list. Check your inbox!
        </span>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full max-w-sm ${className !== undefined ? className : "mt-6"}`}
    >
      <div className="group relative flex items-center overflow-hidden rounded-full border border-neutral-700/80 bg-neutral-900/60 p-1.5 backdrop-blur-md transition-all duration-300 focus-within:border-brand-400 focus-within:bg-neutral-900/90 focus-within:shadow-[0_0_20px_rgba(0,211,218,0.2)]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ENTER YOUR EMAIL"
          disabled={isLoading}
          aria-label="Email address for newsletter"
          className="w-full bg-transparent px-4 py-2 font-mono text-xs tracking-wider text-neutral-100 placeholder:text-neutral-500 focus:outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading}
          onMouseEnter={() => cursorCtx?.setCursorState("magnetic")}
          onMouseLeave={() => cursorCtx?.setCursorState("default")}
          aria-label="Subscribe"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-400 text-neutral-950 transition-all duration-300 hover:scale-105 hover:bg-brand-300 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  )
}
