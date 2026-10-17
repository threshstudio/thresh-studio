"use client"

import React, { useEffect, useState, useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useCursor } from "./CursorContext"

const variants: Record<string, gsap.TweenVars> = {
  default: {
    width: 12,
    height: 12,
    backgroundColor: "var(--foreground, #FFFFFF)",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    mixBlendMode: "normal",
    color: "transparent",
  },
  hidden: {
    width: 0,
    height: 0,
    opacity: 0,
  },
  project: {
    width: 80,
    height: 80,
    backgroundColor: "var(--color-brand-200, #00D3DA)",
    borderColor: "transparent",
    borderWidth: 0,
    mixBlendMode: "normal",
    color: "var(--background, #000000)",
  },
  explore: {
    width: 100,
    height: 100,
    backgroundColor: "transparent",
    borderColor: "var(--color-brand-200, #00D3DA)",
    borderWidth: 1,
    mixBlendMode: "normal",
    color: "var(--color-brand-200, #00D3DA)",
  },
  drag: {
    width: 60,
    height: 60,
    backgroundColor: "var(--background, #111111)",
    borderColor: "var(--border, #333333)",
    borderWidth: 1,
    mixBlendMode: "normal",
    color: "var(--foreground, #FFFFFF)",
  },
  magnetic: {
    width: 40,
    height: 40,
    backgroundColor: "var(--foreground, #FFFFFF)",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    mixBlendMode: "normal",
    color: "transparent",
  },
}

export function CustomCursor() {
  const { cursorState, magneticTarget } = useCursor()
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const cursorRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  // Setup GSAP quickTo for mouse tracking inside useGSAP
  useGSAP(() => {
    if (!cursorRef.current) return

    // Set initial position offscreen to avoid flash
    gsap.set(cursorRef.current, { x: -100, y: -100 })

    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.5,
      ease: "power3",
    })
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.5,
      ease: "power3",
    })

    const moveCursor = (e: MouseEvent) => {
      let targetX = e.clientX
      let targetY = e.clientY

      // Handle magnetic attraction
      if (cursorState === "magnetic" && magneticTarget) {
        const { left, top, width, height } =
          magneticTarget.getBoundingClientRect()
        const centerX = left + width / 2
        const centerY = top + height / 2

        const distanceX = e.clientX - centerX
        const distanceY = e.clientY - centerY

        targetX = centerX + distanceX * 0.2
        targetY = centerY + distanceY * 0.2
      }

      xTo(targetX)
      yTo(targetY)
    }

    window.addEventListener("mousemove", moveCursor)
    return () => window.removeEventListener("mousemove", moveCursor)
  }, [cursorState, magneticTarget])

  // Handle state changes (size, color, text) inside useGSAP
  useGSAP(() => {
    if (!cursorRef.current) return
    const v = variants[cursorState] || variants.default

    gsap.to(cursorRef.current, {
      ...v,
      duration: 0.4,
      ease: "back.out(1.5)",
    })

    if (textRef.current) {
      if (
        cursorState === "project" ||
        cursorState === "explore" ||
        cursorState === "drag"
      ) {
        gsap.fromTo(
          textRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }
        )
      } else {
        gsap.to(textRef.current, { scale: 0.5, opacity: 0, duration: 0.2 })
      }
    }
  }, [cursorState])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (window.matchMedia("(pointer: coarse)").matches) {
        setIsTouchDevice(true)
      }
    }, 0)
    return () => clearTimeout(timeout)
  }, [])

  if (isTouchDevice) return null

  let textContent = ""
  if (cursorState === "project") textContent = "View"
  if (cursorState === "drag") textContent = "← →"
  if (cursorState === "explore") textContent = "Explore"

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-solid text-xs font-medium tracking-widest uppercase"
      style={{
        width: 12,
        height: 12,
        backgroundColor: "var(--foreground, #FFFFFF)",
        borderColor: "rgba(255,255,255,0.1)",
      }}
    >
      <span ref={textRef} className="opacity-0">
        {textContent}
      </span>
    </div>
  )
}
