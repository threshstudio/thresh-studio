"use client"

import React, { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"

const processSteps = [
  {
    id: "01",
    title: "Discovery",
    desc: "Uncovering the core of your product and its market positioning.",
    tags: ["Research", "Workshops"],
  },
  {
    id: "02",
    title: "Strategy",
    desc: "Defining the narrative for your product branding and marketing videos.",
    tags: ["Positioning", "Scripting"],
  },
  {
    id: "03",
    title: "Production",
    desc: "Crafting the visual language, 3D assets, and cinematic video content.",
    tags: ["3D/WebGL", "Video Shoot"],
  },
  {
    id: "04",
    title: "Launch",
    desc: "Releasing high-fidelity product marketing videos that captivate and convert.",
    tags: ["Campaign Launch", "Delivery"],
  },
]

export function Process() {
  const container = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!container.current || !progressRef.current) return

      const nodes = gsap.utils.toArray<HTMLElement>(".process-node")

      // Animate the line drawing down using transform scaleY (avoids layout thrashing)
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        }
      )

      // Animate each node as the line reaches it
      nodes.forEach((node) => {
        const dot = node.querySelector(".process-dot")
        const content = node.querySelector(".process-content")

        gsap.to(dot, {
          backgroundColor: "var(--color-brand-200)",
          scale: 1.2,
          boxShadow: "0 0 20px var(--color-brand-200)",
          scrollTrigger: {
            trigger: node,
            start: "center center+=100",
            end: "center center-=100",
            scrub: true,
          },
        })

        gsap.from(content, {
          opacity: 0.2,
          x: -20,
          scrollTrigger: {
            trigger: node,
            start: "top center+=100",
            end: "center center",
            scrub: true,
          },
        })
      })
    },
    { scope: container }
  )

  return (
    <section
      id="process"
      ref={container}
      className="relative w-full overflow-hidden bg-background px-4 py-32 md:px-16"
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        <h2 className="mb-24 text-[12vw] leading-[0.85] font-bold tracking-[-0.04em] text-neutral-100 uppercase md:mb-40 md:text-[6vw]">
          The Process
        </h2>

        {/* The Track */}
        <div
          ref={lineRef}
          className="absolute top-40 bottom-0 left-[23px] w-[2px] rounded-full bg-neutral-800 md:top-56 md:left-[39px]"
        >
          {/* The Fill */}
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full w-full origin-top scale-y-0 rounded-full bg-brand-300 shadow-[0_0_20px_rgba(0,169,174,0.8)]"
          />
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {processSteps.map((step) => (
            <div
              key={step.id}
              className="process-node relative z-10 flex items-start gap-8 md:gap-16"
            >
              {/* Dot */}
              <div className="relative mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background md:h-20 md:w-20">
                <div className="process-dot h-3 w-3 rounded-full bg-neutral-500 transition-colors md:h-4 md:w-4" />
              </div>

              {/* Content */}
              <div className="process-content flex-1 pt-1 md:pt-4">
                <span className="mb-4 block font-mono text-sm text-brand-300">
                  Phase {step.id}
                </span>
                <h3 className="mb-4 text-3xl font-bold tracking-tighter text-foreground uppercase md:text-5xl">
                  {step.title}
                </h3>
                <p className="mb-6 max-w-lg text-lg leading-relaxed text-neutral-300 md:text-xl">
                  {step.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-neutral-600/30 px-3 py-1 text-xs tracking-widest text-neutral-400 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
