"use client"

import React, { useState } from "react"
import Image from "next/image"
import { X, Smartphone, Monitor } from "lucide-react"

interface EmailPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  subject: string
  previewText?: string
  contentHtml: string
}

export function EmailPreviewModal({
  isOpen,
  onClose,
  subject,
  previewText,
  contentHtml,
}: EmailPreviewModalProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-white">Email Preview</h3>
            <p className="text-xs text-neutral-400">
              Live visualization of your branded newsletter
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-neutral-700 bg-neutral-800 p-0.5">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  device === "desktop"
                    ? "bg-brand-500/20 text-brand-300"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setDevice("mobile")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  device === "mobile"
                    ? "bg-brand-500/20 text-brand-300"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" /> Mobile
              </button>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Email Metadata Bar */}
        <div className="border-b border-neutral-800/80 bg-neutral-900/40 px-6 py-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="font-mono text-neutral-500 uppercase">
              Subject:
            </span>
            <span className="font-semibold text-white">
              {subject || "Untitled Newsletter"}
            </span>
          </div>
          {previewText && (
            <div className="mt-1 flex items-center gap-2 text-neutral-400">
              <span className="font-mono text-neutral-500 uppercase">
                Preheader:
              </span>
              <span>{previewText}</span>
            </div>
          )}
        </div>

        {/* Device Container Preview Area */}
        <div className="flex flex-1 items-start justify-center overflow-y-auto bg-neutral-950 p-6">
          <div
            className={`w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl transition-all duration-300 ${
              device === "mobile" ? "max-w-[390px]" : "max-w-[620px]"
            }`}
          >
            {/* Template Header */}
            <div className="border-b border-neutral-800 bg-neutral-950/80 px-6 py-5 text-center">
              <Image
                src="/logo.png"
                alt="Thresh Studio"
                width={140}
                height={28}
                className="mx-auto h-7 w-auto object-contain"
                priority
              />
            </div>

            {/* Content Body */}
            <div className="p-8">
              <div
                className="prose prose-invert max-w-none text-[15px] leading-relaxed text-neutral-200"
                dangerouslySetInnerHTML={{
                  __html:
                    contentHtml ||
                    "<p class='text-neutral-500 italic'>No content yet. Start composing in the editor!</p>",
                }}
              />
            </div>

            {/* Template Footer */}
            <div className="border-t border-neutral-800 bg-neutral-950/90 p-6 text-center">
              <p className="font-mono text-[11px] font-bold tracking-[0.25em] text-brand-300 uppercase">
                THRESH STUDIO
              </p>
              <p className="mt-1 text-[12px] text-neutral-400">
                Product Branding & Cinematic Marketing
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">
                You are receiving this update because you subscribed to Thresh
                Studio.
              </p>
              <span className="mt-2 inline-block cursor-pointer text-[11px] text-neutral-400 underline hover:text-brand-300">
                Unsubscribe from this newsletter
              </span>
              <p className="mt-4 text-[10px] tracking-wider text-neutral-600 uppercase">
                © {new Date().getFullYear()} Thresh Studio LLC. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
