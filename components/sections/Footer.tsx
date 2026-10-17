"use client"

import React, { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCursor } from "../cursor/CursorContext"
import { gsap, useGSAP } from "@/lib/gsap"
import { useSettings } from "@/hooks/useSettings"
import { FaInstagram, FaLinkedinIn, FaVimeoV, FaTwitter } from "react-icons/fa"

import { FooterNewsletterForm } from "../newsletter/FooterNewsletterForm"

export function Footer() {
  const { setCursorState } = useCursor()
  const container = useRef<HTMLElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const orb3Ref = useRef<HTMLDivElement>(null)
  const orb4Ref = useRef<HTMLDivElement>(null)
  const { data } = useSettings()

  useGSAP(
    () => {
      if (!container.current) return

      // Orbs Animation
      gsap.to(orb1Ref.current, {
        keyframes: {
          scale: [1, 1.2, 1],
          x: ["0%", "10%", "-5%", "0%"],
          y: ["0%", "-10%", "5%", "0%"],
        },
        duration: 15,
        repeat: -1,
        ease: "linear",
      })
      gsap.to(orb2Ref.current, {
        keyframes: {
          scale: [1, 1.3, 1],
          x: ["0%", "-10%", "15%", "0%"],
          y: ["0%", "10%", "-5%", "0%"],
        },
        duration: 18,
        repeat: -1,
        ease: "linear",
      })
      gsap.to(orb3Ref.current, {
        keyframes: {
          scale: [1, 1.1, 1.4, 1],
          x: ["0%", "10%", "-15%", "0%"],
          y: ["0%", "-5%", "15%", "0%"],
        },
        duration: 20,
        repeat: -1,
        ease: "linear",
      })
      gsap.to(orb4Ref.current, {
        keyframes: {
          scale: [1, 1.5, 1],
          x: ["0%", "-20%", "5%", "0%"],
          y: ["0%", "20%", "-10%", "0%"],
        },
        duration: 25,
        repeat: -1,
        ease: "linear",
      })

      // Simple parallax effect for the massive text at the bottom
      gsap.fromTo(
        ".footer-logo",
        { y: -150, opacity: 0.5 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        }
      )
    },
    { scope: container }
  )

  return (
    <footer
      ref={container}
      className="sticky bottom-0 left-0 z-0 flex min-h-screen w-full flex-col justify-between overflow-hidden bg-background px-4 pt-32 pb-8 text-neutral-100 md:px-16"
    >
      {/* Dynamic Aurora / Mesh Gradient Background (Living & Moving) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-100">
        <div className="absolute inset-0 bg-background" />{" "}
        {/* Base background */}
        {/* Creative Pattern Overlay (Subtle Grid) */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-brand-300) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Bright Cyan Orb */}
        <div
          ref={orb1Ref}
          className="absolute -top-[10%] -left-[10%] h-[60vw] w-[60vw] rounded-full bg-brand-200/20 mix-blend-screen blur-[120px]"
        />
        {/* Mid Teal Orb */}
        <div
          ref={orb2Ref}
          className="absolute top-[20%] right-[0%] h-[50vw] w-[50vw] rounded-full bg-brand-400/30 mix-blend-screen blur-[140px]"
        />
        {/* Very Dark Cyan Orb for contrast depth */}
        <div
          ref={orb3Ref}
          className="absolute -bottom-[20%] left-[20%] h-[80vw] w-[80vw] rounded-full bg-brand-600/60 mix-blend-screen blur-[150px]"
        />
        {/* Brightest Brand Accent for intersection glow */}
        <div
          ref={orb4Ref}
          className="absolute right-[-10%] bottom-[-10%] h-[40vw] w-[40vw] rounded-full bg-brand-100/10 mix-blend-screen blur-[130px]"
        />
      </div>

      {/* Top Section - Clean vertical stack */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-screen-2xl flex-1 flex-col">
        {/* Navigation and Socials (Top right aligned on desktop, left on mobile) */}
        <div className="mb-24 flex w-full flex-col items-start justify-between md:mb-32 md:flex-row">
          <div className="mb-16 md:mb-0">
            <p className="font-mono text-sm tracking-[0.3em] text-brand-300 uppercase md:text-base">
              Start a Project
            </p>
          </div>

          <div className="flex w-full flex-row justify-between font-mono text-sm tracking-[0.2em] uppercase md:w-auto md:justify-start md:gap-32">
            <div className="flex flex-col gap-6">
              <span className="mb-2 text-neutral-400">Menu</span>
              <Link
                href="/work"
                className="cursor-none text-neutral-100 transition-colors hover:text-brand-300"
                onMouseEnter={() => setCursorState("magnetic")}
                onMouseLeave={() => setCursorState("default")}
              >
                Work
              </Link>
              <Link
                href="/#process"
                className="cursor-none text-neutral-100 transition-colors hover:text-brand-300"
                onMouseEnter={() => setCursorState("magnetic")}
                onMouseLeave={() => setCursorState("default")}
              >
                Process
              </Link>
              <Link
                href="/#capabilities"
                className="cursor-none text-neutral-100 transition-colors hover:text-brand-300"
                onMouseEnter={() => setCursorState("magnetic")}
                onMouseLeave={() => setCursorState("default")}
              >
                Capabilities
              </Link>
            </div>

            <div className="flex flex-col gap-6 text-left">
              <span className="mb-2 text-neutral-400">Contact</span>
              <a
                href="mailto:threshstudioz@gmail.com"
                className="cursor-none text-neutral-100 transition-colors hover:text-brand-300"
                onMouseEnter={() => setCursorState("magnetic")}
                onMouseLeave={() => setCursorState("default")}
              >
                Email Us
              </a>
              <a
                href="https://calendly.com/threshstudioz/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-none text-neutral-100 transition-colors hover:text-brand-300"
                onMouseEnter={() => setCursorState("magnetic")}
                onMouseLeave={() => setCursorState("default")}
              >
                Book a Call
              </a>
            </div>
          </div>
        </div>

        {/* Massive Call to action */}
        <div className="flex w-full flex-col items-start">
          <a
            href="mailto:threshstudioz@gmail.com"
            className="group relative inline-flex w-full cursor-none flex-col"
            onMouseEnter={() => setCursorState("magnetic")}
            onMouseLeave={() => setCursorState("default")}
          >
            {/* Responsively scaled to fit perfectly */}
            <span className="text-[6vw] font-bold tracking-tighter uppercase transition-colors group-hover:text-brand-200 md:text-[5vw]">
              threshstudioz@gmail.com
            </span>
            <div className="relative mt-2 h-[2px] w-full overflow-hidden bg-neutral-600">
              <div className="absolute top-0 left-0 h-full w-full -translate-x-full bg-brand-300 transition-transform duration-700 ease-out group-hover:translate-x-0" />
            </div>
          </a>
        </div>
      </div>

      {/* Massive Brand Mark at the bottom */}
      <div className="relative z-10 mt-auto flex w-full flex-col items-center justify-end overflow-hidden pt-12 md:pt-16">
        <div className="relative mt-12 mb-4 h-24 w-full md:h-40 xl:h-60">
          <Image
            src="/logo.png"
            alt="Thresh Studio"
            fill
            sizes="100vw"
            className="footer-logo object-contain opacity-80 mix-blend-plus-lighter"
          />
        </div>

        {/* Subscribe input down below after the logo at the right */}
        <div className="flex w-full justify-end py-2 md:py-4">
          <div className="w-full max-w-sm">
            <FooterNewsletterForm className="mt-0 ml-auto" />
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col items-center justify-between gap-6 border-t border-neutral-800 pt-8 font-mono text-xs tracking-[0.2em] text-neutral-400 uppercase md:flex-row md:text-sm">
          <p className="w-full text-center md:w-1/3 md:text-left">
            © 2026 THRESH STUDIO LLC
          </p>

          <div className="flex w-full justify-center gap-6 md:w-1/3 md:gap-8">
            {data?.instagramUrl && (
              <a
                href={data.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex cursor-none items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 p-3 transition-colors hover:border-brand-300 hover:bg-brand-500/10"
                onMouseEnter={() => setCursorState("magnetic")}
                onMouseLeave={() => setCursorState("default")}
              >
                <FaInstagram className="h-4 w-4 text-neutral-100 transition-colors group-hover:text-brand-300" />
                <span className="sr-only">Instagram</span>
              </a>
            )}
            {data?.linkedinUrl && (
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex cursor-none items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 p-3 transition-colors hover:border-brand-300 hover:bg-brand-500/10"
                onMouseEnter={() => setCursorState("magnetic")}
                onMouseLeave={() => setCursorState("default")}
              >
                <FaLinkedinIn className="h-4 w-4 text-neutral-100 transition-colors group-hover:text-brand-300" />
                <span className="sr-only">LinkedIn</span>
              </a>
            )}
            {data?.vimeoUrl && (
              <a
                href={data.vimeoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex cursor-none items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 p-3 transition-colors hover:border-brand-300 hover:bg-brand-500/10"
                onMouseEnter={() => setCursorState("magnetic")}
                onMouseLeave={() => setCursorState("default")}
              >
                <FaVimeoV className="h-4 w-4 text-neutral-100 transition-colors group-hover:text-brand-300" />
                <span className="sr-only">Vimeo</span>
              </a>
            )}
            {data?.twitterUrl && (
              <a
                href={data.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex cursor-none items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 p-3 transition-colors hover:border-brand-300 hover:bg-brand-500/10"
                onMouseEnter={() => setCursorState("magnetic")}
                onMouseLeave={() => setCursorState("default")}
              >
                <FaTwitter className="h-4 w-4 text-neutral-100 transition-colors group-hover:text-brand-300" />
                <span className="sr-only">X (Twitter)</span>
              </a>
            )}
          </div>

          <p className="w-full text-center text-brand-300 md:w-1/3 md:text-right">
            Product Branding & Cinematic Marketing
          </p>
        </div>
      </div>
    </footer>
  )
}
