"use client"

import React, { useCallback, useState, useRef } from "react"
import { UploadCloud, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { VideoMuteButton } from "@/components/media/VideoMuteButton"

interface MultiFileUploadProps {
  value: (File | string)[]
  onChange: (files: (File | string)[]) => void
  accept?: string
  maxSize?: number // in bytes per file
  description?: string
  className?: string
}

export function MultiFileUpload({
  value,
  onChange,
  accept = "video/*,image/*",
  maxSize = 50 * 1024 * 1024, // 50MB default per file
  description = "Drag and drop multiple files, or click to browse",
  className,
}: MultiFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate preview URLs for rendering
  const getPreviewData = (item: File | string) => {
    if (typeof item === "string") {
      const isVideo = item.match(/\.(mp4|webm|ogg)$/i)
      return { url: item, type: isVideo ? "video" : "image" }
    } else {
      const url = URL.createObjectURL(item)
      const isVideo = item.type.startsWith("video/")
      return { url, type: isVideo ? "video" : "image", isFile: true }
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFiles = (files: FileList | File[]) => {
    let hasError = false
    const validFiles: File[] = []

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        hasError = true
      } else {
        validFiles.push(file)
      }
    })

    if (hasError) {
      setError(
        `One or more files exceeded the ${Math.round(maxSize / (1024 * 1024))}MB limit and were skipped.`
      )
    } else {
      setError(null)
    }

    if (validFiles.length > 0) {
      onChange([...value, ...validFiles])
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [maxSize, onChange, value]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
    // Reset input so the same files can be selected again if needed
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleRemove = (index: number) => {
    const updated = [...value]
    updated.splice(index, 1)
    onChange(updated)
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group relative flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-neutral-900/20 transition-all duration-200",
          isDragging
            ? "border-brand-400 bg-brand-400/5"
            : "border-neutral-700 hover:border-brand-500/50 hover:bg-neutral-800/40"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          multiple
        />
        <div className="flex flex-col items-center justify-center px-4 pt-5 pb-6 text-center">
          <div className="mb-4 rounded-full bg-neutral-800/80 p-4 text-neutral-400 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:text-brand-300">
            <UploadCloud className="h-8 w-8" />
          </div>
          <p className="mb-2 text-sm font-semibold text-neutral-200">
            <span className="text-brand-300">Click to upload</span> or drag and
            drop
          </p>
          <p className="mx-auto max-w-[250px] text-xs text-neutral-500">
            {description}
          </p>
          {error && (
            <p className="mt-4 rounded-md bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-500">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {value.map((item, idx) => {
            const preview = getPreviewData(item)
            return (
              <div
                key={idx}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-700 bg-black shadow-inner"
              >
                {preview.type === "video" ? (
                  <>
                    <video
                      src={preview.url}
                      className="absolute inset-0 h-full w-full object-cover opacity-80"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                    <div className="absolute right-2 bottom-2 z-10">
                      <VideoMuteButton size="xs" />
                    </div>
                  </>
                ) : (
                  <img
                    src={preview.url}
                    alt="Gallery item"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                  />
                )}

                {/* Delete button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(idx)
                    }}
                    className="rounded-full bg-red-500 p-3 text-white shadow-lg transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* File badge if it's a raw file waiting to upload */}
                {item instanceof File && (
                  <div className="absolute right-2 bottom-2 rounded bg-brand-500 px-2 py-0.5 text-[9px] font-bold tracking-widest text-neutral-950 uppercase">
                    New
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
