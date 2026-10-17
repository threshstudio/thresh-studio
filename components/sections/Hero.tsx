"use client"

import React, { useRef, useState } from "react"
import Link from "next/link"
import { gsap, useGSAP } from "@/lib/gsap"
import { useCursor } from "../cursor/CursorContext"
import { Loader2 } from "lucide-react"
import { useSettings } from "@/hooks/useSettings"
import { VideoMuteButton } from "@/components/media/VideoMuteButton"

export function Hero() {
  const { setCursorState } = useCursor()
  const container = useRef<HTMLDivElement>(null)
  const textContainer = useRef<HTMLDivElement>(null)
  const videoWrapper = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { data } = useSettings()
  const videoUrl = data?.heroVideoUrl

  const [isBuffering, setIsBuffering] = useState(true)

  useGSAP(
    () => {
      if (!container.current) return

      const letters = gsap.utils.toArray(".hero-letter")
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean }

          // Initial Text Animations
          gsap.fromTo(
            letters,
            {
              y: 150,
              opacity: 0,
              rotateX: -90,
              filter: isDesktop ? "blur(20px)" : "blur(0px)",
            },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              filter: "blur(0px)",
              duration: 1.5,
              stagger: 0.02,
              ease: "power4.out",
              delay: 1.8,
            }
          )

          gsap.fromTo(
            ".hero-sub",
            {
              opacity: 0,
              y: 20,
              filter: isDesktop ? "blur(15px)" : "blur(0px)",
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1,
              delay: 2.3,
              ease: "power3.out",
            }
          )

          // Scroll Choreography
          if (isDesktop) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: "+=200%",
                scrub: 1,
                pin: true,
                refreshPriority: 3,
              },
            })

            tl.to(
              textContainer.current,
              {
                scale: 1.5,
                opacity: 0,
                filter: "blur(20px)",
                duration: 1,
                ease: "power2.inOut",
              },
              0
            )
              .to(
                videoWrapper.current,
                {
                  width: "100%",
                  height: "100vh",
                  borderRadius: "0px",
                  bottom: "0",
                  duration: 1.5,
                  ease: "power2.inOut",
                },
                0
              )
              .to(
                ".hero-overlay",
                {
                  opacity: 0,
                  backdropFilter: "blur(0px)",
                  duration: 1.5,
                },
                0
              )
          } else {
            // Mobile: Simpler scroll effect, no pinning, no layout thrashing
            const tlMobile = gsap.timeline({
              scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: "bottom center",
                scrub: true,
              },
            })

            tlMobile
              .to(
                textContainer.current,
                {
                  opacity: 0,
                  y: -50,
                  ease: "none",
                },
                0
              )
              .to(
                ".hero-overlay",
                {
                  opacity: 0,
                  backdropFilter: "blur(0px)",
                  ease: "none",
                },
                0
              )
          }
        }
      )
    },
    { scope: container }
  )

  const title = "THRESH STUDIO"

  return (
    <section
      ref={container}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background pt-10"
      style={{ perspective: "1000px" }}
    >
      {/* Cinematic Glowing Background Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-brand-600)_0%,transparent_50%)] opacity-30" />
      <div className="pointer-events-none absolute top-1/4 left-1/4 z-0 hidden h-[50vw] w-[50vw] rounded-full bg-brand-500/20 mix-blend-screen blur-[120px] md:block" />

      <div
        ref={textContainer}
        className="relative z-10 flex w-full transform-gpu flex-col items-center justify-center px-4 text-center"
      >
        <h1 className="flex max-w-full flex-wrap justify-center overflow-visible text-[10vw] leading-[0.85] font-bold tracking-[-0.04em] whitespace-nowrap text-neutral-100 uppercase mix-blend-plus-lighter drop-shadow-[0_0_30px_rgba(125,249,255,0.15)] md:text-[8vw]">
          {title.split("").map((char, i) => (
            <span
              key={i}
              className="hero-letter inline-block"
              style={{
                color:
                  char === " "
                    ? "transparent"
                    : i >= 7
                      ? "var(--color-brand-200)"
                      : "inherit",
                transformOrigin: "bottom center",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <div className="hero-sub mt-6 flex flex-col items-center gap-8 md:mt-10 md:gap-12">
          <p className="max-w-2xl text-center text-sm leading-relaxed font-medium tracking-[0.3em] text-brand-100 uppercase md:text-xl">
            Premium Product Branding & <br className="hidden md:block" />{" "}
            Cinematic Marketing Videos
          </p>

          <div className="flex w-full flex-col items-stretch gap-4 px-6 sm:w-auto sm:flex-row md:gap-6 md:px-0">
            <a
              href="https://calendly.com/threshstudioz/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex cursor-none items-center justify-center overflow-hidden rounded-full border border-brand-500 bg-brand-500/10 px-6 py-4 shadow-lg backdrop-blur-md transition-colors duration-700 hover:bg-brand-500/30 sm:px-8 sm:py-4 md:px-10 md:py-5"
              onMouseEnter={() => setCursorState("magnetic")}
              onMouseLeave={() => setCursorState("default")}
            >
              <div className="absolute inset-0 translate-y-[101%] bg-brand-500 transition-transform duration-700 ease-[0.76,0,0.24,1] group-hover:translate-y-0" />
              <span className="relative z-10 font-mono text-xs font-bold tracking-[0.2em] text-brand-100 uppercase transition-colors duration-300 group-hover:text-neutral-900 md:text-sm md:tracking-[0.3em]">
                Start Project
              </span>
            </a>

            <Link
              href="/work"
              className="group relative flex cursor-none items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 px-6 py-4 shadow-lg backdrop-blur-md transition-colors duration-700 hover:border-white/30 sm:px-8 sm:py-4 md:px-10 md:py-5"
              onMouseEnter={() => setCursorState("magnetic")}
              onMouseLeave={() => setCursorState("default")}
            >
              <div className="absolute inset-0 translate-y-[101%] bg-white/10 transition-transform duration-700 ease-[0.76,0,0.24,1] group-hover:translate-y-0" />
              <span className="relative z-10 font-mono text-xs tracking-[0.2em] text-neutral-100 uppercase transition-colors duration-300 group-hover:text-white md:text-sm md:tracking-[0.3em]">
                View Works
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={videoWrapper}
        className="absolute right-0 bottom-[-5%] left-0 z-0 mx-auto h-[35vh] w-[90vw] transform-gpu overflow-hidden rounded-[20px] border border-brand-500/20 bg-neutral-600 shadow-[0_0_50px_rgba(0,22,23,0.8)] sm:bottom-[5%] sm:h-[40vh] sm:w-[60vw] sm:rounded-[30px]"
      >
        <div className="hero-overlay pointer-events-none absolute inset-0 z-10 bg-neutral-900/40 md:backdrop-blur-[20px]" />

        {isBuffering && videoUrl && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/50">
            <Loader2 className="h-10 w-10 animate-spin text-brand-300" />
          </div>
        )}

        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 z-0 h-full w-full object-cover opacity-80"
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onCanPlay={() => setIsBuffering(false)}
            />
            <div className="absolute right-4 bottom-4 z-30 sm:right-6 sm:bottom-6">
              <VideoMuteButton videoRef={videoRef} />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 z-0 bg-neutral-800" />
        )}
      </div>
    </section>
  )
}
