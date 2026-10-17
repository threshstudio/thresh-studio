"use client"

import React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useCursor } from "@/components/cursor/CursorContext"
import { VideoMuteButton } from "@/components/media/VideoMuteButton"
import { ProjectFormValues } from "@/lib/schemas"

interface WorkProjectCardProps {
  project: Partial<ProjectFormValues> & { slug: string; id: string }
}

export function WorkProjectCard({ project }: WorkProjectCardProps) {
  const { setCursorState } = useCursor()

  return (
    <div className="project-card relative w-full opacity-0">
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

            {/* View Case Study hover pill */}
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

            {/* Mute/Unmute Toggle */}
            {project.videoUrl && (
              <div className="absolute right-4 bottom-4 z-20 md:right-6 md:bottom-6">
                <VideoMuteButton size="sm" />
              </div>
            )}
          </div>

          {/* Metadata Row */}
          <div className="mt-6 flex items-center justify-between px-2 md:mt-8">
            <div className="flex flex-col gap-2 font-mono text-sm tracking-widest uppercase md:flex-row md:items-center md:gap-6 md:text-base">
              <span className="text-brand-300">{project.category}</span>
              <span className="hidden h-1 w-1 rounded-full bg-neutral-700 md:block" />
              <span className="text-neutral-500">{project.year}</span>
            </div>

            <div className="text-xl font-bold tracking-wider text-white uppercase transition-colors group-hover:text-brand-200 md:text-2xl">
              {project.title}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
