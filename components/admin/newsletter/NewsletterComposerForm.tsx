"use client"

import React, { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Send, Eye, Mail, Loader2, Sparkles } from "lucide-react"
import { TipTapEditor } from "./TipTapEditor"
import { EmailPreviewModal } from "./EmailPreviewModal"
import { ConfirmAlert } from "@/components/ui/confirm-alert"

interface NewsletterComposerFormProps {
  adminEmail?: string
  activeSubscribersCount: number
}

export function NewsletterComposerForm({
  adminEmail,
  activeSubscribersCount,
}: NewsletterComposerFormProps) {
  const queryClient = useQueryClient()

  // Form State
  const [subject, setSubject] = useState("")
  const [previewText, setPreviewText] = useState("")
  const [contentHtml, setContentHtml] = useState(
    "<p>Hello creative minds,</p><p>We are excited to share our latest cinematic work and behind-the-scenes insights with you.</p>"
  )
  const [contentJson, setContentJson] = useState<Record<string, unknown>>({})
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isTestSending, setIsTestSending] = useState(false)
  const [isBroadcastConfirmOpen, setIsBroadcastConfirmOpen] = useState(false)
  const [isBroadcasting, setIsBroadcasting] = useState(false)

  // Send test email to admin
  const handleSendTest = async () => {
    if (!subject.trim()) {
      toast.error("Please add a subject before sending a test email.")
      return
    }

    setIsTestSending(true)
    const toastId = toast.loading("Sending test email...")

    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          previewText,
          contentHtml,
          contentJson,
          testEmailOnly: true,
          testEmail: adminEmail,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send test email")

      toast.success(data.message || "Test email dispatched successfully!", {
        id: toastId,
      })
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error sending test email",
        { id: toastId }
      )
    } finally {
      setIsTestSending(false)
    }
  }

  // Broadcast to all active subscribers
  const handleBroadcast = async () => {
    setIsBroadcasting(true)
    const toastId = toast.loading(
      "Broadcasting newsletter to active subscribers..."
    )

    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          previewText,
          contentHtml,
          contentJson,
          testEmailOnly: false,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Broadcast failed")

      toast.success(data.message || "Newsletter broadcast complete!", {
        id: toastId,
      })
      setIsBroadcastConfirmOpen(false)
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] })
      queryClient.invalidateQueries({ queryKey: ["adminSubscribers"] })
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error broadcasting newsletter",
        { id: toastId }
      )
    } finally {
      setIsBroadcasting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Subject and Preheader Inputs */}
        <div className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur-md lg:col-span-2">
          <div>
            <label className="mb-2 block font-mono text-xs tracking-wider text-neutral-400 uppercase">
              Email Subject Line *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Unveiling the Future of Cinematic 3D"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-brand-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs tracking-wider text-neutral-400 uppercase">
              Inbox Preview Text (Preheader)
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Short summary displayed in the recipient's inbox snippet"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-brand-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Actions Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-brand-300 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dispatch Controls</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-neutral-400">
              Preview in real-time or send a test email to your admin address
              before broadcasting to your active audience.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-xs font-semibold tracking-wider text-neutral-200 uppercase transition-colors hover:border-brand-400 hover:text-white"
            >
              <Eye className="h-4 w-4 text-brand-300" />
              <span>Live Preview</span>
            </button>

            <button
              type="button"
              onClick={handleSendTest}
              disabled={isTestSending || !subject}
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-xs font-semibold tracking-wider text-neutral-200 uppercase transition-colors hover:border-brand-400 hover:text-white disabled:opacity-40"
            >
              {isTestSending ? (
                <Loader2 className="h-4 w-4 animate-spin text-brand-300" />
              ) : (
                <Mail className="h-4 w-4 text-brand-300" />
              )}
              <span>Send Test Email</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBroadcastConfirmOpen(true)}
              disabled={isBroadcasting || !subject}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-400 px-4 py-3 font-mono text-xs font-bold tracking-widest text-neutral-950 uppercase shadow-lg transition-all hover:bg-brand-300 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              <span>Broadcast to {activeSubscribersCount} Subscribers</span>
            </button>
          </div>
        </div>
      </div>

      {/* TipTap Rich Editor */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="font-mono text-xs tracking-wider text-neutral-400 uppercase">
            Email Content (Drag & drop images or use toolbar to format)
          </label>
          <span className="text-[11px] text-neutral-500">
            Images upload directly to Cloudinary
          </span>
        </div>
        <TipTapEditor
          content={contentHtml}
          onChange={(html, json) => {
            setContentHtml(html)
            setContentJson(json)
          }}
        />
      </div>

      {/* Real-time Email Preview Modal */}
      <EmailPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        subject={subject || "No Subject Specified"}
        previewText={previewText}
        contentHtml={contentHtml}
      />

      {/* Confirm Broadcast Alert */}
      <ConfirmAlert
        isOpen={isBroadcastConfirmOpen}
        onClose={() => setIsBroadcastConfirmOpen(false)}
        onConfirm={handleBroadcast}
        title="Broadcast Newsletter Campaign?"
        description={`This action will immediately email all ${activeSubscribersCount} active subscribers in your audience. This cannot be undone.`}
        confirmText="Confirm & Broadcast"
        isLoading={isBroadcasting}
      />
    </div>
  )
}
