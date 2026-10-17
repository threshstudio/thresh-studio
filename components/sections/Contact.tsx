"use client"

import React, { useState } from "react"
import { useCursor } from "../cursor/CursorContext"
import { cn } from "@/lib/utils"

export function Contact() {
  const { setCursorState } = useCursor()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="relative z-20 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Background glow that expands on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-1000 ease-out",
          isHovered && "opacity-100"
        )}
      >
        <div className="absolute top-1/2 left-1/2 h-[80vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-300/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <h2 className="mb-16 text-4xl leading-[0.85] font-bold tracking-tighter text-neutral-100 uppercase mix-blend-plus-lighter md:text-7xl lg:text-[9vw]">
          Ready to <br />
          Make <span className="pr-4 text-brand-300 italic">Product</span>
          <br />
          Magic?
        </h2>

        <a
          href="https://calendly.com/threshstudioz/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative cursor-none"
          onMouseEnter={() => {
            setIsHovered(true)
            setCursorState("project") // A large custom cursor for the CTA
          }}
          onMouseLeave={() => {
            setIsHovered(false)
            setCursorState("default")
          }}
        >
          <span className="text-xl font-medium tracking-[0.2em] text-brand-200 uppercase drop-shadow-[0_0_15px_rgba(125,249,255,0.3)] transition-all duration-500 group-hover:tracking-[0.4em] md:text-2xl">
            Book a Strategy Call ↗
          </span>
          <div className="absolute -bottom-6 left-0 h-[1px] w-full origin-left scale-x-0 bg-brand-400 shadow-[0_0_10px_var(--color-brand-400)] transition-transform duration-700 group-hover:scale-x-100" />
        </a>
      </div>
    </section>
  )
}
