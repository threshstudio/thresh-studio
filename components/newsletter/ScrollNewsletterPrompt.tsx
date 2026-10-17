"use client"

import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { X, Sparkles, Check } from "lucide-react"
import { NewsletterSubscribeForm } from "./NewsletterSubscribeForm"

export function ScrollNewsletterPrompt() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Only trigger on public pages, not on /admin
  const isPublicPage = !pathname?.startsWith("/admin")

  useEffect(() => {
    if (!isPublicPage) return

    // Check if user already dismissed or subscribed within the last 30 days
    const dismissedTime = localStorage.getItem("thresh_newsletter_dismissed")
    if (dismissedTime) {
      const thirtyDays = 30 * 24 * 60 * 60 * 1000
      if (Date.now() - parseInt(dismissedTime, 10) < thirtyDays) {
        return
      }
    }

    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return

      const progress = window.scrollY / scrollHeight
      if (progress > 0.65) {
        setIsVisible(true)
        window.removeEventListener("scroll", handleScroll)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isPublicPage])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("thresh_newsletter_dismissed", Date.now().toString())
  }

  const handleSuccess = () => {
    setIsSubscribed(true)
    localStorage.setItem("thresh_newsletter_dismissed", Date.now().toString())
    setTimeout(() => {
      setIsVisible(false)
    }, 3500)
  }

  if (!isPublicPage || !isVisible) return null

  return (
    <aside
      aria-label="Newsletter subscription prompt"
      className="fixed right-6 bottom-6 z-[90] w-[calc(100vw-3rem)] max-w-sm transform-gpu animate-in duration-500 fade-in slide-in-from-bottom-8"
    >
      <div className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-neutral-950/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {/* Glow ambient accent */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-400/20 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss newsletter prompt"
          className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {isSubscribed ? (
          <div className="flex items-center gap-3 py-2 text-brand-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Welcome aboard!</p>
              <p className="text-xs text-neutral-400">
                Check your inbox for a confirmation.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">
                <Sparkles className="h-3 w-3" />
              </span>
              <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-brand-300 uppercase">
                Insider Dispatch
              </span>
            </div>

            <h4 className="text-base font-bold tracking-tight text-white">
              Enjoying our work?
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-neutral-400">
              Join visionary founders and creative directors receiving our
              private drops on brand craft.
            </p>

            <NewsletterSubscribeForm
              source="scroll_prompt"
              onSuccess={handleSuccess}
            />
          </div>
        )}
      </div>
    </aside>
  )
}
