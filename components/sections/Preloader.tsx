"use client"

import React, { useState, useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import Image from "next/image"

export function Preloader() {
  const [isMounted, setIsMounted] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const logoContainerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      // Only play once per session
      if (sessionStorage.getItem("preloaderPlayed")) {
        gsap.set(containerRef.current, { display: "none" })
        setIsMounted(false)
        return
      }

      sessionStorage.setItem("preloaderPlayed", "true")

      const tl = gsap.timeline({
        onComplete: () => {
          setIsMounted(false)
        },
      })

      // Logo reveal
      tl.fromTo(
        logoContainerRef.current,
        { opacity: 0, scale: 0.9, filter: "blur(20px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.0,
          ease: "power3.inOut",
        },
        0.1
      )

      // Glow pulse loop
      gsap.to(glowRef.current, {
        scale: 1.5,
        opacity: 0.9,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })

      // Loading bar progress
      tl.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.0,
          ease: "power3.inOut",
          transformOrigin: "left center",
        },
        0
      )

      // Wait a little, then animate out
      tl.to(containerRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
        delay: 0.2,
      })
    },
    { scope: containerRef, dependencies: [] }
  )

  if (!isMounted) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-700 to-black"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500/15 via-black to-black" />

      <div
        ref={logoContainerRef}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        <div className="relative flex h-24 w-48 items-center justify-center md:h-36 md:w-72">
          <div
            ref={glowRef}
            className="absolute inset-0 rounded-full bg-brand-400/30 opacity-50 mix-blend-screen blur-[60px]"
          />
          <Image
            src="/logo.png"
            alt="Thresh Studio"
            fill
            sizes="(max-width: 768px) 192px, 288px"
            className="relative z-10 object-contain brightness-125 contrast-125 drop-shadow-[0_0_30px_rgba(0,211,218,0.6)]"
          />
        </div>

        <div className="absolute -bottom-16 h-[2px] w-32 overflow-hidden rounded-full bg-neutral-800/50 md:w-48">
          <div
            ref={barRef}
            className="h-full w-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 shadow-[0_0_10px_var(--color-brand-400)]"
          />
        </div>
      </div>
    </div>
  )
}
