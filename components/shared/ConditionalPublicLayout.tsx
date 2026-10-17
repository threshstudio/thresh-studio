"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { SmoothScroll } from "@/components/motion/SmoothScroll"
import { CustomCursor } from "@/components/cursor/CustomCursor"
import { Navbar } from "@/components/sections/Navbar"
import { ScrollNewsletterPrompt } from "@/components/newsletter/ScrollNewsletterPrompt"

export function ConditionalPublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <SmoothScroll>
      <Navbar />
      {children}
      <ScrollNewsletterPrompt />
      <CustomCursor />
    </SmoothScroll>
  )
}
