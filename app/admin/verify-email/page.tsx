"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  )
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error")
      setErrorMessage("No verification token provided.")
      return
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/admin/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Verification failed")
        }

        setStatus("success")
        setTimeout(() => {
          router.push("/admin/settings")
        }, 3000)
      } catch (error) {
        setStatus("error")
        setErrorMessage(
          error instanceof Error ? error.message : "An error occurred"
        )
      }
    }

    verifyToken()
  }, [token, router])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 p-4">
      {/* Background glowing effects */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-10">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand-500" />
            <h2 className="text-2xl font-bold text-white">
              Verifying Email...
            </h2>
            <p className="text-neutral-400">
              Please wait while we verify your new email address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="animate-in space-y-4 duration-300 fade-in zoom-in">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
            <p className="text-neutral-400">
              Your email has been successfully updated. Redirecting you to
              settings...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="animate-in space-y-4 duration-300 fade-in zoom-in">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold text-white">
              Verification Failed
            </h2>
            <p className="text-neutral-400">{errorMessage}</p>
            <button
              onClick={() => router.push("/admin/settings")}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-neutral-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
            >
              Return to Settings
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-950">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
