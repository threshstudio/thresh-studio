"use client"

import React, { useCallback, useState, useRef, useEffect } from "react"
import { UploadCloud, X, File as FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { VideoMuteButton } from "@/components/media/VideoMuteButton"

interface FileUploadProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  accept?: string
  maxSize?: number // in bytes
  label?: string
  description?: string
  className?: string
}

export function FileUpload({
  value,
  onChange,
  accept = "video/*,image/*",
  maxSize = 50 * 1024 * 1024, // 50MB default
  description = "Drag and drop or click to browse",
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileType, setFileType] = useState<"video" | "image" | "other" | null>(
    null
  )
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate preview URL when value changes
  useEffect(() => {
    if (!value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null)

      setFileType(null)
      return
    }

    if (typeof value === "string") {
      setPreviewUrl(value)
      // Guess type from string extension or fallback to image
      setFileType(value.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image")
    } else if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setPreviewUrl(url)
      setFileType(
        value.type.startsWith("video/")
          ? "video"
          : value.type.startsWith("image/")
            ? "image"
            : "other"
      )
      return () => URL.revokeObjectURL(url)
    }
  }, [value])

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

  const processFile = (file: File) => {
    if (file.size > maxSize) {
      setError(
        `File is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`
      )
      return
    }
    setError(null)
    onChange(file)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]
        processFile(file)
      }
    },
    [maxSize, onChange]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setError(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "group relative flex min-h-[300px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-neutral-900/20 transition-all duration-200",
            isDragging
              ? "border-brand-400 bg-brand-400/5"
              : "border-neutral-700 hover:border-brand-500/50 hover:bg-neutral-800/40",
            className
          )}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
          <div className="flex flex-col items-center justify-center px-4 pt-5 pb-6 text-center">
            <div className="mb-4 rounded-full bg-neutral-800/80 p-4 text-neutral-400 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:text-brand-300">
              <UploadCloud className="h-8 w-8" />
            </div>
            <p className="mb-2 text-sm font-semibold text-neutral-200">
              <span className="text-brand-300">Click to upload</span> or drag
              and drop
            </p>
            <p className="mx-auto max-w-[250px] text-xs text-neutral-500">
              {description}
            </p>
            {error && (
              <p className="mt-4 rounded-md bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-500">
                {error}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "group relative flex min-h-[350px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-700 bg-black",
            className
          )}
        >
          {fileType === "video" ? (
            <>
              <video
                src={previewUrl}
                className="absolute inset-0 h-full w-full bg-black object-contain"
                controls
                muted
                loop
                playsInline
              />
              <div className="absolute top-4 right-4 z-20">
                <VideoMuteButton size="sm" />
              </div>
            </>
          ) : fileType === "image" ? (
            <img
              src={previewUrl}
              alt="Upload preview"
              className="absolute inset-0 h-full w-full bg-black object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-400">
              <FileIcon className="mb-4 h-12 w-12" />
              <p className="text-sm">File attached</p>
            </div>
          )}

          {/* Overlay to allow replacing/removing */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                inputRef.current?.click()
              }}
              className="rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 rounded-lg bg-red-500/80 px-6 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-red-500"
            >
              <X className="h-4 w-4" /> Remove
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  )
}
