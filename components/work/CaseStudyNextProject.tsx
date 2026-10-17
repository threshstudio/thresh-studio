"use client"

import React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { VideoMuteButton } from "@/components/media/VideoMuteButton"
import { Contact } from "@/components/sections/Contact"
import { useCursor } from "@/components/cursor/CursorContext"

interface NextProjectData {
  title: string
  slug: string
  videoUrl?: string
}

interface CaseStudyNextProjectProps {
  nextProject: NextProjectData | null
}

export function CaseStudyNextProject({
  nextProject,
}: CaseStudyNextProjectProps) {
  const { setCursorState } = useCursor()

  if (!nextProject) {
    return <Contact />
  }

  return (
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

          <div className="absolute right-6 bottom-6 z-20">
            <VideoMuteButton />
          </div>

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
  )
}
