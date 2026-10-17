"use client"

import React, { useRef, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useCursor } from "@/components/cursor/CursorContext"
import { Footer } from "@/components/sections/Footer"
import { useQuery } from "@tanstack/react-query"
import { ProjectFormValues } from "@/lib/schemas"
import { EmptyState } from "@/components/shared/EmptyState"
import { VideoMuteButton } from "@/components/media/VideoMuteButton"
import { CaseStudyOverview } from "@/components/work/CaseStudyOverview"
import { CaseStudyGallery } from "@/components/work/CaseStudyGallery"
import { CaseStudyNextProject } from "@/components/work/CaseStudyNextProject"

export function CaseStudyClient({ slug }: { slug: string }) {
  const { setCursorState } = useCursor()

  // Fetch current project
  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${slug}`)
      if (!res.ok) {
        if (res.status === 404) return null
        throw new Error("Failed to fetch project")
      }
      return res.json()
    },
  })

  // Fetch all projects to compute "Next Project" logic
  const { data: allProjects } = useQuery({
    queryKey: ["publicProjects"],
    queryFn: async () => {
      const res = await fetch("/api/projects")
      if (!res.ok) throw new Error("Failed to fetch all projects")
      return res.json()
    },
  })

  const nextProject = useMemo(() => {
    if (!allProjects || !project || allProjects.length <= 1) return null
    const currentIndex = allProjects.findIndex(
      (p: Partial<ProjectFormValues> & { slug: string; id: string }) =>
        p.slug === project.slug
    )
    if (currentIndex === -1) return null

    // Return the next project, or loop back to the first if it's the last one
    return allProjects[(currentIndex + 1) % allProjects.length]
  }, [allProjects, project])

  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (
        isLoading ||
        !project ||
        !heroRef.current ||
        !headerRef.current ||
        !cardRef.current
      )
        return

      // ── 1. Entrance ───────────────────────────────────────────────────
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".cs-back",
          { y: -16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          0.15
        )
        .fromTo(
          ".cs-cat",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.07 },
          0.25
        )
        .fromTo(
          ".cs-title",
          { y: 64, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1 },
          0.35
        )
        .fromTo(
          ".cs-sub",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          0.55
        )
        .fromTo(
          cardRef.current,
          { scale: 1.07, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5 },
          0.1
        )

      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        // ── 2. Compute initial card bounds from rendered header (Desktop) ───────────
        const headerRect = headerRef.current!.getBoundingClientRect()
        const initTop = headerRect.height + 20
        const initLeft = 64
        const initRight = 64
        const initBottom = 0

        // Position the card absolute full screen, but clip it to match header bounds
        gsap.set(cardRef.current, {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          clipPath: `inset(${initTop}px ${initRight}px ${initBottom}px ${initLeft}px round 20px)`,
        })

        // ── 3. Scroll-driven expansion ────────────────────────────────────
        const expandTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=1000",
            pin: true,
            scrub: 1.5,
            anticipatePin: 1,
            pinSpacing: true,
          },
        })

        expandTl
          // Fade/slide the text header away
          .to(headerRef.current, { opacity: 0, y: -32, duration: 0.4 }, 0)
          // Expand card to fullscreen via clip-path
          .to(
            cardRef.current,
            {
              clipPath: "inset(0px 0px 0px 0px round 0px)",
              duration: 1,
              ease: "none",
            },
            0
          )
      })

      mm.add("(max-width: 767px)", () => {
        // ── Mobile Layout (No pinning, no layout thrashing) ───────────
        gsap.set(cardRef.current, {
          position: "relative",
          top: "auto",
          left: "auto",
          right: "auto",
          bottom: "auto",
          marginTop: "24px",
          borderRadius: "1rem",
          overflow: "hidden",
          width: "100%",
          height: "auto",
          aspectRatio: "4/3",
        })

        gsap.to(headerRef.current, {
          opacity: 0,
          y: -16,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
      })

      // ── 4. Scroll reveals for sections below ─────────────────────────
      gsap.utils
        .toArray<HTMLElement>(".cs-reveal", containerRef.current)
        .forEach((el) => {
          gsap.fromTo(
            el,
            { y: 48, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }
          )
        })

      if (containerRef.current?.querySelector(".cs-stats-row")) {
        gsap.fromTo(
          ".cs-stat",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: { trigger: ".cs-stats-row", start: "top 88%" },
          }
        )
      }

      gsap.utils
        .toArray<HTMLElement>(".cs-gal", containerRef.current)
        .forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              delay: (i % 2) * 0.12,
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                toggleActions: "play none none none",
              },
            }
          )
        })
    },
    { scope: containerRef, dependencies: [isLoading, project] }
  )

  // Helper to determine if a gallery URL is a video
  const isVideoUrl = (url: string): boolean =>
    Boolean(url.match(/\.(mp4|webm|ogg)$/i) || url.includes("/video/upload/"))

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <section className="relative z-[2] h-screen w-full animate-pulse bg-neutral-950/50 pb-10 md:pb-0">
          <div className="relative z-10 px-6 pt-36 pb-5 md:px-16 md:pt-40">
            <div className="mb-8 h-6 w-24 rounded-full bg-neutral-900" />
            <div className="mb-5 flex items-center gap-5">
              <div className="h-4 w-24 rounded-full bg-neutral-900" />
              <div className="h-px w-6 bg-neutral-800" />
              <div className="h-4 w-16 rounded-full bg-neutral-900" />
            </div>
            <div className="mb-4 h-16 w-3/4 rounded-2xl bg-neutral-900 md:h-24" />
            <div className="mb-8 h-16 w-1/2 rounded-2xl bg-neutral-900 md:h-24" />
            <div className="h-4 w-full max-w-xl rounded-full bg-neutral-900" />
          </div>
          <div className="absolute inset-0 -z-10 bg-neutral-900/40" />
        </section>
      </div>
    )
  }

  if (isError || project === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <EmptyState
          title="Project Not Found"
          description="The case study you are looking for does not exist or has been unpublished."
          action={{ label: "View All Work", href: "/work" }}
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative bg-background text-foreground">
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative z-[2] min-h-screen bg-background pb-10 md:h-screen md:overflow-hidden md:pb-0"
      >
        <div
          ref={headerRef}
          className="relative z-10 px-6 pt-36 pb-5 md:px-16 md:pt-40"
        >
          <Link
            href="/work"
            className="cs-back group mb-8 inline-flex cursor-none items-center gap-2 font-mono text-xs tracking-widest text-neutral-500 uppercase transition-colors hover:text-brand-100"
            onMouseEnter={() => setCursorState("link")}
            onMouseLeave={() => setCursorState("default")}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-700 transition-colors group-hover:border-brand-500">
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-px" />
            </span>
            All Work
          </Link>

          <div className="mb-5 flex items-center gap-5">
            <span className="cs-cat font-mono text-xs tracking-[0.35em] text-brand-300 uppercase">
              {project.category}
            </span>
            <span className="cs-cat h-px w-6 bg-neutral-700" />
            <span className="cs-cat font-mono text-xs tracking-[0.35em] text-neutral-500 uppercase">
              {project.year}
            </span>
          </div>

          <h1 className="cs-title mb-3 text-[11vw] leading-[0.85] font-bold tracking-[-0.04em] text-brand-100 uppercase md:text-[7vw]">
            {project.title}
          </h1>

          <p className="cs-sub max-w-xl text-sm leading-relaxed font-light text-neutral-400 md:text-base">
            {project.tagline}
          </p>
        </div>

        <div
          ref={cardRef}
          className="relative cursor-none"
          onMouseEnter={() => setCursorState("drag")}
          onMouseLeave={() => setCursorState("default")}
        >
          <video
            src={project.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute right-6 bottom-6 z-20 md:right-10 md:bottom-10">
            <VideoMuteButton size="lg" />
          </div>
        </div>
      </section>

      {/* ── CONTENT CARD ───────────────────────────────────────────────── */}
      <div className="relative z-[1] overflow-clip rounded-b-3xl bg-background shadow-[0_30px_60px_rgba(0,0,0,0.8)] md:rounded-b-[60px]">
        {/* STATS & OVERVIEW */}
        <CaseStudyOverview
          stats={project.stats}
          description={project.description}
          services={project.services}
          deliverables={project.deliverables}
        />

        {/* CHALLENGE / APPROACH */}
        <section className="border-b border-neutral-800/60">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-neutral-800/60 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <div className="cs-reveal px-6 py-16 md:px-16 md:py-24">
              <p className="mb-6 font-mono text-sm font-semibold tracking-widest text-neutral-400 uppercase md:text-base">
                The Challenge
              </p>
              <p className="text-lg leading-relaxed font-light whitespace-pre-wrap text-neutral-300 md:text-xl">
                {project.challenge}
              </p>
            </div>
            <div className="cs-reveal px-6 py-16 md:px-16 md:py-24">
              <p className="mb-6 font-mono text-sm font-semibold tracking-widest text-neutral-400 uppercase md:text-base">
                Our Approach
              </p>
              <p className="text-lg leading-relaxed font-light whitespace-pre-wrap text-neutral-300 md:text-xl">
                {project.approach}
              </p>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <CaseStudyGallery
          gallery={project.gallery}
          title={project.title}
          isVideoUrl={isVideoUrl}
        />

        {/* OUTCOME */}
        <section className="border-b border-neutral-800/60 px-6 py-20 md:px-16 md:py-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="cs-reveal">
              <p className="mb-6 font-mono text-sm font-semibold tracking-widest text-neutral-400 uppercase md:text-base">
                The Outcome
              </p>
              <h2 className="text-6xl leading-[0.85] font-bold tracking-tighter text-brand-500 uppercase md:text-8xl">
                The
                <br />
                Result.
              </h2>
            </div>
            <p className="cs-reveal text-xl leading-relaxed font-light whitespace-pre-wrap text-neutral-200 md:text-2xl">
              {project.outcome}
            </p>
          </div>
        </section>

        {/* NEXT PROJECT OR CONTACT */}
        <CaseStudyNextProject nextProject={nextProject} />
      </div>
      {/* end content card */}

      <Footer />
    </div>
  )
}
