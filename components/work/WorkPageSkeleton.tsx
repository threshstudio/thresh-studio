"use client"

import React from "react"

export function WorkPageSkeleton() {
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
