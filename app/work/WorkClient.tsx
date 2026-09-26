"use client"

import React, { useRef, useState, useMemo } from "react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useCursor } from "@/components/cursor/CursorContext"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowUpRight, SearchX } from "lucide-react"
import { Footer } from "@/components/sections/Footer"
import { useQuery } from "@tanstack/react-query"
import { PageSkeleton } from "@/components/shared/PageSkeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { ProjectFormValues } from "@/lib/schemas"

export function WorkClient() {
  const container = useRef<HTMLDivElement>(null)
  const { setCursorState } = useCursor()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, "-")

  const [activeCategory, setActiveCategory] = useState<string>(
    categoryParam || "all"
  )

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publicProjects"],
    queryFn: async () => {
      const res = await fetch("/api/projects")
      if (!res.ok) throw new Error("Failed to fetch projects")
      return res.json()
    },
  })

  const categories = useMemo(() => {
    if (!projects) return ["All"]
    const unique = new Set<string>(
      projects.map(
        (p: Partial<ProjectFormValues> & { slug: string; id: string }) =>
          p.category as string
      )
    )
    return ["All", ...Array.from(unique)]
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (!projects) return []
    if (activeCategory === "all") return projects
    return projects.filter(
      (p: Partial<ProjectFormValues> & { slug: string; id: string }) =>
        slugify(p.category as string) === activeCategory
    )
  }, [projects, activeCategory])

  useGSAP(
    () => {
      if (!container.current || isLoading || filteredProjects.length === 0)
        return

      window.scrollTo(0, 0)

      const tl = gsap.timeline()

      // Intro Animations for sticky left panel
      tl.fromTo(
        ".sticky-elem",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.2,
        }
      )

      // Initial load animation for right panel projects
      tl.fromTo(
        ".project-card",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" },
        "-=1"
      )

      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        // Desktop: Extreme Image Parallax & Scrub Scale Effect
        const cards = gsap.utils.toArray<HTMLElement>(".project-card")
        cards.forEach((card) => {
          const inner = card.querySelector(".project-card-inner")
          const img = card.querySelector(".project-media")

          if (inner) {
            const scrubTl = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 95%",
                end: "top -35%",
                scrub: true,
              },
            })

            // ENTER (first half): narrow → full width
            scrubTl
              .fromTo(
                inner,
                { scaleX: 0.75, scaleY: 0.95, opacity: 0.5, y: 40 },
                {
                  scaleX: 1,
                  scaleY: 1,
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "none",
                }
              )
              // EXIT (second half): full width → narrow, perfectly mirrored
              .to(inner, {
                scaleX: 0.75,
                scaleY: 0.95,
                opacity: 0.5,
                y: -40,
                duration: 0.5,
                ease: "none",
              })
          }

          if (img) {
            gsap.fromTo(
              img,
              { y: "-15%" },
              {
                y: "15%",
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            )
          }
        })
      })

      mm.add("(max-width: 767px)", () => {
        // Mobile: Simplified Fade & Parallax
        const cards = gsap.utils.toArray<HTMLElement>(".project-card")
        cards.forEach((card) => {
          const inner = card.querySelector(".project-card-inner")
          const img = card.querySelector(".project-media")

          if (inner) {
            gsap.fromTo(
              inner,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              }
            )
          }

          if (img) {
            gsap.to(img, {
              y: "10%", // much lighter parallax
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            })
          }
        })
      })
    },
    { scope: container, dependencies: [filteredProjects, isLoading] }
  )

  // Handle category change with a simple transition
  const handleCategoryClick = (category: string) => {
    if (category === activeCategory) return

    // Update URL instantly WITHOUT page refresh
    window.history.pushState(
      null,
      "",
      `/work${category === "all" ? "" : `?category=${category}`}`
    )

    const cards = document.querySelectorAll(".project-card")
    if (cards.length === 0) {
      setActiveCategory(category)
      return
    }

    // Animate out current projects
    gsap.to(cards, {
      y: 50,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        setActiveCategory(category)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="relative z-10 overflow-clip rounded-b-3xl bg-background md:rounded-b-[60px]">
          <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
            {/* LEFT SKELETON */}
            <div className="flex w-full flex-col justify-between border-b border-neutral-800/50 bg-background p-8 pt-28 md:p-16 lg:sticky lg:top-0 lg:h-screen lg:w-1/3 lg:border-r lg:border-b-0 lg:pt-40">
              <div className="flex w-full flex-col items-start space-y-4">
                <div className="mb-12 h-4 w-32 animate-pulse rounded-full bg-neutral-900" />
                <div className="h-16 w-4/5 animate-pulse rounded-2xl bg-neutral-900 md:h-20" />
                <div className="mb-8 h-16 w-3/5 animate-pulse rounded-2xl bg-neutral-900 md:h-20" />
                <div className="mt-8 h-4 w-full max-w-sm animate-pulse rounded-full bg-neutral-900" />
                <div className="h-4 w-3/4 max-w-sm animate-pulse rounded-full bg-neutral-900" />
              </div>
            </div>

            {/* RIGHT SKELETON */}
            <div className="flex min-h-screen w-full flex-col p-4 pt-12 md:p-8 lg:w-2/3 lg:p-16 lg:pt-32">
              <div className="sticky top-0 z-40 mb-16 bg-background pt-20 pb-4 md:pt-28">
                <div className="h-10 w-full max-w-xl animate-pulse rounded-full bg-neutral-900" />
              </div>
              <div className="mt-4 flex flex-col gap-16 md:gap-32">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex aspect-[4/3] w-full animate-pulse flex-col justify-end rounded-xl border border-neutral-800/50 bg-neutral-900 p-8 md:aspect-[16/10] md:rounded-3xl"
                  >
                    <div className="mb-4 h-6 w-1/4 rounded-full bg-neutral-800/50" />
                    <div className="h-10 w-2/3 rounded-xl bg-neutral-800/50" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <EmptyState
          title="Connection Error"
          description="Failed to load the archive. Please try refreshing."
          action={{ label: "Refresh", href: "/work" }}
        />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="relative z-10 overflow-clip rounded-b-3xl bg-background shadow-[0_30px_60px_rgba(0,0,0,0.8)] md:rounded-b-[60px]">
        <main
          ref={container}
          className="relative flex min-h-screen w-full flex-col lg:flex-row"
        >
          {/* LEFT: Sticky Sidebar */}
          <div className="z-20 flex w-full flex-col justify-between border-b border-neutral-800/50 bg-background/50 p-8 pt-28 backdrop-blur-md md:p-16 lg:sticky lg:top-0 lg:h-screen lg:w-1/3 lg:border-r lg:border-b-0 lg:pt-40">
            <div className="sticky-elem flex flex-col items-start">
              <Link
                href="/"
                className="group mb-16 flex cursor-none items-center gap-2 font-mono text-sm tracking-wider text-neutral-400 uppercase transition-colors hover:text-brand-100"
                onMouseEnter={() => setCursorState("link")}
                onMouseLeave={() => setCursorState("default")}
              >
                <div className="rounded-full border border-neutral-800 p-2 transition-colors group-hover:border-brand-500">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </div>
                Back to Home
              </Link>

              <div className="mb-6 overflow-hidden">
                <h1 className="text-[15vw] leading-[0.85] font-bold tracking-tighter text-brand-100 uppercase mix-blend-difference lg:text-[6vw]">
                  Selected
                  <br />
                  Archive
                </h1>
              </div>

              <div className="mb-12 overflow-hidden">
                <p className="max-w-sm text-lg leading-relaxed font-light text-neutral-400 md:text-xl">
                  A curated collection of our most iconic digital experiences,
                  product motion, and cinematic campaigns.
                </p>
              </div>

              {/* Filter system removed from here */}
            </div>

            <div className="sticky-elem hidden flex-col gap-6 font-mono text-sm tracking-widest text-neutral-500 uppercase lg:flex">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
                <span>Available for new projects</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Scrollable Project List */}
          <div className="relative flex min-h-screen w-full flex-col p-4 pt-12 pb-32 md:p-8 lg:w-2/3 lg:p-16 lg:pt-32">
            {/* STICKY TOP FILTER BAR */}
            <div className="sticky top-0 z-40 -mx-4 mb-16 flex flex-wrap items-center gap-y-4 border-b border-neutral-800/50 bg-background/95 px-4 pt-20 pb-4 backdrop-blur-xl md:mx-0 md:px-0 md:pt-28">
              <span className="mr-6 hidden shrink-0 font-mono text-xs tracking-widest text-neutral-500 uppercase md:block">
                Filter:
              </span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat: string) => {
                  const catSlug = slugify(cat)
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(catSlug)}
                      className={`rounded-full border px-5 py-2.5 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 md:text-xs ${
                        activeCategory === catSlug
                          ? "border-brand-200 bg-brand-200 font-bold text-neutral-950 shadow-[0_0_15px_rgba(0,211,218,0.4)]"
                          : "border-neutral-800 bg-transparent text-neutral-400 hover:border-brand-200/50 hover:text-brand-100"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* PROJECTS GRID */}
            <div className="mt-4 flex flex-col gap-16 md:gap-32">
              {filteredProjects.length === 0 ? (
                <div className="group relative flex h-96 flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-neutral-800/60 bg-neutral-900/20 backdrop-blur-sm">
                  {/* Subtle glowing orb in background */}
                  <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[80px] transition-colors duration-1000 group-hover:bg-brand-500/20" />

                  <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 transition-colors duration-500 group-hover:border-brand-500/30">
                    <SearchX className="h-6 w-6 text-brand-500/80" />
                  </div>

                  <h3 className="relative z-10 mb-2 text-xl font-bold tracking-tighter text-white uppercase md:text-2xl">
                    No Projects Found
                  </h3>

                  <p className="relative z-10 max-w-sm px-6 text-center font-mono text-xs leading-relaxed tracking-widest text-neutral-500 uppercase">
                    We haven&apos;t published any works in the <br />
                    <span className="text-brand-300">
                      &quot;{activeCategory.replace(/-/g, " ")}&quot;
                    </span>{" "}
                    category yet.
                  </p>

                  {activeCategory !== "all" && (
                    <button
                      onClick={() => handleCategoryClick("all")}
                      className="relative z-10 mt-8 rounded-full bg-brand-200 px-6 py-3 font-mono text-[10px] font-bold tracking-widest text-neutral-950 uppercase shadow-[0_0_20px_rgba(0,211,218,0.3)] transition-colors hover:bg-brand-100 hover:shadow-[0_0_30px_rgba(0,211,218,0.5)] md:text-xs"
                    >
                      View All Works
                    </button>
                  )}
                </div>
              ) : (
                filteredProjects.map(
                  (
                    project: Partial<ProjectFormValues> & {
                      slug: string
                      id: string
                    }
                  ) => (
                    <div
                      key={project.id}
                      className="project-card relative w-full opacity-0"
                    >
                      <Link
                        href={`/work/${project.slug}`}
                        className="block cursor-none"
                        onMouseEnter={() => setCursorState("project")}
                        onMouseLeave={() => setCursorState("default")}
                      >
                        <div className="project-card-inner group relative flex w-full flex-col will-change-transform">
                          {/* Image/Video Container */}
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-800/50 bg-neutral-900 md:aspect-[16/10] md:rounded-3xl">
                            <div className="pointer-events-none absolute inset-[-20%] h-[140%] w-[140%]">
                              <video
                                className="project-media h-full w-full object-cover transition-all duration-[2s] ease-out group-hover:scale-[1.05]"
                                src={project.videoUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            </div>

                            {/* View Case Study hover pill — top right of image */}
                            <div className="absolute top-4 right-4 z-20 translate-y-0 opacity-100 transition-all duration-400 ease-out md:top-6 md:right-6 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                              <div className="flex items-center gap-2 rounded-full border border-brand-500/40 bg-background/60 py-2 pr-3 pl-4 backdrop-blur-md">
                                <span className="font-mono text-xs tracking-widest text-brand-100 uppercase">
                                  View Case Study
                                </span>
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/30">
                                  <ArrowUpRight className="h-3 w-3 text-brand-100" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Metadata Row */}
                          <div className="mt-6 flex items-center justify-between px-2 md:mt-8">
                            <div className="flex flex-col gap-2 font-mono text-sm tracking-widest uppercase md:flex-row md:items-center md:gap-6 md:text-base">
                              <span className="text-brand-300">
                                {project.category}
                              </span>
                              <span className="hidden h-1 w-1 rounded-full bg-neutral-700 md:block" />
                              <span className="text-neutral-500">
                                {project.year}
                              </span>
                            </div>

                            <div className="text-xl font-bold tracking-wider text-white uppercase transition-colors group-hover:text-brand-200 md:text-2xl">
                              {project.title}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
