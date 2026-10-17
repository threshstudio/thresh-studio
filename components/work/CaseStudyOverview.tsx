"use client"

import React from "react"

interface CaseStudyOverviewProps {
  stats?: { label: string; value: string }[]
  description: string
  services?: string[]
  deliverables?: string[]
}

export function CaseStudyOverview({
  stats,
  description,
  services,
  deliverables,
}: CaseStudyOverviewProps) {
  return (
    <>
      {/* STATS */}
      {stats && stats.length > 0 && (
        <div className="cs-stats-row border-b border-neutral-800/60">
          <div className="grid grid-cols-1 divide-y divide-neutral-800/60 md:grid-cols-3 md:divide-x md:divide-y-0">
            {stats.map((stat, idx) => (
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
            ))}
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
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-10">
            {services && services.length > 0 && (
              <div className="cs-reveal">
                <p className="mb-5 font-mono text-sm font-semibold tracking-widest text-neutral-400 uppercase md:text-base">
                  Services
                </p>
                <ul className="flex flex-wrap gap-2">
                  {services.map((s) => (
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
            {deliverables && deliverables.length > 0 && (
              <div className="cs-reveal">
                <p className="mb-5 font-mono text-sm font-semibold tracking-widest text-neutral-400 uppercase md:text-base">
                  Deliverables
                </p>
                <ul className="flex flex-wrap gap-2">
                  {deliverables.map((d) => (
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
    </>
  )
}
