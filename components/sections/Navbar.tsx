"use client"

import React, { useState } from "react"
import { useCursor } from "../cursor/CursorContext"
import { useLenis } from "lenis/react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const { setCursorState } = useCursor()
  const lenis = useLenis()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setIsMobileMenuOpen(false)
    if (href.startsWith("/#") && window.location.pathname === "/") {
      e.preventDefault()
      lenis?.scrollTo(href.replace("/", ""))
    }
  }

  const navLinks = [
    { name: "Work", href: "/work" },
    { name: "Capabilities", href: "/#capabilities" },
    { name: "Process", href: "/#process" },
    { name: "Testimonials", href: "/#testimonials" },
  ]

  return (
    <header className="absolute top-0 left-0 z-[100] flex w-full justify-center px-4 py-6 md:px-8 md:py-8">
      <div className="relative z-[110] mx-auto flex w-full max-w-screen-xl items-center justify-between gap-4 rounded-full border border-brand-500/20 bg-background/50 px-4 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl md:px-8 md:py-4 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="group relative z-[110] flex cursor-none items-center justify-center"
          onMouseEnter={() => setCursorState("magnetic")}
          onMouseLeave={() => setCursorState("default")}
        >
          <Image
            src="/logo.png"
            alt="Thresh Studio"
            width={120}
            height={32}
            style={{ width: "auto" }}
            className="h-6 w-auto transition-transform duration-700 group-hover:scale-105 md:h-8"
          />
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-16">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="group relative cursor-none font-mono text-xs tracking-[0.3em] text-neutral-100 uppercase transition-colors duration-500 hover:text-brand-200"
              onMouseEnter={() => setCursorState("magnetic")}
              onMouseLeave={() => setCursorState("default")}
            >
              {link.name}
              <span className="absolute -bottom-2 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-brand-200 opacity-0 transition-all duration-500 group-hover:w-full group-hover:opacity-100" />
            </Link>
          ))}
        </nav>

        {/* Right CTA & Mobile Toggle */}
        <div className="flex shrink-0 items-center gap-4">
          <a
            href="mailto:threshstudioz@gmail.com"
            className="group relative flex hidden cursor-none items-center justify-center overflow-hidden rounded-full border border-neutral-700 px-5 py-3 transition-colors duration-700 hover:border-brand-300 md:flex md:px-8 md:py-4"
            onMouseEnter={() => setCursorState("magnetic")}
            onMouseLeave={() => setCursorState("default")}
          >
            <div className="absolute inset-0 translate-y-[101%] bg-brand-500/20 transition-transform duration-700 ease-[0.76,0,0.24,1] group-hover:translate-y-0" />
            <span className="relative z-10 font-mono text-[10px] tracking-[0.2em] whitespace-nowrap text-neutral-100 uppercase transition-colors duration-300 group-hover:text-brand-100 md:text-xs">
              Start Project
            </span>
          </a>

          <button
            className="relative z-[110] flex cursor-none p-2 text-neutral-200 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onMouseEnter={() => setCursorState("magnetic")}
            onMouseLeave={() => setCursorState("default")}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-[105] flex flex-col items-center justify-center bg-neutral-950/95 backdrop-blur-2xl transition-all duration-500 lg:hidden ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="group relative cursor-none font-mono text-lg tracking-[0.3em] text-neutral-100 uppercase transition-colors duration-500 hover:text-brand-200"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="mailto:threshstudioz@gmail.com"
            className="mt-8 rounded-full border border-brand-500 bg-brand-500/10 px-8 py-4 font-mono text-sm tracking-[0.2em] text-brand-100 uppercase"
          >
            Start Project
          </a>
        </nav>
      </div>
    </header>
  )
}
