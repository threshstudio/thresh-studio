"use client"

import React, { useRef, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useCursor } from "@/components/cursor/CursorContext"
import { Footer } from "@/components/sections/Footer"
import { Contact } from "@/components/sections/Contact"
import { useQuery } from "@tanstack/react-query"
import { ProjectFormValues } from "@/lib/schemas"
import { EmptyState } from "@/components/shared/EmptyState"

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
  const isVideoUrl = (url: string) =>
    url.match(/\.(mp4|webm|ogg)$/i) || url.includes("/video/upload/")

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
          className="cursor-none"
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
        </div>
      </section>

      {/* ── CONTENT CARD ───────────────────────────────────────────────── */}
      <div className="relative z-[1] overflow-clip rounded-b-3xl bg-background shadow-[0_30px_60px_rgba(0,0,0,0.8)] md:rounded-b-[60px]">
        {/* STATS */}
        {project.stats && project.stats.length > 0 && (
          <div className="cs-stats-row border-b border-neutral-800/60">
            <div className="grid grid-cols-1 divide-y divide-neutral-800/60 md:grid-cols-3 md:divide-x md:divide-y-0">
              {project.stats.map(
                (stat: { label: string; value: string }, idx: number) => (
                  <div
                    key={idx}
                    className="cs-stat flex flex-col gap-2 px-8 py-10 md:px-16"
                  >
                    <span className="text-5xl font-bold tracking-tighter text-brand-500 md:text-6xl">
                      {stat.value}
                    </span>
                    <span className="font-mono text-xs tracking-[0.25em] text-neutral-500 uppercase">
                      {stat.label}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* OVERVIEW */}
        <section className="border-b border-neutral-800/60 px-6 py-20 md:px-16 md:py-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="cs-reveal">
              <p className="mb-6 font-mono text-sm font-semibold tracking-widest text-brand-400 uppercase drop-shadow-md md:text-base">
                Overview
              </p>
              <p className="text-xl leading-relaxed font-light whitespace-pre-wrap text-neutral-200 md:text-2xl">
                {project.description}
              </p>
            </div>
            <div className="flex flex-col gap-10">
              {project.services && project.services.length > 0 && (
                <div className="cs-reveal">
                  <p className="mb-5 font-mono text-sm font-semibold tracking-widest text-neutral-400 uppercase md:text-base">
                    Services
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {project.services.map((s: string) => (
                      <li
                        key={s}
                        className="rounded-full border border-neutral-700 px-4 py-2 font-mono text-sm tracking-wide text-neutral-300 uppercase"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.deliverables && project.deliverables.length > 0 && (
                <div className="cs-reveal">
                  <p className="mb-5 font-mono text-sm font-semibold tracking-widest text-neutral-400 uppercase md:text-base">
                    Deliverables
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {project.deliverables.map((d: string) => (
                      <li
                        key={d}
                        className="rounded-full border border-brand-700/50 bg-brand-700/15 px-4 py-2 font-mono text-sm tracking-wide text-brand-200 uppercase"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

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
        {project.gallery && project.gallery.length > 0 && (
          <section className="border-b border-neutral-800/60 px-6 py-20 md:px-16 md:py-28">
            <p className="cs-reveal mb-10 font-mono text-sm font-semibold tracking-widest text-neutral-400 uppercase md:text-base">
              Process & Stills
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              {project.gallery.map((src: string, i: number) => (
                <div
                  key={i}
                  className={`cs-gal relative overflow-hidden rounded-2xl bg-neutral-900 ${i === 0 ? "aspect-[16/7] md:col-span-2" : "aspect-[4/3]"}`}
                >
                  {isVideoUrl(src) ? (
                    <video
                      src={src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover transition-all duration-700"
                    />
                  ) : (
                    <Image
                      src={src}
                      alt={`${project.title} gallery item`}
                      fill
                      className="object-cover transition-all duration-700 hover:scale-[1.04]"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

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
        {nextProject ? (
          <section className="cs-reveal">
            <Link
              href={`/work/${nextProject.slug}`}
              className="group block cursor-none"
              onMouseEnter={() => setCursorState("project")}
              onMouseLeave={() => setCursorState("default")}
            >
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-neutral-900">
                <video
                  src={nextProject.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04]"
                />

                {/* Smart Hover Pill */}
                <div className="absolute top-6 right-6 z-20 translate-y-0 opacity-100 transition-all duration-500 ease-out md:top-8 md:right-8 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  <div className="flex items-center gap-3 rounded-full border border-brand-500/40 bg-background/60 py-3 pr-4 pl-5 backdrop-blur-md">
                    <span className="font-mono text-xs tracking-widest text-brand-100 uppercase">
                      Next: {nextProject.title}
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/30">
                      <ArrowUpRight className="h-3 w-3 text-brand-100" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        ) : (
          <Contact />
        )}
      </div>
      {/* end content card */}

      <Footer />
    </div>
  )
}
