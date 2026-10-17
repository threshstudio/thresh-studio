"use client"

import React, { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const token = searchParams.get("token") || ""

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >(() => (email && token ? "loading" : "idle"))
  const [message, setMessage] = useState("")

  const executeUnsubscribe = useCallback(async () => {
    if (!email || !token) {
      setStatus("error")
      setMessage("Missing email or unsubscribe verification token.")
      return
    }

    setStatus("loading")
    try {
      const res = await fetch("/api/public/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      })

      const data = await res.json()
      if (res.ok) {
        setStatus("success")
        setMessage(data.message || "You have been successfully unsubscribed.")
      } else {
        setStatus("error")
        setMessage(
          data.error || "Failed to unsubscribe. The link may have expired."
        )
      }
    } catch {
      setStatus("error")
      setMessage("An unexpected network error occurred.")
    }
  }, [email, token])

  // Automatically attempt unsubscribe once on mount if credentials provided
  useEffect(() => {
    let isCancelled = false

    if (!email || !token) return

    fetch("/api/public/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (isCancelled) return
        if (res.ok) {
          setStatus("success")
          setMessage(data.message || "You have been successfully unsubscribed.")
        } else {
          setStatus("error")
          setMessage(
            data.error || "Failed to unsubscribe. The link may have expired."
          )
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setStatus("error")
          setMessage("An unexpected network error occurred.")
        }
      })

    return () => {
      isCancelled = true
    }
  }, [email, token])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-16 text-neutral-100">
      <div className="relative w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950/80 p-8 text-center shadow-2xl backdrop-blur-2xl">
        <Link href="/" className="mb-8 inline-block">
          <Image
            src="/logo.png"
            alt="Thresh Studio"
            width={160}
            height={36}
            className="mx-auto h-8 w-auto object-contain"
            priority
          />
        </Link>

        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-brand-300" />
            <p className="font-mono text-sm tracking-widest text-neutral-400 uppercase">
              Updating your subscription preferences...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Unsubscribed
            </h1>
            <p className="text-sm leading-relaxed text-neutral-400">
              {email} has been removed from the Thresh Studio newsletter. You
              won&apos;t receive marketing emails from us anymore.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-brand-400 px-6 py-3 font-mono text-xs font-bold tracking-widest text-neutral-950 uppercase transition-transform hover:scale-105"
            >
              Back to Home
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Unable to Unsubscribe
            </h1>
            <p className="text-sm leading-relaxed text-neutral-400">
              {message}
            </p>
            {email && token && (
              <button
                onClick={executeUnsubscribe}
                className="mt-4 rounded-full border border-neutral-700 bg-neutral-900 px-6 py-2.5 font-mono text-xs tracking-wider text-neutral-200 uppercase transition-colors hover:border-brand-400 hover:text-white"
              >
                Try Again
              </button>
            )}
            <Link
              href="/"
              className="mt-2 text-xs text-neutral-500 underline hover:text-neutral-300"
            >
              Return to Website
            </Link>
          </div>
        )}

        {status === "idle" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Unsubscribe Confirmation
            </h1>
            <p className="text-sm text-neutral-400">
              Are you sure you want to stop receiving Thresh Studio emails?
            </p>
            <button
              onClick={executeUnsubscribe}
              className="mt-4 rounded-full border border-red-500/40 bg-red-500/20 px-6 py-3 font-mono text-xs font-bold tracking-widest text-red-300 uppercase transition-colors hover:bg-red-500/30"
            >
              Confirm Unsubscribe
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-brand-300" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  )
}
