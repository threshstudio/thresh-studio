"use client"

import React, { useState } from "react"
import { X, Image as ImageIcon } from "lucide-react"

interface ImageUrlModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (url: string) => void
}

export function ImageUrlModal({ isOpen, onClose, onSave }: ImageUrlModalProps) {
  const [url, setUrl] = useState("")

  if (!isOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSave(url.trim())
      setUrl("")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-brand-300" />
          <h3 className="text-lg font-bold text-white">Insert Image by URL</h3>
        </div>

        <div
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave(e)
          }}
        >
          <label className="mb-2 block font-mono text-xs tracking-wider text-neutral-400 uppercase">
            Image Web URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.png"
            autoFocus
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-brand-400 focus:outline-none"
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-brand-400 px-5 py-2 font-mono text-xs font-bold tracking-wider text-neutral-950 uppercase hover:bg-brand-300"
            >
              Insert Image
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
