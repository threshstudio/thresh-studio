import React from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { verifyEmailToken } from "@/lib/services/admin"
import Link from "next/link"

export default async function VerifyEmailPage(props: {
  searchParams: Promise<{ token?: string }>
}) {
  const searchParams = await props.searchParams
  const token = searchParams.token

  let status: "success" | "error" = "success"
  let errorMessage = ""

  if (!token) {
    status = "error"
    errorMessage = "No verification token provided."
  } else {
    try {
      await verifyEmailToken(token)
    } catch (error) {
      status = "error"
      errorMessage =
        error instanceof Error ? error.message : "An error occurred"
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 p-4">
      {/* Background glowing effects */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-10">
        {status === "success" && (
          <div className="animate-in space-y-4 duration-300 fade-in zoom-in">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
            <p className="text-neutral-400">
              Your email has been successfully updated.
            </p>
            <Link
              href="/admin/settings"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-500/20 px-6 py-3 text-sm font-semibold text-brand-200 transition-colors hover:bg-brand-500/30"
            >
              Continue to Settings
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="animate-in space-y-4 duration-300 fade-in zoom-in">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold text-white">
              Verification Failed
            </h2>
            <p className="text-neutral-400">{errorMessage}</p>
            <Link
              href="/admin/settings"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-neutral-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
            >
              Return to Settings
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
