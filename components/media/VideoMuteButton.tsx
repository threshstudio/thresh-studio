"use client"

import React, { useState, useEffect, useRef, useCallback, useId } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { useOptionalCursor } from "../cursor/CursorContext"

export interface VideoMuteButtonProps {
  videoRef?: React.RefObject<HTMLVideoElement | null>
  className?: string
  size?: "xs" | "sm" | "md" | "lg"
}

export function VideoMuteButton({
  videoRef,
  className = "",
  size = "md",
}: VideoMuteButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const instanceId = useId()

  // Safely access cursor context if available (landing pages), ignore if not (admin)
  const cursorCtx = useOptionalCursor()

  // Resolve target video element: either explicitly via videoRef or closest in DOM tree
  const getTargetVideo = useCallback((): HTMLVideoElement | null => {
    if (videoRef?.current) return videoRef.current
    if (!buttonRef.current) return null
    const container =
      buttonRef.current.closest(".relative") ||
      buttonRef.current.closest(".group") ||
      buttonRef.current.parentElement
    return container?.querySelector("video") || null
  }, [videoRef])

  useEffect(() => {
    const video = getTargetVideo()
    if (!video) return

    // Sync initial state asynchronously to avoid React 19 cascading render warning
    queueMicrotask(() => {
      setIsMuted(video.muted)
    })

    const handleVolumeChange = () => {
      setIsMuted(video.muted)
    }

    video.addEventListener("volumechange", handleVolumeChange)

    // Listen for global exclusive unmute events from other VideoMuteButtons
    const handleGlobalUnmute = (e: Event) => {
      const customEvent = e as CustomEvent<{ senderId: string }>
      if (customEvent.detail?.senderId !== instanceId) {
        const vid = getTargetVideo()
        if (vid && !vid.muted) {
          vid.muted = true
          setIsMuted(true)
        }
      }
    }

    window.addEventListener("thresh:video-unmuted", handleGlobalUnmute)

    return () => {
      video.removeEventListener("volumechange", handleVolumeChange)
      window.removeEventListener("thresh:video-unmuted", handleGlobalUnmute)
    }
  }, [getTargetVideo, instanceId])

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const video = getTargetVideo()
    if (!video) return

    if (video.muted) {
      // Unmuting: unmute this video and notify all other videos to mute
      video.muted = false
      setIsMuted(false)
      video.play().catch(() => {})
      window.dispatchEvent(
        new CustomEvent("thresh:video-unmuted", {
          detail: { senderId: instanceId },
        })
      )
    } else {
      // Muting
      video.muted = true
      setIsMuted(true)
    }
  }

  // Size variations
  const sizeStyles = {
    xs: "h-6 w-6 p-1",
    sm: "h-8 w-8 p-1.5",
    md: "h-10 w-10 p-2 sm:h-11 sm:w-11 sm:p-2.5",
    lg: "h-12 w-12 p-3",
  }[size]

  const iconSizes = {
    xs: "h-3.5 w-3.5",
    sm: "h-4 w-4",
    md: "h-4 w-4 sm:h-5 sm:w-5",
    lg: "h-6 w-6",
  }[size]

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleMute}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onMouseEnter={() => cursorCtx?.setCursorState("magnetic")}
      onMouseLeave={() => cursorCtx?.setCursorState("default")}
      aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
      title={isMuted ? "Unmute" : "Mute"}
      className={`group/mute pointer-events-auto flex cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${sizeStyles} ${
        isMuted
          ? "border-neutral-700/60 bg-neutral-950/70 text-neutral-300 shadow-lg hover:scale-105 hover:border-brand-400/80 hover:bg-neutral-900/90 hover:text-brand-200 active:scale-95"
          : "bg-brand-950/60 hover:bg-brand-900/80 border-brand-400/70 text-brand-300 shadow-[0_0_20px_rgba(125,249,255,0.3)] hover:scale-105 hover:border-brand-300 active:scale-95"
      } ${className}`}
    >
      {isMuted ? (
        <VolumeX
          className={`${iconSizes} transition-transform duration-200 group-hover/mute:scale-110`}
        />
      ) : (
        <Volume2
          className={`${iconSizes} transition-transform duration-200 group-hover/mute:scale-110`}
        />
      )}
    </button>
  )
}
