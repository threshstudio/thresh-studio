"use client"

import React from "react"
import Image from "next/image"
import { VideoMuteButton } from "@/components/media/VideoMuteButton"

interface CaseStudyGalleryProps {
  gallery: string[]
  title: string
  isVideoUrl: (url: string) => boolean
}

export function CaseStudyGallery({
  gallery,
  title,
  isVideoUrl,
}: CaseStudyGalleryProps) {
  if (!gallery || gallery.length === 0) return null

  return (
    <section className="border-b border-neutral-800/60 px-6 py-20 md:px-16 md:py-28">
      <p className="cs-reveal mb-10 font-mono text-sm font-semibold tracking-widest text-neutral-400 uppercase md:text-base">
        Process & Stills
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {gallery.map((src: string, i: number) => (
          <div
            key={i}
            className={`cs-gal relative overflow-hidden rounded-2xl bg-neutral-900 ${
              i === 0 ? "aspect-[16/7] md:col-span-2" : "aspect-[4/3]"
            }`}
          >
            {isVideoUrl(src) ? (
              <>
                <video
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover transition-all duration-700"
                />
                <div className="absolute right-4 bottom-4 z-20">
                  <VideoMuteButton size="sm" />
                </div>
              </>
            ) : (
              <Image
                src={src}
                alt={`${title} gallery item`}
                fill
                sizes={i === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                className="object-cover transition-all duration-700 hover:scale-[1.04]"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
