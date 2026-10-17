"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { X, Upload, Loader2, Image as ImageIcon, FileCheck } from "lucide-react"

interface ImageUploadPreviewModalProps {
  isOpen: boolean
  file: File | null
  isUploading: boolean
  onClose: () => void
  onConfirmUpload: (file: File, altText?: string) => Promise<void>
}

export function ImageUploadPreviewModal({
  isOpen,
  file,
  isUploading,
  onClose,
  onConfirmUpload,
}: ImageUploadPreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [altText, setAltText] = useState("")

  useEffect(() => {
    if (!file) {
      return
    }

    const objectUrl = URL.createObjectURL(file)
    queueMicrotask(() => {
      setPreviewUrl(objectUrl)
      setAltText(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "))
    })

    return () => {
      URL.revokeObjectURL(objectUrl)
      queueMicrotask(() => {
        setPreviewUrl(null)
        setAltText("")
      })
    }
  }, [file])

  if (!isOpen || !file || !previewUrl) return null

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || isUploading) return
    await onConfirmUpload(file, altText.trim())
  }

  return (
    <div className="fixed inset-0 z-[110] flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-md duration-200 fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-300">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide text-white">
                Image Preview
              </h3>
              <p className="text-[11px] text-neutral-400">
                Confirm your image before uploading to Cloudinary
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isUploading}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter") handleUpload(e)
          }}
        >
          <div className="space-y-4 p-6">
            {/* Visual Image Preview */}
            <div className="relative flex max-h-[320px] min-h-[200px] w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 p-2">
              <Image
                src={previewUrl}
                alt="Upload preview"
                width={400}
                height={300}
                unoptimized
                className="max-h-[300px] w-auto max-w-full rounded-lg object-contain shadow-md"
              />
            </div>

            {/* File Metadata Pill */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-800/80 bg-neutral-900/40 px-3.5 py-2 text-xs">
              <div className="flex items-center gap-2 truncate text-neutral-300">
                <FileCheck className="h-3.5 w-3.5 shrink-0 text-brand-300" />
                <span className="truncate font-medium">{file.name}</span>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-neutral-400">
                {formatFileSize(file.size)}
              </span>
            </div>

            {/* Alt Text / Caption Input */}
            <div>
              <label
                htmlFor="image-alt-text"
                className="mb-1.5 block font-mono text-[11px] tracking-wider text-neutral-400 uppercase"
              >
                Alt Text / Description (Optional)
              </label>
              <input
                id="image-alt-text"
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                disabled={isUploading}
                placeholder="Brief description for email accessibility"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 px-3.5 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 focus:border-brand-400 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-neutral-800/80 bg-neutral-900/30 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="rounded-xl border border-neutral-700/80 px-4 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-xl bg-brand-400 px-5 py-2 font-mono text-xs font-bold tracking-wider text-neutral-950 uppercase transition-all hover:bg-brand-300 hover:shadow-[0_0_20px_rgba(0,211,218,0.3)] disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-950" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload & Insert</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
