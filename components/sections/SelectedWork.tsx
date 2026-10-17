"use client"

import React, { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import Link from "next/link"
import { useCursor } from "../cursor/CursorContext"
import { useQuery } from "@tanstack/react-query"
import { ProjectFormValues } from "@/lib/schemas"
import { VideoMuteButton } from "@/components/media/VideoMuteButton"

export function SelectedWork() {
  const container = useRef<HTMLDivElement>(null)
  const scrollWrapper = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLAnchorElement>(null)
  const { setCursorState } = useCursor()

  const { data: projects, isLoading } = useQuery({
    queryKey: ["publicProjects"],
    queryFn: async () => {
      const res = await fetch("/api/projects")
      if (!res.ok) throw new Error("Failed to fetch projects")
      return res.json()
    },
  })

  const featuredProjects = projects ? projects.slice(0, 4) : []

  useGSAP(
    () => {
      if (
        !container.current ||
        !scrollWrapper.current ||
        isLoading ||
        featuredProjects.length <= 1
      )
        return

      const sections = gsap.utils.toArray<HTMLElement>(".project-card")

      // Calculate exact width to scroll horizontally
      const getScrollAmount = () => {
        return -(scrollWrapper.current!.scrollWidth - window.innerWidth)
      }

      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        gsap.to(scrollWrapper.current, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            pin: true,
            scrub: 1,
            end: () =>
              `+=${scrollWrapper.current!.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
            refreshPriority: 2,
          },
        })
      })

      // Internal Image Parallax
      sections.forEach((section) => {
        const img = section.querySelector(".project-image")
        if (img) {
          gsap.fromTo(
            img,
            { x: "-10vw" },
            {
              x: "10vw",
              ease: "none",
              scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: () => `+=${scrollWrapper.current!.scrollWidth}`,
                scrub: true,
              },
            }
          )
        }
      })

      // Badge entry animation
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { scale: 0, opacity: 0, rotation: -90 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            ease: "back.out(1.5)",
            duration: 1,
            scrollTrigger: {
              trigger: container.current,
              start: "top 60%", // animate in before it pins
              toggleActions: "play reverse play reverse",
            },
          }
        )
      }
    },
    { scope: container, dependencies: [projects, isLoading] }
  )

  return (
    <section
      id="work"
      ref={container}
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      {/* Absolute Title that stays pinned on the left */}
      <div className="pointer-events-none absolute top-8 left-8 z-20 md:top-16 md:left-16">
        <h2 className="text-[10vw] leading-[0.8] font-bold tracking-tighter text-brand-100 uppercase mix-blend-difference md:text-[6vw]">
          Selected
          <br />
          Work
        </h2>
      </div>

      <div
        ref={scrollWrapper}
        className="hide-scrollbar relative flex h-full w-full snap-x snap-mandatory items-center overflow-x-auto md:absolute md:top-0 md:left-0 md:w-max md:snap-none md:overflow-visible md:will-change-transform"
      >
        {isLoading ? (
          <div className="relative flex h-full w-screen items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-neutral-800 border-t-brand-200" />
          </div>
        ) : featuredProjects.length === 0 ? (
          <div className="group relative flex h-full w-screen flex-col items-center justify-center overflow-hidden bg-background">
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-200/5 blur-[100px] transition-colors duration-1000 group-hover:bg-brand-200/10" />
            <h3 className="z-10 mb-4 text-2xl font-bold tracking-tighter text-white uppercase mix-blend-difference md:text-5xl">
              Coming Soon
            </h3>
            <p className="z-10 max-w-sm text-center font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase md:text-xs">
              We are currently curating our latest digital experiences.
            </p>
          </div>
        ) : (
          featuredProjects.map(
            (
              project: Partial<ProjectFormValues> & { slug: string; id: string }
            ) => (
              <div
                key={project.id}
                className="project-card relative flex h-full w-screen shrink-0 snap-center items-center justify-center overflow-hidden"
              >
                <div
                  className="group relative h-full w-full cursor-none"
                  onMouseEnter={() => setCursorState("project")}
                  onMouseLeave={() => setCursorState("default")}
                >
                  <div className="pointer-events-none absolute top-0 left-[-20%] h-full w-[140%]">
                    {project.videoUrl ? (
                      <video
                        className="project-image h-full w-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.1] md:mix-blend-luminosity md:group-hover:mix-blend-normal"
                        src={project.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : project.gallery && project.gallery.length > 0 ? (
                      <img
                        className="project-image h-full w-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.1] md:mix-blend-luminosity md:group-hover:mix-blend-normal"
                        src={project.gallery[0]}
                        alt={project.title || "Project Image"}
                      />
                    ) : null}
                  </div>

                  {/* Overlays for contrast (always visible) */}
                  <div className="absolute inset-0 bg-neutral-900/20 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                  {/* ── Per-card Case Study CTA & Mute Toggle ─────────────────────────────── */}
                  <div className="pointer-events-auto absolute bottom-8 left-8 z-30 flex items-center gap-4 md:bottom-12 md:left-12">
                    <Link
                      href={`/work/${project.slug}`}
                      onMouseEnter={() => setCursorState("link")}
                      onMouseLeave={() => setCursorState("default")}
                    >
                      <div className="group/btn flex items-center gap-3">
                        {/* Pill button */}
                        <div className="relative flex items-center gap-3 overflow-hidden rounded-full border border-brand-500/40 bg-background/30 py-3 pr-4 pl-5 backdrop-blur-md transition-all duration-500 group-hover/btn:border-brand-400 group-hover/btn:bg-brand-500/15 group-hover/btn:pr-5">
                          {/* Animated fill */}
                          <div className="absolute inset-0 translate-x-[-101%] rounded-full bg-brand-500/10 transition-transform duration-500 ease-out group-hover/btn:translate-x-0" />
                          <span className="relative font-mono text-xs tracking-[0.25em] whitespace-nowrap text-brand-100 uppercase transition-colors duration-300">
                            Case Study
                          </span>
                          {/* Arrow icon */}
                          <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 transition-colors duration-300 group-hover/btn:bg-brand-400/30">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                              className="text-brand-100 transition-transform duration-300 group-hover/btn:translate-x-px"
                            >
                              <path
                                d="M1 9L9 1M9 1H3M9 1V7"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>

                    {project.videoUrl && <VideoMuteButton />}
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>

      {/* Floating Circular Badge — links to full archive */}
      <Link
        href="/work"
        ref={badgeRef}
        className="group absolute right-8 bottom-8 z-30 cursor-none md:right-16 md:bottom-16"
        onMouseEnter={() => setCursorState("link")}
        onMouseLeave={() => setCursorState("default")}
      >
        <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-brand-500/20 bg-brand-500/10 backdrop-blur-md transition-colors duration-500 hover:bg-brand-500/20 md:h-40 md:w-40">
          {/* Rotating Text SVG */}
          <div className="absolute inset-0 h-full w-full animate-[spin_10s_linear_infinite] group-hover:animate-[spin_4s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="h-full w-full text-brand-100">
              <path
                id="circlePath"
                d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
                fill="transparent"
              />
              <text className="fill-current font-mono text-[12px] tracking-[0.2em] uppercase">
                <textPath href="#circlePath" startOffset="0%">
                  VIEW ALL WORKS • VIEW ALL WORKS •
                </textPath>
              </text>
            </svg>
          </div>
          {/* Center Arrow */}
          <div className="absolute text-brand-100 transition-transform duration-500 ease-out group-hover:scale-125">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </Link>
    </section>
  )
}
